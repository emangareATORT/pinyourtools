import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { LinkItem, ThemeType } from '../types';
import { getDomain } from '../utils/grid';

interface LinkCardProps {
  link: LinkItem;
  isEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isSoberMode: boolean;
  theme: ThemeType;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  isEditMode,
  onEdit,
  onDelete,
  onMoveLeft,
  onMoveRight,
  onMoveUp,
  onMoveDown,
  canMoveLeft = false,
  canMoveRight = false,
  canMoveUp = false,
  canMoveDown = false,
  isSoberMode,
  theme,
}) => {
  const domain = getDomain(link.url);
  const monogram = link.title ? link.title.charAt(0).toUpperCase() : '?';
  
  // High quality favicon service
  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

  // Clean URL to display (without http/https)
  const displayUrl = link.url
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .split('/')[0];

  // Secure URL with protocol
  const secureUrl = link.url.match(/^[a-zA-Z]+:\/\//) ? link.url : `https://${link.url}`;

  // Card theme-specific layout classes
  const getCardThemeClasses = () => {
    if (isSoberMode) {
      switch (theme) {
        case 'sepia':
          return 'bg-[#ebdcb9]/40 border-[#dfd0b0] text-[#5c4a37] hover:text-[#433422] hover:bg-[#ebdcb9]/70';
        case 'newspaper':
          return 'bg-white border border-zinc-350 text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950 font-serif';
        case 'colorful':
          return 'bg-indigo-950/15 border border-indigo-500/10 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-950/25';
        case 'dark':
        default:
          return 'bg-white/[0.015] border-white/5 text-zinc-400 hover:text-zinc-300';
      }
    }

    switch (theme) {
      case 'sepia':
        return link.color
          ? `${link.color.replace('bg-rose-400/[0.04]', 'bg-rose-900/10').replace('border-rose-300/15', 'border-[#dfd0b0]').replace('text-rose-200', 'text-rose-950').replace('bg-emerald-400/[0.04]', 'bg-emerald-900/10').replace('border-emerald-300/15', 'border-[#dfd0b0]').replace('text-emerald-200', 'text-emerald-950').replace('bg-sky-400/[0.04]', 'bg-sky-900/10').replace('border-sky-300/15', 'border-[#dfd0b0]').replace('text-sky-200', 'text-sky-950').replace('bg-zinc-900/40', 'bg-[#ebdcb9]/40').replace('border-zinc-800/50', 'border-[#dfd0b0]').replace('text-zinc-350', 'text-[#5c4a37]').replace('hover:text-zinc-100', 'hover:text-[#433422]')} shadow-sm hover:bg-[#ebdcb9]/60 hover:border-[#c5b18a]`
          : 'bg-[#ebdcb9]/40 hover:bg-[#ebdcb9]/70 border-[#dfd0b0] text-[#433422] hover:border-[#c5b18a] hover:shadow-[0_4px_12px_rgba(67,52,34,0.06)]';
      case 'newspaper':
        return 'bg-white border border-zinc-900 text-zinc-900 hover:bg-zinc-50 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 font-serif';
      case 'colorful':
        return link.color
          ? `${link.color} hover:border-indigo-400/40`
          : 'bg-indigo-950/25 hover:bg-indigo-950/40 border border-indigo-500/25 text-purple-100 hover:border-indigo-400/50';
      case 'dark':
      default:
        return link.color || 'bg-zinc-900/60 hover:bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-zinc-700 hover:shadow-zinc-950/40';
    }
  };

  const getMonogramClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#ebdcb9]/60 border border-[#dfd0b0] text-[#433422]';
      case 'newspaper':
        return 'bg-zinc-100 border border-zinc-300 text-zinc-900 font-serif font-extrabold';
      case 'colorful':
        return 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-200';
      case 'dark':
      default:
        return 'bg-white/[0.02] border border-white/5 text-white/90';
    }
  };

  const getFaviconWrapperClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#fbf6eb] border border-[#dfd0b0]';
      case 'newspaper':
        return 'bg-white border border-zinc-300';
      case 'colorful':
        return 'bg-[#09080e] border border-indigo-500/30';
      case 'dark':
      default:
        return 'bg-[#080808] border border-white/10';
    }
  };

  const getTitleClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'text-[#433422] font-semibold';
      case 'newspaper':
        return 'text-zinc-900 font-serif font-extrabold';
      case 'colorful':
        return 'text-purple-200 font-medium';
      case 'dark':
      default:
        return 'text-white/95';
    }
  };

  const getSubtitleClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'text-[#705d46]/70';
      case 'newspaper':
        return 'text-zinc-500 font-sans';
      case 'colorful':
        return 'text-indigo-400/70';
      case 'dark':
      default:
        return 'text-zinc-500';
    }
  };

  const getEditOverlayClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#fbf6eb]/98 border border-[#dfd0b0] text-[#433422] shadow-md';
      case 'newspaper':
        return 'bg-white border border-zinc-900 text-zinc-900 font-serif shadow-lg';
      case 'colorful':
        return 'bg-[#09080e]/95 border border-indigo-500/35 text-purple-100';
      case 'dark':
      default:
        return 'bg-[#050505]/95 border border-amber-500/20 text-white';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative w-full h-full group"
    >
      <a
        href={isEditMode ? undefined : secureUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (isEditMode) {
            e.preventDefault();
          }
        }}
        className={`flex flex-col items-center justify-center w-full h-full p-6 rounded-md border transition-all duration-300 text-center backdrop-blur-md select-none ${getCardThemeClasses()} ${
          isEditMode ? 'cursor-default ring-1 ring-amber-500/30' : 'cursor-pointer'
        }`}
        id={`link-card-${link.id}`}
      >
        {/* Subtle Index indicator in top-right of the card */}
        <div className={`absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-40 text-[10px] font-mono tracking-widest transition-opacity duration-300 ${
          theme === 'newspaper' ? 'text-zinc-900 font-bold' : theme === 'sepia' ? 'text-[#433422]' : 'text-white'
        }`}>
          {String(link.order + 1).padStart(2, '0')}
        </div>

        {/* Monogram or large icon in center - with "LETRA" as the central monogram and icon as dynamic bottom right indicator */}
        <div className={`relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mb-3.5 rounded-md transition-transform duration-300 ${getMonogramClasses()} ${isSoberMode ? '' : 'group-hover:scale-105'}`}>
          <span className="text-xl md:text-2xl select-none">
            {monogram}
          </span>
          
          {/* Smaller favicon overlay - styled flat and clean */}
          <div className={`absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center ${getFaviconWrapperClasses()}`}>
            <img
              src={faviconUrl}
              alt={link.title}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
              className="w-4 h-4 object-contain rounded"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Text Details */}
        <div className="max-w-full px-2">
          <h3 className={`font-light text-lg md:text-xl tracking-tight leading-snug truncate ${getTitleClasses()}`}>
            {link.title}
          </h3>
          <p className={`text-[10px] uppercase tracking-widest mt-1 truncate max-w-[180px] md:max-w-xs mx-auto ${getSubtitleClasses()}`}>
            {displayUrl}
          </p>
        </div>

        {/* Small floating link indicator */}
        {!isEditMode && (
          <div className={`absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            theme === 'newspaper' ? 'text-zinc-500 hover:text-zinc-900' : theme === 'sepia' ? 'text-[#705d46] hover:text-[#433422]' : 'text-white/20 hover:text-white/50'
          }`}>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        )}
      </a>

      {/* Edit Mode Overlay / Quick Controls */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => onEdit()}
            className={`absolute inset-0 flex flex-col items-center justify-center rounded-md backdrop-blur-sm p-4 z-10 select-none cursor-pointer transition-all duration-300 ${getEditOverlayClasses()}`}
          >
            <span className={`text-[9px] font-mono tracking-widest font-medium mb-1 uppercase ${theme === 'newspaper' ? 'text-zinc-900 font-bold' : 'text-amber-500'}`}>
              Organizar
            </span>
            <span className="text-xs font-semibold mb-3 truncate max-w-full px-2 text-center">
              {link.title}
            </span>
            
            {/* Quick Edit Action Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className={`p-1.5 rounded-md border transition-all duration-200 ${
                  theme === 'newspaper'
                    ? 'border-zinc-900 bg-white hover:bg-zinc-100 text-zinc-900'
                    : 'bg-white/[0.02] border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-500 hover:text-amber-400'
                }`}
                title="Modificar"
                id={`quick-edit-${link.id}`}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className={`p-1.5 rounded-md border transition-all duration-200 ${
                  theme === 'newspaper'
                    ? 'border-zinc-900 bg-white hover:bg-red-50 text-red-600 hover:text-red-700'
                    : 'bg-white/[0.02] border-white/10 hover:border-red-500/50 hover:bg-red-500/5 text-red-400 hover:text-red-300'
                }`}
                title="Eliminar"
                id={`quick-delete-${link.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4-Directional Reordering D-Pad */}
            <div className="grid grid-cols-3 gap-1.5 w-28 items-center justify-items-center">
              {/* Row 1: Up */}
              <div />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canMoveUp && onMoveUp) {
                    onMoveUp();
                  }
                }}
                className={`p-1 rounded bg-white/[0.02] border border-white/5 transition-all duration-200 pointer-events-auto ${
                  theme === 'newspaper' ? 'border-zinc-900 text-zinc-900' : 'text-zinc-400'
                } ${
                  (!canMoveUp || !onMoveUp) ? 'opacity-10 cursor-not-allowed' : 'hover:border-amber-500/30 hover:bg-white/[0.05] hover:text-amber-500 active:scale-95'
                }`}
                title="Mover Arriba"
                id={`move-up-${link.id}`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <div />

              {/* Row 2: Left, Center, Right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canMoveLeft && onMoveLeft) {
                    onMoveLeft();
                  }
                }}
                className={`p-1 rounded bg-white/[0.02] border border-white/5 transition-all duration-200 pointer-events-auto ${
                  theme === 'newspaper' ? 'border-zinc-900 text-zinc-900' : 'text-zinc-400'
                } ${
                  (!canMoveLeft || !onMoveLeft) ? 'opacity-10 cursor-not-allowed' : 'hover:border-amber-500/30 hover:bg-white/[0.05] hover:text-amber-500 active:scale-95'
                }`}
                title="Mover Izquierda"
                id={`move-left-${link.id}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              
              <div className={`w-1.5 h-1.5 rounded-full ${theme === 'newspaper' ? 'bg-zinc-900' : 'bg-amber-500/40'}`} />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canMoveRight && onMoveRight) {
                    onMoveRight();
                  }
                }}
                className={`p-1 rounded bg-white/[0.02] border border-white/5 transition-all duration-200 pointer-events-auto ${
                  theme === 'newspaper' ? 'border-zinc-900 text-zinc-900' : 'text-zinc-400'
                } ${
                  (!canMoveRight || !onMoveRight) ? 'opacity-10 cursor-not-allowed' : 'hover:border-amber-500/30 hover:bg-white/[0.05] hover:text-amber-500 active:scale-95'
                }`}
                title="Mover Derecha"
                id={`move-right-${link.id}`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Row 3: Down */}
              <div />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canMoveDown && onMoveDown) {
                    onMoveDown();
                  }
                }}
                className={`p-1 rounded bg-white/[0.02] border border-white/5 transition-all duration-200 pointer-events-auto ${
                  theme === 'newspaper' ? 'border-zinc-900 text-zinc-900' : 'text-zinc-400'
                } ${
                  (!canMoveDown || !onMoveDown) ? 'opacity-10 cursor-not-allowed' : 'hover:border-amber-500/30 hover:bg-white/[0.05] hover:text-amber-500 active:scale-95'
                }`}
                title="Mover Abajo"
                id={`move-down-${link.id}`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <div />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
