import type { GameConfig } from '../types';

export const games: GameConfig[] = [
  {
    id: 'truth-or-dare',
    title: '真心话大冒险',
    icon: '🎴',
    description: '两张牌，选真心话还是大冒险，翻开就开始。',
    tags: ['抽卡', '破冰', '朋友局'],
  },
  {
    id: 'punishment-wheel',
    title: '转盘惩罚',
    icon: '🎡',
    description: '转一下，随机抽一个轻松惩罚。',
    tags: ['随机', '搞笑', '轻惩罚'],
  },
  {
    id: 'chemistry-quiz',
    title: '默契问答',
    icon: '💬',
    description: '一个问题，大家轮流回答，看谁最有梗。',
    tags: ['问答', '互动', '熟人局'],
  },
];
