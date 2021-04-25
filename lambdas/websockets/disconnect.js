//Api called whenever someone connects to our websocket

const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

//table name will be get from environment variables from serverless
const tableName = process.env.tableName;

exports.handler = async event => {
  //on new connection logs the connection and returns a 
  // message of succesfull connection
  console.log('event: ',event)
  const { connectionId: connectionID } = event.requestContext;

  await Dynamo.delete(connectionID,tableName);
  
  return Responses._200({message: 'disconnected'});
} 