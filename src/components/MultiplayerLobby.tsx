import { useEffect, useState } from "react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";

interface CustomSocket extends Socket {
    join(roomName: string): void;
}

var socket;
const MultiplayerLobby = () => {
    const [roomName, setRoomName] = useState("");
    // const [socket, setSocket] = useState<CustomSocket | null>(null);

    const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(event.target.value);
    };
    useEffect(() => {
        socketInitializer();
    }, []);

    const socketInitializer = async () => {
        // We just call it because we don't need anything else out of it
        await fetch("/api/socket");

        socket = io();


    };
    const handleCreateRoom = () => {

        if (socket) {
            console.log(`Creating room ${roomName}`);
            socket.emit(`create-room`, { name: roomName })
        }
        else {
            console.log(`Problem with connection`);

        }
    };

    const handleJoinRoom = (roomName: string) => {

        if (socket) {
            socket.on('room-join', (roomName) => {
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
                        onClick={handleCreateRoom}
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
