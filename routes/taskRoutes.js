const router = require('express').Router();
const ctrl = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/project/:projectId', ctrl.getByProject);
router.post('/project/:projectId', ctrl.create);
router.put('/:id', ctrl.update);
router.patch('/:id/status', ctrl.toggleStatus);
router.delete('/:id', ctrl.delete);

module.exports = router;
