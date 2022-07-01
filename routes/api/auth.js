const express = require('express');

const ctrl = require('../../controllers/users');

const { ctrlWrapper } = require('../../helpers');

const { validation } = require('../../middlewares');

const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/signup', validation(schemas.signup), ctrlWrapper(ctrl.signup));
router.post('/login', validation(schemas.login), ctrlWrapper(ctrl.login));

module.exports = router;