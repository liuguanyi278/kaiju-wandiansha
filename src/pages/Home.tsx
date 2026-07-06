import { Sparkles } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const sceneTags = ['朋友聚会', '宿舍', '饭局', 'KTV', '破冰'];

export default function Home({ onStart }: HomeProps) {
  return (
    <section className="page home-page">
      <div className="home-hero">
        <div className="logo-mark" aria-hidden="true">
          <Sparkles size={28} />
        </div>
        <p className="eyebrow">聚会小游戏合集</p>
        <h1>开局玩点啥</h1>
        <p className="slogan">朋友聚会，不知道玩什么？打开就能玩。</p>
        <p className="body-copy">
          适合朋友聚会、宿舍、饭局、KTV 的轻量小游戏合集。不用下载，不用注册，点开就能开始。
        </p>
        <div className="tag-row center-tags">
          {sceneTags.map((tag) => (
            <span className="tag bright-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <button className="primary-button wide-button" type="button" onClick={onStart}>
        开始玩
      </button>
    </section>
  );
}
