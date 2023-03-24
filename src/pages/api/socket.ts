import { NextApiRequest, NextApiResponse } from "next";
import { Server as IO } from "socket.io";




const handler = (req: NextApiRequest, res: NextApiResponse) => {
    var id;
    if (res.socket.server.io) {
        console.log('Socket is already attached');
        console.log(id);

        return res.end();
    }

    const io = new IO(res?.socket?.server);
    res.socket.server.io = io;
    io.on('connection', (socket) => {
        var id = socket.id;
        console.log(`User connected: ${socket.id}`);


    });

    res.end();

}




export default handler