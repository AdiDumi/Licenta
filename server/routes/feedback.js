const express = require('express');
const feedbackControlers = require('../controllers/feedback');
const router = express.Router();

router.get('/sent', feedbackControlers.getSentFeedback);
router.get('/recv', feedbackControlers.getRecvFeedback);
router.get('/team', feedbackControlers.getTeamFeedback);
router.post('/add', feedbackControlers.addFeedback);
router.post('/markAsSeen', feedbackControlers.markAsSeen);
router.post('/markAsLiked', feedbackControlers.markAsLiked);

module.exports = router;