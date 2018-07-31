import express from 'express';
import employeeModel from './employeeModel'
let employeeRoutes = express.Router();

employeeRoutes.get('/all', (req, res) => {
    employeeModel.getEmployeeList(req,res);
});
employeeRoutes.put('/add', (req, res) => {
    employeeModel.addEmployee(req,res);
});

employeeRoutes.post('/update', (req, res) => {
    employeeModel.updateEmployee(req,res);
});

employeeRoutes.delete('/delete', (req, res) => {
    employeeModel.deleteEmployee(req,res);
});

export default employeeRoutes;