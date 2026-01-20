const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, organization, role, experience } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            organization,
            role,
            experience
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                organization: user.organization,
                role: user.role,
                experience: user.experience,
                badges: user.badges,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                organization: user.organization,
                role: user.role,
                experience: user.experience,
                badges: user.badges,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user badges
// @route   PUT /api/auth/badges
// @access  Private
router.put('/badges', async (req, res) => {
    // Basic auth check inline for speed, or assume valid token passed if middleware used
    // Since we don't have middleware imported here, let's extract user from token or pass ID
    // ideally we use middleware. For now let's trust the frontend sends the ID or we duplicate check.
    // Wait, we need middleware to get user ID safely. 
    // Let's import protect middleware or just use body for now as user is logged in.

    // Better approach: verify token here manually if middleware not available, 
    // BUT looking at project directory there is 'middleware' folder.
    // Let's assume user sends token in header and we verify it.

    // Simpler for this fix: Just use body user ID if we trust client context or verify token.
    // Let's stick to standard pattern: import middleware if possible.
    // I will use a simple update based on body ID to be safe and quick, 
    // assuming the frontend handles the security context via existing auth flow.

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
            const { badgeId } = req.body;
            if (!user.badges.includes(badgeId)) {
                user.badges.push(badgeId);
                await user.save();
            }
            res.json(user.badges);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

module.exports = router;
