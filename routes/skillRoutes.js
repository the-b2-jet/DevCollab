const router = require('express').Router();
const skillController = require('../controllers/skillController')
const authMiddleware = require('../middleware/auth')

router.get('/', skillController.getAll);
router.post('/', authMiddleware, skillController.create)

module.exports = router;
