const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { processSchema } = require('../validators/schemas');
const {
    getProcesses,
    addProcess,
    updateProcess,
    deleteProcess
} = require('../controllers/processesController');

router.route('/')
    .get(getProcesses)
    .post(validate(processSchema), addProcess);

router.route('/:id')
    .put(validate(processSchema), updateProcess)
    .delete(deleteProcess);

module.exports = router;
