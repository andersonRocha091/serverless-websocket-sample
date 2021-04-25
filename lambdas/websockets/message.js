//Api called whenever someone connects to our websocket

const Responses = require('../common/API_Responses');

const Dynamo = require('../common/Dynamo');
const websocket = require('../common/websocketMessage');

const tableName = process.env.tableName;

exports.handler = async event => {
  //on new connection logs the connection and returns a 
  // message of succesfull connection
  console.log('event: ',event)

  const { connectionId: connectionID } = event.requestContext;
  console.log('connection id: ', connectionID);
  const body = JSON.parse(event.body);
  console.log('body: ', body);
  //receiving messages on body to be stored on list array created on connection

  try {
    const record = await Dynamo.get(connectionID, tableName);
    const {messages, domainName, stage} = record;

    messages.push(body.message);

    const data = {
      ...record,
      messages
    };
    console.log('data: ', data);
    await Dynamo.write(data, tableName);
    console.log('Replying: ',{domainName, stage, connectionID, message: "This is a reply to your message"});
    const result = await websocket.send({domainName, stage, connectionID, message: "This is a reply to your message"})
    console.log('send back result: ', result);

    return Responses._200({message: 'got a message'});
  } catch (error) {
    return Responses._400({ message: "could not be received!" });
  }
} 