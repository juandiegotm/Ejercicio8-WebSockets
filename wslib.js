const WebSocket = require("ws");
const fs = require("fs");

const URL_MESSAGES_JSON = "./storage/messages.json";

const clients = [];
let messages = [];

const wsConnection = (server) => {
    const wss = new WebSocket.Server({server});
    messages = fs.existsSync(URL_MESSAGES_JSON) ? JSON.parse(fs.readFileSync(URL_MESSAGES_JSON)) : [];
    console.log("Messages load!");


    wss.on("connection", (ws) => {
        clients.push(ws);
        sendMessages();

        ws.on("message", (message) => {


            if(message === "UPDATE"){
                console.log("HOLA");
                messages = JSON.parse(fs.readFileSync(URL_MESSAGES_JSON))
                return sendMessages();
            }
            
            else{

            const receivedOn = new Date();
            const newMessage = {message, author: "anStrange", ts: receivedOn.getTime()};
            messages.push(newMessage);
            console.log(`[${receivedOn}]: ${newMessage.message}`);

            fs.writeFile(URL_MESSAGES_JSON, JSON.stringify(messages), () => {
                console.log("messages saved");
            });

            sendMessages();
            }
        });


    });


    const sendMessages = () => {
        const onlyMessages = messages.map((messageObject) => messageObject.message);
        clients.forEach((client) => client.send(JSON.stringify(onlyMessages)));
    }
};

exports.wsConnection = wsConnection;