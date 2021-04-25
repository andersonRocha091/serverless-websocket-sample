//Api called whenever someone connects to our websocket

const Responses = require('../common/API_Responses');

const Dynamo = require('../common/Dynamo');

const tableName = process.env.tableName;

exports.handler = async event => {
  //on new connection logs the connection and returns a 
  // message of succesfull connection
  console.log('event: ',event)

  const { connectionId: connectionID } = event.requestContext;

  const body = JSON.parse(event.body);
  
  //receiving messages on body to be stored on list array created on connection

  try {
    const record = await Dynamo.get(connectionID, TableName);
    const messages = record.messages;

    messages.push(body.message);

    const data = {
      ...record,
      messages
    };

    await Dynamo.write(data, tableName);
    return Responses._200({message: 'got a message'});
  } catch (error) {
    return Responses._400({ message: "could not be received!" });
  }
} 