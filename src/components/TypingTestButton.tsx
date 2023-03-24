import Link from 'next/link';

function TypingTestButton() {
    return (<>
        <Link href="/typing-test">
            Take the typing test
        </Link>
        <Link href="/multiplayer-lobby">
            Multiplayer
        </Link>
    </>
    );
}

export default TypingTestButton;
