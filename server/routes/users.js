const express = require('express');
const authToken = require('../middleware/authenticateToken');
const userControllers = require('../controllers/users');
const refreshController = require('../controllers/refreshToken');
const router = express.Router();

router.post('/login', userControllers.userLogin);
router.post('/logout', authToken, userControllers.userLogout);
router.get('/teamUsers', authToken, userControllers.getTeamUsers);
router.get('/manager', authToken, userControllers.getManager);
router.get('/otherUsers', authToken, userControllers.getOtherUsers);
router.get('/user', authToken, userControllers.getCurrentUserInfo);

router.get('/refresh', authToken, refreshController.refreshToken);

module.exports = router;