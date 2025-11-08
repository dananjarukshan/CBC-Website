// controllers/productController.js
import Product from '../models/Product.js';
import { isAdmin } from './userController.js';

// POST /products
// Only admin users can create products
// Assumes req.user is populated by authentication middleware
// and contains a 'role' field
// indicating the user's role. 
function createProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ error: 'Access denied. Admins only.' });
        return; // isAdmin handles the response
    }

    const product = new Product(req.body);
    product.save()
        .then(() => {
            res.status(201).json({ message: 'Product created successfully', product: product });
        })
        .catch((err) => {
            console.error('Error creating product:', err);
            res.status(500).json({ error: 'Failed to create product' });
        }
    );
}


function getAllProducts(req, res) {
    if(isAdmin(req)) {
        Product.find()

        .then((products) => {
            res.json(products);
        })

        .catch((err) => {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Failed to fetch products' });
        });

    } else {
        Product.find({isAvailable: true})
        
        .then((products) => {
            res.json(products);
        })

        .catch((err) => {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Failed to fetch products' });
        });
    }
}


function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ error: 'Access denied. Admins only.' });
        return; // isAdmin handles the response
    }

    const id = req.params.id;
    Product.findByIdAndDelete(id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            console.error('Error deleting product:', err);
            res.status(500).json({ error: 'Failed to delete product' });
        });
}
        
function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ error: 'Access denied. Admins only.' });
        return; // isAdmin handles the response
    }

    const id = req.params.id;
    const updates = req.body;

    Product.findByIdAndUpdate(id, updates, { new: true })
     
    .then((updatedProduct) => {
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ message: 'Product updated successfully', product: updatedProduct });
        })
        .catch((err) => {
            console.error('Error updating product:', err);
            res.status(500).json({ error: 'Failed to update product' });
        });
}


export { createProduct, getAllProducts, deleteProduct, updateProduct };