const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { wipSchema } = require('../validators/schemas');
const {
    getWipItems,
    addWipItem,
    updateWipItem,
    deleteWipItem
} = require('../controllers/wipController');

router.route('/')
    .get(getWipItems)
    .post(validate(wipSchema), addWipItem);

router.route('/:id')
    .put(validate(wipSchema), updateWipItem)
    .delete(deleteWipItem);

module.exports = router;
