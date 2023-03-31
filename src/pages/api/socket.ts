import { NextApiRequest, NextApiResponse } from "next";
import { Server as IO } from "socket.io";

interface Room {
    room: string
}
const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (res.socket.server.io) {
        console.log('Socket is already running');
        return res.end();
    }
    const io = new IO(res?.socket?.server);
    res.socket.server.io = io;
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on(`createRoom`, (args: Room) => {
            const { rooms } = io.sockets.adapter;
            console.log(`Active Rooms : ${rooms}`);
            const room = rooms.get(args.room);
            if (room === undefined) {
                socket.join(args.room);
                socket.emit("createdSuccess", { Room: args.room, Message: 'Room Succesfully Created' }, (response: Response) => {
                    console.log(response.status);
                });
            }
            else {
                socket.emit("alreadyexist", {
                    Error: "This room already exist please use a diffrent room code",
                })
            }
        });

    });

    res.end();

}
export default handler