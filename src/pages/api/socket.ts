import { NextApiRequest, NextApiResponse } from "next";
import { Server as IO } from "socket.io";

interface Room {
    room: string
}
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

        socket.on(`createRoom`, (args: Room) => {
            const roomID = args.room;
            const { rooms } = io.sockets.adapter;
            const room = rooms.get(args.room);
            console.log(`Active Rooms : ${rooms}`);
            const numClients = room ? room.size : 0;
            console.log(`Number of clients in room ${room}: ${numClients}`);

            if (room === undefined) {
                socket.join(args.room);
                socket.emit("createdSuccess", { Room: args.room, Message: 'Room Succesfully Created' }, (response: Response) => {
                    console.log(response.status);
                });

                socket.on('currentuserProgress', (args) => {
                    userProgress = args.lastCorrectIndex;
                    console.log(userProgress);

                    socket.to(args.room).emit('otherUsersProgress', { userProgress })
                })
            }
            else {
                socket.emit("alreadyexist", {
                    Error: "This room already exist please use a diffrent room code",
                })
            }
        });
        socket.on('roomJoin', (args: Room) => {
            const { rooms } = io.sockets.adapter;
            const room = rooms.get(args.room);
            if (room === undefined) {
                socket.emit('roomNotFound', {
                    Error: "This room doesnt exist, wrong room code"
                })
            }
            else {
                socket.join(args.room);
                const numClients = room ? room.size : 0;
                console.log(`Number of clients in room ${room}: ${numClients}`);
                socket.emit("joinedSuccessfully", { Room: args.room, Message: 'Room Succesfully Joined' }, (response: Response) => {
                    console.log(response.status);
                })
            };
        });
        res.end();
    })
}
export default handler