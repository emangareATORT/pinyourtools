import { LinkItem } from '../types';

/**
 * Generates a fully self-contained index.html file that represents the user's links and layout configuration.
 * It uses Tailwind CSS and Lucide Icons via CDN to deliver a pixel-perfect, responsive static copy
 * of their homepage which runs 100% client-side with offline capabilities.
 */
export function generateExportHtml(
  links: LinkItem[],
  currentViewMode: 'grid' | 'list' | 'groups' | 'dock',
  isSoberMode: boolean,
  currentTheme: string = 'dark'
): string {
  const linksJson = JSON.stringify(links, null, 2);

  return `<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pin Your Tools - Mi Inicio</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <!-- Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            zinc: {
              850: '#141417',
              900: '#0f0f12',
              950: '#070709',
            }
          },
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            serif: ['Playfair Display', 'Georgia', 'serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Custom Scrollbars */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(120, 120, 120, 0.15);
      border-radius: 99px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(120, 120, 120, 0.3);
    }
    
    /* Elegant transition animations */
    .fade-in {
      animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Theme specific override stylings */
    body.theme-dark {
      background-color: #080808;
      color: #f4f4f5;
    }
    body.theme-sepia {
      background-color: #fbf6eb;
      color: #433422;
    }
    body.theme-colorful {
      background-color: #09080e;
      color: #e9e3ff;
    }
    body.theme-newspaper {
      background-color: #faf9f6;
      color: #18181b;
    }
  </style>
</head>
<body class="h-full flex flex-col overflow-hidden select-none relative transition-all duration-300 theme-${currentTheme}">
  <!-- Theme Background Elements Overlay -->
  <div id="bg-grid-overlay" class="absolute inset-0 pointer-events-none z-0"></div>

  <!-- Main Container -->
  <div class="relative z-10 h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <header id="app-header" class="w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3 cursor-pointer group" onclick="window.location.reload()">
          <div id="logo-badge" class="w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-md">
            <i data-lucide="pin" class="w-4 h-4 rotate-[30deg]"></i>
          </div>
          <span id="logo-text" class="text-xs font-semibold tracking-[0.3em] uppercase">
            PIN YOUR TOOLS
          </span>
        </div>
      </div>

      <!-- Toolbar controls -->
      <div class="flex flex-wrap items-center justify-end gap-3">
        
        <!-- Theme Switcher (Working Live in static HTML!) -->
        <div id="theme-selectors-container" class="flex items-center rounded-md p-0.5">
          <button onclick="setTheme('dark')" id="btn-theme-dark" class="p-1.5 rounded transition-all duration-150" title="Tema Oscuro">
            <i data-lucide="moon" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="setTheme('sepia')" id="btn-theme-sepia" class="p-1.5 rounded transition-all duration-150" title="Tema Sepia">
            <i data-lucide="coffee" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="setTheme('colorful')" id="btn-theme-colorful" class="p-1.5 rounded transition-all duration-150" title="Tema Multicolor">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="setTheme('newspaper')" id="btn-theme-newspaper" class="p-1.5 rounded transition-all duration-150" title="Tema Periódico">
            <i data-lucide="newspaper" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Layout Modes -->
        <div id="layout-selectors-container" class="flex items-center rounded-md p-0.5">
          <button onclick="setViewMode('grid')" id="btn-mode-grid" class="p-1.5 rounded transition-all duration-150" title="Vista Cuadrícula">
            <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="setViewMode('list')" id="btn-mode-list" class="p-1.5 rounded transition-all duration-150" title="Vista Lista">
            <i data-lucide="list" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="setViewMode('groups')" id="btn-mode-groups" class="p-1.5 rounded transition-all duration-150" title="Vista Grupos">
            <i data-lucide="folder" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="setViewMode('dock')" id="btn-mode-dock" class="p-1.5 rounded transition-all duration-150" title="Vista Dock / Teclado">
            <i data-lucide="command" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Appearance controls (Sober mode) -->
        <div id="appearance-selectors-container" class="flex items-center rounded-md p-0.5">
          <button onclick="toggleSoberMode()" id="btn-sober" class="px-2.5 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5" title="Modo Sobrio">
            <i data-lucide="feather" class="w-3.5 h-3.5"></i>
            <span>Sobrio: <span id="sober-status" class="font-semibold">OFF</span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Local filtering search bar -->
    <div id="filter-bar" class="w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b shrink-0 gap-4">
      <div class="relative w-full max-w-xs">
        <i data-lucide="search" class="w-3.5 h-3.5 opacity-45 absolute left-2.5 top-1/2 -translate-y-1/2"></i>
        <input
          type="text"
          id="local-filter-input"
          oninput="handleLocalSearch(this.value)"
          placeholder="Filtrar mis accesos directos..."
          class="w-full bg-transparent pl-8 pr-3 text-xs focus:outline-none"
        />
      </div>
      
      <div id="stats-badge" class="text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span id="filtered-count" class="font-semibold">0</span> / <span id="total-count">0</span> accesos directos
      </div>
    </div>

    <!-- Main viewport -->
    <main class="flex-1 w-full overflow-hidden relative flex flex-col justify-between">
      <!-- Links content area -->
      <div id="content-container" class="w-full h-full p-4 md:p-8 flex justify-center items-center overflow-y-auto">
        <!-- Dynamic list of links injected here -->
      </div>
    </main>

    <!-- Footer -->
    <footer id="app-footer" class="w-full py-3 text-center shrink-0 border-t">
      <p class="text-[10px] font-mono tracking-wider opacity-50">
        By @emagnare Version 1.7
      </p>
    </footer>
  </div>

  <!-- Link data and Client-side dynamic logic -->
  <script>
    // Embedded link configuration
    const links = ${linksJson};
    
    // Application state
    let viewMode = '${currentViewMode}';
    let isSoberMode = ${isSoberMode};
    let theme = '${currentTheme}';
    let searchQuery = '';

    // Secure URL helper
    function getCleanUrl(url) {
      if (!url) return '#';
      if (url.toLowerCase().indexOf('http://') === 0 || url.toLowerCase().indexOf('https://') === 0) {
        return url;
      }
      return 'https://' + url;
    }

    // Clean domains for display
    function getDomainLabel(url) {
      try {
        const clean = getCleanUrl(url);
        const parsed = new URL(clean);
        return parsed.hostname.replace('www.', '').toLowerCase();
      } catch (e) {
        return 'sitio';
      }
    }

    // Get filtered list
    function getFilteredLinks() {
      if (!searchQuery.trim()) return links;
      const q = searchQuery.toLowerCase().trim();
      return links.filter(function(l) {
        return (l.title && l.title.toLowerCase().indexOf(q) !== -1) || 
               (l.url && l.url.toLowerCase().indexOf(q) !== -1) ||
               (l.category && l.category.toLowerCase().indexOf(q) !== -1);
      });
    }

    // Live Theme Switching Manager
    function setTheme(newTheme) {
      theme = newTheme;
      
      // Update body classes
      document.body.className = "h-full flex flex-col overflow-hidden select-none relative transition-all duration-300 theme-" + theme;
      
      const header = document.getElementById('app-header');
      const logoBadge = document.getElementById('logo-badge');
      const logoText = document.getElementById('logo-text');
      const bgOverlay = document.getElementById('bg-grid-overlay');
      const filterBar = document.getElementById('filter-bar');
      const statsBadge = document.getElementById('stats-badge');
      const footer = document.getElementById('app-footer');
      
      // Clear theme-specific helper classes first
      header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b";
      filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b shrink-0 gap-4";
      statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border";
      footer.className = "w-full py-3 text-center shrink-0 border-t";

      // Apply tailored theme classes
      if (theme === 'sepia') {
        header.classList.add('bg-[#f4ebd0]', 'border-[#dfd0b0]', 'text-[#433422]');
        filterBar.classList.add('bg-[#fbf6eb]/50', 'border-[#dfd0b0]');
        statsBadge.classList.add('bg-[#ebdcb9]/40', 'border-[#dfd0b0]', 'text-[#5c4a37]');
        footer.classList.add('bg-[#f4ebd0]/30', 'border-[#dfd0b0]', 'text-[#705d46]');
        
        logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-[#dfd0b0] border border-[#c5b18a] text-[#433422]";
        logoText.className = "text-xs font-semibold tracking-[0.3em] uppercase text-[#433422]";
        
        bgOverlay.className = "absolute inset-0 bg-[linear-gradient(to_right,rgba(67,52,34,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(67,52,34,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0";
      } 
      else if (theme === 'newspaper') {
        header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b-2 border-zinc-900 bg-[#faf9f6]";
        filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b border-zinc-300 shrink-0 gap-4 bg-[#faf9f6]";
        statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-zinc-900 bg-white text-zinc-900 font-bold";
        footer.className = "w-full py-3 text-center shrink-0 border-t border-zinc-300 bg-zinc-50 text-zinc-600";
        
        logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-zinc-900 border border-zinc-900 text-white";
        logoText.className = "text-xs font-bold tracking-[0.2em] uppercase font-serif text-zinc-900";
        
        bgOverlay.className = "absolute inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none z-0";
      } 
      else if (theme === 'colorful') {
        header.classList.add('bg-[#09080e]/95', 'border-indigo-950/60', 'text-purple-200/90');
        filterBar.classList.add('bg-indigo-950/10', 'border-indigo-900/10');
        statsBadge.classList.add('bg-indigo-950/20', 'border-indigo-900/25', 'text-indigo-300');
        footer.classList.add('bg-indigo-950/20', 'border-indigo-900/10', 'text-indigo-400');
        
        logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/40 text-indigo-400";
        logoText.className = "text-xs font-semibold tracking-[0.3em] uppercase text-indigo-200";
        
        bgOverlay.className = "absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0";
      } 
      else { // dark
        header.classList.add('bg-[#080808]/90', 'border-white/5', 'text-zinc-200');
        filterBar.classList.add('bg-[#060608]/50', 'border-white/[0.02]');
        statsBadge.classList.add('bg-white/[0.02]', 'border-white/[0.04]', 'text-zinc-400');
        footer.classList.add('bg-[#060608]/30', 'border-white/[0.03]', 'text-zinc-500');
        
        logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-zinc-900 border border-white/10 text-emerald-400";
        logoText.className = "text-xs font-semibold tracking-[0.3em] uppercase text-zinc-100";
        
        bgOverlay.className = "absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0";
      }

      // Sync active Theme selector classes
      const themes = ['dark', 'sepia', 'colorful', 'newspaper'];
      themes.forEach(t => {
        const btn = document.getElementById('btn-theme-' + t);
        if (btn) {
          if (t === theme) {
            if (theme === 'sepia') btn.className = "p-1.5 rounded bg-[#dfd0b0] text-[#433422] shadow-sm font-semibold border border-[#dfd0b0]";
            else if (theme === 'newspaper') btn.className = "p-1.5 rounded bg-zinc-900 text-white font-bold border border-zinc-900";
            else if (theme === 'colorful') btn.className = "p-1.5 rounded bg-indigo-600/20 text-purple-200 border border-indigo-500/30 shadow-sm";
            else btn.className = "p-1.5 rounded bg-white/10 text-white border border-white/10 shadow";
          } else {
            if (theme === 'sepia') btn.className = "p-1.5 rounded text-[#705d46] hover:text-[#433422] hover:bg-[#ebdcb9]/30 border border-transparent";
            else if (theme === 'newspaper') btn.className = "p-1.5 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent";
            else if (theme === 'colorful') btn.className = "p-1.5 rounded text-indigo-400 hover:text-purple-200 hover:bg-indigo-500/5 border border-transparent";
            else btn.className = "p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent";
          }
        }
      });

      // Update layout selector background wrapper styles
      const themeContainerClass = theme === 'sepia' 
        ? 'flex items-center bg-[#ebdcb9]/60 border border-[#dfd0b0] rounded-md p-0.5' 
        : theme === 'newspaper' 
        ? 'flex items-center bg-white border border-zinc-300 rounded-md p-0.5' 
        : theme === 'colorful' 
        ? 'flex items-center bg-indigo-950/20 border border-indigo-900/30 rounded-md p-0.5' 
        : 'flex items-center bg-white/5 border border-white/10 rounded-md p-0.5';

      document.getElementById('theme-selectors-container').className = themeContainerClass;
      document.getElementById('layout-selectors-container').className = themeContainerClass;
      document.getElementById('appearance-selectors-container').className = themeContainerClass;

      setViewMode(viewMode);
    }

    // Set layout view mode
    function setViewMode(mode) {
      viewMode = mode;
      
      const modes = ['grid', 'list', 'groups', 'dock'];
      modes.forEach(m => {
        const btn = document.getElementById('btn-mode-' + m);
        if (btn) {
          if (m === mode) {
            if (theme === 'sepia') btn.className = "p-1.5 rounded bg-[#dfd0b0] text-[#433422] font-semibold border border-[#dfd0b0]/50";
            else if (theme === 'newspaper') btn.className = "p-1.5 rounded bg-zinc-900 text-white font-bold border border-zinc-900";
            else if (theme === 'colorful') btn.className = "p-1.5 rounded bg-indigo-600/20 text-purple-200 border border-indigo-500/30 shadow-sm";
            else btn.className = "p-1.5 rounded bg-white/10 text-white border border-white/10 shadow-sm";
          } else {
            if (theme === 'sepia') btn.className = "p-1.5 rounded text-[#705d46] hover:text-[#433422]";
            else if (theme === 'newspaper') btn.className = "p-1.5 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100";
            else if (theme === 'colorful') btn.className = "p-1.5 rounded text-indigo-400 hover:text-purple-200";
            else btn.className = "p-1.5 rounded text-zinc-500 hover:text-zinc-300";
          }
        }
      });
      
      render();
    }

    // Toggle sober mode
    function toggleSoberMode() {
      isSoberMode = !isSoberMode;
      const btn = document.getElementById('btn-sober');
      const status = document.getElementById('sober-status');
      
      if (isSoberMode) {
        if (theme === 'sepia') btn.className = "px-2.5 py-1 rounded bg-[#dfd0b0] text-[#433422] border border-[#dfd0b0] text-[10px] uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-1.5";
        else if (theme === 'newspaper') btn.className = "px-2.5 py-1 rounded bg-zinc-900 text-white border border-zinc-900 text-[10px] uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-1.5";
        else if (theme === 'colorful') btn.className = "px-2.5 py-1 rounded bg-indigo-600/20 text-purple-200 border border-indigo-500/35 text-[10px] uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-1.5";
        else btn.className = "px-2.5 py-1 rounded bg-zinc-800 text-white border border-zinc-700 text-[10px] uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-1.5";
        status.textContent = "ON";
      } else {
        btn.className = "px-2.5 py-1 rounded text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 text-zinc-500 hover:text-current";
        status.textContent = "OFF";
      }
      
      render();
    }

    // Handle typing in filter bar
    function handleLocalSearch(val) {
      searchQuery = val;
      render();
    }

    // Global Key Listener for Dock Mode quick navigation
    window.addEventListener('keydown', (e) => {
      if (viewMode !== 'dock') return;
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      
      const filtered = getFilteredLinks();
      const key = e.key;
      
      const index = parseInt(key) - 1;
      if (index >= 0 && index < 9 && index < filtered.length) {
        e.preventDefault();
        const url = getCleanUrl(filtered[index].url);
        window.open(url, '_blank');
      }
    });

    // Helper to get card classes dynamically
    function getCardClass(presetColorClass) {
      if (isSoberMode) {
        if (theme === 'sepia') {
          return 'bg-[#ebdcb9]/40 border-[#dfd0b0] text-[#5c4a37] hover:text-[#433422] hover:bg-[#ebdcb9]/70';
        } else if (theme === 'newspaper') {
          return 'bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950 font-serif';
        } else if (theme === 'colorful') {
          return 'bg-indigo-950/15 border border-indigo-500/10 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-950/25';
        } else {
          return 'bg-white/[0.015] border-white/5 text-zinc-400 hover:text-zinc-300';
        }
      }

      if (theme === 'sepia') {
        return 'bg-[#ebdcb9]/40 hover:bg-[#ebdcb9]/70 border-[#dfd0b0] text-[#433422] hover:border-[#c5b18a] hover:shadow-md';
      } else if (theme === 'newspaper') {
        return 'bg-white border border-zinc-900 text-zinc-900 hover:bg-zinc-50 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 font-serif';
      } else if (theme === 'colorful') {
        return presetColorClass 
          ? presetColorClass + ' border-indigo-500/10'
          : 'bg-indigo-950/25 hover:bg-indigo-950/40 border border-indigo-500/25 text-purple-100 hover:border-indigo-400/50';
      } else { // dark
        return presetColorClass || 'bg-zinc-900/60 hover:bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-zinc-700 hover:shadow-md';
      }
    }

    function getMonogramClass() {
      if (theme === 'sepia') return 'bg-[#ebdcb9]/70 border-[#dfd0b0] text-[#433422]';
      if (theme === 'newspaper') return 'bg-zinc-100 border border-zinc-300 text-zinc-900 font-serif font-extrabold';
      if (theme === 'colorful') return 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-200';
      return 'bg-white/[0.02] border border-white/5 text-white/95';
    }

    function getFaviconWrapperClass() {
      if (theme === 'sepia') return 'bg-[#fbf6eb] border-[#dfd0b0]';
      if (theme === 'newspaper') return 'bg-white border border-zinc-300';
      if (theme === 'colorful') return 'bg-[#09080e] border border-indigo-500/30';
      return 'bg-[#080808] border border-white/10';
    }

    function getTitleColorClass() {
      if (theme === 'sepia') return 'text-[#433422]';
      if (theme === 'newspaper') return 'text-zinc-900 font-serif font-extrabold';
      if (theme === 'colorful') return 'text-purple-200';
      return 'text-white/95';
    }

    // Main render function
    function render() {
      const container = document.getElementById('content-container');
      const filtered = getFilteredLinks();
      
      // Update statistics
      const filteredCountEl = document.getElementById('filtered-count');
      const totalCountEl = document.getElementById('total-count');
      if (filteredCountEl) filteredCountEl.textContent = filtered.length;
      if (totalCountEl) totalCountEl.textContent = links.length;

      if (filtered.length === 0) {
        container.className = "w-full h-full p-6 flex flex-col items-center justify-center text-center";
        container.innerHTML = '<div class="fade-in max-w-xs">' +
            '<p class="text-sm font-medium">No se encontraron accesos directos</p>' +
            '<p class="text-xs mt-2 opacity-50">Prueba modificando tus filtros o de búsqueda.</p>' +
          '</div>';
        return;
      }

      if (viewMode === 'grid') {
        container.className = "w-full h-full p-2 md:p-6 overflow-y-auto flex items-start justify-center";
        
        let cardsHtml = '';
        filtered.forEach(function(link) {
          const cleanUrl = getCleanUrl(link.url);
          const domainLabel = getDomainLabel(link.url);
          const styleClass = getCardClass(link.color);
          const monogram = link.title ? link.title.charAt(0).toUpperCase() : '?';
          const faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain=" + domainLabel;
          
          cardsHtml += '<a href="' + cleanUrl + '" target="_blank" class="fade-in block rounded-xl border p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group overflow-hidden h-44 md:h-48 ' + styleClass + '">' +
              '<div class="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mb-3.5 rounded-md transition-all duration-300 ' + getMonogramClass() + ' group-hover:scale-105">' +
                '<span class="text-lg md:text-xl font-light select-none">' + monogram + '</span>' +
                '<div class="absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ' + getFaviconWrapperClass() + '">' +
                  '<img src="' + faviconUrl + '" alt="favicon" class="w-3.5 h-3.5 object-contain rounded" onerror="this.style.display=\'none\'" />' +
                '</div>' +
              '</div>' +
              '<div class="max-w-full px-1 text-center">' +
                '<h3 class="text-sm font-semibold tracking-tight leading-snug truncate ' + getTitleColorClass() + ' transition-colors">' + (link.title || 'Acceso Directo') + '</h3>' +
                '<p class="text-[9px] uppercase tracking-widest mt-1 truncate max-w-[140px] md:max-w-[180px] mx-auto opacity-60">' + getDomainLabel(link.url) + '</p>' +
              '</div>' +
              '<div class="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-60 transition-opacity">' +
                '<i data-lucide="external-link" class="w-3.5 h-3.5"></i>' +
              '</div>' +
            '</a>';
        });

        container.innerHTML = '<div class="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 content-start pb-8">' +
            cardsHtml +
          '</div>';
      } 
      else if (viewMode === 'list') {
        container.className = "w-full h-full p-2 md:p-6 overflow-y-auto flex items-start justify-center";
        
        let itemsHtml = '';
        filtered.forEach(function(link) {
          const cleanUrl = getCleanUrl(link.url);
          const domainLabel = getDomainLabel(link.url);
          const styleClass = getCardClass(link.color);
          const monogram = link.title ? link.title.charAt(0).toUpperCase() : '?';
          const faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain=" + domainLabel;
          
          itemsHtml += '<a href="' + cleanUrl + '" target="_blank" class="fade-in flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ' + styleClass + '">' +
              '<div class="flex items-center gap-3.5 min-w-0">' +
                '<div class="relative flex items-center justify-center w-9 h-9 rounded flex-shrink-0 border ' + getMonogramClass() + '">' +
                  '<span class="text-xs select-none font-bold">' + monogram + '</span>' +
                  '<div class="absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ' + getFaviconWrapperClass() + '">' +
                    '<img src="' + faviconUrl + '" alt="favicon" class="w-2.5 h-2.5 object-contain rounded" onerror="this.style.display=\'none\'" />' +
                  '</div>' +
                '</div>' +
                '<div class="truncate">' +
                  '<span class="text-xs font-semibold tracking-tight block truncate ' + getTitleColorClass() + ' transition-colors">' + (link.title || 'Acceso Directo') + '</span>' +
                  '<span class="text-[9px] font-mono block truncate mt-0.5 font-light opacity-55">' + link.url + '</span>' +
                '</div>' +
              '</div>' +
              '<i data-lucide="external-link" class="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 shrink-0 mr-1 transition-all"></i>' +
            '</a>';
        });

        container.innerHTML = '<div class="w-full max-w-3xl flex flex-col gap-2.5 pb-8">' +
            itemsHtml +
          '</div>';
      }
      else if (viewMode === 'groups') {
        container.className = "w-full h-full p-2 md:p-6 overflow-y-auto flex items-start justify-center";
        
        const groups = {};
        filtered.forEach(function(link) {
          const cat = (link.category && link.category.trim()) ? link.category.trim() : 'General';
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(link);
        });

        let groupsHtml = '';
        Object.keys(groups).sort().forEach(function(cat) {
          const catLinks = groups[cat];
          let groupCardsHtml = '';
          
          catLinks.forEach(function(link) {
            const cleanUrl = getCleanUrl(link.url);
            const domainLabel = getDomainLabel(link.url);
            const styleClass = getCardClass(link.color);
            const monogram = link.title ? link.title.charAt(0).toUpperCase() : '?';
            const faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain=" + domainLabel;
            
            groupCardsHtml += '<a href="' + cleanUrl + '" target="_blank" class="fade-in flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group ' + styleClass + '">' +
                '<div class="relative flex items-center justify-center w-8 h-8 rounded flex-shrink-0 border ' + getMonogramClass() + '">' +
                  '<span class="text-[10px] select-none font-bold">' + monogram + '</span>' +
                  '<div class="absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ' + getFaviconWrapperClass() + '">' +
                    '<img src="' + faviconUrl + '" alt="favicon" class="w-2.5 h-2.5 object-contain rounded" onerror="this.style.display=\'none\'" />' +
                  '</div>' +
                '</div>' +
                '<div class="truncate flex-1">' +
                  '<h4 class="text-xs font-semibold tracking-tight truncate ' + getTitleColorClass() + '">' + link.title + '</h4>' +
                '</div>' +
              '</a>';
          });

          const groupBorderClass = theme === 'newspaper' 
            ? 'border-zinc-950 border-b-2' 
            : theme === 'sepia' 
            ? 'border-[#dfd0b0] border-b' 
            : 'border-white/[0.05] border-b';

          const groupTitleClass = theme === 'newspaper' 
            ? 'text-xs font-bold uppercase tracking-wider text-zinc-900 font-serif' 
            : theme === 'sepia' 
            ? 'text-xs font-bold uppercase tracking-wider text-[#433422]' 
            : 'text-xs font-semibold uppercase tracking-wider text-zinc-400';

          groupsHtml += '<div class="space-y-3.5">' +
              '<div class="flex items-center gap-2 pb-2 ' + groupBorderClass + '">' +
                '<i data-lucide="folder" class="w-3.5 h-3.5 opacity-60"></i>' +
                '<h2 class="' + groupTitleClass + '">' + cat + '</h2>' +
                '<span class="px-2 py-0.5 rounded-full text-[8px] font-mono border ' + getMonogramClass() + '">' + catLinks.length + '</span>' +
              '</div>' +
              '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">' +
                groupCardsHtml +
              '</div>' +
            '</div>';
        });

        container.innerHTML = '<div class="w-full max-w-5xl space-y-8 pb-8">' +
            groupsHtml +
          '</div>';
      }
      else if (viewMode === 'dock') {
        container.className = "w-full h-full p-2 md:p-6 flex flex-col items-center justify-center";
        
        let dockItemsHtml = '';
        const limit10 = filtered.slice(0, 10);
        
        limit10.forEach(function(link, idx) {
          const cleanUrl = getCleanUrl(link.url);
          const domainLabel = getDomainLabel(link.url);
          const styleClass = getCardClass(link.color);
          const monogram = link.title ? link.title.charAt(0).toUpperCase() : '?';
          const faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain=" + domainLabel;
          const keyNum = idx < 9 ? (idx + 1) : 0;
          
          dockItemsHtml += '<a href="' + cleanUrl + '" target="_blank" class="fade-in block w-24 h-24 md:w-28 md:h-28 rounded-xl border p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group overflow-hidden text-center ' + styleClass + '">' +
              '<div class="relative flex items-center justify-center w-10 h-10 rounded border ' + getMonogramClass() + '">' +
                '<span class="text-xs select-none font-bold">' + monogram + '</span>' +
                '<div class="absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ' + getFaviconWrapperClass() + '">' +
                  '<img src="' + faviconUrl + '" alt="favicon" class="w-2.5 h-2.5 object-contain rounded" onerror="this.style.display=\'none\'" />' +
                '</div>' +
              '</div>' +
              '<span class="mt-2 text-[10px] font-semibold truncate w-full px-1 ' + getTitleColorClass() + '">' + (link.title || 'Acceso') + '</span>' +
              '<div class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-mono border ' + getMonogramClass() + '">' +
                keyNum +
              '</div>' +
            '</a>';
        });

        const dockNoticeClass = theme === 'sepia'
          ? 'mt-6 text-[10px] font-mono text-center max-w-sm shrink-0 leading-relaxed bg-[#ebdcb9]/40 border border-[#dfd0b0] p-3 rounded-lg text-[#5c4a37]'
          : theme === 'newspaper'
          ? 'mt-6 text-[10px] font-mono text-center max-w-sm shrink-0 leading-relaxed bg-white border border-zinc-900 p-3 rounded-lg text-zinc-900 font-serif font-bold'
          : 'mt-6 text-[10px] font-mono text-center max-w-sm shrink-0 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg text-zinc-500';

        container.innerHTML = '<div class="flex-1 flex items-center justify-center p-4">' +
            '<div class="w-full max-w-4xl flex flex-wrap items-center justify-center gap-4">' +
              dockItemsHtml +
            '</div>' +
          '</div>' +
          '<div class="' + dockNoticeClass + '">' +
            '<span class="opacity-80 font-bold uppercase tracking-wider block mb-1">Muelle de Teclado Activo</span>' +
            'Presiona las teclas <kbd class="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 text-[9px] shadow">1</kbd> al <kbd class="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 text-[9px] shadow">9</kbd> para navegar instantáneamente.' +
          '</div>';
      }

      // Re-create icons dynamically
      if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
    }

    // Trigger Initial Theme styling & layout state
    setTheme(theme);
  </script>
</body>
</html>`;
}
