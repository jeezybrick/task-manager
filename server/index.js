// config should be imported before importing any other file
const express = require('express');
const path = require('path');
const config = require('./config/config');
const app = require('./config/express');
const fileUpload = require('express-fileupload');

let server = require('http').createServer(app);
app.use(express.static(path.join(__dirname, 'uploads')));
let io = require('socket.io')(server);
require('./config/mongoose');

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },

}));

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
  server.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;
