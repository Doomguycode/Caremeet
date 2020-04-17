const createError = require('http-errors');//error
const express = require('express');//framework
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');//encrypt cookie decrypt
const logger = require('morgan');//logger

const debug = require('debug')('caremeet:server');
const http = require('http');//server protocol
const https = require('https');
const helmet = require('helmet');//security headers to add
const compression = require('compression');//gzip compression-fast ui

const indexRouter = require('./routes/index');//urls.py

const app = express();

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//handlebar template engine for Express Framework
const exphbs = require('express-handlebars'); //template engine
const hbsHelpers = require('handlebars-helpers'); //helpers for template engine
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'layout.hbs', //Master page
    layoutsDir: path.join(__dirname, "views/layouts/"), //Master page layouts
    partialsDir: path.join(__dirname, 'views/partials'), //Template Tags
    helpers: require('handlebars-helpers').helpers //Template Tag Helpers
});

// Replace default view engine with Hbs engine
app.engine('hbs', hbs.engine); //Set handlebar engine to express
app.set('view engine', 'hbs'); // set view engine to handlebar

//Securty/compression/json/loggin/encode/decode *SET Static Foldder*
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session encryption code
const secret = 'eeeek';
//Parses Json by default
app.use(require('body-parser').urlencoded({
    extended: true // must give a value for extended
}));

//Set session in express
app.use(
    require('express-session')(
        {
            name: 'site_cookie',
            secret: secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 15000
            }
        }
    )
);

//Default router
app.use('/', indexRouter);

// MongoDB
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'Ref_Db';// Database Name
const client = new MongoClient(url);// Create a new MongoClient
client.connect(  async function(err) {
    db = client.db(dbName);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.render('error/404', {layout: 'default'});
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//WEB rtc Server
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
//const io = require('socket.io');

//Server https Configuration
var key = fs.readFileSync(__dirname + '/cert/key.pem');
var cert = fs.readFileSync(__dirname + '/cert/cert.pem');
var options = {
  key: key,
  cert: cert,
//  requestCert: false,
//  rejectUnauthorized: false
};

https.globalAgent.options.rejectUnathorized = false;
var server = https.createServer(options, app);

//const server = http.createServer( app);


server.listen(port);
server.on('error', onError);
server.on('listening', function () {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
});

//const socket = io.listen(server);
//socket.set('transports', ['websocket',]);

const socketIO = require('socket.io');
const io = socketIO.listen(server);

//Namespace for WebRTC
const nsp = io.of("/controlevent")

//const redisAdapter = require('socket.io-redis');
//io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

//WebRTC Events (Remote/VoiceCall/VideoCall)
nsp.on("connection" , function(socket) {

        console.log('Connection to client established');

        RTCMultiConnectionServer.addSocket(socket);

        const params = socket.handshake.query;

        if (!params.socketCustomEvent) {
            params.socketCustomEvent = 'custom-message';
        }

        socket.on('screencontrol', function (data) {
            socket.broadcast.emit(data.otp, data.objdata);
        });
        socket.on('otpverification', function (data) {
            socket.broadcast.emit(data.otp + "_listen", data.objdata);
        });
        socket.on('remote-connection-status', function (data) {
            console.log(data);
            socket.broadcast.emit(data.otp + "_connect", data);
        });
        socket.on('stop-screen-share', function (data) {
            console.log("stopscreenshare");
            console.log(data);
            socket.broadcast.emit(data.otp + "_stop", data);
        });
        socket.on(params.socketCustomEvent, function (message) {
            socket.broadcast.emit(params.socketCustomEvent, message);
        });
        socket.on('message', function (data) {
            socket.broadcast.emit('message', data);
        });
        socket.on('disconnect', function () {
            console.log('Server has disconnected');
        });

})


//SOCKET IO (TextChat/LivePrescence) Events
io.on("connection",async (socket)=>{
    var userId = socket.handshake.query['userid']
    console.log('--------------------------------------------------------------------------------');
    console.log("A new Client has connected with userId : " +userId +' and socket id:' +socket.id);

    //Fetch all the details from MongoDB with User ID
    var user_data = await db.collection("People_Info").find({"Login_ID":userId}).toArray()
    socket.emit(userId , { type: 'data',"status": user_data})
    console.log('emiting user id');
    socket.emit(userId , { type: 'greetings', "status": true})
    console.log(user_data);

    //Set Custom Properties for socket through Redis pub/sub (persistence)
    socket.groups = [];
    socket.first_name = user_data[0]["First_Name"];
    socket.last_name = user_data[0]["Last_Name"];
    socket.Login_ID = user_data[0]["Login_ID"];
    socket.avatar = user_data[0]["avatar"];

    //Get his Assigned Groups
    var zAssigned_Group = user_data[0].zAssigned_Group.toString()
    zAssigned_Group_list = zAssigned_Group.split(';')
    zAssigned_Group_list.forEach(value => {
        if(value !='')
            socket.groups.push(user_data[0]["Client"] + "-"+ value);
    });





    socket.on('room-clients', ()=>{
        console.log('room_client event has been fired');
        myMap = {};
        userMapList = [];
        socket.groups.forEach((group)=>{
            if(socket.join(group)){
                io.of('/').adapter.clients([group],(err, clients) => {
                    socket.to(group).emit('room-join',  { number_of_users : clients.length ,users : clients , user_first_name : socket.first_name, user_last_name : socket.last_name, Login_ID : socket.Login_ID, group : group, avatar : socket.avatar});

                    console.log('-----------------------------------------------------------------------------------------')
                    console.log(socket.Login_ID + " has joined the group " + group)
                    console.log('clients  -: ' + clients)
                    other_user_names_in_room = [];
                    clients.forEach(value => {
                        //Don't Push my socket id inside
                        if(value!= socket.id)
                        {
                            userObj = {};
                            userObj['first_name'] = io.sockets.sockets[value].first_name ;
                            userObj['last_name'] = io.sockets.sockets[value].last_name;
                            userObj['Login_ID'] = io.sockets.sockets[value].Login_ID;
                            userObj['avatar'] = io.sockets.sockets[value].avatar;
                            userMapList.push(userObj);
                        }
                    });
                    console.log('Groups   -: ' + group);
                    console.log('UserName -: ' + other_user_names_in_room);

                    myMap[group] = userMapList;
                    console.log('Inside the forEach' + myMap);
                    socket.emit("success",{status : "True "+ group , group:group, users_already_in : myMap})
                  });
            }
            else
                return socket.emit("error","Sorry there is no room named "+  group)
            });
    });
    socket.on('newMsg', async function(data){
        console.log('new message received!');
        console.log(`message: ${data.chatMsg} ----- to:  ${data.to} ----- from : ${data.from}`);
        console.log(data.chatMsg);
        console.log(data.from);
        console.log(Date.now());
        var user_data = await db.collection('Chat_Logs').insertOne({"from": data.from , "msg":data.chatMsg , "to":data.to , 'time':Date.now()})
        socket.broadcast.emit(data.to , { type: 'incoming_message', msg: data.chatMsg ,from: data.from });
      });
    socket.on('fetchMessages',async function(data){
        console.log(socket.Login_ID + ' has disconnected');
        console.log(`to : ${data.to_user} ----- from :  ${data.from_user}`);
        var chatData = await db.collection("Chat_Logs").find({
           $or : [ { "from":data.from_user ,"to":data.to_user} , { "from":data.to_user,"to":data.from_user } ]
        }).sort( { "time": -1 } ).limit(5).toArray();
        console.log(chatData);
        console.log(data.from_user);
        socket.emit(data.from_user , { type: 'recentChats', chatData});
      });
    socket.on('disconnect', function(){
        console.log(socket.Login_ID + ' has disconnected');
        console.log(socket.groups);
        socket.groups.forEach(value =>{
            socket.to(value).emit('room-leave' , {Login_ID : socket.Login_ID })
        });
    });
    socket.on('newVoiceCall', async function(data){
        console.log('new voice call message received!');
        console.log(`to:  ${data.to} ----- from : ${data.from}`);
//        var user_data = await db.collection('Voice_Logs').insertOne({"from": data.from ,  "to":data.to , 'time':Date.now()})
        socket.broadcast.emit(data.to , { type: 'incoming_voice_call',from: data.from });
      });
    socket.on('newVideoCall', async function(data){
        console.log('new video call message received!');
        console.log(`to:  ${data.to} ----- from : ${data.from}`);
//        var user_data = await db.collection('Voice_Logs').insertOne({"from": data.from ,  "to":data.to , 'time':Date.now()})
        socket.broadcast.emit(data.to , { type: 'incoming_video_call',from: data.from });
      });
    socket.on('voiceCallAccept', async function(data){
        console.log('Voice Call Accepted!');
        console.log(`room:  ${data.room} ----- from : ${data.from}`);
        var user_data = await db.collection('Voice_Logs').insertOne({"from": data.from ,  "to":data.to , 'time':Date.now()})
        socket.broadcast.emit(data.from , { type: 'join_voice_room',from: data.from,room: data.room });
      })
    socket.on('videoCallAccept', async function(data){
        console.log('Voice Call Accepted!');
        console.log(`room:  ${data.room} ----- from : ${data.from}`);
        var user_data = await db.collection('Voice_Logs').insertOne({"from": data.from ,  "to":data.to , 'time':Date.now()})
        socket.broadcast.emit(data.from , { type: 'join_video_room',from: data.from,room: data.room });
      })
});

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
}

