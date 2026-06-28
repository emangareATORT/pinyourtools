import { LinkItem } from './types';

export const DEFAULT_LINKS: LinkItem[] = [
  {
    id: 'default-google',
    title: 'Google',
    url: 'https://www.google.com',
    userId: 'default',
    order: 0,
    color: 'bg-zinc-900/40 hover:bg-zinc-800/50 border-zinc-800/50 text-zinc-350 hover:text-zinc-100 hover:border-zinc-700/60',
  },
  {
    id: 'default-youtube',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    userId: 'default',
    order: 1,
    color: 'bg-rose-400/[0.04] hover:bg-rose-400/[0.09] border-rose-300/15 text-rose-200 hover:text-rose-100 hover:border-rose-300/30',
  },
  {
    id: 'default-github',
    title: 'GitHub',
    url: 'https://www.github.com',
    userId: 'default',
    order: 2,
    color: 'bg-zinc-900/40 hover:bg-zinc-800/50 border-zinc-800/50 text-zinc-350 hover:text-zinc-100 hover:border-zinc-700/60',
  },
  {
    id: 'default-wikipedia',
    title: 'Wikipedia',
    url: 'https://www.wikipedia.org',
    userId: 'default',
    order: 3,
    color: 'bg-sky-400/[0.04] hover:bg-sky-400/[0.09] border-sky-300/15 text-sky-200 hover:text-sky-100 hover:border-sky-300/30',
  },
  {
    id: 'default-gmail',
    title: 'Gmail',
    url: 'https://mail.google.com',
    userId: 'default',
    order: 4,
    color: 'bg-rose-400/[0.04] hover:bg-rose-400/[0.09] border-rose-300/15 text-rose-200 hover:text-rose-100 hover:border-rose-300/30',
  },
  {
    id: 'default-translate',
    title: 'Translate',
    url: 'https://translate.google.com',
    userId: 'default',
    order: 5,
    color: 'bg-sky-400/[0.04] hover:bg-sky-400/[0.09] border-sky-300/15 text-sky-200 hover:text-sky-100 hover:border-sky-300/30',
  },
];
