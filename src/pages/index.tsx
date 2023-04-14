import TypingTestButton from '@/components/TypingTestButton'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';



export default function Home() {

  const STATE_MACHINE_NAME = 'State Machine 1';
  const ON_HOVER_INPUT_NAME = 'hover';

  const {
    rive,
    RiveComponent: RiveComponentTouch
  } = useRive({
    src: 'viking.riv',
    stateMachines: STATE_MACHINE_NAME,
    artboard: 'New Artboard',
    autoplay: true
  });

  const onHoverInput = useStateMachineInput(rive, STATE_MACHINE_NAME, ON_HOVER_INPUT_NAME);

  function onMouseEnter() {
    if (onHoverInput)
      onHoverInput.value = true;
  }

  function onMouseLeave() {
    if (onHoverInput)
      onHoverInput.value = false;
  }
  return (

    <div className='h-screen w-scree bg-black'>

      <RiveComponentTouch onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ width: '15rem', height: '30rem', border: "1px solid black" }} />

      <h1 className='text-white	'>Welcome to my keyboard typing app!</h1>
      <TypingTestButton />
    </div>


  )
}
