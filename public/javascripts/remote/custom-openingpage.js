$(function () {
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


    $('#otp-verify').on('click', function () {
        const OTP = $('#otp').val();

        if (OTP === undefined || OTP.isEmpty()) {
            $('#otp-desc').html('OTP value is Required');
            return;
        }

        connection.checkPresence(OTP, function (isRoomExists, roomid) {
            if (isRoomExists) {
                AskUserToAllowControl(connection, OTP);
                $('#otp-desc').html('User Notification sent for permission');
            } else {
                $('#otp-desc').html('Invalid OTP');
            }
        });

    });


    function AskUserToAllowControl(connection, otp) {
        var mSocket = connection.getSocket();

        const OTP_DATA = otp;

        mSocket.emit('otpverification', {
            otp: OTP_DATA,
            objdata: {
                event: ACTIONS.OTP_VERIFICATION,
                payload: {
                    user: CURRENT_USER,
                    session: OTP_DATA
                }
            }
        });

        mSocket.on(OTP_DATA + "_connect", function (data) {
            if (data.status) {
                window.location.href = '/rjoin?room=' + OTP_DATA;
            } else {
                $('#otp-desc').html('User denied your request');
            }
        });
    }

});
