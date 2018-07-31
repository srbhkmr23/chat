import connectionModel from '../core/connection';
import responseModel from '../core/response';
import config from  '../core/config';

let userModel = {};

userModel.login = (req,res) => {
	let userEmailId= req.body.email || '';
	let userPassword= req.body.password || '';

	console.log("req.body",req.body);
	connectionModel.getConnection().then((connection)=>{
		const employeedb = connection.db(config.db);
	      let collection = employeedb.collection('user');
	      collection.find({
	      	email:userEmailId,
	      	password:userPassword
	      }).toArray((err, list)=>{
	      	let result = {};
	      	if(list.length==0){
				result.message="Id or password is wrong! please try again."
	      	}
	      	else if(list.length==1) {
				result.status=200;
				result.message="Login success."
				result.userDetails=list[0];
	      	}
	      	else {
				result.message="Somting went wrong"
	      	}
	      	responseModel.sendResponseToClient(req,res,result,connection);
	      })
	})
}

userModel.signUp = (req,res) =>{
	let requestData = req.body || {};
	let newUserData = {
		name:requestData.name,
		gender:requestData.gender,
		contact:requestData.contact,
		address:requestData.address,
		email:requestData.email,
		password:requestData.password
	};

	connectionModel.getConnection().then((connection)=>{
		const employeedb = connection.db(config.db);
		let collection = employeedb.collection('user');
		collection.insert(newUserData,(error,response)=>{
			let result = {};
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

userModel.getUserList = (req,res) => {
	connectionModel.getConnection().then((connection)=>{
		const employeedb = connection.db(config.db)
	      let collection = employeedb.collection('user');
	      collection.find({}).toArray((err, list)=>{
	      	let result = {};
			result.status=200;
			result.userList= list || [];
	      	responseModel.sendResponseToClient(req,res,result,connection);
	      })
	})
}


userModel.getAllUsers = (cb) => {
	connectionModel.getConnection().then((connection)=>{
		const employeedb = connection.db(config.db)
	      let collection = employeedb.collection('user');
	      collection.find({}).toArray((err, list)=>{
	      	cb(list);
	      })
	})
}

export default userModel;

