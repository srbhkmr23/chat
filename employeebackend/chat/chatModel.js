import connectionModel from '../core/connection';
import responseModel from '../core/response';
import config from  '../core/config';

let chatModel = {};

chatModel.addMessageInDb = (data) => {
	connectionModel.getConnection().then((connection)=>{

		let newMessageData = {
			senderId:data.from,
		    receiverId:data.to,
		    updatedAt:'',
		    message: data.msg,
		    read:'',
		}

		const employeedb = connection.db(config.db);
	    let collection = employeedb.collection('chat');
	    collection.insert(newMessageData,(error,response)=>{
	    	connection.close();
	    	if(error) {
				console.log(error)
								
			}

			if(!error){
				console.log("message added successfully")
			}



	    })
	})
}


chatModel.getAllMessage = (data,cb) =>{
	connectionModel.getConnection().then((connection)=>{

		let messageData ={$or: [ {
			senderId:data.from,
		    receiverId:data.to
		},
		{
			senderId:data.to,
		    receiverId:data.from
		}


		]

	}

		const employeedb = connection.db(config.db);
	    let collection = employeedb.collection('chat');
	    collection.find(messageData).toArray((err, list)=>{
	      	connection.close();

	    	cb(list)  	
	    })
	})
}

export default chatModel;

