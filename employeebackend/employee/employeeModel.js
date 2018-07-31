import MongoDb from 'mongodb';

import connectionModel from '../core/connection';
import responseModel from '../core/response';
import config from  '../core/config';

const ObjectID = MongoDb.ObjectID;
let employeeModel = {};

employeeModel.getEmployeeList = (req,res) => {
	let result = {};
	connectionModel.getConnection().then((connection)=>{
		const employeedb = connection.db(config.db)
	    let collection = employeedb.collection('employees');
	    collection.find({}).toArray((err, list)=>{
			result.status=200;
			result.employeeList= list || [];
	      	responseModel.sendResponseToClient(req,res,result,connection);
	    })
	})
}

employeeModel.addEmployee = (req,res) => {
	let result = {};
	let requestData = req.body || {};
	let newEmployeeData = {
		name:requestData.name,
		gender:requestData.gender,
		contact:requestData.contact,
		address:requestData.address,
		email:requestData.email
	};

	connectionModel.getConnection().then((connection)=>{
		const employeedb = connection.db(config.db)
	    let collection = employeedb.collection('employees');
	   
	    collection.insert(newEmployeeData,(error,response)=>{
			if(error) {
				console.log(error)
				result.message= "Somting went wrong";
				result.error = error;				
			}

			if(!error){
				result.status=200;
				result.userData=response.ops || {};
			}
			responseModel.sendResponseToClient(req,res,result,connection);
		})
	})
}

employeeModel.updateEmployee = (req,res) => {
	let result = {};
	let requestData = req.body || {};
	let updateEmployeeData = {
		name:requestData.name,
		gender:requestData.gender,
		contact:requestData.contact,
		address:requestData.address,
		email:requestData.email
	};


	let id= ObjectID(requestData.id);

	connectionModel.getConnection().then((connection)=>{
		const employeedb = connection.db(config.db)
	    let collection = employeedb.collection('employees');
	    collection.replaceOne(
	    	{_id:id},
	    	updateEmployeeData,(error,response)=>{
			if(error) {
				console.log(error)
				result.message= "Somting went wrong";
				result.error = error;				
			}

			if(!error){
				result.status=200;
				result.userData=response.ops || {};
				console.log("response : ",response)
			}
			responseModel.sendResponseToClient(req,res,result,connection);
		})
	})
}


employeeModel.deleteEmployee = (req,res) => {
	let result = {};
	let requestData = req.body || {};
	let id= ObjectID(requestData.id);

	connectionModel.getConnection().then((connection)=>{
		const employeedb = connection.db(config.db)
	    let collection = employeedb.collection('employees');
	    collection.deleteOne(
	    	{_id:id},(error,response)=>{
			if(error) {
				console.log(error)
				result.message= "Somting went wrong";
				result.error = error;				
			}

			if(!error){
				result.status=200;
				console.log("response : ",response)
			}
			responseModel.sendResponseToClient(req,res,result,connection);
		})
	})
}

export default employeeModel;