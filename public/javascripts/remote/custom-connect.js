window.remoteConnection = undefined;


const buttons = {
    0: 'left',
    1: 'middle',
    2: 'right'
};

var lastX = null;
var lastY = null;
const OTP = ROOM;
var STREAM = null;


const DEFAULT_THROTTLE = 10;
const MIN_SCROLL_THRESHOLD = 5;
const MIN_TOUCH_DURATION = 50;
var video = undefined;
var videoSize;

function getButtonName(eventButtonCode) {
    return buttons[eventButtonCode];
}

function getMouseData(e) {
    var data = {};
    data.clientX = e.clientX;
    data.clientY = e.clientY;

    if (!video) video = document.getElementById(STREAM);
    if (video) {
        videoSize = video.getBoundingClientRect();
        data.canvasWidth = videoSize.width;
        data.canvasHeight = videoSize.height;

    }

    return data;
}

function globalEmit(socket, OTP, payload) {
    socket.emit('screencontrol', {
        otp: OTP,
        objdata: payload
    });
}

const VIEW_ACTION = {
    keyPress: function (socket, OTP, payload) {

        globalEmit(socket, OTP, {
            event: ACTIONS.WS_KEY_PRESS,
            payload: payload
        });

    },
    keyToggle: function (socket, payload) {
        globalEmit(socket, OTP, {
            event: ACTIONS.WS_KEY_TOGGLE,
            payload: payload
        });
    },
    mouseMove: function (socket, OTP, payload) {
        globalEmit(socket, OTP, {
            event: ACTIONS.WS_MOUSE_MOVE,
            payload: payload,
        });
    },
    mouseClick: function (socket, OTP, payload) {
        globalEmit(socket, OTP, {
            event: ACTIONS.WS_MOUSE_CLICK,
            payload: payload
        });
    },
    mouseToggle: function (socket, OTP, payload) {
        globalEmit(socket, OTP, {
            event: ACTIONS.WS_MOUSE_TOGGLE,
            payload: payload
        });
    },

    mouseScroll: function (socket, OTP, payload) {
        globalEmit(socket, OTP, {
            event: ACTIONS.WS_MOUSE_SCROLL,
            payload: payload
        });
    }


};


function handleMouse(event, scroll) {

    VIEW_ACTION.mouseMove(window.remoteConnection.getSocket(), OTP, {
        x: event.clientX,
        y: event.clientY,
        scroll: scroll || false,
        mousedata: getMouseData(event)
    });

}

function handleMouseMove(event) {
    handleMouse(event);
}

function handleDoubleClick(event) {

    VIEW_ACTION.mouseClick(window.remoteConnection.getSocket(), OTP, {
        button: getButtonName(event.button),
        double: true,
        mousedata: getMouseData(event)
    });

}

function handleClick(event) {
    VIEW_ACTION.mouseClick(window.remoteConnection.getSocket(), OTP, {
        button: getButtonName(event.button),
        double: false,
        mousedata: getMouseData(event)
    });
}

function handleKeyDown(e) {
    var data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        control: e.ctrlKey,
        alt: e.altKey
    };

    //this is comment
    //this is test cursor
    //this is onather test cursor
    //D is capital
    VIEW_ACTION.keyPress(window.remoteConnection.getSocket(), OTP, data);
}

var SCROLL_POS = $(window).scrollTop();

function handleScroll(event) {
    console.log(event);
    var scroll = $(window).scrollTop();
    if (scroll > SCROLL_POS) {

        VIEW_ACTION.mouseScroll(window.remoteConnection.getSocket(), OTP, {
            ypos: 1
        });
    } else {
        VIEW_ACTION.mouseScroll(window.remoteConnection.getSocket(), OTP, {
            ypos: -1
        });
    }
    SCROLL_POS = scroll;
}


function disconnectStream() {
    $('#userstream').html('');
    $('#disconnected-page').show();

    $('#' + STREAM).off('dblclick', handleDoubleClick);
    $('#' + STREAM).off('click', handleClick);
    $(window).off('scroll', handleScroll);
    $(window).off('keydown', handleKeyDown);
}

function initScreenControl(element) {


    //element.on('mousemove', handleMouseMove);
    element.on('dblclick', handleDoubleClick);
    element.on('click', handleClick);
    $(window).on('scroll', handleScroll);
    $(window).on('keydown', handleKeyDown);


    window.remoteConnection.getSocket().on(ROOM + "_stop", function (data) {
        if (data.status) {
            disconnectStream();
        }
    });
}

//keyboartest
$(function () {

    $('#error-page').hide();
    $('#disconnected-page').hide();

    //connect to ROOM and Socket
    var connection = new RTCMultiConnection();
    connection.socketURL = '/';
    connection.enableLogs = true;

    connection.session = {
        audio: false,
        video: false,
        screen: false,
        data: true
    };

    connection.extra = {
        name: CURRENT_USER
    };
    connection.mediaConstraints = {
        audio: false,
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
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    };


    connection.checkPresence(ROOM, function (isRoomExists, roomid) {
        if (!isRoomExists) {
            window.location.href = '/';
        } else {
            connection.join(roomid);
            window.remoteConnection = connection;
            initRemoteProcedure();
        }
    });


    function initRemoteProcedure() {

        window.remoteConnection.onstream = function (e) {

            e.mediaElement.muted = true;
            e.mediaElement.volume = 0;

            $('#userstream').append(e.mediaElement);

            console.log(e.stream.getVideoTracks()[0].getSettings().height);
            console.log(e.stream.getVideoTracks()[0].getSettings().width);

            $('#' + e.stream.streamid).attr('height', '100%');
            $('#' + e.stream.streamid).attr('width', '100%');
            $('#' + e.stream.streamid).removeAttr('controls');
            $('#' + e.stream.streamid).css('background', 'black');
            $('#' + e.stream.streamid).css('object-fit', 'fill');
            //$('#' + e.stream.streamid).css('cursor', 'none');
            var played = e.mediaElement.play();
            initScreenControl($('#' + e.stream.streamid));

            STREAM = e.stream.streamid;
            if (typeof played !== 'undefined') {
                played.catch(function () {
                    /*** iOS 11 doesn't allow automatic play and rejects ***/
                }).then(function () {
                    setTimeout(function () {
                        e.mediaElement.play();
                    }, 2000);
                });
                return;
            }

            setTimeout(function () {
                e.mediaElement.play();
            }, 2000);


        };
        window.remoteConnection.onstreamended = function (event) {
            console.log('stream ended');
            disconnectStream();
        };
        window.remoteConnection.onEntireSessionClosed = function (event) {
            disconnectStream();
        };
        window.remoteConnection.onMediaError = function (e) {
            disconnectStream();
        };


    }


});
