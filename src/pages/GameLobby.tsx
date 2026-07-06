import { Home } from 'lucide-react';
import GameCard from '../components/GameCard';
import { games } from '../data/games';
import type { Route } from '../types';

interface GameLobbyProps {
  onNavigate: (route: Route) => void;
}

export default function GameLobby({ onNavigate }: GameLobbyProps) {
  return (
    <section className="page lobby-page">
      <header className="page-header">
        <button className="ghost-button icon-text-button" type="button" onClick={() => onNavigate('home')}>
          <Home size={18} aria-hidden="true" />
          <span>返回首页</span>
        </button>
        <div>
          <p className="eyebrow">Game Lobby</p>
          <h1>今晚玩哪个？</h1>
          <p>选一个小游戏，马上开局。</p>
        </div>
      </header>
      <div className="game-list">
        {games.map((game) => (
          <GameCard game={game} key={game.id} onStart={() => onNavigate(game.id)} />
        ))}
      </div>
    </section>
  );
}
