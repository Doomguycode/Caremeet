var FULL_STREAM = {};
var LOCAL_AUDIO = undefined;
var LOCAL_VIDEO = undefined;
var LOCAL_SCREEN = undefined;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var connection = new RTCMultiConnection();
var room = getParameterByName("room") || connection.token()
connection.socketURL = 'https://ra-staging.ctsmartdesk.com/';
connection.enableLogs = true;
connection.UA = connection.DetectRTC.browser;


connection.session = {
    audio: true,
    video: true,
    screen: false,
    data: true
};
connection.extra = {
    name: getParameterByName("user")
};
connection.mediaConstraints = {
    audio: true,
    video: false
};
connection.iceServers = [{
    'urls': [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun.l.google.com:19302?transport=udp',
    ]
}];


connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
};
connection.audiosContainer = document.getElementById('audios-container');
connection.videosContainer = document.getElementById('videos-container');


connection.onstream = function (event) {
    if (event.type !== 'local') {
        if (event.stream.isVideo || event.stream.isScreen) {
            var existing = document.getElementById(event.streamid);
            if (existing && existing.parentNode) {
                existing.parentNode.removeChild(existing);
            }
            event.mediaElement.removeAttribute('src');
            event.mediaElement.removeAttribute('srcObject');
            event.mediaElement.muted = true;
            event.mediaElement.volume = 0;
            var video = document.createElement('video');
            try {
                video.setAttributeNode(document.createAttribute('autoplay'));
                video.setAttributeNode(document.createAttribute('playsinline'));
            } catch (e) {
                video.setAttribute('autoplay', true);
                video.setAttribute('playsinline', true);
            }
            if (event.type === 'local') {
                video.volume = 0;
                try {
                    video.setAttributeNode(document.createAttribute('muted'));
                } catch (e) {
                    video.setAttribute('muted', true);
                }
            }
            video.srcObject = event.stream;
            video.setAttribute('width', '100%');
            video.setAttribute('class', "pad15 mvideo");
            connection.videosContainer.appendChild(video);
            FULL_STREAM[event.streamid] = {element: video.cloneNode(true), src: event.stream};
            video.setAttribute('id', event.streamid);
            $('.mvideo').on('click', function () {
                $('#main-video-elem').html('');
                var mvideo = FULL_STREAM[$(this).attr('id')];
                //mvideo['element'].setAttribute('width', '100%');
                mvideo['element'].setAttribute('width', $('#video-parent').width());
                mvideo['element'].srcObject = mvideo['src'];
                mvideo['element'].setAttribute('vscreen', 'vscreen');
                mvideo['element'].setAttribute('id', 'scrid');
                mvideo['element'].setAttribute('class', 'video-js');
                // $('#main-video-elem').css('background-color', 'black');
                $('#main-video-elem').append(mvideo['element']);
                //initScreenControl(OTP, $('video[vscreen]'));
            });
        } else {
            var width = parseInt(connection.audiosContainer.clientWidth / 2) - 20;
            var mediaElement = getHTMLMediaElement(event.mediaElement, {
                title: event.userid,
                buttons: ['full-screen'],
                width: width,
                showOnMouseEnter: false
            });
            connection.audiosContainer.appendChild(mediaElement);
            setTimeout(function () {
                mediaElement.media.play();
            }, 5000);
            mediaElement.id = event.streamid;
        }
    }
    initHark({
        stream: event.stream,
        streamedObject: event,
        connection: connection
    });
};
connection.onspeaking = function (e) {
    connection.send({
        streamid: e.streamid,
        speaking: true
    });
};
connection.onopen = function (event) {
    connection.onUserStatusChanged({
        userid: event.userid,
        extra: event.extra,
        status: 'online'
    });
};
connection.onUserStatusChanged = function (status) {
    //document.getElementById(event.userid).src = status === 'online' ? 'online.gif' : 'offline.gif';
    renderUser();
};
connection.onleave = connection.onclose = function (event) {
    connection.onUserStatusChanged({
        userid: event.userid,
        extra: event.extra,
        status: 'offline'
    });
};
connection.onsilence = function (e) {
    connection.send({
        streamid: e.streamid,
        silence: true
    });
};
connection.onmessage = function (event) {
    if (event.data.speaking) {
        $('#' + event.userid + "_speaker").show();
    }
    if (event.data.silence) {
        $('#' + event.userid + "_speaker").hide();
    }
};
connection.onstreamended = function (event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
        $('#main-video-elem').html('');
        delete FULL_STREAM[event.streamid];
    }
};
connection.onMediaError = function (e) {
    if (e.message === 'Concurrent mic process limit.') {
        if (DetectRTC.audioInputDevices.length <= 1) {
            alert('Please select external microphone.');
            return;
        }
        var secondaryMic = DetectRTC.audioInputDevices[1].deviceId;
        connection.mediaConstraints.audio = {
            deviceId: secondaryMic
        };
        connection.join(connection.sessionid);
    }
};
connection.openOrJoin(room);
connection.onNewParticipant = function (participantId, userPreferences) {
    connection.acceptParticipationRequest(participantId, userPreferences);
    renderUser();
};
connection.onmute = function (event) {
    if (event.stream.pause) {
        $('#' + event.userid + "_mute").show();
    }
};
connection.onunmute = function (event) {
    if (event.stream.resume) {
        $('#' + event.userid + "_mute").hide();
    }
};
connection.onEntireSessionClosed = function (event) {
    console.info('Entire session is closed: ', event.sessionid, event.extra);
};
renderUser();

function renderUser() {
    $('#user-list').html('');

    $('#user-list').append("<ul>")
    connection.getAllParticipants().forEach(function (remoteUserId) {
        var user = connection.peers[remoteUserId];
        var extra = user.extra;
        $('#user-list').append(`<li id="${remoteUserId}"> ${extra.name}</li>`)
    });
    $('#user-list').append("</ul>")
}

$('#webcam-share').on('click', function () {
    DetectRTC.load(() => {
        if (!DetectRTC.hasWebcam) {
            alert('No Webcam found');
            return;
        }
        var screenClick = $(this);
        if ($(this).hasClass('aui-nav-selected')) {
            $(this).removeClass('aui-nav-selected');
            $(this).find('.aui-nav-item-label').html('Webcam Sharing');
            //connection.removeStream($(this).attr('streamid'));
            //connection.renegotiate();
            connection
                .streamEvents[LOCAL_VIDEO]
                .stream
                .stop();
        } else {
            $(this).addClass('aui-nav-selected');
            $(this).find('.aui-nav-item-label').html('Remove Webcam');
            connection.captureUserMedia(function (stream) {
                LOCAL_VIDEO = stream.streamid;
                connection.addStream(stream);
            }, {video: true, audio: false});

        }
    });
});
$('#mute-button').on('click', function () {
    if ($(this).hasClass('muted')) {
        connection.streamEvents.selectFirst({local: true}).stream.unmute();
        $(this).html('Mute');
        $(this).removeClass('muted');
    } else {
        connection.streamEvents.selectFirst({local: true}).stream.mute();
        $(this).html('Un-Mute');
        $(this).addClass('muted');
    }
});
$('#screen-share').on('click', function () {
    var screenClick = $(this);
    if ($(this).hasClass('aui-nav-selected')) {
        $(this).removeClass('aui-nav-selected');
        $(this).find('.aui-nav-item-label').html('Screen Sharing');
        //connection.removeStream($(this).attr('streamid'));
        //connection.renegotiate();
        connection
            .streamEvents[LOCAL_SCREEN]
            .stream
            .stop();
    } else {
        $(this).addClass('aui-nav-selected');
        $(this).find('.aui-nav-item-label').html('Remove Sharing');
        //connection.attachStreams[0].addTrack()
        //connection.
        connection.captureUserMedia(function (stream) {
            LOCAL_SCREEN = stream.streamid;
            connection.addStream(stream);
        }, {video: false, audio: false, screen: true});
    }
});

function initHark(args) {
    if (!window.hark) {
        throw 'Please link hark.js';
        return;
    }
    var connection = args.connection;
    var streamedObject = args.streamedObject;
    var stream = args.stream;
    var options = {};
    var speechEvents = hark(stream, options);
    speechEvents.on('speaking', function () {
        connection.onspeaking(streamedObject);
    });
    speechEvents.on('stopped_speaking', function () {
        connection.onsilence(streamedObject);
    });
}
