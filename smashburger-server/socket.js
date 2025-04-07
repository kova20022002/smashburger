let io;

module.exports ={ 
    init: httpServer => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: "http://localhost:5173", // Frontend URL
                methods: ["GET", "POST"],
                allowedHeaders: ["Content-Type"],
                credentials: true
            }
        });
        return io;
    },
    getIO: () => {
        if(!io){
            throw new Error('Socket.io error')
        }
        return io;
    }
}