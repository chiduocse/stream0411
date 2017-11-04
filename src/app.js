const Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
const io = require('socket.io-client');

const socket = io("http://localhost:3000");

$('#chatBox').hide();

// Node Get ICE STUN and TURN list
var https = require("https");
var options = {
    host: "global.xirsys.net",
    path: "/_turn/ChiduocSE",
    method: "PUT",
    headers: {
        "Authorization": "Basic " + new Buffer("chiduocse:bbfb0526-c154-11e7-b314-00d588086573").toString("base64")
    }
};
let str;
var httpreq = https.request(options, function (httpres) {

    httpres.on("data", function (data) { str = data; });
    httpres.on("error", function (e) { console.log("error: ", e); });
    httpres.on("end", function () {
    });
});
httpreq.end();
let customConfig;

const connectionObj = {
    host: 'stream041117.herokuapp.com',
    port: 443,
    secure: true,
    key: 'peerjs',
    config: str
};
const peerId = getPeerId();
$('#btnSignUp').click(() => {
    const username = $('#txtUserName').val();
    socket.emit('NEW_PEER_ID', {peerId: peerId, username: username});
});

const peer = new Peer(peerId, connectionObj);
$('#btnCall').click(() => {
    const friendId = $('#txtFriendId').val();
    openStream(stream => {
        playVideo(stream, 'localStream');
        const call = peer.call(friendId, stream);
        call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'));
    });
});

peer.on('call', (call) => {
    openStream(stream => {
        playVideo(stream, 'localStream');
        call.answer(stream);
        call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'));
    });
});


$('#ulPeerId').on('click', 'li', function () {
    const peerId = $(this).attr('id');
    openStream(stream => {
        playVideo(stream, 'localStream');
        const call = peer.call(peerId, stream);
        call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'));
    });
});

function getPeerId() {
    const id = uid(10);
    $('#peerid').append(id);
    return id;
};

socket.on('ONLINE_PEER_ARRAY', arrUserInfo => {
    $('#chatBox').show();
    $('#register').hide();
    arrUserInfo.forEach(user => {
        $('#ulPeerId').append('<li id=' + user.peerId + '>' + user.username + '</li>');
    });
    socket.on('NEW_CLIENT_CONNECT', user => $('#ulPeerId').append('<li id=' + user.peerId + '>' + user.username + '</li>'));
});

socket.on('REGISTRATION_FAILED',()=> alert('Vui lòng chọn UserName khác!'));

socket.on('SOMEONE_DISCONNECTED', peerId => {
    $('#' + peerId).remove();
});

