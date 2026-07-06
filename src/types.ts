export type Route = 'home' | 'lobby' | 'truth-or-dare' | 'punishment-wheel' | 'chemistry-quiz';

export type GameId = Exclude<Route, 'home' | 'lobby'>;

export interface GameConfig {
  id: GameId;
  title: string;
  icon: string;
  description: string;
  tags: string[];
}
