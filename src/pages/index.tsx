
import { Inter } from 'next/font/google'
import TypingTestButton from '@/components/TypingTestButton'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <h1>Welcome to my keyboard typing app!</h1>
      <TypingTestButton />
    </>
  )
}
