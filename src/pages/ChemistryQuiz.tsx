import { useState } from 'react';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import { games } from '../data/games';
import { chemistryQuestions } from '../data/questions';
import { randomItem } from '../utils/random';

interface ChemistryQuizProps {
  onBack: () => void;
}

const gameInfo = games.find((game) => game.id === 'chemistry-quiz')!;

export default function ChemistryQuiz({ onBack }: ChemistryQuizProps) {
  const [question, setQuestion] = useState(() => randomItem(chemistryQuestions));

  return (
    <section className="page game-page">
      <BackButton onClick={onBack} />
      <header className="game-header">
        <p className="eyebrow">Question Time</p>
        <h1>{gameInfo.title}</h1>
        <div className="tag-row compact-tags">
          {gameInfo.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p>{gameInfo.description}</p>
        <p className="play-tip">大家轮流回答同一个问题，看谁最有默契。</p>
      </header>

      <Card className="question-card">
        <span>本题</span>
        <strong>{question}</strong>
      </Card>

      <button
        className="primary-button wide-button"
        type="button"
        onClick={() => setQuestion(randomItem(chemistryQuestions, question))}
      >
        下一题
      </button>
    </section>
  );
}
