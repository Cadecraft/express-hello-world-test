// Dependencies
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// Defs
const port = process.env.PORT || 3001;

// Send HTML
//app.get("/", (req, res) => res.type('html').send(html)); // from example
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/styles.css');
    res.sendFile(__dirname + '/index.html');
});

// Variables
var totalClicks = 0;
var totalUsers = 0;

// On events
io.on('connection', (socket) => {
    // USER CONNECTED
    console.log('USER CONNECTED');
    // Update total users
    totalUsers++;
    io.emit('update_totalUsers', totalUsers);

    // EVENTS
    // On clicked button
    socket.on('clickedButton', (amtClicks) => {
        console.log('- A user clicked the button');
        // Increase total clicks
        totalClicks += amtClicks;
        // Update ALL clients
        io.emit('update_totalClicks', totalClicks);
    });
    // On request update
    socket.on('request_updateAll', function() {
        // Update all
        socket.emit('update_totalClicks', totalClicks);
        socket.emit('update_totalUsers', totalUsers);
    });
    // On disconnection
    socket.on('disconnect', function() {
        // USER DISCONNECTED
        console.log('USER DISCONNECTED')
        // Update total users
        totalUsers--;
        io.emit('update_totalUsers', totalUsers);
    });
});

// Listen
server.listen(port, () => console.log("Express Hello World Test listening on port "+port)); // Render ex. had 'app.listen' instead