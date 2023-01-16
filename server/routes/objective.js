const express = require('express');
const objectivesControllers = require('../controllers/objective');
const router = express.Router();

router.post('/addMain', objectivesControllers.addMainObjective);
router.post('/addSecondary', objectivesControllers.addSecondaryObjective);
router.post('/editProgress', objectivesControllers.editProgress);
router.post('/editProgressMain', objectivesControllers.editProgressMain);
router.post('/markAsDone', objectivesControllers.markAsDone);
router.get('/main', objectivesControllers.getMainObjectives);
router.get('/secondary', objectivesControllers.getSecondaryObjectives);
router.get('/team/main', objectivesControllers.getMainTeamObjectives);
router.get('/team/secondary', objectivesControllers.getSecondaryTeamObjectives);
router.post('/team/edit', objectivesControllers.editTeamObjective);

module.exports = router;