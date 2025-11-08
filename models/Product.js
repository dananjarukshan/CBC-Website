import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        productID: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        altNames: {
            type: [String],
            default: []
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        labelledPrice: {
            type: Number,
            required: true
        },

        images : {
            type: [String],
            required:true
        },

        category : {
            type: String,
            required: true
        },

        brand : {
            type: String,
            required: true,
            default : "no brand"
        },

        stock : {
            type: Number,
            required: true,
            default: 0
        },  
        
        isAvailable : {
            type: Boolean,
            required: true,
            default: true
        },

    }
);

// create a model and export it
const Product = mongoose.model('Product', productSchema);
// Export the Product model
export default Product;