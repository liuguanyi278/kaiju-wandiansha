import type { GameConfig } from '../types';

interface GameCardProps {
  game: GameConfig;
  onStart: () => void;
}

export default function GameCard({ game, onStart }: GameCardProps) {
  return (
    <button className="game-grid-card" type="button" onClick={onStart} aria-label={`开始${game.title}`}>
      <span className="game-grid-icon" aria-hidden="true">
        {game.icon}
      </span>
      <span className="game-grid-title">{game.title}</span>
    </button>
  );
}
