const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { rawMaterialSchema } = require('../validators/schemas');
const {
    getRawMaterials,
    addRawMaterial,
    updateRawMaterial,
    deleteRawMaterial
} = require('../controllers/rawMaterialsController');

router.route('/')
    .get(getRawMaterials)
    .post(validate(rawMaterialSchema), addRawMaterial);

router.route('/:id')
    .put(validate(rawMaterialSchema), updateRawMaterial)
    .delete(deleteRawMaterial);

module.exports = router;
