import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Sparkles, Edit2, Trash2, ArrowUp, ArrowDown, ExternalLink, Folder, Zap, Keyboard } from 'lucide-react';
import { LinkItem, ThemeType } from '../types';
import { LinkCard } from './LinkCard';
import { getOptimalGrid, getDomain } from '../utils/grid';
import { useWindowSize } from '../hooks/useWindowSize';

interface LinkGridProps {
  links: LinkItem[];
  isEditMode: boolean;
  onEditLink: (link: LinkItem) => void;
  onDeleteLink: (id: string) => void;
  onMoveLink: (id: string, direction: 'up' | 'down' | 'left' | 'right', cols: number) => void;
  onOpenAdmin: () => void;
  viewMode: 'grid' | 'list' | 'groups' | 'dock';
  isSoberMode: boolean;
  theme: ThemeType;
}

export const LinkGrid: React.FC<LinkGridProps> = ({
  links,
  isEditMode,
  onEditLink,
  onDeleteLink,
  onMoveLink,
  onOpenAdmin,
  viewMode,
  isSoberMode,
  theme,
}) => {
  const windowSize = useWindowSize();

  // Keyboard navigation for 'dock' mode
  useEffect(() => {
    if (viewMode !== 'dock' || isEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key;
      let index = -1;

      if (key >= '1' && key <= '9') {
        index = parseInt(key) - 1;
      } else if (key === '0') {
        index = 9;
      }

      if (index >= 0 && index < links.length) {
        const link = links[index];
        const anchor = document.getElementById(`link-dock-anchor-${link.id}`);
        if (anchor) {
          anchor.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewMode, links, isEditMode]);
  
  const headerHeight = windowSize.width < 768 ? 140 : 76;
  const gridWidth = windowSize.width - 32;
  const gridHeight = Math.max(windowSize.height - headerHeight - 32, 250);

  const { cols, rows } = getOptimalGrid(links.length, gridWidth, gridHeight);

  const minRowHeight = windowSize.width < 768 ? 110 : 130;
  const isGridScrollable = (gridHeight / rows) < minRowHeight;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: isGridScrollable
      ? `repeat(${rows}, minmax(${minRowHeight}px, 1fr))`
      : `repeat(${rows}, minmax(0, 1fr))`,
    gap: '1rem',
    width: '100%',
    height: isGridScrollable ? 'auto' : `${gridHeight}px`,
  };

  // Helper to map dark pastel classes to bright, vibrant, luminous classes in colorful theme
  const mapColorfulPreset = (c: string) => {
    if (!c) return '';
    return c
      .replace(/bg-rose-400\/\[0\.04\]/g, 'bg-rose-50/90')
      .replace(/border-rose-300\/15/g, 'border-rose-200/80')
      .replace(/text-rose-200/g, 'text-rose-700')
      .replace(/hover:text-rose-100/g, 'hover:text-rose-800')
      .replace(/hover:bg-rose-400\/\[0\.09\]/g, 'hover:bg-rose-100/70')

      .replace(/bg-emerald-400\/\[0\.04\]/g, 'bg-emerald-50/90')
      .replace(/border-emerald-300\/15/g, 'border-emerald-200/80')
      .replace(/text-emerald-200/g, 'text-emerald-700')
      .replace(/hover:text-emerald-100/g, 'hover:text-emerald-800')
      .replace(/hover:bg-emerald-400\/\[0\.09\]/g, 'hover:bg-emerald-100/70')

      .replace(/bg-sky-400\/\[0\.04\]/g, 'bg-sky-50/90')
      .replace(/border-sky-300\/15/g, 'border-sky-200/80')
      .replace(/text-sky-200/g, 'text-sky-700')
      .replace(/hover:text-sky-100/g, 'hover:text-sky-800')
      .replace(/hover:bg-sky-400\/\[0\.09\]/g, 'hover:bg-sky-100/70')

      .replace(/bg-amber-400\/\[0\.03\]/g, 'bg-amber-50/90')
      .replace(/border-amber-300\/15/g, 'border-amber-200/80')
      .replace(/text-amber-200/g, 'text-amber-700')
      .replace(/hover:text-amber-100/g, 'hover:text-amber-800')
      .replace(/hover:bg-amber-400\/\[0\.08\]/g, 'hover:bg-amber-100/70')

      .replace(/bg-orange-400\/\[0\.04\]/g, 'bg-orange-50/90')
      .replace(/border-orange-300\/15/g, 'border-orange-200/80')
      .replace(/text-orange-200/g, 'text-orange-700')
      .replace(/hover:text-orange-100/g, 'hover:text-orange-800')
      .replace(/hover:bg-orange-400\/\[0\.09\]/g, 'hover:bg-orange-100/70')

      .replace(/bg-purple-400\/\[0\.04\]/g, 'bg-purple-50/90')
      .replace(/border-purple-300\/15/g, 'border-purple-200/80')
      .replace(/text-purple-200/g, 'text-purple-700')
      .replace(/hover:text-purple-100/g, 'hover:text-purple-800')
      .replace(/hover:bg-purple-400\/\[0\.09\]/g, 'hover:bg-purple-100/70')

      .replace(/bg-cyan-400\/\[0\.04\]/g, 'bg-cyan-50/90')
      .replace(/border-cyan-300\/15/g, 'border-cyan-200/80')
      .replace(/text-cyan-200/g, 'text-cyan-700')
      .replace(/hover:text-cyan-100/g, 'hover:text-cyan-800')
      .replace(/hover:bg-cyan-400\/\[0\.09\]/g, 'hover:bg-cyan-100/70')

      .replace(/bg-teal-400\/\[0\.04\]/g, 'bg-teal-50/90')
      .replace(/border-teal-300\/15/g, 'border-teal-200/80')
      .replace(/text-teal-200/g, 'text-teal-700')
      .replace(/hover:text-teal-100/g, 'hover:text-teal-800')
      .replace(/hover:bg-teal-400\/\[0\.09\]/g, 'hover:bg-teal-100/70')

      .replace(/bg-fuchsia-400\/\[0\.04\]/g, 'bg-fuchsia-50/90')
      .replace(/border-fuchsia-300\/15/g, 'border-fuchsia-200/80')
      .replace(/text-fuchsia-200/g, 'text-fuchsia-700')
      .replace(/hover:text-fuchsia-100/g, 'hover:text-fuchsia-800')
      .replace(/hover:bg-fuchsia-400\/\[0\.09\]/g, 'hover:bg-fuchsia-100/70')

      .replace(/bg-indigo-400\/\[0\.04\]/g, 'bg-indigo-50/90')
      .replace(/border-indigo-300\/15/g, 'border-indigo-200/80')
      .replace(/text-indigo-200/g, 'text-indigo-700')
      .replace(/hover:text-indigo-100/g, 'hover:text-indigo-800')
      .replace(/hover:bg-indigo-400\/\[0\.09\]/g, 'hover:bg-indigo-100/70')

      .replace(/bg-zinc-900\/40/g, 'bg-slate-50/90')
      .replace(/border-zinc-800\/50/g, 'border-slate-200')
      .replace(/text-zinc-350/g, 'text-slate-600')
      .replace(/hover:text-zinc-100/g, 'hover:text-slate-800')
      .replace(/hover:bg-zinc-800\/50/g, 'hover:bg-slate-100/80');
  };

  // Helper to resolve card classes based on Theme & Sober mode
  const getCardClasses = (presetColor?: string) => {
    if (isSoberMode) {
      switch (theme) {
        case 'sepia':
          return 'bg-[#ebdcb9]/40 border-[#dfd0b0] text-[#5c4a37] hover:text-[#433422] hover:bg-[#ebdcb9]/70';
        case 'newspaper':
          return 'bg-white border border-zinc-300 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50';
        case 'colorful':
          return 'bg-slate-50/70 border border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-100/80';
        case 'dark':
        default:
          return 'bg-white/[0.015] border-white/5 text-zinc-400 hover:text-zinc-300';
      }
    }

    switch (theme) {
      case 'sepia':
        return presetColor
          ? `${presetColor.replace('bg-rose-400/[0.04]', 'bg-rose-900/10').replace('border-rose-300/15', 'border-rose-800/20').replace('text-rose-200', 'text-rose-900').replace('bg-emerald-400/[0.04]', 'bg-emerald-900/10').replace('border-emerald-300/15', 'border-emerald-800/20').replace('text-emerald-200', 'text-emerald-900').replace('bg-sky-400/[0.04]', 'bg-sky-900/10').replace('border-sky-300/15', 'border-sky-800/20').replace('text-sky-200', 'text-sky-900').replace('bg-zinc-900/40', 'bg-[#ebdcb9]/40').replace('border-zinc-800/50', 'border-[#dfd0b0]').replace('text-zinc-350', 'text-[#5c4a37]').replace('hover:text-zinc-100', 'hover:text-[#433422]')} shadow-sm`
          : 'bg-[#ebdcb9]/40 hover:bg-[#ebdcb9]/70 border-[#dfd0b0] text-[#433422] hover:border-[#c5b18a] hover:shadow-[0_4px_12px_rgba(67,52,34,0.06)]';
      case 'newspaper':
        return 'bg-white border border-zinc-900 text-zinc-900 hover:bg-zinc-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5';
      case 'colorful':
        return presetColor
          ? `${mapColorfulPreset(presetColor)} shadow-sm hover:border-slate-350 hover:shadow-md transition-all duration-200`
          : 'bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200 text-slate-800 hover:border-slate-350 shadow-sm hover:shadow-md transition-all duration-200';
      case 'dark':
      default:
        return presetColor || 'bg-zinc-900/60 hover:bg-zinc-900/80 border border-zinc-800 text-zinc-100 hover:border-zinc-700 hover:shadow-zinc-950/40';
    }
  };

  const getIconWrapperClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#ebdcb9]/50 border-[#dfd0b0] text-[#433422]';
      case 'newspaper':
        return 'bg-zinc-100 border border-zinc-300 text-zinc-900 font-serif font-bold';
      case 'colorful':
        return 'bg-slate-100 border border-slate-200 text-slate-700';
      case 'dark':
      default:
        return 'bg-white/[0.02] border border-white/5 text-white/90';
    }
  };

  const getOverlayBgClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#fbf6eb] border-[#dfd0b0]';
      case 'newspaper':
        return 'bg-white border border-zinc-900';
      case 'colorful':
        return 'bg-white border border-slate-200';
      case 'dark':
      default:
        return 'bg-[#080808] border border-white/10';
    }
  };

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] w-full max-w-lg mx-auto text-center px-6">
        <div className={`p-5 rounded-md mb-6 shadow-lg backdrop-blur-md ${theme === 'newspaper' ? 'bg-white border border-zinc-900 text-zinc-900' : theme === 'sepia' ? 'bg-[#f4ebd0] border border-[#dfd0b0] text-[#433422]' : 'bg-white/[0.02] border border-white/5 text-zinc-400'}`}>
          <Sparkles className="w-8 h-8 opacity-90" />
        </div>
        <h2 className={`font-display font-light text-2xl tracking-tight ${theme === 'newspaper' ? 'font-serif font-bold text-zinc-900' : 'text-current'}`}>
          Tu Inicio Personalizado
        </h2>
        <p className={`text-xs mt-3 leading-relaxed max-w-xs ${theme === 'sepia' ? 'text-amber-900/70' : theme === 'newspaper' ? 'text-zinc-600 font-serif' : 'text-zinc-500 font-sans'}`}>
          No tienes ningún sitio guardado todavía. Agrega tus accesos directos favoritos y se expandirán de forma inteligente para ocupar todo tu navegador.
        </p>
        <button
          onClick={onOpenAdmin}
          className={`mt-6 flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest shadow-md transition-all ${
            theme === 'sepia'
              ? 'bg-[#433422] text-[#fbf6eb] hover:bg-[#5c4a37]'
              : theme === 'newspaper'
              ? 'bg-zinc-900 text-white border border-zinc-900 hover:bg-white hover:text-zinc-900'
              : theme === 'colorful'
              ? 'bg-indigo-600 text-white hover:bg-indigo-500'
              : 'bg-white text-black hover:bg-zinc-200'
          }`}
          id="empty-state-add-btn"
        >
          <PlusCircle className="w-4 h-4" />
          Agregar mi primer sitio
        </button>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="w-full h-full p-4 md:p-6 overflow-hidden flex items-start justify-center">
        <div 
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-2.5 content-start overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          style={{ maxHeight: `${gridHeight}px` }}
        >
          <AnimatePresence mode="popLayout">
            {links.map((link, index) => {
              const canMoveUp = index > 0;
              const canMoveDown = index < links.length - 1;
              const domain = getDomain(link.url);
              const monogram = link.title ? link.title.charAt(0).toUpperCase() : '?';
              const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
              const displayUrl = link.url
                .replace(/^(https?:\/\/)?(www\.)?/, '')
                .split('/')[0];
              const secureUrl = link.url.match(/^[a-zA-Z]+:\/\//) ? link.url : `https://${link.url}`;
              const themeClass = getCardClasses(link.color);

              return (
                <motion.div
                  key={link.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="w-full relative group"
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
                    className={`flex items-center justify-between p-3 md:p-3.5 rounded-md border transition-all duration-300 shadow-sm backdrop-blur-md select-none ${themeClass} ${
                      isEditMode ? 'cursor-default ring-1 ring-amber-500/20' : `cursor-pointer ${isSoberMode ? '' : 'hover:translate-x-1'}`
                    }`}
                    id={`link-list-row-${link.id}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Left: Icon / Monogram Area */}
                      <div className={`relative flex items-center justify-center w-10 h-10 rounded flex-shrink-0 border ${getIconWrapperClasses()}`}>
                        <span className={`font-light text-sm ${theme === 'newspaper' ? 'font-serif font-bold text-zinc-900' : 'text-current'}`}>
                          {monogram}
                        </span>
                        <div className={`absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ${getOverlayBgClasses()}`}>
                          <img
                            src={faviconUrl}
                            alt={link.title}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            className="w-3.5 h-3.5 object-contain rounded"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      {/* Middle: Title & URL */}
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-light text-base md:text-lg tracking-tight truncate ${theme === 'newspaper' ? 'font-serif font-bold text-zinc-900' : 'text-current'}`}>
                          {link.title}
                        </h3>
                        <p className={`text-[10px] uppercase tracking-widest mt-0.5 truncate max-w-sm font-mono ${theme === 'sepia' ? 'text-[#705d46]' : theme === 'newspaper' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                          {displayUrl}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions or External Link indicator */}
                    {!isEditMode ? (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-current opacity-40 hover:opacity-80 pr-1 flex-shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <div className={`flex items-center rounded-md p-0.5 mr-1 md:mr-2 border ${getIconWrapperClasses()}`}>
                          <button
                            onClick={() => canMoveUp && onMoveLink(link.id, 'up', 1)}
                            disabled={!canMoveUp}
                            className={`p-1 rounded transition-all ${
                              !canMoveUp ? 'opacity-15 cursor-not-allowed' : 'hover:bg-white/[0.05] text-amber-500 active:scale-90'
                            }`}
                            title="Mover Arriba"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => canMoveDown && onMoveLink(link.id, 'down', 1)}
                            disabled={!canMoveDown}
                            className={`p-1 rounded transition-all ${
                              !canMoveDown ? 'opacity-15 cursor-not-allowed' : 'hover:bg-white/[0.05] text-amber-500 active:scale-90'
                            }`}
                            title="Mover Abajo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => onEditLink(link)}
                          className={`p-1.5 rounded-md border transition-all duration-200 ${
                            theme === 'newspaper' 
                              ? 'border-zinc-900 hover:bg-zinc-100 text-zinc-900' 
                              : 'bg-white/[0.02] border-white/5 hover:border-amber-500/50 text-amber-400'
                          }`}
                          title="Modificar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteLink(link.id)}
                          className={`p-1.5 rounded-md border transition-all duration-200 ${
                            theme === 'newspaper' 
                              ? 'border-zinc-900 hover:bg-red-50 text-red-600 hover:text-white' 
                              : 'bg-white/[0.02] border-white/5 hover:border-red-500/50 text-red-400'
                          }`}
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </a>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (viewMode === 'groups') {
    const groups: { [key: string]: LinkItem[] } = {};
    links.forEach((link) => {
      const cat = link.category?.trim() ? link.category.trim() : 'General';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(link);
    });

    return (
      <div className="w-full h-full p-4 md:p-6 overflow-hidden flex flex-col items-center">
        <div 
          className="w-full max-w-5xl overflow-y-auto space-y-8 pr-1 select-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent animate-fade-in"
          style={{ maxHeight: `${gridHeight}px` }}
        >
          <AnimatePresence mode="popLayout">
            {Object.entries(groups).map(([catName, catLinks]) => (
              <motion.div
                key={catName}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Group Header */}
                <div className={`flex items-center gap-2 border-b pb-1.5 ${theme === 'newspaper' ? 'border-zinc-950 pb-2 font-serif' : theme === 'sepia' ? 'border-[#dfd0b0]' : 'border-white/[0.05]'}`}>
                  <Folder className="w-3.5 h-3.5 opacity-60" />
                  <h3 className={`font-light text-xs uppercase tracking-widest ${theme === 'newspaper' ? 'font-serif font-bold text-zinc-900 text-sm' : theme === 'sepia' ? 'text-[#433422] font-semibold' : 'text-zinc-400'}`}>
                    {catName}
                  </h3>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${getIconWrapperClasses()}`}>
                    {catLinks.length}
                  </span>
                </div>

                {/* Grid of group items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {catLinks.map((link) => {
                    const domain = getDomain(link.url);
                    const monogram = link.title ? link.title.charAt(0).toUpperCase() : '?';
                    const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
                    const secureUrl = link.url.match(/^[a-zA-Z]+:\/\//) ? link.url : `https://${link.url}`;
                    const themeClass = getCardClasses(link.color);

                    return (
                      <motion.div
                        key={link.id}
                        layout
                        className="relative group"
                      >
                        <a
                          href={isEditMode ? undefined : secureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (isEditMode) e.preventDefault();
                          }}
                          className={`flex items-center gap-3 p-3 rounded-md border backdrop-blur-md select-none transition-all duration-300 ${themeClass} ${
                            isEditMode ? 'cursor-default ring-1 ring-amber-500/20' : `cursor-pointer ${isSoberMode ? '' : 'hover:scale-[1.02] hover:-translate-y-0.5'}`
                          }`}
                          id={`link-group-item-${link.id}`}
                        >
                          <div className={`relative flex items-center justify-center w-8 h-8 rounded flex-shrink-0 border ${getIconWrapperClasses()}`}>
                            <span className={`font-light text-xs ${theme === 'newspaper' ? 'font-serif font-bold' : 'text-current'}`}>
                              {monogram}
                            </span>
                            <div className={`absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ${getOverlayBgClasses()}`}>
                              <img
                                src={faviconUrl}
                                alt={link.title}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                                className="w-3 h-3 object-contain rounded"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h4 className={`font-light text-xs tracking-tight truncate ${theme === 'newspaper' ? 'font-serif font-bold text-zinc-900' : 'text-current'}`}>
                              {link.title}
                            </h4>
                          </div>

                          {isEditMode && (
                            <div className="flex items-center gap-1.5 flex-shrink-0 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => onEditLink(link)}
                                className={`p-1 rounded border transition-all ${
                                  theme === 'newspaper' 
                                    ? 'border-zinc-900 text-zinc-900 hover:bg-zinc-100' 
                                    : 'bg-white/[0.02] border-white/5 text-amber-400'
                                }`}
                                title="Modificar"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onDeleteLink(link.id)}
                                className={`p-1 rounded border transition-all ${
                                  theme === 'newspaper' 
                                    ? 'border-zinc-900 text-red-600 hover:bg-red-50' 
                                    : 'bg-white/[0.02] border-white/5 text-red-400'
                                }`}
                                title="Eliminar"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </a>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (viewMode === 'dock') {
    return (
      <div className="w-full h-full p-4 md:p-6 overflow-hidden flex flex-col items-center justify-center">
        {!isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest mb-6 font-mono border ${
              theme === 'sepia' 
                ? 'bg-[#ebdcb9]/40 border-[#dfd0b0] text-[#705d46]' 
                : theme === 'newspaper' 
                ? 'bg-white border-zinc-900 text-zinc-900 font-serif font-bold' 
                : 'bg-white/[0.01] border-white/5 text-zinc-500'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 opacity-60 animate-pulse" />
            <span>Atajos de teclado activos: Presiona [1 - 9]</span>
          </motion.div>
        )}

        <div 
          className="w-full max-w-4xl flex flex-wrap items-center justify-center gap-4 overflow-y-auto p-4"
          style={{ maxHeight: `${gridHeight}px` }}
        >
          <AnimatePresence mode="popLayout">
            {links.map((link, index) => {
              const domain = getDomain(link.url);
              const monogram = link.title ? link.title.charAt(0).toUpperCase() : '?';
              const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
              const secureUrl = link.url.match(/^[a-zA-Z]+:\/\//) ? link.url : `https://${link.url}`;
              const themeClass = getCardClasses(link.color);
              
              const keyNumber = index < 9 ? `${index + 1}` : index === 9 ? '0' : null;

              return (
                <motion.div
                  key={link.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={isSoberMode ? undefined : { y: -6, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="relative"
                >
                  <a
                    href={isEditMode ? undefined : secureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (isEditMode) e.preventDefault();
                    }}
                    className={`flex flex-col items-center justify-center p-5 w-24 h-24 md:w-28 md:h-28 rounded-xl border backdrop-blur-md select-none transition-all duration-300 ${themeClass} ${
                      isEditMode ? 'cursor-default ring-1 ring-amber-500/20' : 'cursor-pointer'
                    }`}
                    id={`link-dock-anchor-${link.id}`}
                  >
                    {keyNumber && !isEditMode && (
                      <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center justify-center leading-none border ${getIconWrapperClasses()}`}>
                        {keyNumber}
                      </div>
                    )}

                    {/* Icon / Monogram Area */}
                    <div className={`relative flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0 border ${getIconWrapperClasses()}`}>
                      <span className={`font-light text-base ${theme === 'newspaper' ? 'font-serif font-bold text-zinc-900' : 'text-current'}`}>
                        {monogram}
                      </span>
                      <div className={`absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ${getOverlayBgClasses()}`}>
                        <img
                          src={faviconUrl}
                          alt={link.title}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                          className="w-3.5 h-3.5 object-contain rounded"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <span className={`mt-3.5 text-[10px] md:text-xs font-semibold text-center truncate w-full px-1 ${theme === 'newspaper' ? 'font-serif font-bold text-zinc-900' : 'text-current opacity-90'}`}>
                      {link.title}
                    </span>

                    {/* Actions in Edit Mode */}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/90 rounded-xl flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEditLink(link)}
                          className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-amber-400 transition-all"
                          title="Modificar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteLink(link.id)}
                          className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-red-500/50 text-red-400 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </a>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full p-4 md:p-6 flex justify-center ${
        isGridScrollable
          ? 'items-start overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent'
          : 'items-center overflow-hidden'
      }`}
      style={isGridScrollable ? { maxHeight: `${gridHeight}px` } : undefined}
    >
      <div style={gridStyle} className="w-full transition-all duration-500 ease-out">
        <AnimatePresence mode="popLayout">
          {links.map((link, index) => {
            const canMoveLeft = index > 0;
            const canMoveRight = index < links.length - 1;
            const canMoveUp = index >= cols;
            const canMoveDown = index + cols < links.length;

            return (
              <LinkCard
                key={link.id}
                link={link}
                isEditMode={isEditMode}
                onEdit={() => onEditLink(link)}
                onDelete={() => onDeleteLink(link.id)}
                onMoveLeft={() => onMoveLink(link.id, 'left', cols)}
                onMoveRight={() => onMoveLink(link.id, 'right', cols)}
                onMoveUp={() => onMoveLink(link.id, 'up', cols)}
                onMoveDown={() => onMoveLink(link.id, 'down', cols)}
                canMoveLeft={canMoveLeft}
                canMoveRight={canMoveRight}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                isSoberMode={isSoberMode}
                theme={theme}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
