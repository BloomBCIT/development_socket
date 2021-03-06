const server = require("http").Server();
const port = process.env.PORT || 10000;

var io = require("socket.io")(server);

var usernames = [];
var msgs = [];
var allRooms ={};


io.on("connection", function(socket){
    
   console.log("user is connected"); 
    
    socket.on("username", function(data){
        console.log("user is giving username:"+data);
        usernames.push(data);
        
        io.emit("usersjoined", usernames);
        
    })
    
    socket.on("joinroom", function(data){
        socket.emit("yourid", socket.id);
        socket.join(data);
        //io.emit("createimage", allusers);
        socket.myRoom =data;
        
        if(!allRooms[data]){
            allRooms[data] = [];
        }
        
        
        allRooms[data].push(socket.id);
        io.to(data).emit("createimage", allRooms[data]);
    
           console.log(data);
        
    });
        
    socket.on("sendChat", function(data){
        console.log("user sent a msg for chat");
        msgs.push(data);
        
        io.emit("msgsent", msgs);
    });
    
    
    socket.on("disconnect", function(){
        var index = allRooms[this.myRoom].indexOf(socket.id);
        allRooms[this.myRoom].splice(index, 1);
        io.to(this.myRoom).emit("createimage", allRooms[this.myRoom]);
        console.log("user has disconnected");
    })
    
});

server.listen(port, (err)=>{
    if(err){
        console.log("Error:" +err);
        return false;
        
    }
    console.log("socket port is running");
});





