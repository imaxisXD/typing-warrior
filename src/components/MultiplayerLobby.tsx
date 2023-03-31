import { useEffect, useState } from "react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/router";

interface CustomSocket extends Socket {
    join(roomName: string): void;
}
let sockets: any;

const MultiplayerLobby = () => {
    const router = useRouter()
    const [roomName, setRoomName] = useState("");
    const [socket, setSocket] = useState<CustomSocket | null>(null);
    const [connection, setConnection] = useState(false);


    const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(event.target.value);
    };

    useEffect(() => {
        socketConnection();
    }, []);

    async function socketConnection() {
        try {
            await fetch(`/api/socket`)
            sockets = io();
            sockets.on("connect", () => {
                console.log(sockets);
            });
            setSocket(sockets)
            setConnection(true);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleCreateRoom = async () => {
        if (connection) {
            try {
                console.log(`Creating room ${roomName}`);
                socket?.emit(`createRoom`, { room: roomName });
                socket?.on('createdSuccess', (args1, callback) => {
                    console.log(args1);
                    callback({
                        status: "ok"
                    });
                    router.push(`/typing-test/${roomName}`)

                });
                socket?.on('alreadyexist', (args) => {
                    console.log(args);
                    //TOAST MSG TO USE DIFF CODE
                });
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log(`Connection status - ${connection}`);
            console.log(`Problem with connection - Try reloading`);
        }
    };

    const handleJoinRoom = (roomName: string) => {

        if (connection) {
            socket?.on('roomJoin', (roomName) => {
                console.log(`Joining room ${roomName}`);
                socket.join(roomName);
            })
        }

    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
            <div className="text-4xl font-bold text-center text-fuchsia-600 mb-8">
                Multiplayer Lobby
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg mb-8">
                <div className="mb-4">
                    <label
                        htmlFor="roomNameInput"
                        className="block text-xl font-bold text-gray-700 mb-2"
                    >
                        Room name
                    </label>
                    <input
                        id="roomNameInput"
                        type="text"
                        className="border-gray-300 border-2 px-4 py-2 rounded-lg w-full text-xl font-medium shadow-lg"
                        value={roomName}
                        onChange={handleRoomNameChange}
                    />
                </div>
                <div className="flex flex-row justify-center">
                    <button
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded mr-4"
                        onClick={() => handleCreateRoom()}
                    >
                        Create Room
                    </button>
                    <button
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {

                            handleJoinRoom(roomName);
                        }}
                    >
                        Join Room
                    </button>
                </div>
            </div>
            <div className="text-lg font-bold text-center">
                <Link href="/" className="text-fuchsia-600 hover:underline">
                    Back to home
                </Link>
            </div>
        </div>
    );
};

export default MultiplayerLobby;
