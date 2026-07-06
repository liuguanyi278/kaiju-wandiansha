import { useState } from 'react';
import BackButton from '../components/BackButton';
import { games } from '../data/games';
import { dareTasks, truthQuestions } from '../data/questions';
import { randomItem } from '../utils/random';

type Choice = 'truth' | 'dare';

const copy = {
  truth: {
    title: '真心话',
    button: '换一题',
    items: truthQuestions,
  },
  dare: {
    title: '大冒险',
    button: '换一个',
    items: dareTasks,
  },
};

const gameInfo = games.find((game) => game.id === 'truth-or-dare')!;

interface TruthOrDareProps {
  onBack: () => void;
}

export default function TruthOrDare({ onBack }: TruthOrDareProps) {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [content, setContent] = useState('');

  const pickCard = (nextChoice: Choice) => {
    setChoice(nextChoice);
    setContent(randomItem(copy[nextChoice].items, content));
  };

  const refresh = () => {
    if (!choice) return;
    setContent(randomItem(copy[choice].items, content));
  };

  const reset = () => {
    setChoice(null);
    setContent('');
  };

  return (
    <section className="page game-page">
      <BackButton onClick={onBack} />
      <header className="game-header">
        <p className="eyebrow">Card Game</p>
        <h1>{gameInfo.title}</h1>
        <div className="tag-row compact-tags">
          {gameInfo.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p>{gameInfo.description}</p>
        <p className="play-tip">选一张牌，翻开看看你的任务。</p>
      </header>

      <div className={`choice-stage ${choice ? 'has-choice' : ''}`}>
        {(['truth', 'dare'] as Choice[]).map((cardChoice) => {
          const selected = choice === cardChoice;
          const muted = Boolean(choice && !selected);
          return (
            <button
              className={`flip-card ${selected ? 'selected flipped' : ''} ${muted ? 'muted' : ''}`}
              disabled={Boolean(choice)}
              key={cardChoice}
              type="button"
              onClick={() => pickCard(cardChoice)}
            >
              <span className="flip-card-inner">
                <span className="flip-card-face flip-card-front">
                  <span>{copy[cardChoice].title}</span>
                </span>
                <span className="flip-card-face flip-card-back">
                  <strong>{copy[cardChoice].title}</strong>
                  <span>{selected ? content : '准备翻牌'}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {choice && (
        <div className="action-row">
          <button className="primary-button" type="button" onClick={refresh}>
            {copy[choice].button}
          </button>
          <button className="secondary-button" type="button" onClick={reset}>
            返回选择
          </button>
        </div>
      )}
    </section>
  );
}
