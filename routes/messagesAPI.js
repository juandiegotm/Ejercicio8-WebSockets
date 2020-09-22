const { json } = require('express');
const express = require('express');
const router = express.Router();
const fs = require("fs");
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:3000');

const URL_MESSAGES_JSON = "./storage/messages.json";

/* GET messages listing. */
router.get('/', function(req, res, next) {
  fs.readFile(URL_MESSAGES_JSON, (err, data) => {
    if(err) return res.status(500).json({msg: "Hubo un errer recuperando los archivos"});
    res.json(JSON.parse(data));
  });
});

/* GET a message with specific TS */
router.get('/:ts', (req, res, next) => {
  fs.readFile(URL_MESSAGES_JSON, (err, data) => {
    if(err) return res.status(500).json({msg: "Hubo un errer recuperando los archivos"});

    // Busca entre los archivos
    const messages = JSON.parse(data);
    const searchedMessage = messages.find((value) => String(value.ts) === req.params.ts);
    if(searchedMessage)
      res.json(searchedMessage);
    else
      res.json({message: "El mensaje con el ts solicitado no existe"});
  });
});

/* Add a message */
router.post('/', (req, res, next) => {

  const newMessage = req.body;

  fs.readFile(URL_MESSAGES_JSON, (err, data) => {
    if(err) return res.status(500).json({msg: "Hubo un errer recuperando los archivos"});

    // Busca entre los archivos
    const messages = JSON.parse(data);
    const searchedMessage = messages.find((value) => String(value.ts) === newMessage.ts);

    if(searchedMessage)
      return res.status(200),json({status: 200, message: "Ya existe un mensaje con ese ts"});

    messages.push(newMessage);
    fs.writeFile(URL_MESSAGES_JSON, JSON.stringify(messages), () => {
      res.status(200).json({status: 200, message: "Mensaje guardado correctamente"});
      ws.send("UPDATE");
    });
  });
});

/* Update message */
router.put('/:ts', (req, res, next) => {

  const updateMessage = req.body;


  fs.readFile(URL_MESSAGES_JSON, (err, data) => {
    if(err) return res.status(500).json({msg: "Hubo un errer recuperando los archivos"});

    // Busca entre los archivos
    const messages = JSON.parse(data);
    const searchedMessage = messages.find((value) => String(value.ts) === req.params.ts);
    if(searchedMessage){
      searchedMessage["ts"] = updateMessage.ts || searchedMessage.ts;
      searchedMessage["author"] = updateMessage.author || searchedMessage.author;
      searchedMessage["message"] = updateMessage.message || searchedMessage.message;

      fs.writeFile(URL_MESSAGES_JSON, JSON.stringify(messages), () => {
        res.status(200).json({status: 200, message: "Mensaje atyalizado correctamente"});
      });

    }
    else
      res.json({message: "El mensaje con el ts solicitado no existe"});
  });
});


/* Update message */
router.delete('/:ts', (req, res, next) => {

  fs.readFile(URL_MESSAGES_JSON, (err, data) => {
    if(err) return res.status(500).json({msg: "Hubo un errer recuperando los archivos"});

    // Busca entre los archivos
    const messages = JSON.parse(data);

    const searchedMessageIndex = messages.findIndex((value) => String(value.ts) === req.params.ts);
    if(searchedMessageIndex !== -1){
      messages.splice(searchedMessageIndex, 1);
      fs.writeFile(URL_MESSAGES_JSON, JSON.stringify(messages), () => {
        res.status(200).json({status: 200, message: "Mensaje eliminado correctamente"});
      });

    }
    else
      res.json({message: "El mensaje con el ts solicitado no existe"});
  });
});


module.exports = router;
