import { useMemo, useState } from 'react';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import { games } from '../data/games';
import { punishmentItems } from '../data/questions';
import { randomItem } from '../utils/random';

interface PunishmentWheelProps {
  onBack: () => void;
}

const gameInfo = games.find((game) => game.id === 'punishment-wheel')!;

export default function PunishmentWheel({ onBack }: PunishmentWheelProps) {
  const [result, setResult] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const wheelBackground = useMemo(() => {
    const colors = ['#ff7a45', '#ffd166', '#2ec4b6', '#f56c9c', '#7c6cff'];
    const slice = 360 / punishmentItems.length;
    return `conic-gradient(${punishmentItems
      .map((_, index) => `${colors[index % colors.length]} ${index * slice}deg ${(index + 1) * slice}deg`)
      .join(', ')})`;
  }, []);

  const spin = () => {
    if (isSpinning) return;

    const nextResult = randomItem(punishmentItems, result);
    const nextIndex = punishmentItems.indexOf(nextResult);
    const slice = 360 / punishmentItems.length;
    const targetAngle = 360 - (nextIndex * slice + slice / 2);
    const fullTurns = 4 + Math.floor(Math.random() * 3);
    const nextRotation = rotation + fullTurns * 360 + targetAngle;

    setResult('');
    setIsSpinning(true);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setResult(nextResult);
      setIsSpinning(false);
    }, 1800);
  };

  return (
    <section className="page game-page">
      <BackButton onClick={onBack} />
      <header className="game-header">
        <p className="eyebrow">Lucky Wheel</p>
        <h1>{gameInfo.title}</h1>
        <div className="tag-row compact-tags">
          {gameInfo.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p>{gameInfo.description}</p>
        <p className="play-tip">点击转盘，随机抽一个轻松惩罚。</p>
      </header>

      <div className="wheel-wrap" aria-label="转盘区域">
        <div className="wheel-pointer" aria-hidden="true" />
        <div
          className="wheel"
          style={{
            background: wheelBackground,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="wheel-center">开局</div>
        </div>
      </div>

      <button className="primary-button wide-button" type="button" disabled={isSpinning} onClick={spin}>
        {isSpinning ? '转动中...' : result ? '再来一次' : '开始转盘'}
      </button>

      <Card className="result-card">
        <p className="result-label">抽中结果</p>
        <strong>{result || (isSpinning ? '正在揭晓...' : '点击按钮开始抽取')}</strong>
      </Card>
    </section>
  );
}
