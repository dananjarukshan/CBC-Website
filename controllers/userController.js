// import the User model to use in this controller
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Create a new user.
 *
 * This controller expects a JSON body with at least { email, password } and
 * optional profile fields (firstName, lastName, role). It will:
 *  - hash the provided password using bcryptjs
 *  - create and save a new User document in MongoDB
 *  - respond with 201 and a small payload containing userId and email on success
 *  - respond with 500 if an error occurs during save
 *
 * Security note: The hashed password is stored in the database, but it is
 * never returned in responses.
 *
 * @param {import('express').Request} req - Express request, body contains user data
 * @param {import('express').Response} res - Express response
 */
async function createUser(req, res) {
    const data = req.body;

    try {
        // VERY IMPORTANT: Hash the password before saving it to the database
        const hashedPassword = bcrypt.hashSync(data.password, 10); // salt rounds = 10

        console.log('Hashed password for new user:', hashedPassword);

        const user = new User({
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role
        });

        await user.save();

        // Don't return the password in the response
        res.status(201).json({ message: 'User created successfully', userId: user._id, email: user.email });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
}



/**
 * Authenticate a user (login).
 *
 * Expects a JSON body: { email, password }.
 * Workflow:
 *  - find a user by email
 *  - if not found, return 404
 *  - compare the provided password with the stored hashed password
 *  - if passwords match, return 200 with minimal user info
 *  - if passwords do not match, return 401
 *  - on unexpected errors return 500
 *
 * Note: This is a simple credential check. For a production app you should
 * issue a signed session token (JWT or session cookie) on successful login
 * and add rate-limiting / account lockout protections.
 *
 * @param {import('express').Request} req - Express request, body contains credentials
 * @param {import('express').Response} res - Express response
 */
async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Protect against brute force: check invalidTries (default to 0)
        const invalidTries = user.invalidTries || 0;
        if (invalidTries >= 100) {
            return res.status(403).json({ message: 'Account is blocked due to multiple invalid login attempts' });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (isPasswordCorrect) {
            // Generate a JWT token
            const payload = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                image: user.image
            };

            const token = jwt.sign(payload, 'secretKey96$2025', { expiresIn: '2h' });

            // Return minimal user info (never return password)
            // reset invalidTries on successful login
            try {
                await User.updateOne({ email: email }, { $set: { invalidTries: 0 } });
            } catch (e) {
                console.warn('Failed to reset invalidTries:', e);
            }

            return res.json({ message: 'Login successful', user: { email: user.email }, token: token });
        } else {
            // increment invalidTries atomically
            try {
                await User.updateOne({ email: email }, { $inc: { invalidTries: 1 } });
            } catch (e) {
                console.warn('Failed to increment invalidTries:', e);
            }
            return res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Login failed' });
    }
}


// Helper function to check if the user is an admin
export function isAdmin(req){
    if(req.user == null) {
        return false;
    }
    if(req.user.role !== 'admin') {
        return false;
    }
    return true;
}



export { createUser, loginUser };


