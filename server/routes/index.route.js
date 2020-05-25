const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const boardRoutes = require('./board.route');
const columnRoutes = require('./column.route');
const cardRoutes = require('./card.route');
const noteRoutes = require('./note.route');
const usersRoutes = require('./users.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/users', usersRoutes);
router.use('/boards', boardRoutes);
router.use('/columns', columnRoutes);
router.use('/cards', cardRoutes);
router.use('/notes', noteRoutes);

module.exports = router;
