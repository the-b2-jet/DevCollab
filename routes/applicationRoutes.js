const router = require('express').Router();
const ctrl = require('../controllers/applicationController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/project/:projectId', ctrl.submit);
router.get('/project/:projectId', ctrl.getByProject);
router.put('/:id/accept', ctrl.accept);
router.put('/:id/reject', ctrl.reject);

module.exports = router;
