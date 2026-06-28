import React from 'react';
import { Settings, LogIn, LogOut, RotateCcw, LayoutGrid, List, Folder, Command, Feather, Palette, Download, Moon, Coffee, Sparkles, Newspaper, PlusCircle, Pin } from 'lucide-react';
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
  viewMode: 'grid' | 'list' | 'groups' | 'dock';
  onChangeViewMode: (mode: 'grid' | 'list' | 'groups' | 'dock') => void;
  isSoberMode: boolean;
  onToggleSoberMode: () => void;
  onExportHtml?: () => void;
  theme: ThemeType;
  onChangeTheme: (theme: ThemeType) => void;
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
}) => {
  // Theme-specific CSS classes for high-quality integration
  const getHeaderThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f4ebd0]/90 border-b border-[#dfd0b0] text-[#433422]';
      case 'newspaper':
        return 'bg-[#faf9f6] border-b border-zinc-300 text-zinc-900 font-serif';
      case 'colorful':
        return 'bg-[#09080e]/95 border-b border-indigo-950/60 text-purple-200/90';
      case 'dark':
      default:
        return 'bg-[#080808]/90 border-b border-white/5 text-zinc-100';
    }
  };

  const getControlBgClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#ebdcb9]/70 border border-[#dfd0b0]/80';
      case 'newspaper':
        return 'bg-white border border-zinc-300';
      case 'colorful':
        return 'bg-indigo-950/20 border border-indigo-900/30';
      case 'dark':
      default:
        return 'bg-white/5 border border-white/10';
    }
  };

  const getButtonActiveClasses = (isActive: boolean) => {
    if (theme === 'sepia') {
      return isActive
        ? 'bg-[#dfd0b0] text-[#433422] shadow-sm font-medium border border-[#dfd0b0]/50'
        : 'text-[#705d46] hover:text-[#433422] hover:bg-[#dfd0b0]/30 border border-transparent';
    } else if (theme === 'newspaper') {
      return isActive
        ? 'bg-zinc-900 text-white font-bold shadow-sm border border-zinc-900'
        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent';
    } else if (theme === 'colorful') {
      return isActive
        ? 'bg-indigo-600/20 text-purple-200 shadow-sm border border-indigo-500/30'
        : 'text-indigo-400/80 hover:text-purple-200 hover:bg-indigo-500/5 border border-transparent';
    } else {
      return isActive
        ? 'bg-white/10 text-white shadow-sm border border-white/10'
        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent';
    }
  };

  const getLoginButtonClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#433422] text-[#fbf6eb] hover:bg-[#5c4a37]';
      case 'newspaper':
        return 'bg-zinc-900 text-white hover:bg-zinc-800';
      case 'colorful':
        return 'bg-indigo-600 text-white hover:bg-indigo-500';
      case 'dark':
      default:
        return 'bg-white text-black hover:bg-zinc-200';
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
              ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/40 text-indigo-400'
              : 'bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 text-emerald-400'
          }`}>
            <Pin className={`w-4 h-4 rotate-[30deg] transform group-hover:rotate-[45deg] group-hover:scale-110 transition-all duration-300 ${
              theme === 'sepia' 
                ? 'text-[#433422]' 
                : theme === 'newspaper'
                ? 'text-white'
                : theme === 'colorful'
                ? 'text-indigo-400'
                : 'text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]'
            }`} />
          </div>
          <span className={`text-xs font-semibold tracking-[0.3em] uppercase group-hover:opacity-100 transition-all ${
            theme === 'newspaper' ? 'font-serif font-bold tracking-[0.2em] text-zinc-900' : theme === 'colorful' ? 'font-sans text-indigo-250' : 'font-light text-current'
          }`}>
            PIN YOUR TOOLS
          </span>
        </div>
      </div>

      {/* Right section: Theme Selector, Views, Actions, Add Link button */}
      <div className="flex flex-wrap items-center justify-end gap-3.5 font-sans">
        
        {/* ADD LINK BUTTON - High Visibility UX CTA */}
        <button
          onClick={onOpenAdmin}
          className={`px-3.5 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-widest transition-all duration-200 flex items-center gap-1.5 shadow-sm border font-sans ${
            theme === 'sepia'
              ? 'bg-[#433422] border-[#433422] text-[#fbf6eb] hover:bg-[#5c4a37] hover:border-[#5c4a37]'
              : theme === 'newspaper'
              ? 'bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800'
              : theme === 'colorful'
              ? 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
          }`}
          title="Añadir un nuevo enlace favorito"
          id="header-add-link-btn"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Añadir Enlace</span>
        </button>

        {/* Theme Switcher Bar - 4 distinct themes */}
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
          <div className={`flex items-center p-0.5 rounded-md ${getControlBgClasses()}`} id="style-appearance-controls">
            {/* Toggle Sobrio */}
            <button
              onClick={onToggleSoberMode}
              className={`px-2.5 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 font-sans ${
                isSoberMode
                  ? theme === 'sepia'
                    ? 'bg-[#433422] text-[#fbf6eb] font-semibold border border-[#dfd0b0]/40'
                    : theme === 'newspaper'
                    ? 'bg-zinc-900 text-white font-bold border border-zinc-900'
                    : theme === 'colorful'
                    ? 'bg-indigo-600/20 text-purple-200 border border-indigo-500/35 font-semibold'
                    : 'bg-zinc-850 text-white border border-zinc-700/60 font-semibold'
                  : 'text-zinc-500 hover:text-current border border-transparent'
              }`}
              title="Modo Sobrio"
              id="toggle-sober-mode-btn"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Sobrio: {isSoberMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        )}

        {/* Organize Mode Switcher */}
        {totalLinks > 0 && (
          <div className="flex items-center gap-2">
            {isEditMode && onResetStyles && (
              <button
                onClick={onResetStyles}
                className={`px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 font-sans ${
                  theme === 'sepia'
                    ? 'bg-[#ebdcb9] border border-[#dfd0b0] text-[#433422] hover:bg-[#dfd0b0]'
                    : theme === 'newspaper'
                    ? 'bg-white border border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-100'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
                id="reset-styles-btn"
                title="Llevar el estilo de todos los cards a neutro"
              >
                <RotateCcw className="w-3 h-3" />
                Reset styles
              </button>
            )}
            <button
              onClick={onToggleEditMode}
              className={`px-3 py-1.5 rounded-md border text-[10px] uppercase tracking-wider transition-all duration-200 font-sans ${
                isEditMode
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 font-bold'
                  : theme === 'newspaper'
                  ? 'bg-white border border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-100'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
              }`}
              id="toggle-edit-mode-btn"
            >
              {isEditMode ? 'Listo' : 'Organizar'}
            </button>
          </div>
        )}

        {/* Export HTML Button */}
        {totalLinks > 0 && onExportHtml && (
          <button
            onClick={onExportHtml}
            className={`px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 font-sans ${
              theme === 'sepia'
                ? 'bg-[#ebdcb9] border border-[#dfd0b0] text-[#433422] hover:bg-[#dfd0b0]'
                : theme === 'newspaper'
                ? 'bg-white border border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-100'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.08]'
            }`}
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
          className={`p-1.5 rounded-md transition-all duration-200 font-sans ${
            theme === 'sepia'
              ? 'bg-[#ebdcb9] border border-[#dfd0b0] text-[#433422] hover:bg-[#dfd0b0]'
              : theme === 'newspaper'
              ? 'bg-white border border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-100'
              : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
          }`}
          title="Administrar Sitios"
          id="open-admin-panel-btn"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Card */}
        {user ? (
          <div className={`flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full cursor-pointer transition-colors font-sans ${
            theme === 'sepia'
              ? 'bg-[#ebdcb9] border border-[#dfd0b0] hover:bg-[#dfd0b0]'
              : theme === 'newspaper'
              ? 'bg-white border border-zinc-900 text-zinc-900 hover:bg-zinc-100'
              : 'bg-white/5 border border-white/10 hover:bg-white/10'
          }`} onClick={onOpenAdmin}>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Google User'}
                className="w-5 h-5 rounded-full object-cover border border-white/10"
                referrerPolicy="no-referrer"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all duration-200 font-sans ${getLoginButtonClasses()}`}
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
