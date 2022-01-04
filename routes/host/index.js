const router = require('express').Router();
const controller = require('./controller');
const { HostValidator, HostValidatorDelete } = require('../../middlewares/validator');
const { authenticateToken } = require('../../middlewares/jwt');

router.delete('/', HostValidator);
router.post('/', controller.create)

router.delete('/delete', HostValidatorDelete, authenticateToken);
router.post('/delete', controller.delete)

router.delete('/list', authenticateToken);
router.get('/list', controller.list)

module.exports = router;