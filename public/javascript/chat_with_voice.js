var FULL_STREAM = {};
var LOCAL_AUDIO = undefined;
var LOCAL_VIDEO = undefined;
var LOCAL_SCREEN = undefined;
const OTP = "647991";

$(function () {
    console.log(`${login_id}`);
    $('ul').on('click', 'li', function (e) {

        $('.current-name').empty();
        $('.current-avatar').empty();
        $('#current-chat-id').empty();

        var to_user = $(this).attr('id');
        var from_user = $('#current-user-id').val();
        $('.current-avatar').append($(this).find('.avatar-icon').html());
        $('.current-name').append($(this).find('.sideBar-name').html());
        $('#current-chat-id').val(to_user);
        $('#conversation').empty();
        socket.emit('fetchMessages', {to_user, from_user});

        $(document).keydown(function (evt) {
            if (evt.keyCode == 13 && (evt.ctrlKey)) {
                evt.preventDefault();
                alert('worked');
            }
        });

        $('#textChat').show();
        $('#voiceChat').hide();

    });
});
(function ($, window) {
    $.fn.contextMenu = function (settings) {
        return this.each(function () {

            // Open context menu
            $(this).on("contextmenu", function (e) {
                // return native menu if pressing control
                if (e.ctrlKey) return;

                //open menu
                var $menu = $(settings.menuSelector)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                        position: "absolute",
                        left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                        top: getMenuPosition(e.clientY, 'height', 'scrollTop')
                    })
                    .off('click')
                    .on('click', 'a', function (e) {
                        $menu.hide();

                        var $invokedOn = $menu.data("invokedOn");
                        var $selectedMenu = $(e.target);

                        settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                    });

                return false;
            });

            //make sure menu closes on any click
            $('body').click(function () {
                $(settings.menuSelector).hide();
            });
        });

        function getMenuPosition(mouse, direction, scrollDir) {
            var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $(settings.menuSelector)[direction](),
                position = mouse + scroll;

            // opening menu would pass the side of the page
            if (mouse + menu > win && menu < mouse)
                position -= menu;

            return position;
        }

    };
})(jQuery, window);

//Bing Context Menu to Element
$("#live_user_list").contextMenu({
    menuSelector: "#contextMenu",
    menuSelected: function (invokedOn, selectedMenu) {
        var to = invokedOn.parent().parent().parent().parent().parent().attr('id');

        var msg = "You are initiating a '" + selectedMenu.text() +
            "' to - '" + invokedOn.text() + "'";

        if (selectedMenu.text() == 'Voice Call') {
            from = $('#current-user-id').val();
            socket.emit('newVoiceCall', {to, from});
        }
        if (selectedMenu.text() == 'Video Call') {
            console.log('video call initiaited');
            from = $('#current-user-id').val();
            socket.emit('newVideoCall', {to, from});
        }
        alert(msg);
    }
});

let CTS_NameSpace = "/";
//query: `userid=${login_id}&first_name=${first_name}&last_name=${last_name}&groups=${groups}&client=${client}&groups0=${groups0}&groups1=${groups1}`,

//Establish socket connection to server
var socket = io.connect(CTS_NameSpace, {
    query: `userid=${login_id}&first_name=${first_name}&last_name=${last_name}&groups=${groups}&client=${client}&groups0=${groups0}&groups1=${groups1}`,
    transport: ['websocket'],
    rejectUnathorized: false
});

socket.on(login_id, function (data) {
    if (data.type == 'data') {
             console.log(data);
             var user_name = data['status'][0]['First_Name'] + " " + data['status'][0]['Last_Name'];
             var zAssignedGroup = data["status"][0]["zAssigned_Group"];
             var avatar = data["status"][0]["avatar"];
             zAssigned_Group_list = zAssignedGroup.split(';');
             zAssigned_Group_list.forEach((group) => {
                 if (group != '') {

                 }
             });
             $('#logged_in_user').text(user_name);
             $('#profile_pic').append('<img src="https://bootdey.com/img/Content/avatar/avatar' + data["status"][0]["avatar"] + '.png">');
     //        $('#profile_pic').append('/images/Profile_Avatar_Icons/avatar' + data["status"][0]["avatar"] + '.png">');
     //        profile_image_path = "/images/Profile_Avatar_Icons/avatar" + data["status"][0]["avatar"] + '.png"
     //        $('#profile_pic').prepend('<img id="theImg" src="/images/Profile_Avatar_Icons/avatar" />')
             $('#current-user-id').val(data["status"][0]["Login_ID"]);
         }
         if (data.type == 'greetings')
             socket.emit('room-clients', {});
         if (data.type == 'incoming_message') {
     //                jquery_param = '#'+ data.from
     //                $( jquery_param ).trigger( "click" );
             $("#conversation").append('<div class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">' + data.msg + ' </div><span class="message-time pull-right"> Sun </span></div></div></div>');
         }
         if (data.type == 'recentChats') {
             console.log(data);
             console.log('data received');
             data.chatData.reverse().forEach(value => {
                 if (value["from"] == login_id) {
                     console.log('sender message');
                     console.log(value["msg"]);
                     $('#conversation').append(' <div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">' + value["msg"] + '</div><span class="message-time pull-right"> Sun </span></div></div></div>');
                 } else {
                     console.log('receiver Mesage');
                     console.log(value["msg"]);
                     $('#conversation').append('<div class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">' + value["msg"] + '</div><span class="message-time pull-right"> Sun </span></div></div></div>');
                 }
             });
         }
         if (data.type == 'incoming_voice_call') {
             var from = data.from;
             var r = confirm('voice call received from ' + from+'. Press ok to join collaborative room');
             if (r == true) {
                 txt = "You pressed OK!";
                 room = Math.floor(Math.random() * 100);
                 console.log('random room is :' + room);
                 join_voice_room(room);
     //            window.open('https://192.168.1.90:3000/meet/'+room+'/?user=WAL-BALPERN', "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
                 window.open('https://192.168.1.90:3000/collab/'+'?room='+room+'&user=WAL-BALPERN'+'&audio=true'+'&video=false', "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
                 socket.emit('voiceCallAccept', {room, from});
             } else {
                 txt = "You pressed Cancel!";
             }
         }
         if (data.type == 'join_voice_room') {
              var r = confirm('voice call accepted by ' + data.from+ '. Press ok to join collaborative room');
                     if (r == true) {
     //                    window.open('https://192.168.1.90:3000/meet/'+data.room+'/?user=WAL-JESDALE', "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
                         window.open('https://192.168.1.90:3000/collab/'+'?room='+data.room+'&user=WAL-JESDALE'+'&audio=true'+'&video=false', "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
                         join_voice_room(data.room);
                         console.log('voice room joined');
                     }
                     else{console.log('you denied joining the meeting')};
         }
         if (data.type == 'incoming_video_call') {
             var from = data.from;
             var r = confirm('video call received from ' + from+'. Press ok to join collaborative room');
             if (r == true) {
                 txt = "You pressed OK!";
                 room = Math.floor(Math.random() * 100);
                 console.log('random room is :' + room);
                 join_voice_room(room);
     //            window.open('https://192.168.1.90:3000/meet/'+room+'/?user=WAL-BALPERN', "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
                 window.open('https://192.168.1.90:3000/collab/'+'?room='+room+'&user=WAL-BALPERN'+'&audio=true'+'&video=true', "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
                 socket.emit('videoCallAccept', {room, from});
             } else {
                 txt = "You pressed Cancel!";
             }
         }
         if (data.type == 'join_video_room') {
              var r = confirm('video call accepted by' + data.from+ '. Press ok to join collaborative room');
                     if (r == true) {
     //                    window.open('https://192.168.1.90:3000/meet/'+data.room+'/?user=WAL-JESDALE', "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
                         window.open('https://192.168.1.90:3000/collab/'+'?room='+data.room+'&user=WAL-JESDALE'+'&audio=true'+'&video=true', "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
                         join_voice_room(data.room);
                         console.log('voice room joined');
                     }
                     else{console.log('you denied joining the meeting')};
         }
});
socket.on('success', function (data) {
    console.log(data);
    if (data.users_already_in[data.group] != null) {
        data.users_already_in[data.group].forEach(value => {
            string_construct = '#' + value.Login_ID;
            if ($(string_construct).length) {
            } else {
                $("#live_user_list").append('<li id=' + value['Login_ID'] + ' ><div class="row sideBar-body"><div class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="https://bootdey.com/img/Content/avatar/avatar' + value['avatar'] + '.png"></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">' + value['first_name'] + ' ' + value['last_name'] + '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18 </span></div></div></div></div></div></li>');
            }

        });
    }
});
socket.on('room-join', function (data) {
    console.log('room join data is ');
    console.log(data);

    $('#users_online').val('Users Online :' + data.number_of_users + ' under development');
    string_construct = '[id="' + data.Login_ID + '"]';
    if ($(string_construct).length > 1) {
        // exists twice
    } else {
        $("#live_user_list").append('<li id=' + data.Login_ID + ' ><div  class="row sideBar-body"><div class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="https://bootdey.com/img/Content/avatar/avatar' + data.avatar + '.png"></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">' + data.user_first_name + ' ' + data.user_last_name + '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18 </span></div></div></div></div></div></li>');
        console.log("New User has joined in the group   : " + data['group']);
    }

});
socket.on('room-leave', function (data) {
    console.log('room leave data is');
    console.log(data);
    console.log('The user that just left is ' + data.Login_ID);
    $("#" + data.Login_ID).remove();
});

$('#send_message').click(function () {
    sendMessage();
});

function sendMessage() {
    from = $('#current-user-id').val();
    to = $('#current-chat-id').val();
    if( $('#message').val() == ''){
    }
    else{
    chatMsg = $('#message').val();
    $('#conversation').append(' <div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">' + chatMsg + '</div><span class="message-time pull-right"> Sun </span></div></div></div>');
    socket.emit('newMsg', {chatMsg, to, from});
    $('#message').val('');
    }
};

function join_voice_room(roomId) {

        DetectRTC.load(() => {
            if (!DetectRTC.hasMicrophone) {
                 alert('MicroPhone not Available');
            }
            if (!DetectRTC.hasSpeakers) {
                 alert('Speaker not Available');
            }
        });

        var room = roomId;
        var connection = new RTCMultiConnection();

        // connection.enableScalableBroadcast = true;
        connection.socketURL = '/control-event/';
        connection.enableLogs = true;
        connection.UA = connection.DetectRTC.browser;

        connection.session = {
            audio: true,
            video: false,
            screen: false,
            data: true
        };
        connection.extra = {
            name: '{{query.user}}'
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
            OfferToReceiveVideo: true
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
//        AJS.$('.stat-tooltip').tooltip();

        function renderUser() {
            $('#user-list').html('');

            connection.getAllParticipants().forEach(function (remoteUserId) {
                var user = connection.peers[remoteUserId];
                var extra = user.extra;

                $('#user-list').append(com.poovarasan.application.onlineUsers({
                    title: extra.name,
                    userid: remoteUserId,
                    presenter: true
                }));
            });
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

                    // connection.addStream({
                    //     video: true,
                    //     streamCallback: function (screenStream) {
                    //         screenClick.attr('streamid', screenStream.streamid);
                    //         if (!screenStream) {
                    //             alert('User did NOT select to share any stream. He clicked "Cancel" button instead.');
                    //             return;
                    //         }
                    //         screenStream.onended = function () {
                    //             screenClick.removeClass('aui-nav-selected');
                    //             screenClick.find('.aui-nav-item-label').html('Screen Sharing');
                    //         };
                    //     }
                    // });
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
                // connection.addStream({
                //     screen: true,
                //     oneway: true,
                //     streamCallback: function (screenStream) {
                //
                //         if (!screenStream) {
                //             alert('User did NOT select to share any stream. He clicked "Cancel" button instead.');
                //             return;
                //         }
                //
                //         screenClick.attr('streamid', screenStream.streamid);
                //         screenStream.onended = function () {
                //             screenClick.removeClass('aui-nav-selected');
                //             screenClick.find('.aui-nav-item-label').html('Screen Sharing');
                //         };
                //     }
                // });
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

        window.SOCK_CONNECTION = connection;
        enableScreenControl();
}