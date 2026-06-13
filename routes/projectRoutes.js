const router = require('express').Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const requireProjectOwner = require('../middleware/guard');

// Public routes
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

// Protected routes (auth required)
router.post('/', authMiddleware, projectController.create);
router.put('/:id', authMiddleware, requireProjectOwner, projectController.update);
router.delete('/:id', authMiddleware, requireProjectOwner, projectController.delete);

// Skill management on a project (only owner)
router.post('/:id/skills', authMiddleware, requireProjectOwner, projectController.addSkill);
router.delete('/:id/skills/:skillId', authMiddleware, requireProjectOwner, projectController.removeSkill);

module.exports = router;
