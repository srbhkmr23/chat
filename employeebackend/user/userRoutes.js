import express from 'express';
import userModel from './userModel';
let userRoutes = express.Router();

userRoutes.post('/login', (req, res) => {
    userModel.login(req,res);
});

userRoutes.put('/signup', (req, res) => {
    userModel.signUp(req,res);
});

userRoutes.get('/all', (req, res) => {
    userModel.getUserList(req,res);
});

export default userRoutes;