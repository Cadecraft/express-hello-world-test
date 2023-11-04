// Express Hello World Test: Script (client-side)

// Connection
var socket = io();

// UPDATES BINDINGS
socket.on('update_totalClicks', function(newTotalClicks) {
    // Update clicks
    document.getElementById('click-counter').innerText = ""+newTotalClicks;
});
socket.on('update_totalUsers', function(newTotalUsers) {
    // Update total users
    document.getElementById('connection-counter').innerText = ""+newTotalUsers;
});

// BUTTON BINDINGS
document.getElementById('click-button').addEventListener('click', function() {
    socket.emit('clickedButton', 1);
});

// ADMIN
function tryBecomeAdmin(password) {
    socket.emit('tryBecomeAdmin', password);
}
socket.on('update_adminSuccess', function() {
    // Successfully became admin
    console.log('Successfully became admin');
    document.getElementById('adminPanel').style.display = 'block';
});
socket.on('update_adminFailed', function() {
    // Failed to become admin
    console.log('Failed to become admin');
    document.getElementById('adminPanel').style.display = 'none';
});
document.getElementById('admin_clearClicks').addEventListener('click', function() {
    socket.emit('admin_clearClicks');
});

// UPDATE FROM THE SERVER ONCE ALL LOADED
socket.emit('request_updateAll');