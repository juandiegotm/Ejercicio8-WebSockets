const WebSocket = require("ws");
const fs = require("fs");

const URL_MESSAGES_JSON = "./storage/messages.json";

const clients = [];
const messages = [];

const wsConnection = (server) => {
    const wss = new WebSocket.Server({server});
    const messages = JSON.parse(fs.readFileSync(URL_MESSAGES_JSON));
    console.log("Messages load!");
    wss.on("connection", (ws) => {
        clients.push(ws);
        sendMessages();

        ws.on("message", (message) => {
            messages.push(message);

            fs.writeFile(URL_MESSAGES_JSON, JSON.stringify(messages), () => {
                console.log("messages saved");
            });

            sendMessages();

        });
    });

    const sendMessages = () => {
        clients.forEach((client) => client.send(JSON.stringify(messages)));
    }
};

exports.wsConnection = wsConnection;