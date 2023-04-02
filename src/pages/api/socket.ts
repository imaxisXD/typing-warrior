import { NextApiRequest, NextApiResponse } from "next";
import { Server as IO } from "socket.io";


const handler = (req: NextApiRequest, res: NextApiResponse) => {
    let userProgress;
    if (res.socket.server.io) {
        console.log('Socket is already running');
        return res.end();
    }
    const io = new IO(res?.socket?.server);
    res.socket.server.io = io;
    io.on('connection', (socket) => {

        console.log(`User connected: ${socket.id}`);

        socket.on(`createRoom`, (args) => {
            const { rooms } = io.sockets.adapter;
            let room = rooms.get(args.room);
            if (room === undefined) {
                socket.join(args.room);
                socket.emit("createdSuccess", { Room: args.room, Message: 'Room Succesfully Created' }, (response: Response) => {
                    console.log(response.status);
                });
            }
            else {
                socket.emit("alreadyexist", {
                    Error: socket.rooms,
                })
            }
        });
        socket.on('roomJoin', async (args) => {
            const { rooms } = io.sockets.adapter;
            const room = rooms.has(args.room);
            if (room === false) {
                socket.emit('roomNotFound', {
                    Error: "This room doesnt exist, wrong room code"
                })
            }
            else {
                socket.join(args.room);
                // const numClients = room ? room.size : 0;
                // console.log(`Number of clients in room ${JSON.stringify(room)}: ${numClients}`);
                socket.emit("joinedSuccessfully", { Room: args.room, Message: 'Room Succesfully Joined' }, (response: Response) => {
                    console.log(response.status);
                })
            };
        });

        socket.on('currentuserProgress', (args) => {
            const { rooms } = io.sockets.adapter;
            const room = rooms.has(args.roomId);
            userProgress = args.lastCorrectIndex;
            if (room) {
                console.log(`User ${socket.id} sent progress update to room ${args.roomId}`);
                socket.to(args.roomId).emit('otherUsersProgress', { userProgress });
            }
            else {
                console.log('ERROOR in room - current user progress');
            }
        })
        res.end();
    })
}
export default handler