let responseModel = {};

responseModel.sendResponseToClient= (req,res,result,connection) => {
	connection.close();
	console.log('connection closed.');
	// res.setHeader('Content-Type', 'application/json');

	if(result.status==200){
		res.writeHead(200, {"Content-Type": "application/json"});
	}
	else{
		res.writeHead(800, {"Content-Type": "application/json"});
	}
	
	let resultStr = JSON.stringify(result);
	res.write(resultStr);
	res.end();
}


export default responseModel;