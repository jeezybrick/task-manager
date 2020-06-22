// config should be imported before importing any other file
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const app = require('./config/express');
let server = require('http').createServer(app);

app.use('/avatars', express.static(path.join(__dirname, '/avatars')));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'accept, authorization, content-type, x-requested-with');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Origin', req.header('origin'));

  next();
});

let io = require('socket.io')(server);
require('./config/mongoose');

global.io = io;
global.socketUsers = [];

io.on('connection', (socket) => {
  global.socket = socket;

  socket.on("set-id", (userId) => {
    socket.userId = userId;
    global.socketUsers.push({
      socketId: socket.id,
      userId: userId
    });
  });

  socket.on("disconnect", () => {
    console.info(`Client gone [id=${socket.id}]`);

    if(global.socketUsersIds) {
      global.socketUsersIds = global.socketUsersIds.filter(item => item.userId !== socket.userId);
    }

    socket.userId = null;
  });

});


// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  server.listen(config.port, (req, res) => {
    console.info(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;
