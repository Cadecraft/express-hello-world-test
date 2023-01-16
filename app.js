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
    res.sendFile(__dirname + '/index.html');
});

// Variables
var totalClicks = 0;
var totalUsers = 0;

// On events
io.on('connection', (socket) => {
    console.log('- A user connected');
    // Update total users
    totalUsers++;
    io.emit('update-totalusers', totalUsers);
    // Events
    // On clicked button
    socket.on('clickedbutton', (amtClicks) => {
        console.log('- A user clicked the button');
        // Increase total clicks
        totalClicks += amtClicks;
        // Emit
        io.emit('update-totalclicks', totalClicks);
    });
})

// Listen
server.listen(port, () => console.log("Express Hello World Test listening on port "+port)); // Render ex. had 'app.listen' instead