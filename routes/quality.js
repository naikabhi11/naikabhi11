const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { qualityCheckSchema } = require('../validators/schemas');
const {
    getQualityChecks,
    getQualityChecksForItem,
    addQualityCheck
} = require('../controllers/qualityController');

router.route('/')
    .get(getQualityChecks)
    .post(validate(qualityCheckSchema), addQualityCheck);

router.route('/:itemId')
    .get(getQualityChecksForItem);

module.exports = router;
