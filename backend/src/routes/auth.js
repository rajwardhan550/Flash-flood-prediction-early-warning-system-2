const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const { jwt: jwtConfig } = require('../config/env');
const { validate } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('citizen', 'authority', 'admin').default('citizen'),
  assignedZoneId: Joi.string().allow(null, '').optional(),
  phone: Joi.string().allow(null, '').optional(),
  preferredLanguage: Joi.string().valid('en', 'hi').default('en')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
  try {
    const { email, password, name, role, assignedZoneId, phone, preferredLanguage } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'citizen',
      assignedZoneId: assignedZoneId || null,
      phone: phone || null,
      preferredLanguage: preferredLanguage || 'en',
      isActive: true
    });

    const token = jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedZoneId: user.assignedZoneId,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'Account is deactivated.' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedZoneId: user.assignedZoneId,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;