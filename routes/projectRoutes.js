const router = require('express').Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

// Protected routes (require login)
router.post('/', authMiddleware, projectController.create);
router.put('/:id', authMiddleware, projectController.update);
router.delete('/:id', authMiddleware, projectController.delete);

// Skill management (protected)
router.post('/:id/skills', authMiddleware, projectController.addSkill);
router.delete('/:id/skills/:skillId', authMiddleware, projectController.removeSkill);

module.exports = router;
