import { useEffect, useMemo, useRef, useState } from 'react';
import type { TouchEvent } from 'react';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import { games } from '../data/games';

interface LiarDiceProps {
  onBack: () => void;
}

interface DiceResult {
  slotId: number;
  value: number;
}

interface DiceSlot {
  slotId: number;
  left: string;
  top: string;
  rotate: number;
  zIndex: number;
}

const gameInfo = games.find((game) => game.id === 'liar-dice')!;

const diceSlots: DiceSlot[] = [
  { slotId: 1, left: '17%', top: '25%', rotate: -14, zIndex: 2 },
  { slotId: 2, left: '39%', top: '18%', rotate: 9, zIndex: 3 },
  { slotId: 3, left: '58%', top: '27%', rotate: -4, zIndex: 2 },
  { slotId: 4, left: '25%', top: '52%', rotate: 12, zIndex: 4 },
  { slotId: 5, left: '49%', top: '49%', rotate: -10, zIndex: 5 },
  { slotId: 6, left: '66%', top: '51%', rotate: 15, zIndex: 4 },
];

const defaultRulesText = `每个人打开自己的手机，手机就是自己的骰盅。
点击“摇”生成本轮骰子，未锁定前可以重复摇骰。
上滑开盖查看自己的骰子，下滑关盖防止别人偷看。
确认本轮结果后，可以点击“锁骰盅”，锁定后无法继续摇骰，避免误触。
玩家线下轮流叫骰，例如“3 个 4”“5 个 6”。
如果觉得上一位在吹牛，可以喊“开”。
所有人开盖展示骰子并人工统计。
如果实际数量达到或超过上一位叫的数量，则开的人输；否则上一位输。
是否 1 点万能、顺子是否重摇，由玩家自行约定。
本工具只作为个人电子骰盅，不自动判断输赢。`;

const storageKeys = {
  diceCount: 'liarDice:diceCount',
  soundEnabled: 'liarDice:soundEnabled',
  rulesText: 'liarDice:rulesText',
};

function readStoredDiceCount() {
  const stored = Number(window.localStorage.getItem(storageKeys.diceCount));
  return Number.isInteger(stored) && stored >= 1 && stored <= 6 ? stored : 5;
}

function readStoredSoundEnabled() {
  const stored = window.localStorage.getItem(storageKeys.soundEnabled);
  return stored === null ? true : stored === 'true';
}

function readStoredRulesText() {
  return window.localStorage.getItem(storageKeys.rulesText) || defaultRulesText;
}

function shuffleSlots() {
  return [...diceSlots].sort(() => Math.random() - 0.5);
}

function createDiceResults(diceCount: number): DiceResult[] {
  const selectedSlots = diceCount === 6 ? diceSlots : shuffleSlots().slice(0, diceCount);

  return selectedSlots
    .map((slot) => ({
      slotId: slot.slotId,
      value: Math.floor(Math.random() * 6) + 1,
    }))
    .sort((a, b) => a.slotId - b.slotId);
}

function DiceImage({ result }: { result: DiceResult }) {
  const [failed, setFailed] = useState(false);
  const imagePath = `/images/liar-dice/dice/slot-${result.slotId}-${result.value}.png`;

  useEffect(() => {
    setFailed(false);
  }, [imagePath]);

  if (failed) {
    return <span className="liar-dice-fallback-die">{result.value}</span>;
  }

  return (
    <img
      alt={`${result.value} 点骰子`}
      draggable={false}
      src={imagePath}
      onError={() => setFailed(true)}
    />
  );
}

export default function LiarDice({ onBack }: LiarDiceProps) {
  const [diceCount, setDiceCount] = useState(readStoredDiceCount);
  const [soundEnabled, setSoundEnabled] = useState(readStoredSoundEnabled);
  const [rulesText, setRulesText] = useState(readStoredRulesText);
  const [diceResults, setDiceResults] = useState<DiceResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cupFailed, setCupFailed] = useState(false);
  const [plateFailed, setPlateFailed] = useState(false);
  const [countChanged, setCountChanged] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const slotMap = useMemo(() => new Map(diceSlots.map((slot) => [slot.slotId, slot])), []);
  const hasRolled = diceResults.length > 0;

  const statusText = (() => {
    if (countChanged) return '骰子个数已更新，请重新摇骰。';
    if (isLocked) return '骰盅已锁定，无法继续摇骰。';
    if (!hasRolled) return '点击摇骰，生成你的本轮骰子。';
    if (isOpen) return '下滑可关盖，防止别人偷看。';
    return '已摇好，上滑开盖查看。';
  })();

  const playShakeSound = () => {
    if (!soundEnabled) return;

    const audio = new Audio('/sounds/dice-shake.mp3');
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Missing audio files or blocked playback should not interrupt the dice roll.
    });
  };

  const rollDice = () => {
    if (isLocked || isShaking) return;

    playShakeSound();
    setCountChanged(false);
    setIsOpen(false);
    setIsShaking(true);
    setDiceResults(createDiceResults(diceCount));

    window.setTimeout(() => {
      setIsShaking(false);
    }, 760);
  };

  const updateDiceCount = (nextCount: number) => {
    setDiceCount(nextCount);
    window.localStorage.setItem(storageKeys.diceCount, String(nextCount));
    setDiceResults([]);
    setIsOpen(false);
    setIsLocked(false);
    setCountChanged(true);
  };

  const updateSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled);
    window.localStorage.setItem(storageKeys.soundEnabled, String(enabled));
  };

  const updateRulesText = (text: string) => {
    setRulesText(text);
    window.localStorage.setItem(storageKeys.rulesText, text);
  };

  const restoreDefaultRules = () => {
    updateRulesText(defaultRulesText);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return;

    const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
    const deltaY = endY - touchStartY.current;
    touchStartY.current = null;

    if (deltaY < -24) {
      setIsOpen(true);
      return;
    }

    if (deltaY > 24) {
      setIsOpen(false);
    }
  };

  return (
    <section className="page game-page liar-dice-page">
      <BackButton onClick={onBack} />
      <header className="game-header">
        <p className="eyebrow">Personal Dice Cup</p>
        <h1>{gameInfo.title}</h1>
        <div className="tag-row compact-tags">
          {gameInfo.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p>{gameInfo.description}</p>
      </header>

      <div
        className={`liar-dice-stage ${isOpen ? 'is-open' : ''} ${isShaking ? 'is-shaking' : ''}`}
        aria-label="大话骰骰盅区域"
      >
        <div className="liar-dice-plate-layer">
          {plateFailed ? (
            <span className="liar-dice-fallback-plate">底盘素材缺失</span>
          ) : (
            <img alt="" draggable={false} src="/images/liar-dice/plate.png" onError={() => setPlateFailed(true)} />
          )}
        </div>

        <div className="liar-dice-list" aria-hidden={!isOpen}>
          {isOpen &&
            diceResults.map((result) => {
              const slot = slotMap.get(result.slotId)!;
              return (
                <div
                  className="liar-dice-item"
                  key={result.slotId}
                  style={{
                    left: slot.left,
                    top: slot.top,
                    transform: `rotate(${slot.rotate}deg)`,
                    zIndex: slot.zIndex,
                  }}
                >
                  <DiceImage result={result} />
                </div>
              );
            })}
        </div>

        <div
          className="liar-dice-cup-layer"
          role="button"
          tabIndex={0}
          aria-label={isOpen ? '点击关盖' : '点击开盖'}
          onClick={() => setIsOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setIsOpen((current) => !current);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {cupFailed ? (
            <span className="liar-dice-fallback-cup">骰盅素材缺失</span>
          ) : (
            <img alt="" draggable={false} src="/images/liar-dice/cup.png" onError={() => setCupFailed(true)} />
          )}
        </div>
      </div>

      <Card className="liar-dice-status">
        <span>当前状态</span>
        <strong>{statusText}</strong>
      </Card>

      <div className="liar-dice-actions">
        <button className="secondary-button" type="button" onClick={() => setIsLocked((current) => !current)}>
          {isLocked ? '解锁' : '锁骰盅'}
        </button>
        <button className="primary-button" type="button" disabled={isLocked || isShaking} onClick={rollDice}>
          {isShaking ? '摇动中...' : '摇'}
        </button>
        <button className="secondary-button" type="button" onClick={() => setIsSettingsOpen(true)}>
          设置
        </button>
      </div>

      {isSettingsOpen && (
        <div className="liar-dice-modal" role="dialog" aria-modal="true" aria-label="大话骰设置">
          <div className="liar-dice-modal-panel">
            <div className="liar-dice-modal-header">
              <h2>设置</h2>
              <button className="ghost-button" type="button" onClick={() => setIsSettingsOpen(false)}>
                完成
              </button>
            </div>

            <label className="liar-dice-field">
              <span>骰子个数</span>
              <select value={diceCount} onChange={(event) => updateDiceCount(Number(event.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((count) => (
                  <option value={count} key={count}>
                    {count} 个
                  </option>
                ))}
              </select>
            </label>

            <label className="liar-dice-switch">
              <span>摇骰音效</span>
              <input
                checked={soundEnabled}
                type="checkbox"
                onChange={(event) => updateSoundEnabled(event.target.checked)}
              />
            </label>

            <label className="liar-dice-field">
              <span>玩法介绍</span>
              <textarea value={rulesText} rows={9} onChange={(event) => updateRulesText(event.target.value)} />
            </label>

            <button className="secondary-button wide-button" type="button" onClick={restoreDefaultRules}>
              恢复默认规则
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
