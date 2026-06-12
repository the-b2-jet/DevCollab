const router = require('express').Router();
const skillController = require('../controllers/skillController')

router.get('/', skillController.getAll);

module.exports = router;
