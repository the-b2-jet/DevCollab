const router = require('express').Router();
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middleware/auth');

router.get('/project/:projectId', memberController.getMembers);

router.post('/project/:projectId', authMiddleware, memberController.addMember);
router.delete('/project/:projectId/:userId', authMiddleware, memberController.removeMember);
router.put('/project/:projectId/:userId', authMiddleware, memberController.updateRole);

module.exports = router;
