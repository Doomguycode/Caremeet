var  Socket = function(host , userid) {
    //This is a socket Object
    var connection = undefined;

    this.connect = function() {
        this.connection = io.connect(host, { query :  `userid=${userid}`} )
        this.connection.on(userid , this.onMessage)
    }

    this.getSocketConnection = function() {
        return this.connection
    }

    this.addListener =  function(channelName , callback) {
        this.connection.on(channelName , callback)
    }

    this.sendMessage = function(channelName , message) {
        this.connection.emit(channelName , message)
    }

    this.getAllUsers = function() {
    }
}
//
//Socket.prototype.connect = function(host , userid)  {
//    Socket.host = host;
//    Socket.connection = io.connect(host, { query :  `userid=${userid}`} )
//    this.connection.on(userid , this.onMessage)
//}
//
//Socket.prototype.getSocketConnection = function() {
//    return Socket.connection
//}
//
//Socket.prototype.addListener = function(channelName , callback) {
//    this.connection.on(channelName , callback)
//}
//
//Socket.prototype.sendMessage = function(channelName , message) {
//    this.connection.emit(channelName , message)
//}
