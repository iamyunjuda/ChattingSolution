const express = require('express');
const socket = require('socket.io');
const http = require('http');
const fs = require('fs');
const app =express();

const server = http.createServer(app);
const io = socket(server);
app.use('/css',express.static('./static/css'));
app.use('/js', express.static('./static/js'));

app.get('/',function(request, response){
    fs.readFile('./static/js/index.html',(err,data)=>{
        if(err) throw err;
        
        response.writeHead(200,{
            'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
    
    });
   
});
io.sockets.on('connection',function(socket){
    socket.on('newUser',function(name){
        console.log(name+'유저 접속 됨');
        socket.name= name;
        io.sockets.emit('update', {

            type:'connect',
            name:'SERVER',
            message: name +'님이 접속하였습니다.'
        });
    });
  

    socket.on('message',function(data){
        data.name = socket.name;
        console.log('전달된 메시지:', data);
        socket.broadcast.emit('update',data);

    });
    socket.on('disconnect',function(){
        console.log(socket.name+"접속 종료");
        socket.broadcast.emit('updatae',{
            type: 'disconnect',
            name: 'SERVER',
            message: socket.name + '님이 나가셨습니다.'

        });
    });

});







server.listen(8080,function(){
   console.log("서버 실행 중");
})