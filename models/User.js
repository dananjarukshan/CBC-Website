// models/User.js
import mongoose from 'mongoose';

// Define the User schema
// with various fields and their constraints.
// Each field has its type and validation rules.
const userSchema = new mongoose.Schema(
    {
        email : {
            type: String,
            required: true,  // definitely need an email.
            unique: true    // email has to be unique.
        },


        firstName : {
            type: String,
            required: true
        },


        lastName : {
            type: String,
            required: true
        },


        password : {
            type: String,
            required: true
        },


        role : {
            type: String,
            enum: ['admin', 'customer'],    // role can only be 'admin' or 'customer'.
            default: 'customer'         // default role is 'customer'.
        },


        isBlocked : {
            type: Boolean,
            default: false
        },


        isEmailVerified : {
            type: Boolean,
            default: false
        },


        image : {
            type: String,
            required: false,
            default: "default.jpg"
        },

        invalidTries: {
            type: Number,
            default: 0
        }

    }
);

// Create and export the User model
const User = mongoose.model('User', userSchema);
// Export the User model for use in other parts of the application
export default User;

