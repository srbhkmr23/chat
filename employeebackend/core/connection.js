import MongoDb from 'mongodb';
import config from  './config'

let connectionModel = {};
connectionModel.getConnection = () => {
	let connectionString = '';
  	let host = process.env.HOST || config.host;
  	let mongoport = process.env.MONGO_PORT || config.mongoport;
  	let db = process.env.MONGO_DB || config.db;
  	connectionString = 'mongodb://' + host + ':' + mongoport;
  	console.log('connectionString', connectionString);
  	let MongoClient = MongoDb.MongoClient;

  	return new Promise((resolve, reject) =>{
  	 	MongoClient.connect(connectionString,  (err, connection) => {
			if(err) {
				console.dir("ERROR:----",err);
				reject(err)
			}

			if(!err) {
			 	resolve(connection);
			}
		})
	})
}

connectionModel.closeConnection = (connection) => {
	connection.close();
	console.log('connection closed.')
}


export default connectionModel;