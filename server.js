const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const serverPort = 3000;

// Serve static assents in root directory
app.use(express.static(__dirname));

// Serve root path
app.get('/', (request, response) => {
  //TODO eventually this should be index.html
  response.sendFile(__dirname + '/bitStoryOnline.html');
});



// Listen for socket connections (taken from https://socket.io/get-started/chat/)
io.on('connection', (socket) => {
  console.log("a user connected");

  // Listen for blocks to be published
  socket.on('publish-block', (b) => {
    console.log("received a new block");

    // Broadcast it to everyone (including original creator)
    //TODO might be able to not send back to sender with socket.broadcast.emit??
    io.emit('gossip-block', b);
  });
});

// Start the server running
http.listen(serverPort, () => {
  console.log(`Started bitstory server on port ${serverPort}`)
})
