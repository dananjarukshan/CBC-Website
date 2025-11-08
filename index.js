import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';



//mongo db connection string
const mongoURI = "mongodb+srv://admin:admin1234234344@cluster0.bccoi4v.mongodb.net/?appName=Cluster0";
//connect to mongo db 
mongoose.connect(mongoURI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    }
);



// create an express application
const app = express();


// middleware to parse JSON request bodies
app.use(express.json());

//middleware to extract token from Authorization header
app.use(
    (req, res, next) => {
        const authorizationHeader = req.headers['authorization'];
        if (authorizationHeader != null) {
            const token = authorizationHeader.split(' ')[1];
            req.token = token;
            console.log('Extracted Token:', token);
            jwt.verify(token, "secretKey96$2025", (err, user) => {
                if (err) {
                    console.error('Token verification failed:', err);
                    return res.status(403).json({ error: 'Invalid token' });
                }
                req.user = user;
                next();
            });
        } else {
            next();
        }
    }
);


//import user router
import userRouter from './routes/userRouter.js';
app.use('/users', userRouter);

//import product router
import productRouter from './routes/productRouter.js';
app.use('/products', productRouter);

// Also expose products under /users/products to accept requests sent to that path
// (some clients post to /users/products). This mounts the same router at both paths.
app.use('/users/products', productRouter);


// start the server (port number 3000)
// arrow function that logs "SERVER IS RUNNING" (no need to create a separate function)
app.listen(3000, () => {
    console.log("SERVER IS RUNNING");
});


