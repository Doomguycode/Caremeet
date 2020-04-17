const ACTIONS = {
    VIEW_SET: 'VIEW_SET',

    KEYBOARD_TOGGLE: 'KEYBOARD_TOGGLE',
    MOUSE_TOGGLE: 'MOUSE_TOGGLE',

    WS_KEY_PRESS: 'WS_KEY_PRESS',
    WS_KEY_TOGGLE: 'WS_KEY_TOGGLE',
    WS_MOUSE_CLICK: 'WS_MOUSE_CLICK',
    WS_MOUSE_MOVE: 'WS_MOUSE_MOVE',
    WS_MOUSE_TOGGLE: 'WS_MOUSE_TOGGLE',

    OTP_VERIFICATION: 'OTP_VERIFY'
};

const buttons = {
    0: 'left',
    1: 'middle',
    2: 'right'
};

var lastX = null;
var lastY = null;

var socket = null;
const DEFAULT_THROTTLE = 10;
const MIN_SCROLL_THRESHOLD = 5;
const MIN_TOUCH_DURATION = 50;

function getButtonName(eventButtonCode) {
    return buttons[eventButtonCode];
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
            payload: payload
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
    }
};


function toggleFullScreen(player) {


    if (player.requestFullscreen)
        if (document.fullScreenElement) {
            document.cancelFullScreen();
        } else {
            player.requestFullscreen();
        }
    else if (player.msRequestFullscreen)
        if (document.msFullscreenElement) {
            document.msExitFullscreen();
        } else {
            player.msRequestFullscreen();
        }
    else if (player.mozRequestFullScreen)
        if (document.mozFullScreenElement) {
            document.mozCancelFullScreen();
        } else {
            player.mozRequestFullScreen();
        }
    else if (player.webkitRequestFullscreen)
        if (document.webkitFullscreenElement) {
            document.webkitCancelFullScreen();
        } else {
            player.webkitRequestFullscreen();
        }
    else {
        alert("Fullscreen API is not supported");

    }
}

function FormSubmission(eventer) {
    var mSocket = window.SOCK_CONNECTION.getSocket();

    eventer.preventDefault();
    const OTP_DATA = $('#OTP').val();

    console.log(window.SOCK_CONNECTION);
    mSocket.emit('otpverification', {
        otp: OTP_DATA,
        objdata: {
            event: ACTIONS.OTP_VERIFICATION,
            payload: {
                user: window.SOCK_CONNECTION.extra.name,
                session: window.SOCK_CONNECTION.sessionid
            }
        }
    });

    mSocket.on(OTP_DATA + "_connect", function (data) {
        if (data.status) {
            AJS.dialog2("#screen-control-dialog").hide();
            initScreenControl(OTP, $('video[vscreen]'));
            AJS.flag({
                type: 'success',
                body: 'User Accepted your screen Control.',
                close: 'auto'
            });

        } else {

        }
    });
}

function enableScreenControl() {

    var mSocket = window.SOCK_CONNECTION.getSocket();
    $('#screen-control-btn').show();
    $('#screen-control-btn').on('click', function (event) {
        event.preventDefault();
        AJS.dialog2("#screen-control-dialog").show();


        $('#otp-submission-form').on('submit', FormSubmission);
    });
}

function disableScreenControl() {
    $('#screen-control-btn').hide();
}


function handleMouse(posX, posY, scroll) {
    const x = posX - lastX;
    const y = posY - lastY;

    if (scroll && Math.abs(y) < MIN_SCROLL_THRESHOLD) return;

    lastX = posX;
    lastY = posY;

    VIEW_ACTION.mouseMove(socket, OTP, {
        x: posX,
        y: posY,
        scroll: scroll
    });

}

function handleMouseMove(event) {
    handleMouse(event.clientX, event.clientY,);
}

function handleMouseEnter(event) {
    lastX = event.clientX;
    lastY = event.clientY;
}

function handleDoubleClick(event) {

    VIEW_ACTION.mouseClick(socket, OTP, {
        button: getButtonName(event.button),
        double: true
    });

}

function handleClick(event) {
    VIEW_ACTION.mouseClick(socket, OTP, {
        button: getButtonName(event.button),
        double: false
    });
}


function initScreenControl(OTP, element) {


    socket = window.SOCK_CONNECTION.getSocket();
    const tOTP = OTP;

    element.on('mousemove', handleMouseMove);
    element.on('mouseenter', handleMouseEnter);
    element.on('dblclick', handleDoubleClick);
    element.on('click', handleClick);
}
