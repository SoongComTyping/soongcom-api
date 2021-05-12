const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = new SocketIO(server, { path: '/socket.io'});
    app.set('io', io);

    //of키워드는 소켓에 namespace를 부여하는 기능을 한다.
    const room = io.of('/room');
    const char = io.of('/chat');
    
    //각각 namespace별로 이벤트 리스너를 달아줄 수 있다.
    room.on('connect', (socket) =>{
        console.log('room SOCKET CONNECT');
        
        //대결방 접속 해제 시
        socket.on('disconnect', () => {
            console.log('room 접속 해제');
        });
    });

    chat.on('connect', (socket) =>{
        console.log('char SOCKET CONNECT');
        const req = socket.request;
        const { headers : {referer}} = req;
        //현재 url에서 방 아이디를 분리
        const roomId =  referer.split('/')[referer.split('/').length -1].replace(/\?.+/, '');
        //방에 접속하는 메서드
        //분리한 방 아이디로 같은 방끼리만 정보를 주고 받음
        socket.join(roomId);
        //연결이 끊겼을 떄 이벤트 리스너
        socket.on('disconnect', ()=>{
            console.log('Chat 접속 해제');
            socket.leave(roomId);
        })
    })

    //연결 시도 시 호출되는 이벤트 리스너
    //외부적으로 접속할 땐 io 객체 사용
    io.on('connection', (socket) =>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log("NEW CLIENT CONNECT", ip, socket.id, req.ip);
        //내부적 이벤트 리스너는 socket 객체를 사용하여 이벤트를 담당한다. 
        //reply 이벤트 리스너
        //이벤트 이름을 따로 지정할 수 있다.
        socket.on('reply', (data) => {
            console.log(data);
        });
        //error 이벤트 리스너
        socket.on('error', (error) => {
            console.error(error);
        });
        //close 이벤트 리스너
        socket.on('disconnect', () =>{
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });

        //3초마다 클라이언트로 메세지 전송
        socket.interval = setInterval(() => {
            //emit 매서드는 news라는 이벤트 이름으로 2번째 파라미터에 담긴 메세지를 전송한다.
            socket.emit('news', '서버에서 클라이언트로 메세지 전송!');
        }, 3000);
    });
};