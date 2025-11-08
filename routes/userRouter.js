import {createUser, loginUser} from '../controllers/userController.js';

import express from 'express';

const userRouter = express.Router();

userRouter.post('/', createUser);
// login should be a POST because credentials are sent in the request body
userRouter.post('/login', loginUser);

export default userRouter;