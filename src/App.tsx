import { useState } from 'react';
import type { Route } from './types';
import Home from './pages/Home';
import GameLobby from './pages/GameLobby';
import TruthOrDare from './pages/TruthOrDare';
import PunishmentWheel from './pages/PunishmentWheel';
import ChemistryQuiz from './pages/ChemistryQuiz';
import LiarDice from './pages/LiarDice';

export default function App() {
  const [route, setRoute] = useState<Route>('home');

  return (
    <main className="app-shell">
      {route === 'home' && <Home onStart={() => setRoute('lobby')} />}
      {route === 'lobby' && <GameLobby onNavigate={setRoute} />}
      {route === 'truth-or-dare' && <TruthOrDare onBack={() => setRoute('lobby')} />}
      {route === 'punishment-wheel' && <PunishmentWheel onBack={() => setRoute('lobby')} />}
      {route === 'chemistry-quiz' && <ChemistryQuiz onBack={() => setRoute('lobby')} />}
      {route === 'liar-dice' && <LiarDice onBack={() => setRoute('lobby')} />}
    </main>
  );
}
