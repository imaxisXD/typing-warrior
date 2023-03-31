import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSocket } from "@/utils/socketContext";



const MultiplayerLobby = () => {
    const router = useRouter()
    const [roomName, setRoomName] = useState("");
    const socket = useSocket();

    const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(event.target.value);
    };
    const handleCreateRoom = async () => {
        if (socket?.connected && roomName) {
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
            console.log(`Connection status - ${socket?.connected}`);
            console.log(`if Connection status is true, then please enter the room`);
        }
    };

    const handleJoinRoom = (roomName: string) => {
        if (socket?.connected && roomName) {
            socket?.emit('roomJoin', { room: roomName });
            socket?.on('joinedSuccessfully', (args1, callback) => {
                console.log(args1);
                callback({
                    status: "ok"
                });
                router.push(`/typing-test/${roomName}`)

            });
            socket?.on('roomNotFound', (args) => {
                console.log(args);
                //TOAST MSG TO USE DIFF CODE
            });
        }
    }



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
                        required
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
                        onClick={() => handleJoinRoom(roomName)}
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
