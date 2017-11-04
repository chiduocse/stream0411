const io = require('socket.io')(3000);
const arrUserInfo = [];

io.on('connection', socket => {

    socket.on('NEW_PEER_ID', user => {
        const isExist = arrUserInfo.some(e => e.username === user.username);
        if (isExist) return socket.emit('REGISTRATION_FAILED');
        socket.peerId = user.peerId;
        arrUserInfo.push(user);
        socket.emit('ONLINE_PEER_ARRAY', arrUserInfo);
        socket.broadcast.emit('NEW_CLIENT_CONNECT', user);
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.indexOf(socket.peerId);
        arrUserInfo.splice(index, 1);
        io.emit('SOMEONE_DISCONNECTED', socket.peerId);
    });
});