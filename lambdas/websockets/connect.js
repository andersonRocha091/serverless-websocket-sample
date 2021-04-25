//Api called whenever someone connects to our websocket

const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

//table name will be get from environment variables from serverless
const tableName = process.env.tableName;

exports.handler = async event => {
  //on new connection logs the connection and returns a 
  // message of succesfull connection
  console.log('event: ',event)
  //getting the connection id
  const { connectionId: connectionID , domainName, stage} = event.requestContext; 
  
  const data = {
    ID: connectionID,
    date: Date.now(),
    messages:[],
    domainName,
    stage
  }
  
  //writing it to dynamo
  await Dynamo.write(data, tableName);

  /**
   * When the user connects to our api we need to 
    store some information regarded to the connections
    and list of messages sent
    */

  return Responses._200({message: 'connected'})
} 