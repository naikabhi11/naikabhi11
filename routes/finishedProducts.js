const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { finishedProductSchema } = require('../validators/schemas');
const {
    getFinishedProducts,
    addFinishedProduct,
    updateFinishedProduct,
    deleteFinishedProduct
} = require('../controllers/finishedProductsController');

router.route('/')
    .get(getFinishedProducts)
    .post(validate(finishedProductSchema), addFinishedProduct);

router.route('/:id')
    .put(validate(finishedProductSchema), updateFinishedProduct)
    .delete(deleteFinishedProduct);

module.exports = router;
