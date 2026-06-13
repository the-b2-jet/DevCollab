const router = require('express').Router();
const userSkillController = require('../controllers/userSkillController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', userSkillController.getMySkills);
router.post('/', userSkillController.addSkill);
router.delete('/:skillId', userSkillController.removeSkill);

module.exports = router;
