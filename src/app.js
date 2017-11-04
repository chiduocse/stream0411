const Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');
const openStream = require('./openStream');
const playVideo = require('./playVideo');


function getPeerId() {
    const id = uid(10);
    $('#peerid').append(id);
    return id;
};

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
        console.log(str);
    });
});
httpreq.end();
let customConfig;

//Call Xirsys ICE server
// $.ajax({
//     url: "https://service.xirsys.com/ice",
//     data: {
//         ident: "chiduocse",
//         secret: "bbfb0526-c154-11e7-b314-00d588086573",
//         channel: "ChiduocSE",
//         secure: 1
//     },
//     success: function (data, status) {
//         //data.d is where the iceServers object lives
//         customConfig = data.d;
//         console.log(customConfig);
//     },
//     async: false
// });

const connectionObj = {
    host: 'stream041117.herokuapp.com',
    port: 443,
    secure: true,
    key: 'peerjs',
    config: str
}

const peer = new Peer(getPeerId(), connectionObj);
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