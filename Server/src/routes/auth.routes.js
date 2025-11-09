const express = require('express');
const { register, login, changePassword } = require('../controllers/auth.controller');

const router = express.Router();

//* @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

//* @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

//* @route   POST api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', changePassword);

module.exports = router;    
