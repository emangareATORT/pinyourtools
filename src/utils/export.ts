import { LinkItem } from '../types';

/**
 * Generates a fully self-contained index.html file that represents the user's links and layout configuration.
 * It uses Tailwind CSS and Lucide Icons via CDN to deliver a pixel-perfect, responsive static copy
 * of their homepage which runs 100% client-side with offline capabilities.
 */
export function generateExportHtml(
  links: LinkItem[],
  currentViewMode: 'grid' | 'list' | 'groups' | 'dock' | 'compact-groups',
  isSoberMode: boolean,
  currentTheme: string = 'dark',
  defaultBgBrightness: number = 9
): string {
  const safeLinks = links || [];
  
  // High-reliability strategy: serialize to Base64 to avoid quotes, backslashes, HTML brackets, or template literal conflicts!
  let base64Links = '';
  try {
    const jsonStr = JSON.stringify(safeLinks);
    base64Links = btoa(unescape(encodeURIComponent(jsonStr)));
  } catch (err) {
    console.error("Failed to encode links to base64:", err);
  }

  const safeIsSoberMode = !!isSoberMode;
  const safeViewMode = currentViewMode || 'grid';
  const safeTheme = currentTheme || 'dark';

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
  <script src="https://unpkg.com/lucide@latest" onload="if(window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons()"></script>
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

    /* Theme-specific custom input/placeholder styling */
    body.theme-dark input {
      color: #f4f4f5;
    }
    body.theme-dark input::placeholder {
      color: rgba(161, 161, 170, 0.4);
    }
    body.theme-sepia input {
      color: #433422;
    }
    body.theme-sepia input::placeholder {
      color: rgba(112, 93, 70, 0.5);
    }
    body.theme-colorful input {
      color: #e9e3ff;
    }
    body.theme-colorful input::placeholder {
      color: rgba(129, 140, 248, 0.4);
    }
    body.theme-newspaper input {
      color: #18181b;
      font-family: ui-serif, Georgia, serif;
    }
    body.theme-newspaper input::placeholder {
      color: rgba(113, 113, 122, 0.5);
    }
  </style>
</head>
<body class="h-full flex flex-col overflow-hidden select-none relative transition-all duration-300 theme-${safeTheme}">
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

        <!-- Background Brightness Selector (Working Live in static HTML!) -->
        <div id="brightness-selectors-container" class="flex items-center rounded-md p-1 px-2.5 gap-2">
          <i data-lucide="contrast" class="w-3.5 h-3.5 opacity-65 shrink-0"></i>
          <input
            type="range"
            min="1"
            max="10"
            id="brightness-range"
            oninput="handleBrightnessChange(parseInt(this.value, 10))"
            class="w-16 sm:w-20 h-1 rounded-lg appearance-none cursor-pointer"
            title="Ajustar tono de fondo (1 = Blanco, 10 = Negro)"
          />
          <span id="brightness-value" class="text-[10px] font-mono font-bold min-w-[12px] text-center">9</span>
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
          <button onclick="setViewMode('compact-groups')" id="btn-mode-compact-groups" class="p-1.5 rounded transition-all duration-150" title="Vista Grupos Compacta">
            <i data-lucide="folder-open" class="w-3.5 h-3.5"></i>
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
        By @emagnare Version 2.0
      </p>
    </footer>
  </div>

  <!-- Link data and Client-side dynamic logic -->
  <script>
    // Safe HTML Escape Helper to prevent layout breaks, script injection, and quote issues
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // Embedded link configuration safely decoded from high-reliability Base64 encoding
    let links = [];
    try {
      const base64Data = "${base64Links}";
      if (base64Data) {
        const decodedJson = decodeURIComponent(escape(atob(base64Data)));
        links = JSON.parse(decodedJson || '[]');
      }
    } catch (err) {
      console.error("Error decoding or parsing embedded links JSON:", err);
    }
    
    // Application state with resilient localStorage error handling (handles restricted iframe environments)
    let viewMode = '${safeViewMode}';
    let isSoberMode = ${safeIsSoberMode};
    let theme = '${safeTheme}';
    let searchQuery = '';

    const THEME_BACKGROUNDS = {
      sepia: {
        1: '#ffffff',
        2: '#fdfcf7',
        3: '#fcf9f1',
        4: '#fbf6eb', // original sepia
        5: '#f4e9d5',
        6: '#ead5b3',
        7: '#d1b68a',
        8: '#9e8055',
        9: '#433422',
        10: '#000000',
      },
      newspaper: {
        1: '#ffffff',
        2: '#fcfcfc',
        3: '#faf9f6', // original newspaper
        4: '#eaeae3',
        5: '#dbdad2',
        6: '#bcbbb3',
        7: '#9c9b93',
        8: '#5c5b55',
        9: '#18181b',
        10: '#000000',
      },
      colorful: {
        1: '#ffffff',
        2: '#f8fafc', // original colorful
        3: '#f1f5f9',
        4: '#cbd5e1',
        5: '#94a3b8',
        6: '#64748b',
        7: '#475569',
        8: '#1e293b',
        9: '#0f172a',
        10: '#000000',
      },
      dark: {
        1: '#ffffff',
        2: '#f4f4f5',
        3: '#d4d4d8',
        4: '#a1a1aa',
        5: '#71717a',
        6: '#3f3f46',
        7: '#27272a',
        8: '#18181b',
        9: '#080808', // original dark
        10: '#000000',
      }
    };

    const getThemeDefaultBrightness = (t) => {
      switch (t) {
        case 'sepia': return 4;
        case 'newspaper': return 3;
        case 'colorful': return 2;
        case 'dark': default: return 9;
      }
    };

    let bgBrightness = ${defaultBgBrightness};

    try {
      const storedViewMode = localStorage.getItem('homepage_view_mode');
      if (storedViewMode) viewMode = storedViewMode;
      
      const storedSoberMode = localStorage.getItem('homepage_sober_mode');
      if (storedSoberMode !== null) {
        isSoberMode = storedSoberMode === 'true';
      }
      
      const storedTheme = localStorage.getItem('homepage_theme');
      if (storedTheme) theme = storedTheme;

      const storedBrightness = localStorage.getItem('homepage_bg_brightness');
      if (storedBrightness) bgBrightness = parseInt(storedBrightness, 10);
    } catch (e) {
      console.warn("Storage access restricted. Proceeding with in-memory state fallback.", e);
    }

    // Secure URL helper
    function getCleanUrl(url) {
      if (!url) return '#';
      const strUrl = String(url).trim();
      if (strUrl.toLowerCase().indexOf('http://') === 0 || strUrl.toLowerCase().indexOf('https://') === 0) {
        return strUrl;
      }
      return 'https://' + strUrl;
    }

    // Clean domains for display
    function getDomainLabel(url) {
      try {
        if (!url) return 'sitio';
        const clean = getCleanUrl(url);
        const parsed = new URL(clean);
        return parsed.hostname.replace('www.', '').toLowerCase();
      } catch (e) {
        return 'sitio';
      }
    }

    // Get filtered list
    function getFilteredLinks() {
      try {
        const validLinks = (links || []).filter(function(l) { return l !== null && l !== undefined; });
        if (!searchQuery.trim()) return validLinks;
        const q = searchQuery.toLowerCase().trim();
        return validLinks.filter(function(l) {
          const title = l.title ? String(l.title).toLowerCase() : '';
          const url = l.url ? String(l.url).toLowerCase() : '';
          const category = l.category ? String(l.category).toLowerCase() : '';
          return title.indexOf(q) !== -1 || url.indexOf(q) !== -1 || category.indexOf(q) !== -1;
        });
      } catch (err) {
        console.error("Error in getFilteredLinks:", err);
        return [];
      }
    }

    // Live Theme Switching Manager
    function setTheme(newTheme) {
      try {
        theme = newTheme;
        try {
          localStorage.setItem('homepage_theme', theme);
        } catch (e) {}
        
        const isDark = bgBrightness >= 6;
        
        // Update body classes and inline background color
        document.body.className = "h-full flex flex-col overflow-hidden select-none relative transition-all duration-300 theme-" + theme + (isDark ? " is-dark" : " is-light");
        document.body.style.backgroundColor = THEME_BACKGROUNDS[theme][bgBrightness];
        
        const header = document.getElementById('app-header');
        const logoBadge = document.getElementById('logo-badge');
        const logoText = document.getElementById('logo-text');
        const bgOverlay = document.getElementById('bg-grid-overlay');
        const filterBar = document.getElementById('filter-bar');
        const statsBadge = document.getElementById('stats-badge');
        const footer = document.getElementById('app-footer');
        
        // Clear theme-specific helper classes first
        if (header) header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b";
        if (filterBar) filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b shrink-0 gap-4";
        if (statsBadge) statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border";
        if (footer) footer.className = "w-full py-3 text-center shrink-0 border-t";

        // Apply tailored theme classes
        if (theme === 'sepia') {
          if (isDark) {
            if (header) header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b bg-[#433422]/90 border-[#5c4a37] text-[#fcf9f1]";
            if (filterBar) filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b shrink-0 gap-4 bg-black/20 border-[#5c4a37]/50 text-[#fcf9f1]";
            if (statsBadge) statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border bg-black/20 border-[#5c4a37]/50 text-[#fcf9f1]/80";
            if (footer) footer.className = "w-full py-3 text-center shrink-0 border-t border-[#5c4a37] bg-black/10 text-[#fcf9f1]/60";
            if (logoBadge) logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-[#5c4a37] border border-[#5c4a37] text-[#fcf9f1]";
            if (logoText) logoText.className = "text-xs font-semibold tracking-[0.3em] uppercase text-[#fcf9f1]";
          } else {
            if (header) header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b bg-[#f4ebd0]/90 border-[#dfd0b0] text-[#433422]";
            if (filterBar) filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b shrink-0 gap-4 bg-[#fbf6eb]/50 border-[#dfd0b0] text-[#433422]";
            if (statsBadge) statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border bg-[#ebdcb9]/40 border-[#dfd0b0] text-[#5c4a37]";
            if (footer) footer.className = "w-full py-3 text-center shrink-0 border-t border-[#dfd0b0] bg-[#fbf6eb]/50 text-[#705d46]/75";
            if (logoBadge) logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-[#dfd0b0] border border-[#c5b18a] text-[#433422]";
            if (logoText) logoText.className = "text-xs font-semibold tracking-[0.3em] uppercase text-[#433422]";
          }
          if (bgOverlay) bgOverlay.className = "absolute inset-0 bg-[linear-gradient(to_right,rgba(67,52,34,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(67,52,34,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0";
        } 
        else if (theme === 'newspaper') {
          if (isDark) {
            if (header) header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b bg-zinc-950/90 border-zinc-850 text-zinc-100 font-serif";
            if (filterBar) filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b shrink-0 gap-4 bg-zinc-900/60 border-zinc-850 text-zinc-100 font-serif";
            if (statsBadge) statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border bg-zinc-900 border-zinc-800 text-zinc-100 font-bold";
            if (footer) footer.className = "w-full py-3 text-center shrink-0 border-t border-zinc-850 bg-black/30 text-zinc-400 font-sans";
            if (logoBadge) logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-zinc-100 text-zinc-950";
            if (logoText) logoText.className = "text-xs font-bold tracking-[0.2em] uppercase font-serif text-zinc-100";
          } else {
            if (header) header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b-2 border-zinc-900 bg-[#faf9f6] text-zinc-900 font-serif";
            if (filterBar) filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b border-zinc-300 shrink-0 gap-4 bg-[#faf9f6] text-zinc-900 font-serif";
            if (statsBadge) statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border border-zinc-900 bg-white text-zinc-900 font-bold";
            if (footer) footer.className = "w-full py-3 text-center shrink-0 border-t border-zinc-900 bg-white/50 text-zinc-500 font-sans";
            if (logoBadge) logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-zinc-900 border border-zinc-900 text-white";
            if (logoText) logoText.className = "text-xs font-bold tracking-[0.2em] uppercase font-serif text-zinc-900";
          }
          if (bgOverlay) bgOverlay.className = "absolute inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none z-0";
        } 
        else if (theme === 'colorful') {
          if (isDark) {
            if (header) header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b bg-[#0f172a]/90 border-indigo-950 text-purple-100";
            if (filterBar) filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b shrink-0 gap-4 bg-slate-900/60 border-slate-850 text-purple-100";
            if (statsBadge) statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border bg-indigo-950/20 border-indigo-900/25 text-indigo-350";
            if (footer) footer.className = "w-full py-3 text-center shrink-0 border-t border-indigo-950 bg-black/30 text-indigo-400 font-sans";
            if (logoBadge) logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/40 text-indigo-400";
            if (logoText) logoText.className = "text-xs font-semibold tracking-[0.3em] uppercase text-indigo-200";
          } else {
            if (header) header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b bg-white/70 border-slate-200 text-slate-800 backdrop-blur-md";
            if (filterBar) filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b border-slate-200 shrink-0 gap-4 bg-[#f8fafc]/50 text-slate-800";
            if (statsBadge) statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-200 bg-white text-slate-600";
            if (footer) footer.className = "w-full py-3 text-center shrink-0 border-t border-slate-200 bg-white/50 text-slate-500 font-sans";
            if (logoBadge) logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-gradient-to-br from-rose-400 to-amber-300 border border-amber-200 text-white shadow-sm";
            if (logoText) logoText.className = "text-xs font-semibold tracking-[0.3em] uppercase text-slate-700";
          }
          if (bgOverlay) bgOverlay.className = "absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0";
        } 
        else { // dark
          if (isDark) {
            if (header) header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b bg-[#080808]/90 border-white/5 text-zinc-100";
            if (filterBar) filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b shrink-0 gap-4 bg-[#060608]/50 border-white/[0.02] text-zinc-100";
            if (statsBadge) statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border bg-white/[0.02] border-white/[0.04] text-zinc-400";
            if (footer) footer.className = "w-full py-3 text-center shrink-0 border-t border-white/5 bg-black/20 text-zinc-500";
            if (logoBadge) logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-zinc-900 border border-white/10 text-emerald-400";
            if (logoText) logoText.className = "text-xs font-semibold tracking-[0.3em] uppercase text-zinc-100";
          } else {
            if (header) header.className = "w-full min-h-[72px] flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-5 pb-4 md:py-4 gap-4 shrink-0 transition-colors duration-300 border-b bg-white/90 border-zinc-200 text-zinc-900";
            if (filterBar) filterBar.className = "w-full px-6 md:px-10 py-2.5 flex items-center justify-between border-b shrink-0 gap-4 bg-zinc-50 border-zinc-200 text-zinc-900";
            if (statsBadge) statsBadge.className = "text-[10px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded border border-zinc-200 bg-white text-zinc-600";
            if (footer) footer.className = "w-full py-3 text-center shrink-0 border-t border-zinc-200 bg-white/50 text-zinc-500 font-sans";
            if (logoBadge) logoBadge.className = "w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-white border border-zinc-200 text-zinc-800";
            if (logoText) logoText.className = "text-xs font-semibold tracking-[0.3em] uppercase text-zinc-800";
          }
          if (bgOverlay) bgOverlay.className = "absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0";
        }

        // Sync active Theme selector classes
        const themes = ['dark', 'sepia', 'colorful', 'newspaper'];
        themes.forEach(t => {
          const btn = document.getElementById('btn-theme-' + t);
          if (btn) {
            if (t === theme) {
              if (theme === 'sepia') btn.className = "p-1.5 rounded bg-[#5c4a37] text-white shadow-sm font-semibold border border-[#5c4a37]";
              else if (theme === 'newspaper') btn.className = isDark ? "p-1.5 rounded bg-zinc-100 text-zinc-950 font-bold border border-zinc-100 shadow" : "p-1.5 rounded bg-zinc-900 text-white font-bold border border-zinc-900 shadow";
              else if (theme === 'colorful') btn.className = isDark ? "p-1.5 rounded bg-indigo-600/35 text-purple-100 border border-indigo-500/35 shadow-sm" : "p-1.5 rounded bg-white text-slate-800 font-semibold border border-slate-200 shadow-sm";
              else btn.className = isDark ? "p-1.5 rounded bg-white/10 text-white border border-white/10 shadow" : "p-1.5 rounded bg-black/10 text-black border border-black/10 shadow";
            } else {
              if (theme === 'sepia') btn.className = isDark ? "p-1.5 rounded text-[#fcf9f1]/65 hover:text-white hover:bg-[#5c4a37]/35 border border-transparent" : "p-1.5 rounded text-[#705d46] hover:text-[#433422] hover:bg-[#ebdcb9]/30 border border-transparent";
              else if (theme === 'newspaper') btn.className = isDark ? "p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-transparent" : "p-1.5 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent";
              else if (theme === 'colorful') btn.className = isDark ? "p-1.5 rounded text-indigo-400 hover:text-purple-200 hover:bg-indigo-500/5 border border-transparent" : "p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200/40 border border-transparent";
              else btn.className = isDark ? "p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent" : "p-1.5 rounded text-zinc-500 hover:text-zinc-800 hover:bg-black/5 border border-transparent";
            }
          }
        });

        // Update layout selector background wrapper styles
        const themeContainerClass = (theme === 'sepia')
          ? (isDark ? 'flex items-center bg-black/20 border border-[#5c4a37]/50 rounded-md p-0.5' : 'flex items-center bg-[#ebdcb9]/60 border border-[#dfd0b0] rounded-md p-0.5')
          : (theme === 'newspaper')
          ? (isDark ? 'flex items-center bg-zinc-900/60 border border-zinc-800 rounded-md p-0.5' : 'flex items-center bg-white border border-zinc-300 rounded-md p-0.5')
          : (theme === 'colorful')
          ? (isDark ? 'flex items-center bg-slate-900/60 border border-slate-850 rounded-md p-0.5' : 'flex items-center bg-slate-100 border border-slate-200/80 rounded-md p-0.5')
          : (isDark ? 'flex items-center bg-white/5 border border-white/10 rounded-md p-0.5' : 'flex items-center bg-black/5 border border-black/10 rounded-md p-0.5');

        const themeSelectors = document.getElementById('theme-selectors-container');
        const layoutSelectors = document.getElementById('layout-selectors-container');
        const appearanceSelectors = document.getElementById('appearance-selectors-container');
        const brightnessSelectors = document.getElementById('brightness-selectors-container');

        if (themeSelectors) themeSelectors.className = themeContainerClass;
        if (layoutSelectors) layoutSelectors.className = themeContainerClass;
        if (appearanceSelectors) appearanceSelectors.className = themeContainerClass;
        if (brightnessSelectors) brightnessSelectors.className = themeContainerClass;

        // Sync brightness inputs
        const rangeInput = document.getElementById('brightness-range');
        if (rangeInput) {
          rangeInput.value = bgBrightness;
          if (theme === 'sepia') {
            rangeInput.className = "w-16 sm:w-20 h-1 rounded-lg appearance-none cursor-pointer bg-[#dfd0b0]";
          } else if (theme === 'newspaper') {
            rangeInput.className = "w-16 sm:w-20 h-1 rounded-lg appearance-none cursor-pointer bg-zinc-300";
          } else if (theme === 'colorful') {
            rangeInput.className = "w-16 sm:w-20 h-1 rounded-lg appearance-none cursor-pointer bg-slate-200";
          } else {
            rangeInput.className = "w-16 sm:w-20 h-1 rounded-lg appearance-none cursor-pointer bg-zinc-800";
          }
        }
        const valSpan = document.getElementById('brightness-value');
        if (valSpan) valSpan.innerText = bgBrightness;

        setViewMode(viewMode);
      } catch (err) {
        console.error("Error in setTheme:", err);
      }
    }

    function handleBrightnessChange(level) {
      bgBrightness = level;
      try {
        localStorage.setItem('homepage_bg_brightness', bgBrightness);
      } catch (e) {}
      setTheme(theme);
    }

    // Set layout view mode
    function setViewMode(mode) {
      try {
        viewMode = mode;
        try {
          localStorage.setItem('homepage_view_mode', viewMode);
        } catch (e) {}
        
        const modes = ['grid', 'list', 'groups', 'compact-groups', 'dock'];
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
      } catch (err) {
        console.error("Error in setViewMode:", err);
      }
    }

    // Toggle sober mode
    function toggleSoberMode() {
      try {
        isSoberMode = !isSoberMode;
        try {
          localStorage.setItem('homepage_sober_mode', isSoberMode ? 'true' : 'false');
        } catch (e) {}
        render();
      } catch (err) {
        console.error("Error in toggleSoberMode:", err);
      }
    }

    // Handle typing in filter bar
    function handleLocalSearch(val) {
      try {
        searchQuery = val;
        render();
      } catch (err) {
        console.error("Error in handleLocalSearch:", err);
      }
    }

    // Global Key Listener for Dock Mode quick navigation
    window.addEventListener('keydown', (e) => {
      if (viewMode !== 'dock') return;
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
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
        return presetColorClass
          ? presetColorClass.replace(/bg-rose-400\/\[0\.04\]/g, 'bg-rose-900/10')
                            .replace(/border-rose-300\/15/g, 'border-[#dfd0b0]')
                            .replace(/text-rose-200/g, 'text-rose-950')
                            .replace(/bg-emerald-400\/\[0\.04\]/g, 'bg-emerald-900/10')
                            .replace(/border-emerald-300\/15/g, 'border-[#dfd0b0]')
                            .replace(/text-emerald-200/g, 'text-emerald-950')
                            .replace(/bg-sky-400\/\[0\.04\]/g, 'bg-sky-900/10')
                            .replace(/border-sky-300\/15/g, 'border-[#dfd0b0]')
                            .replace(/text-sky-200/g, 'text-sky-950')
                            .replace(/bg-zinc-900\/40/g, 'bg-[#ebdcb9]/40')
                            .replace(/border-zinc-800\/50/g, 'border-[#dfd0b0]')
                            .replace(/text-zinc-350/g, 'text-[#5c4a37]')
                            .replace(/hover:text-zinc-100/g, 'hover:text-[#433422]')
            + ' shadow-sm hover:bg-[#ebdcb9]/60 hover:border-[#c5b18a]'
          : 'bg-[#ebdcb9]/40 hover:bg-[#ebdcb9]/70 border-[#dfd0b0] text-[#433422] hover:border-[#c5b18a] hover:shadow-md';
      } else if (theme === 'newspaper') {
        return 'bg-white border border-zinc-900 text-zinc-900 hover:bg-zinc-50 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 font-serif';
      } else if (theme === 'colorful') {
        return presetColorClass 
          ? presetColorClass + ' hover:border-indigo-400/40'
          : 'bg-indigo-950/25 hover:bg-indigo-950/40 border border-indigo-500/25 text-purple-100 hover:border-indigo-400/50';
      } else { // dark
        return presetColorClass || 'bg-zinc-900/60 hover:bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-zinc-700 hover:shadow-md';
      }
    }

    function getMonogramClass() {
      if (theme === 'sepia') return 'bg-[#ebdcb9]/70 border border-[#dfd0b0] text-[#433422]';
      if (theme === 'newspaper') return 'bg-zinc-100 border border-zinc-300 text-zinc-900 font-serif font-extrabold';
      if (theme === 'colorful') return 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-200';
      return 'bg-white/[0.02] border border-white/5 text-white/95';
    }

    function getFaviconWrapperClass() {
      if (theme === 'sepia') return 'bg-[#fbf6eb] border border-[#dfd0b0]';
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
      if (!container) return;
      const filtered = getFilteredLinks();
      
      // Sync Sober Mode button class and label text under all circumstances
      const btnSober = document.getElementById('btn-sober');
      const statusSober = document.getElementById('sober-status');
      if (btnSober && statusSober) {
        if (isSoberMode) {
          if (theme === 'sepia') btnSober.className = "px-2.5 py-1.5 rounded bg-[#dfd0b0] text-[#433422] border border-[#dfd0b0]/50 text-[10px] uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-1.5";
          else if (theme === 'newspaper') btnSober.className = "px-2.5 py-1.5 rounded bg-zinc-900 text-white border border-zinc-900 text-[10px] uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-1.5";
          else if (theme === 'colorful') btnSober.className = "px-2.5 py-1.5 rounded bg-indigo-600/20 text-purple-200 border border-indigo-500/35 text-[10px] uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-1.5";
          else btnSober.className = "px-2.5 py-1.5 rounded bg-zinc-800 text-white border border-zinc-700 text-[10px] uppercase tracking-wider font-semibold transition-all duration-200 flex items-center gap-1.5";
          statusSober.textContent = "ON";
        } else {
          if (theme === 'sepia') btnSober.className = "px-2.5 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 text-[#705d46] hover:text-[#433422] hover:bg-[#ebdcb9]/30";
          else if (theme === 'newspaper') btnSober.className = "px-2.5 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100";
          else if (theme === 'colorful') btnSober.className = "px-2.5 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 text-indigo-450 hover:text-purple-200 hover:bg-indigo-500/5";
          else btnSober.className = "px-2.5 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-white/5";
          statusSober.textContent = "OFF";
        }
      }

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
          
          cardsHtml += '<a href="' + escapeHtml(cleanUrl) + '" target="_blank" class="fade-in block rounded-xl border p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group overflow-hidden h-44 md:h-48 ' + styleClass + '">' +
              '<div class="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mb-3.5 rounded-md transition-all duration-300 ' + getMonogramClass() + ' group-hover:scale-105">' +
                '<span class="text-lg md:text-xl font-light select-none">' + escapeHtml(monogram) + '</span>' +
                '<div class="absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ' + getFaviconWrapperClass() + '">' +
                  '<img src="' + escapeHtml(faviconUrl) + '" alt="favicon" class="w-3.5 h-3.5 object-contain rounded" onerror="this.style.display=\'none\'" />' +
                '</div>' +
              '</div>' +
              '<div class="max-w-full px-1 text-center">' +
                '<h3 class="text-sm font-semibold tracking-tight leading-snug truncate ' + getTitleColorClass() + ' transition-colors">' + escapeHtml(link.title || 'Acceso Directo') + '</h3>' +
                '<p class="text-[9px] uppercase tracking-widest mt-1 truncate max-w-[140px] md:max-w-[180px] mx-auto opacity-60">' + escapeHtml(domainLabel) + '</p>' +
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
          
          itemsHtml += '<a href="' + escapeHtml(cleanUrl) + '" target="_blank" class="fade-in flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ' + styleClass + '">' +
              '<div class="flex items-center gap-3.5 min-w-0">' +
                '<div class="relative flex items-center justify-center w-9 h-9 rounded flex-shrink-0 border ' + getMonogramClass() + '">' +
                  '<span class="text-xs select-none font-bold">' + escapeHtml(monogram) + '</span>' +
                  '<div class="absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ' + getFaviconWrapperClass() + '">' +
                    '<img src="' + escapeHtml(faviconUrl) + '" alt="favicon" class="w-2.5 h-2.5 object-contain rounded" onerror="this.style.display=\'none\'" />' +
                  '</div>' +
                '</div>' +
                '<div class="truncate">' +
                  '<span class="text-xs font-semibold tracking-tight block truncate ' + getTitleColorClass() + ' transition-colors">' + escapeHtml(link.title || 'Acceso Directo') + '</span>' +
                  '<span class="text-[9px] font-mono block truncate mt-0.5 font-light opacity-55">' + escapeHtml(link.url) + '</span>' +
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
            
            groupCardsHtml += '<a href="' + escapeHtml(cleanUrl) + '" target="_blank" class="fade-in flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group ' + styleClass + '">' +
                '<div class="relative flex items-center justify-center w-8 h-8 rounded flex-shrink-0 border ' + getMonogramClass() + '">' +
                  '<span class="text-[10px] select-none font-bold">' + escapeHtml(monogram) + '</span>' +
                  '<div class="absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ' + getFaviconWrapperClass() + '">' +
                    '<img src="' + escapeHtml(faviconUrl) + '" alt="favicon" class="w-2.5 h-2.5 object-contain rounded" onerror="this.style.display=\'none\'" />' +
                  '</div>' +
                '</div>' +
                '<div class="truncate flex-1">' +
                  '<h4 class="text-xs font-semibold tracking-tight truncate ' + getTitleColorClass() + '">' + escapeHtml(link.title || 'Acceso Directo') + '</h4>' +
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
                '<h2 class="' + groupTitleClass + '">' + escapeHtml(cat) + '</h2>' +
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
      else if (viewMode === 'compact-groups') {
        container.className = "w-full h-full p-2 md:p-4 overflow-y-auto flex items-start justify-center";
        
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
            
            groupCardsHtml += '<a href="' + escapeHtml(cleanUrl) + '" target="_blank" class="fade-in flex items-center gap-2 p-1.5 rounded-md border transition-all duration-200 group ' + styleClass + '">' +
                '<div class="relative flex items-center justify-center w-6 h-6 rounded flex-shrink-0 border ' + getMonogramClass() + '">' +
                  '<span class="text-[9px] select-none font-bold">' + escapeHtml(monogram) + '</span>' +
                  '<div class="absolute -bottom-0.5 -right-0.5 p-0.5 rounded shadow flex items-center justify-center border ' + getFaviconWrapperClass() + '">' +
                    '<img src="' + escapeHtml(faviconUrl) + '" alt="favicon" class="w-2.5 h-2.5 object-contain rounded" onerror="this.style.display=\'none\'" />' +
                  '</div>' +
                '</div>' +
                '<div class="truncate flex-1">' +
                  '<h4 class="text-[11px] font-semibold leading-tight tracking-tight truncate ' + getTitleColorClass() + '">' + escapeHtml(link.title || 'Acceso Directo') + '</h4>' +
                '</div>' +
              '</a>';
          });

          const groupBorderClass = theme === 'newspaper' 
            ? 'border-zinc-950 border-b' 
            : theme === 'sepia' 
            ? 'border-[#dfd0b0] border-b' 
            : 'border-white/[0.05] border-b';

          const groupTitleClass = theme === 'newspaper' 
            ? 'text-[10px] font-bold uppercase tracking-wider text-zinc-900 font-serif' 
            : theme === 'sepia' 
            ? 'text-[10px] font-bold uppercase tracking-wider text-[#433422]' 
            : 'text-[10px] font-semibold uppercase tracking-wider text-zinc-400';

          groupsHtml += '<div class="space-y-1.5">' +
              '<div class="flex items-center gap-1.5 pb-1 ' + groupBorderClass + '">' +
                '<i data-lucide="folder-open" class="w-3 h-3 opacity-60"></i>' +
                '<h2 class="' + groupTitleClass + '">' + escapeHtml(cat) + '</h2>' +
                '<span class="px-1.5 py-0.5 rounded-full text-[8px] font-mono border ' + getMonogramClass() + '">' + catLinks.length + '</span>' +
              '</div>' +
              '<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">' +
                groupCardsHtml +
              '</div>' +
            '</div>';
        });

        container.innerHTML = '<div class="w-full max-w-6xl space-y-4 pb-8">' +
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
          
          dockItemsHtml += '<a href="' + escapeHtml(cleanUrl) + '" target="_blank" class="fade-in block w-24 h-24 md:w-28 md:h-28 rounded-xl border p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group overflow-hidden text-center ' + styleClass + '">' +
              '<div class="relative flex items-center justify-center w-10 h-10 rounded border ' + getMonogramClass() + '">' +
                '<span class="text-xs select-none font-bold">' + escapeHtml(monogram) + '</span>' +
                '<div class="absolute -bottom-1 -right-1 p-0.5 rounded shadow flex items-center justify-center border ' + getFaviconWrapperClass() + '">' +
                  '<img src="' + escapeHtml(faviconUrl) + '" alt="favicon" class="w-2.5 h-2.5 object-contain rounded" onerror="this.style.display=\'none\'" />' +
                '</div>' +
              '</div>' +
              '<span class="mt-2 text-[10px] font-semibold truncate w-full px-1 ' + getTitleColorClass() + '">' + escapeHtml(link.title || 'Acceso') + '</span>' +
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

    // Trigger Initial Theme styling & layout state safely after DOM loads
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          try {
            setTheme(theme);
          } catch (err) {
            console.error("Error setting theme on DOMContentLoaded:", err);
          }
        });
      } else {
        setTheme(theme);
      }
    } catch (err) {
      console.error("Error during initial theme setup:", err);
    }
  </script>
</body>
</html>`;
}
