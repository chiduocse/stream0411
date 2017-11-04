const Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');
const openStream = require('./openStream');
const playVideo = require('./playVideo');

const config = { host: 'stream041117.herokuapp.com', port: 443, secure: true, key: 'peerjs' }

function getPeerId() {
    const id = uid(10);
    $('#peerid').append(id);
    return id;
}
const peer = new Peer(getPeerId(), config);
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
    })
});