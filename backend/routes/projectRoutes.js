const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');
const { generatePDF, generateDOCX, generateExcel } = require('../utils/exportService');

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, description, templateId, organization, data } = req.body;

    try {
        const project = new Project({
            user: req.user._id,
            name,
            description,
            organization,
            templateId,
            data: data || {},
            currentStep: 1,
            completedSteps: [],
            progress: 0,
            status: 'draft',
            badges: []
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get projects by location (for showing existing templates)
// @route   GET /api/projects/location
// @access  Private
router.get('/location', protect, async (req, res) => {
    try {
        const { state, district, block, cluster } = req.query;
        const query = {};

        if (state) query['data.problemDefinition.geographicScope.state'] = state;
        if (district) query['data.problemDefinition.geographicScope.district'] = district;
        // Optional block/cluster for wider matching or specific matching
        if (block) query['data.problemDefinition.geographicScope.block'] = block;
        if (cluster) query['data.problemDefinition.geographicScope.cluster'] = cluster;

        if (Object.keys(query).length === 0) {
            return res.status(400).json({ message: 'At least state is required' });
        }

        const projects = await Project.find(query)
            .select('name description templateId data.problemDefinition.geographicScope createdAt user badges')
            .populate('user', 'name organization')
            .sort('-createdAt');

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project && project.user.toString() === req.user._id.toString()) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project && project.user.toString() === req.user._id.toString()) {
            const updatedProject = await Project.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project && project.user.toString() === req.user._id.toString()) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Import/Clone data from another project
// @route   POST /api/projects/:id/import
// @access  Private
router.post('/:id/import', protect, async (req, res) => {
    try {
        const { sourceId } = req.body;
        const targetId = req.params.id;

        // 1. Verify target project belongs to user
        const targetProject = await Project.findById(targetId);
        if (!targetProject || targetProject.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Target project not found or unauthorized' });
        }

        // 2. Find source project (can belong to ANY user - that's the sharing feature)
        const sourceProject = await Project.findById(sourceId);
        if (!sourceProject) {
            return res.status(404).json({ message: 'Source project not found' });
        }

        // 3. Clone data logic
        // We preserve the target's name, description, and organization, but overwrite the "data" (LFA content)
        // We also want to preserve the target's geographicScope if the user already set it?
        // The user request says "when other user2 enters... with same geography location it has to show template... click... added as their problem"
        // It implies the LFA logic (problem, trees, logframe) is what matters. 
        // We will overwrite the full 'data' object but might want to keep the geometry if slightly different?
        // For simplicity and "template" behavior, we overwrite fully, BUT
        // the querying matches geography, so source geography ~= target geography.

        // Deep clone the data
        const dataToClone = JSON.parse(JSON.stringify(sourceProject.data));

        targetProject.data = dataToClone;

        // Auto-update status/progress based on the imported data? 
        // Let's assume the user wants to review it, so keep status? 
        // Or better, update completedSteps if the source had them.
        targetProject.completedSteps = sourceProject.completedSteps;
        targetProject.currentStep = sourceProject.currentStep;

        const updatedProject = await targetProject.save();

        res.json(updatedProject);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Export project in various formats
// @route   GET /api/projects/:id/export/:format
// @access  Private
router.get('/:id/export/:format', protect, async (req, res) => {
    try {
        const { id, format } = req.params;
        const project = await Project.findById(id);

        if (!project || project.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const fileName = `${project.name.replace(/\s+/g, '-').toLowerCase()}-lfa`;

        switch (format.toLowerCase()) {
            case 'pdf':
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
                await generatePDF(project, res);
                break;

            case 'docx':
                const docxBuffer = await generateDOCX(project);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}.docx"`);
                res.send(docxBuffer);
                break;

            case 'xlsx':
                const xlsxBuffer = await generateExcel(project);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}.xlsx"`);
                res.send(xlsxBuffer);
                break;

            default:
                return res.status(400).json({ message: 'Invalid format. Supported formats: pdf, docx, xlsx' });
        }
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Error generating export: ' + error.message });
    }
});

module.exports = router;
