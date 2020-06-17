// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
let server = require('http').createServer(app);
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
  server.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;
