// pages/api/passages/index.ts
import { NextApiHandler } from 'next';

interface Passage {
  id: number;
  text: string;
}

const passages: Passage[] = [
  {
    id: 1,
    text: "Hello World"
  },
  {
    id: 2,
    text: "She sells seashells by the seashore"
  },
  {
    id: 3,
    text: "Peter Piper picked a peck of pickled peppers"
  }
];

const handler: NextApiHandler = (req, res) => {
  const randomIndex = Math.floor(Math.random() * passages.length);
  const passage = passages[randomIndex];

  if (passage) {
    res.status(200).json(passage);
  } else {
    res.status(404).json({ message: `Passage not found` });
  }
};

export default handler;
