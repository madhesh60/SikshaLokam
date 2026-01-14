const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

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

module.exports = router;
