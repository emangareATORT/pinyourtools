export interface LinkItem {
  id: string;
  title: string;
  url: string;
  userId: string;
  order: number;
  color?: string; // Tailwind accent or background class
  category?: string;
}

export type ThemeType = 'dark' | 'sepia' | 'colorful' | 'newspaper';

export const PRESET_COLORS = [
  {
    name: 'Obsidiana Mística',
    class: 'bg-zinc-900/40 hover:bg-zinc-800/50 border-zinc-800/50 text-zinc-350 hover:text-zinc-100 hover:border-zinc-700/60',
    previewClass: 'bg-zinc-900/60 border-zinc-800/60',
    dotClass: 'bg-zinc-400'
  },
  {
    name: 'Rosa Pastel',
    class: 'bg-rose-400/[0.04] hover:bg-rose-400/[0.09] border-rose-300/15 text-rose-200 hover:text-rose-100 hover:border-rose-300/30',
    previewClass: 'bg-rose-400/10 border-rose-300/25',
    dotClass: 'bg-rose-300'
  },
  {
    name: 'Menta Pastel',
    class: 'bg-emerald-400/[0.04] hover:bg-emerald-400/[0.09] border-emerald-300/15 text-emerald-200 hover:text-emerald-100 hover:border-emerald-300/30',
    previewClass: 'bg-emerald-400/10 border-emerald-300/25',
    dotClass: 'bg-emerald-300'
  },
  {
    name: 'Celeste Pastel',
    class: 'bg-sky-400/[0.04] hover:bg-sky-400/[0.09] border-sky-300/15 text-sky-200 hover:text-sky-100 hover:border-sky-300/30',
    previewClass: 'bg-sky-400/10 border-sky-300/25',
    dotClass: 'bg-sky-300'
  },
  {
    name: 'Melocotón Pastel',
    class: 'bg-orange-400/[0.04] hover:bg-orange-400/[0.09] border-orange-300/15 text-orange-200 hover:text-orange-100 hover:border-orange-300/30',
    previewClass: 'bg-orange-400/10 border-orange-300/25',
    dotClass: 'bg-orange-300'
  },
  {
    name: 'Lila Pastel',
    class: 'bg-purple-400/[0.04] hover:bg-purple-400/[0.09] border-purple-300/15 text-purple-200 hover:text-purple-100 hover:border-purple-300/30',
    previewClass: 'bg-purple-400/10 border-purple-300/25',
    dotClass: 'bg-purple-300'
  },
  {
    name: 'Crema Pastel',
    class: 'bg-amber-400/[0.03] hover:bg-amber-400/[0.08] border-amber-300/15 text-amber-200 hover:text-amber-100 hover:border-amber-300/30',
    previewClass: 'bg-amber-400/10 border-amber-300/25',
    dotClass: 'bg-amber-300'
  },
  {
    name: 'Cian Pastel',
    class: 'bg-cyan-400/[0.04] hover:bg-cyan-400/[0.09] border-cyan-300/15 text-cyan-200 hover:text-cyan-100 hover:border-cyan-300/30',
    previewClass: 'bg-cyan-400/10 border-cyan-300/25',
    dotClass: 'bg-cyan-300'
  },
  {
    name: 'Teal Pastel',
    class: 'bg-teal-400/[0.04] hover:bg-teal-400/[0.09] border-teal-300/15 text-teal-200 hover:text-teal-100 hover:border-teal-300/30',
    previewClass: 'bg-teal-400/10 border-teal-300/25',
    dotClass: 'bg-teal-300'
  },
  {
    name: 'Fucsia Pastel',
    class: 'bg-fuchsia-400/[0.04] hover:bg-fuchsia-400/[0.09] border-fuchsia-300/15 text-fuchsia-200 hover:text-fuchsia-100 hover:border-fuchsia-300/30',
    previewClass: 'bg-fuchsia-400/10 border-fuchsia-300/25',
    dotClass: 'bg-fuchsia-300'
  },
  {
    name: 'Lavanda Pastel',
    class: 'bg-indigo-400/[0.04] hover:bg-indigo-400/[0.09] border-indigo-300/15 text-indigo-200 hover:text-indigo-100 hover:border-indigo-300/30',
    previewClass: 'bg-indigo-400/10 border-indigo-300/25',
    dotClass: 'bg-indigo-300'
  }
];
