"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var next = require('next');
var http = require('http');
var socket_io_1 = require("socket.io");
var dev = process.env.NODE_ENV !== 'production';
var app = next({ dev: dev });
var handle = app.getRequestHandler();
var server = http.createServer();
var io = new socket_io_1.Server(server);
io.on('connection', function (socket) {
    console.log("Socket ".concat(socket.id, " connected"));
    socket.on('create-room', function (data) {
        console.log(`Creating room ${data.name}`);
        socket.join(data.name);
    });
    socket.on('disconnect', function () {
        console.log("Socket ".concat(socket.id, " disconnected"));
    });
});

app.prepare().then(function () {
    server.on('request', handle);

    var PORT = process.env.PORT || 4000;
    server.listen(PORT, function () {
        console.log("Server listening on port ".concat(PORT));
    });
});
