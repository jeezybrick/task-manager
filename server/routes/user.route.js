const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }));

router.route('/')
  .post(asyncHandler(insert));
router.patch('/edit', passport.authenticate('jwt', { session: false }), userCtrl.updateUser);

async function insert(req, res) {
  let user = await userCtrl.insert(req.body);
  res.json(user);
}
