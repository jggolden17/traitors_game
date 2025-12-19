import { useState } from 'react'
import { useGameStore } from '../state/gameStore'

const Home = () => {
  const { setStage } = useGameStore()
  const [showButton, setShowButton] = useState(false)

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-1 w-full items-center justify-center">
        <img
          src="/traitors_logo.webp"
          alt="Traitors logo"
          className="h-52 w-52 max-w-[320px] animate-logo-bounce drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
          onAnimationEnd={() => setShowButton(true)}
        />
      </div>

      <button
        type="button"
        onClick={() => setStage('playerEntry')}
        className={`mb-4 mt-auto w-full rounded-full bg-accent px-6 py-4 text-lg font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition-all duration-500 active:translate-y-[1px] ${
          showButton ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        aria-label="Start a new game"
      >
        Start new game
      </button>
    </div>
  )
}

export default Home
