var CareMeetUtility = {};

function detectStream(deviceid) {
    navigator.mediaDevices.getUserMedia({
        video: false, audio: {
            deviceId: {
                exact: deviceid
            }
        }
    }, function (stream) {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var analyser = audioCtx.createAnalyser();
        var source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

    }).catch(function (err) {
        alert(err)
    })
}

CareMeetUtility.chooseDevices = function (connection, callback) {
    audioInputDevices = [];
    audioOutputDevices = [];
    DEVICEID = 'default';


    DetectRTC.load(function () {
        DetectRTC.audioInputDevices.forEach(function (devices) {
            $('#audioInputDevices').append('<option value="' + devices.deviceId + '"> ' + devices.label + '</option>')
        });

        DetectRTC.audioOutputDevices.forEach(function (devices) {
            $('#audioOutputDevices').append('<option value="' + devices.deviceId + '"> ' + devices.label + '</option>')
        });
    });


    AJS.dialog2("#chooseInputDeviceDialog").show();


    $('#audioInputDevices').on('change', function () {
        DEVICEID = $(this).val()
    });

    $('#audioOutputDevices').on('change', function () {

    });
    $('#audioOkay').on('click', function () {
        AJS.dialog2("#chooseInputDeviceDialog").hide()
        callback()
    })
};
CareMeetUtility.getTracks = function (stream, kind) {
    if (!stream || !stream.getTracks) {
        return [];
    }

    return stream.getTracks().filter(function (t) {
        return t.kind === (kind || 'audio');
    });
}