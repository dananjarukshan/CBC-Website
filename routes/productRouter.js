import {createProduct, getAllProducts, deleteProduct, updateProduct} from '../controllers/productController.js';

import express from 'express';

// create a router
const productRouter = express.Router();

productRouter.post('/', createProduct);
productRouter.get('/', getAllProducts);
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);

export default productRouter;


