import { useSocket } from '@/utils/socketContext';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';


function TypingTest() {
    const [inputText, setInputText] = useState("");
    const [words, setWords] = useState<string[]>([""]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [lastCorrectIndex, setLastCorrectIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const path = router.pathname
    let socket = useSocket();


    // fetch the passage from the API using useEffect
    useEffect(() => {
        async function fetchPassage() {
            const response = await fetch('/api/passages');
            const data = await response.json();
            setWords(data.text.toLowerCase().split(' '));
        }
        fetchPassage();
    }, []);
    async function opponentsProgress() {
        if (socket?.connected && path) {
            try {
                await socket.on(`otherUsersProgress`, (data) => {
                    console.log(data);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    useEffect(() => {
        opponentsProgress();
    }
        , []);

    function handleTyping(event: React.FormEvent<HTMLInputElement>) {
        if (currentIndex === 0) {
            setStartTime(Date.now());
        }
        const currentWord = words[currentIndex].toLowerCase();
        setInputText(event.currentTarget.value.toLowerCase());

        let lastCorrectIndex = -1;
        for (let i = 0; i < inputText.length; i++) {
            if (inputText[i] === currentWord[i]) {
                lastCorrectIndex = i;
            } else {
                break;
            }
        }
        setLastCorrectIndex(lastCorrectIndex);

        if (inputText.trim() === currentWord.trim()) {
            setCurrentIndex(currentIndex + 1);
            (event.target as HTMLInputElement).value = '';
            setLastCorrectIndex(-1);
            if (currentIndex === words.length - 1) {
                setEndTime(Date.now());
            }
        }
        if (
            event.nativeEvent instanceof KeyboardEvent &&
            (event.nativeEvent.key === 'Backspace' ||
                event.nativeEvent.key === 'Delete')
        ) {
            if (inputText.length <= lastCorrectIndex + 1) {
                event.preventDefault();
            }
        }
        if (socket?.connected) {

            socket?.emit(`currentuserProgress`, { lastCorrectIndex });
        }

    }


    function renderWords() {
        return words.map((word, index) => {
            const isCurrentWord = index === currentIndex;
            const isCompletedWord = index < currentIndex;

            return (
                <span key={index}>
                    {word.split("").map((char, charIndex) => {

                        let colorClass = "";
                        if (isCurrentWord) {
                            colorClass = "underline text-blue-500";
                            if (charIndex < inputText.length) {
                                if (char === inputText[charIndex]) {
                                    colorClass = "text-green-500";
                                } else {
                                    colorClass = "text-red-500";
                                }
                            }
                        } else if (isCompletedWord) {
                            if (charIndex < word.length) {
                                if (char === word[charIndex]) {
                                    colorClass = "text-green-500";
                                }
                            }
                        }

                        return (
                            <span key={charIndex} className={colorClass}>
                                {char}
                            </span>
                        );
                    })}
                    <span>&nbsp;</span>
                </span>
            );
        });
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            setInputText(event.currentTarget.value);
            if (inputText.length <= lastCorrectIndex + 1) {
                event.preventDefault();
            }
        }
    }

    useEffect(() => {
        if (startTime !== 0 && endTime !== 0) {
            const totalTime = endTime - startTime;
            const minutes = totalTime / 60000;
            const wpm = Math.floor(words.length / minutes);
            setWpm(wpm);
            inputRef.current!.disabled = true;
        }
    }, [endTime, inputRef, words.length, startTime]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-200">
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-xl font-bold text-center text-fuchsia-600">{renderWords()}</div>
            <input
                type="text"
                className="border-gray-300 border-2 px-4 py-2 rounded-lg w-full text-xl font-medium shadow-lg"
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
                ref={inputRef}
            />

            {endTime !== 0 && (
                <div className="fixed top-0 left-0 h-screen w-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <div className="text-3xl font-bold mb-4">Your WPM: {wpm}</div>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                            onClick={() => {
                                setInputText("");
                                setCurrentIndex(0);
                                setStartTime(0);
                                setEndTime(0);
                                setWpm(0);
                                setLastCorrectIndex(-1);
                                inputRef.current!.disabled = false;
                            }}
                        >
                            You can do better !
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TypingTest;
