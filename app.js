// Express Hello World Test: App (server-side)

// Dependencies
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// Defs
const port = process.env.PORT || 3001;

// Passwords (not secure)
const passwordAdmin = 'ojqewt09u0948u4098j9ija9ijcbnneqt9d901j234069i2353';

// Send HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static('static'));

// Variables
var totalClicks = 0;
var totalUsers = 0;
var userData = {};

// On events
io.on('connection', (socket) => {
    // USER CONNECTED
    console.log('CONNECTION: User ' + socket.id + ' CONNECTED');
    // Create user data
    userData[socket.id] = {
        clickCount: 0,
        privelige: "none"
    };
    // Update total users
    totalUsers++;
    io.emit('update_totalUsers', totalUsers);

    // EVENTS
    // On disconnection
    socket.on('disconnect', function() {
        // USER DISCONNECTED
        console.log('DISCONNECTION: User ' + socket.id + ' DISCONNECTED');
        // Delete user data
        delete userData[socket.id];
        // Update total users
        totalUsers--;
        io.emit('update_totalUsers', totalUsers);
    });
    // On request update
    socket.on('request_updateAll', function() {
        // Update all
        socket.emit('update_totalClicks', totalClicks);
        socket.emit('update_totalUsers', totalUsers);
    });
    // On clicked button
    socket.on('clickedButton', (amtClicks) => {
        console.log('User ' + socket.id + ' clicked button');
        // Increase click counts
        totalClicks += amtClicks;
        userData[socket.id].clickCount++;
        // Update ALL clients
        io.emit('update_totalClicks', totalClicks);
    });

    // ADMIN EVENTS
    // On try to become admin
    socket.on('tryBecomeAdmin', (password) => {
        // Check password
        if (password == passwordAdmin) {
            // Password matches
            console.log('User ' + socket.id + ' successfully became admin');
            socket.emit('update_adminSuccess');
            userData[socket.id].privelige = "admin";
        } else {
            // Password does not match
            console.log('User ' + socket.id + ' failed to become admin (incorrect password)');
            socket.emit('update_adminFailed');
        }
    });
    socket.on('admin_clearClicks', function() {
        // Check if admin
        if (userData[socket.id].privelige == "admin") {
            // Admin: clear clicks
            console.log('Admin ' + socket.id + ' cleared clicks');
            totalClicks = 0;
            // Update ALL clients
            io.emit('update_totalClicks', totalClicks);
        } else {
            // Not admin
            console.log('User ' + socket.id + ' failed to clear clicks');
        }
    });
});

// Listen
server.listen(port, () => console.log("Express Hello World Test listening on port " + port)); // Render ex. had 'app.listen' instead