import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Save, RotateCcw, LogIn, LogOut, Trash2, ArrowUp, ArrowDown, Edit2, Grid, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';
import { LinkItem, PRESET_COLORS } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  links: LinkItem[];
  onAddLink: (link: Omit<LinkItem, 'id' | 'userId' | 'order'>) => void;
  onUpdateLink: (id: string, updated: Partial<LinkItem>) => void;
  onDeleteLink: (id: string) => void;
  onMoveLink: (id: string, direction: 'up' | 'down' | 'left' | 'right', cols?: number) => void;
  initialEditingLink?: LinkItem | null;
  onSelectEditLink?: (link: LinkItem) => void;
  onCancelEdit?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  links,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onMoveLink,
  initialEditingLink = null,
  onSelectEditLink,
  onCancelEdit,
}) => {
  // Form States
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].class);
  const [category, setCategory] = useState('');

  // Refs for UX enhancements
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load editing item to form
  useEffect(() => {
    if (initialEditingLink) {
      setTitle(initialEditingLink.title);
      setUrl(initialEditingLink.url);
      setSelectedColor(initialEditingLink.color || PRESET_COLORS[0].class);
      setCategory(initialEditingLink.category || '');

      // Scroll to top of content container smoothly
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Focus and highlight title input with a slight delay for panel entrance transition
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.select();
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setTitle('');
      setUrl('');
      setSelectedColor(PRESET_COLORS[0].class);
      setCategory('');
    }
  }, [initialEditingLink]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    // Clean URL
    let cleanUrl = url.trim();
    if (!cleanUrl.match(/^[a-zA-Z]+:\/\//)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    if (initialEditingLink) {
      onUpdateLink(initialEditingLink.id, {
        title: title.trim(),
        url: cleanUrl,
        color: selectedColor,
        category: category.trim(),
      });
    } else {
      onAddLink({
        title: title.trim(),
        url: cleanUrl,
        color: selectedColor,
        category: category.trim(),
      });
    }

    // Reset Form
    setTitle('');
    setUrl('');
    setSelectedColor(PRESET_COLORS[0].class);
    setCategory('');
  };

  const handleQuickFill = (domain: string, siteTitle: string) => {
    setTitle(siteTitle);
    setUrl(domain);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#080808] border-l border-white/5 shadow-2xl flex flex-col z-50 overflow-hidden font-sans"
            id="admin-side-panel"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#080808]">
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4 text-zinc-400" />
                <h2 className="font-display font-light text-base uppercase tracking-widest text-white">
                  Panel de Control
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                id="close-admin-panel-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div ref={contentRef} className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
              {/* Cloud Sync & Auth Section */}
              <div className="bg-white/[0.01] border border-white/5 rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    Sincronización Cloud
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full ${user ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                </div>

                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Usuario"
                          className="w-8 h-8 rounded-full border border-white/10 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-white uppercase border border-white/10">
                          {user.email?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-medium text-white truncate max-w-[200px]">
                          {user.displayName || 'Sesión Iniciada'}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate max-w-[200px] font-mono">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full py-1.5 px-3 rounded-md bg-white/5 hover:bg-red-950/20 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-red-400 border border-white/5 hover:border-red-900/20 font-bold transition-all duration-200 flex items-center justify-center gap-2"
                      id="drawer-logout-btn"
                    >
                      <LogOut className="w-3 h-3" />
                      Cerrar Sesión Google
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Inicia sesión con tu cuenta de Google para almacenar de forma segura tus sitios en la nube y acceder a ellos desde cualquier dispositivo.
                    </p>
                    <button
                      onClick={onLogin}
                      className="w-full py-2 px-3 rounded-md bg-white hover:bg-zinc-200 text-black text-[10px] font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                      id="drawer-login-btn"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Iniciar Sesión con Google
                    </button>
                  </div>
                )}
              </div>

              {/* Add / Edit Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[11px] uppercase tracking-widest text-white font-medium">
                    {initialEditingLink ? 'Modificar Sitio' : 'Agregar Nuevo Enlace'}
                  </h3>
                  {initialEditingLink && (
                    <button
                      type="button"
                      onClick={onCancelEdit || onClose}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors uppercase tracking-wider"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Cancelar
                    </button>
                  )}
                </div>

                <div className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-md">
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400">
                      Nombre del Sitio
                    </label>
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. GitHub"
                      required
                      className="w-full bg-white/[0.02] border border-white/10 rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                      id="link-title-input"
                    />
                  </div>

                  {/* URL Field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400">
                      Dirección URL
                    </label>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Ej. github.com"
                      required
                      className="w-full bg-white/[0.02] border border-white/10 rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                      id="link-url-input"
                    />
                  </div>

                  {/* Category Field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 flex items-center justify-between">
                      <span>Categoría (Opcional)</span>
                      <span className="text-[9px] font-mono text-zinc-600">Para agrupar</span>
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ej. Trabajo, Personal, Ocio"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-md px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
                      id="link-category-input"
                    />
                  </div>

                  {/* Colors Grid */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 flex items-center justify-between">
                      <span>Estilo Visual</span>
                      <span className="text-[9px] font-mono text-zinc-600">Minimal Presets</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {PRESET_COLORS.map((color) => {
                        const isSelected = selectedColor === color.class;
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setSelectedColor(color.class)}
                            className={`h-8 rounded-md border flex items-center justify-center transition-all ${color.previewClass} ${
                              isSelected
                                ? 'border-white/50 ring-1 ring-white/10 scale-[1.04]'
                                : 'opacity-65 hover:opacity-100 hover:scale-[1.02]'
                            }`}
                            title={color.name}
                          >
                            <div className={`h-2 w-2 rounded-full transition-transform ${color.dotClass} ${isSelected ? 'scale-125 ring-2 ring-white/20' : ''}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick suggestion tags if creating */}
                  {!initialEditingLink && !title && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Sugerencias Rápidas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickFill('github.com', 'GitHub')}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                        >
                          + GitHub
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickFill('news.ycombinator.com', 'Hacker News')}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                        >
                          + HackerNews
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickFill('reddit.com', 'Reddit')}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                        >
                          + Reddit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickFill('chatgpt.com', 'ChatGPT')}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                        >
                          + ChatGPT
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    type="submit"
                    className="w-full py-2 px-4 mt-1 rounded-md bg-white hover:bg-zinc-200 text-black font-bold text-[10px] uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5"
                    id="save-link-btn"
                  >
                    {initialEditingLink ? (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Guardar Cambios
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Agregar Sitio
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Links List Manager */}
              <div className="space-y-3.5">
                <h3 className="font-display text-[11px] uppercase tracking-widest text-white font-medium flex items-center justify-between">
                  <span>Listado de Sitios ({links.length})</span>
                  <span className="text-[10px] font-mono text-zinc-500">Orden</span>
                </h3>

                {links.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/5 rounded-md bg-white/[0.005]">
                    <Sparkles className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">No hay sitios.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {links.map((link, index) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-3 rounded-md bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-light text-zinc-200 truncate">{link.title}</p>
                          <p className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">{link.url}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onMoveLink(link.id, 'up')}
                            disabled={index === 0}
                            className={`p-1.5 rounded text-zinc-500 transition-colors ${
                              index === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 hover:text-zinc-200'
                            }`}
                            title="Subir"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onMoveLink(link.id, 'down')}
                            disabled={index === links.length - 1}
                            className={`p-1.5 rounded text-zinc-500 transition-colors ${
                              index === links.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 hover:text-zinc-200'
                            }`}
                            title="Bajar"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectEditLink && onSelectEditLink(link)}
                            className="p-1.5 rounded text-zinc-500 hover:bg-white/5 hover:text-amber-400 transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteLink(link.id)}
                            className="p-1.5 rounded text-zinc-500 hover:bg-white/5 hover:text-red-400 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer with user guidance */}
            <div className="p-4 bg-[#080808] border-t border-white/5 text-center">
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                Tip: Presiona el botón <span className="text-zinc-300 font-bold">Organizar</span> para editar ágilmente.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
