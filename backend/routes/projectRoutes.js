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
