import React from 'react';
import { Settings, LogIn, LogOut, RotateCcw, LayoutGrid, List, Folder, FolderOpen, Command, Feather, Palette, Download, Moon, Coffee, Sparkles, Newspaper, PlusCircle, Pin, Contrast } from 'lucide-react';
import { User } from 'firebase/auth';
import { ThemeType } from '../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  totalLinks: number;
  onResetStyles?: () => void;
  viewMode: 'grid' | 'list' | 'groups' | 'dock' | 'compact-groups';
  onChangeViewMode: (mode: 'grid' | 'list' | 'groups' | 'dock' | 'compact-groups') => void;
  isSoberMode: boolean;
  onToggleSoberMode: () => void;
  onExportHtml?: () => void;
  theme: ThemeType;
  onChangeTheme: (theme: ThemeType) => void;
  bgBrightness: number;
  onChangeBgBrightness: (level: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  onOpenAdmin,
  isEditMode,
  onToggleEditMode,
  totalLinks,
  onResetStyles,
  viewMode,
  onChangeViewMode,
  isSoberMode,
  onToggleSoberMode,
  onExportHtml,
  theme,
  onChangeTheme,
  bgBrightness,
  onChangeBgBrightness,
}) => {
  // Theme-specific CSS classes for high-quality integration
  const getHeaderThemeClasses = () => {
    const isDark = bgBrightness >= 6;
    switch (theme) {
      case 'sepia':
        return isDark
          ? 'bg-[#433422]/90 border-b border-[#5c4a37] text-[#fcf9f1] backdrop-blur-md'
          : 'bg-[#f4ebd0]/90 border-b border-[#dfd0b0] text-[#433422]';
      case 'newspaper':
        return isDark
          ? 'bg-zinc-950/90 border-b border-zinc-850 text-zinc-100 font-serif'
          : 'bg-[#faf9f6] border-b border-zinc-300 text-zinc-900 font-serif';
      case 'colorful':
        return isDark
          ? 'bg-[#0f172a]/90 border-b border-indigo-950 text-purple-100 backdrop-blur-md'
          : 'bg-white/70 border-b border-slate-200 text-slate-800 backdrop-blur-md';
      case 'dark':
      default:
        return isDark
          ? 'bg-[#080808]/90 border-b border-white/5 text-zinc-100'
          : 'bg-white/90 border-b border-zinc-200 text-zinc-900 backdrop-blur-md';
    }
  };

  const getControlBgClasses = () => {
    const isDark = bgBrightness >= 6;
    switch (theme) {
      case 'sepia':
        return isDark
          ? 'bg-black/20 border border-[#5c4a37]/50'
          : 'bg-[#ebdcb9]/70 border border-[#dfd0b0]/80';
      case 'newspaper':
        return isDark
          ? 'bg-zinc-900/60 border border-zinc-800'
          : 'bg-white border border-zinc-300';
      case 'colorful':
        return isDark
          ? 'bg-slate-900/60 border border-slate-850'
          : 'bg-slate-100 border border-slate-200/80';
      case 'dark':
      default:
        return isDark
          ? 'bg-white/5 border border-white/10'
          : 'bg-black/5 border border-black/10';
    }
  };

  const getButtonActiveClasses = (isActive: boolean) => {
    const isDark = bgBrightness >= 6;
    if (theme === 'sepia') {
      if (isDark) {
        return isActive
          ? 'bg-[#5c4a37] text-white shadow-sm font-medium border border-[#5c4a37]'
          : 'text-[#fcf9f1]/60 hover:text-white hover:bg-[#5c4a37]/30 border border-transparent';
      }
      return isActive
        ? 'bg-[#dfd0b0] text-[#433422] shadow-sm font-medium border border-[#dfd0b0]/50'
        : 'text-[#705d46] hover:text-[#433422] hover:bg-[#dfd0b0]/30 border border-transparent';
    } else if (theme === 'newspaper') {
      if (isDark) {
        return isActive
          ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm border border-zinc-100'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-transparent';
      }
      return isActive
        ? 'bg-zinc-900 text-white font-bold shadow-sm border border-zinc-900'
        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent';
    } else if (theme === 'colorful') {
      if (isDark) {
        return isActive
          ? 'bg-indigo-600/35 text-purple-100 border border-indigo-500/35 shadow-sm'
          : 'text-indigo-400 hover:text-purple-200 hover:bg-indigo-500/10 border border-transparent';
      }
      return isActive
        ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60 font-medium'
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40 border border-transparent';
    } else {
      if (isDark) {
        return isActive
          ? 'bg-white/10 text-white shadow-sm border border-white/10'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent';
      }
      return isActive
        ? 'bg-black/10 text-black shadow-sm border border-black/10'
        : 'text-zinc-500 hover:text-zinc-850 hover:bg-black/5 border border-transparent';
    }
  };

  const getTopButtonClasses = (isActive: boolean = false, isIconOnly: boolean = false, isRound: boolean = false) => {
    const isDark = bgBrightness >= 6;
    const padding = isIconOnly ? 'p-1.5' : 'px-3 py-1.5';
    const rounded = isRound ? 'rounded-full' : 'rounded-md';
    const base = `${padding} ${rounded} text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 font-sans border shadow-sm cursor-pointer select-none`;

    switch (theme) {
      case 'sepia':
        if (isDark) {
          return isActive
            ? `${base} bg-[#5c4a37] border-[#5c4a37] text-white`
            : `${base} bg-black/20 border-[#5c4a37]/50 text-[#fcf9f1]/70 hover:text-white hover:bg-[#5c4a37]/30`;
        } else {
          return isActive
            ? `${base} bg-[#dfd0b0] border-[#dfd0b0]/50 text-[#433422]`
            : `${base} bg-[#ebdcb9]/70 border-[#dfd0b0]/80 text-[#705d46] hover:text-[#433422] hover:bg-[#dfd0b0]/40`;
        }
      case 'newspaper':
        if (isDark) {
          return isActive
            ? `${base} bg-zinc-100 border-zinc-100 text-zinc-950 font-bold`
            : `${base} bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850`;
        } else {
          return isActive
            ? `${base} bg-zinc-900 border-zinc-900 text-white font-bold`
            : `${base} bg-white border-zinc-300 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100`;
        }
      case 'colorful':
        if (isDark) {
          return isActive
            ? `${base} bg-indigo-600/35 border-indigo-500/35 text-purple-100`
            : `${base} bg-slate-900/60 border-slate-850 text-indigo-400 hover:text-purple-200 hover:bg-indigo-500/10`;
        } else {
          return isActive
            ? `${base} bg-white border-slate-200/60 text-slate-800 font-medium`
            : `${base} bg-slate-100 border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-200/40`;
        }
      case 'dark':
      default:
        if (isDark) {
          return isActive
            ? `${base} bg-white/10 border-white/10 text-white`
            : `${base} bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.08]`;
        } else {
          return isActive
            ? `${base} bg-black/10 border-black/10 text-black`
            : `${base} bg-black/5 border-black/10 text-zinc-500 hover:text-zinc-850 hover:bg-black/[0.08]`;
        }
    }
  };

  return (
    <header className={`w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 select-none z-30 shrink-0 ${getHeaderThemeClasses()}`}>
      {/* Left logo: Clean, modern custom logo using Pin Icon with rotation effect */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-3 cursor-pointer group"
          title="Recargar Página"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 transition-all shadow-md ${
            theme === 'sepia' 
               ? 'bg-[#dfd0b0] border border-[#c5b18a] text-[#433422]' 
              : theme === 'newspaper'
              ? 'bg-zinc-900 text-white border border-zinc-900'
              : theme === 'colorful'
              ? 'bg-gradient-to-br from-rose-400 to-amber-300 border border-amber-200 text-white shadow-sm'
              : 'bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 text-emerald-400'
          }`}>
            <Pin className={`w-4 h-4 rotate-[30deg] transform group-hover:rotate-[45deg] group-hover:scale-110 transition-all duration-300 ${
              theme === 'sepia' 
                ? 'text-[#433422]' 
                : theme === 'newspaper'
                ? 'text-white'
                : theme === 'colorful'
                ? 'text-white'
                : 'text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]'
            }`} />
          </div>
          <span className={`text-xs font-semibold tracking-[0.3em] uppercase group-hover:opacity-100 transition-all ${
            theme === 'newspaper' ? 'font-serif font-bold tracking-[0.2em] text-zinc-900' : theme === 'colorful' ? 'font-sans text-slate-700' : 'font-light text-current'
          }`}>
            PIN YOUR TOOLS
          </span>
        </div>
      </div>

      {/* Right section: Theme Selector, Views, Actions, Add Link button */}
      <div className="flex flex-wrap items-center justify-end gap-3.5 font-sans">

        {/* Theme Switcher Bar - 4 distinct themes */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center p-0.5 rounded-md ${getControlBgClasses()}`} id="theme-selector-bar">
            <button
              onClick={() => onChangeTheme('dark')}
              className={`p-1.5 rounded transition-all duration-150 ${getButtonActiveClasses(theme === 'dark')}`}
              title="Tema Oscuro"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeTheme('sepia')}
              className={`p-1.5 rounded transition-all duration-150 ${getButtonActiveClasses(theme === 'sepia')}`}
              title="Tema Sepia"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeTheme('colorful')}
              className={`p-1.5 rounded transition-all duration-150 ${getButtonActiveClasses(theme === 'colorful')}`}
              title="Tema Multicolor"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeTheme('newspaper')}
              className={`p-1.5 rounded transition-all duration-150 ${getButtonActiveClasses(theme === 'newspaper')}`}
              title="Tema Periódico"
            >
              <Newspaper className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Background Brightness Control (1-10) */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md ${getControlBgClasses()}`} id="bg-brightness-control">
            <Contrast className="w-3.5 h-3.5 opacity-65 shrink-0" />
            <input
              type="range"
              min="1"
              max="10"
              value={bgBrightness}
              onChange={(e) => onChangeBgBrightness(parseInt(e.target.value, 10))}
              className={`w-16 sm:w-20 h-1 rounded-lg appearance-none cursor-pointer ${
                theme === 'sepia'
                  ? 'bg-[#dfd0b0] accent-[#433422]'
                  : theme === 'newspaper'
                  ? 'bg-zinc-300 accent-zinc-900'
                  : theme === 'colorful'
                  ? 'bg-slate-200 accent-slate-800'
                  : 'bg-zinc-880 accent-white'
              }`}
              title="Ajustar tono de fondo (1 = Blanco, 10 = Negro)"
              id="bg-brightness-range"
            />
            <span className="text-[10px] font-mono font-bold min-w-[12px] text-center">{bgBrightness}</span>
          </div>
        </div>

        {/* Layout Switcher */}
        {totalLinks > 0 && (
          <div className={`flex items-center p-0.5 rounded-md ${getControlBgClasses()}`} id="view-mode-selector">
            <button
              onClick={() => onChangeViewMode('grid')}
              className={`p-1.5 rounded transition-all duration-150 ${getButtonActiveClasses(viewMode === 'grid')}`}
              title="Vista de Cuadrícula (Grid)"
              id="view-grid-btn"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('list')}
              className={`p-1.5 rounded transition-all duration-150 ${getButtonActiveClasses(viewMode === 'list')}`}
              title="Vista de Lista (List)"
              id="view-list-btn"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('groups')}
              className={`p-1.5 rounded transition-all duration-150 ${getButtonActiveClasses(viewMode === 'groups')}`}
              title="Vista por Categorías"
              id="view-groups-btn"
            >
              <Folder className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('compact-groups')}
              className={`p-1.5 rounded transition-all duration-150 ${getButtonActiveClasses(viewMode === 'compact-groups')}`}
              title="Vista por Categorías Compacta"
              id="view-compact-groups-btn"
            >
              <FolderOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('dock')}
              className={`p-1.5 rounded transition-all duration-150 ${getButtonActiveClasses(viewMode === 'dock')}`}
              title="Vista Muelle / Atajos Teclado (Dock)"
              id="view-dock-btn"
            >
              <Command className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Visual Appearance Controls Bar (Sober Mode) */}
        {totalLinks > 0 && (
          <button
            onClick={onToggleSoberMode}
            className={getTopButtonClasses(isSoberMode)}
            title="Modo Sobrio"
            id="toggle-sober-mode-btn"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Sobrio: {isSoberMode ? 'ON' : 'OFF'}</span>
          </button>
        )}

        {/* Organize Mode Switcher */}
        {totalLinks > 0 && (
          <div className="flex items-center gap-2">
            {isEditMode && onResetStyles && (
              <button
                onClick={onResetStyles}
                className={getTopButtonClasses(false)}
                id="reset-styles-btn"
                title="Llevar el estilo de todos los cards a neutro"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset styles
              </button>
            )}
            <button
              onClick={onToggleEditMode}
              className={getTopButtonClasses(isEditMode)}
              id="toggle-edit-mode-btn"
            >
              {isEditMode ? 'Listo' : 'Organizar'}
            </button>
          </div>
        )}

        {/* ADD LINK BUTTON - Styled identically to the other action buttons */}
        <button
          onClick={onOpenAdmin}
          className={getTopButtonClasses(false)}
          title="Añadir un nuevo enlace favorito"
          id="header-add-link-btn"
        >
          + Enlace
        </button>

        {/* Export HTML Button */}
        {totalLinks > 0 && onExportHtml && (
          <button
            onClick={onExportHtml}
            className={getTopButtonClasses(false)}
            title="Exportar mi configuración como un archivo index.html"
            id="export-html-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenAdmin}
          className={getTopButtonClasses(false, true)}
          title="Administrar Sitios"
          id="open-admin-panel-btn"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Card */}
        {user ? (
          <div 
            className={getTopButtonClasses(false, false, true)} 
            onClick={onOpenAdmin}
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Google User'}
                className="w-5 h-5 rounded-full object-cover border border-white/10"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-white uppercase border border-white/10">
                {user.email?.charAt(0) || 'G'}
              </div>
            )}
            <span className="text-[10px] font-medium hidden sm:inline max-w-[120px] truncate">
              {user.email}
            </span>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className={getTopButtonClasses(true)}
            title="Iniciar sesión con Google"
            id="google-login-btn"
          >
            <LogIn className="w-3 h-3" />
            <span className="hidden sm:inline">Entrar</span>
          </button>
        )}
      </div>
    </header>
  );
};

