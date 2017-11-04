const playVideo = require('./playVideo');

function openStream(cb) {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(stream =>{
            cb(stream);
        })
        .catch(error => console.log(error));
}

module.exports = openStream;