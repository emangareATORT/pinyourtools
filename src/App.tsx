import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { LinkItem, PRESET_COLORS, ThemeType } from './types';
import { DEFAULT_LINKS } from './defaultLinks';
import { Header } from './components/Header';
import { LinkGrid } from './components/LinkGrid';
import { AdminPanel } from './components/AdminPanel';
import { handleFirestoreError, OperationType } from './utils/firestoreError';
import { generateExportHtml } from './utils/export';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // App state
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [localLinks, setLocalLinks] = useState<LinkItem[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'groups' | 'dock'>(() => {
    return (localStorage.getItem('homepage_view_mode') as 'grid' | 'list' | 'groups' | 'dock') || 'grid';
  });
  const [isSoberMode, setIsSoberMode] = useState<boolean>(() => {
    return localStorage.getItem('homepage_sober_mode') === 'true';
  });
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('homepage_theme') as ThemeType) || 'dark';
  });
  
  // Track selected link to edit in Admin Drawer
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  const handleViewModeChange = (mode: 'grid' | 'list' | 'groups' | 'dock') => {
    setViewMode(mode);
    localStorage.setItem('homepage_view_mode', mode);
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('homepage_theme', newTheme);
  };

  const handleToggleSoberMode = () => {
    setIsSoberMode((prev) => {
      const next = !prev;
      localStorage.setItem('homepage_sober_mode', String(next));
      return next;
    });
  };

  // 1. Listen for Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch custom links from Firestore in real-time
        const q = query(collection(db, 'links'), where('userId', '==', currentUser.uid));
        
        const unsubFirestore = onSnapshot(q, (snapshot) => {
          const fetchedLinks: LinkItem[] = [];
          snapshot.forEach((docSnap) => {
            fetchedLinks.push({
              id: docSnap.id,
              ...docSnap.data(),
            } as LinkItem);
          });
          
          // Sort items client-side by order field to avoid requiring complex Firestore indexes
          fetchedLinks.sort((a, b) => a.order - b.order);
          setLinks(fetchedLinks);
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'links');
        });

        return () => {
          unsubFirestore();
        };
      } else {
        // Fetch local links from localStorage
        const stored = localStorage.getItem('homepage_local_links');
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as LinkItem[];
            parsed.sort((a, b) => a.order - b.order);
            setLocalLinks(parsed);
            setLinks(parsed);
          } catch (e) {
            console.error('Error parsing local links:', e);
            setLocalLinks(DEFAULT_LINKS);
            setLinks(DEFAULT_LINKS);
          }
        } else {
          // No local links stored yet, seed default ones
          setLocalLinks(DEFAULT_LINKS);
          setLinks(DEFAULT_LINKS);
          localStorage.setItem('homepage_local_links', JSON.stringify(DEFAULT_LINKS));
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Automatically prompt/handle migrating local links to Cloud on first Google Login
  useEffect(() => {
    if (user && localLinks.length > 0) {
      const migrateLocalLinks = async () => {
        try {
          // Check if cloud links are already populated
          const q = query(collection(db, 'links'), where('userId', '==', user.uid));
          let snapshot;
          try {
            snapshot = await getDocs(q);
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, 'links');
            return;
          }
          
          // If cloud has no links, automatically migrate the user's local customized layout!
          if (snapshot.empty) {
            const batch = writeBatch(db);
            
            localLinks.forEach((localLink) => {
              // Exclude the word 'default' to ensure we migrate real customized items,
              // or migrate all if they are customized
              const docRef = doc(collection(db, 'links'));
              batch.set(docRef, {
                title: localLink.title,
                url: localLink.url,
                color: localLink.color || '',
                userId: user.uid,
                order: localLink.order,
              });
            });

            try {
              await batch.commit();
            } catch (err) {
              handleFirestoreError(err, OperationType.WRITE, 'links');
              return;
            }
            console.log('Sincronización exitosa: Enlaces locales migrados a la nube.');
            
            // Clear local links storage now that they are in the cloud
            setLocalLinks([]);
            localStorage.removeItem('homepage_local_links');
          }
        } catch (err) {
          console.error('Failed to auto-migrate local links to Firestore:', err);
        }
      };

      migrateLocalLinks();
    }
  }, [user, localLinks]);

  // Auth Handlers
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign In failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsEditMode(false);
      setEditingLink(null);
    } catch (error) {
      console.error('Sign Out failed:', error);
    }
  };

  // Link Handlers
  const handleAddLink = async (newLinkData: Omit<LinkItem, 'id' | 'userId' | 'order'>) => {
    // Determine the next order securely to prevent duplicates even with gaps
    const nextOrder = links.length > 0 ? Math.max(...links.map((l) => l.order)) + 1 : 0;

    if (user) {
      // Cloud database
      try {
        await addDoc(collection(db, 'links'), {
          ...newLinkData,
          userId: user.uid,
          order: nextOrder,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'links');
      }
    } else {
      // Local Storage fallback
      const newLink: LinkItem = {
        id: `local-${Date.now()}`,
        ...newLinkData,
        userId: 'local',
        order: nextOrder,
      };
      const updated = [...links, newLink];
      setLocalLinks(updated);
      setLinks(updated);
      localStorage.setItem('homepage_local_links', JSON.stringify(updated));
    }
  };

  const handleUpdateLink = async (id: string, updatedFields: Partial<LinkItem>) => {
    if (user) {
      // Cloud
      try {
        await updateDoc(doc(db, 'links', id), {
          ...updatedFields,
          userId: user.uid,
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `links/${id}`);
      }
    } else {
      // Local
      const updated = links.map((l) => {
        if (l.id === id) {
          return { ...l, ...updatedFields };
        }
        return l;
      });
      setLocalLinks(updated);
      setLinks(updated);
      localStorage.setItem('homepage_local_links', JSON.stringify(updated));
    }

    // Reset editing state and close panel
    setEditingLink(null);
    setIsAdminOpen(false);
  };

  const handleDeleteLink = async (id: string) => {
    if (user) {
      // Cloud
      try {
        await deleteDoc(doc(db, 'links', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `links/${id}`);
      }
    } else {
      // Local
      const filtered = links.filter((l) => l.id !== id);
      // Clean and recompute order fields sequentially
      const updated = filtered.map((l, idx) => ({ ...l, order: idx }));
      setLocalLinks(updated);
      setLinks(updated);
      localStorage.setItem('homepage_local_links', JSON.stringify(updated));
    }

    // Clear editing link if deleted
    if (editingLink?.id === id) {
      setEditingLink(null);
    }
  };

  const handleMoveLink = async (id: string, direction: 'up' | 'down' | 'left' | 'right', cols: number = 3) => {
    const index = links.findIndex((l) => l.id === id);
    if (index === -1) return;

    let targetIndex = -1;
    if (direction === 'left') {
      if (index > 0) targetIndex = index - 1;
    } else if (direction === 'right') {
      if (index < links.length - 1) targetIndex = index + 1;
    } else if (direction === 'up') {
      if (index >= cols) targetIndex = index - cols;
    } else if (direction === 'down') {
      if (index + cols < links.length) targetIndex = index + cols;
    }

    if (targetIndex === -1) return;

    const currentItem = links[index];
    const targetItem = links[targetIndex];

    if (user) {
      // Cloud reorder using atomic Firestore batch
      try {
        const batch = writeBatch(db);

        // Detect if there are duplicate or overlapping order values in the current set
        const uniqueOrders = new Set(links.map((l) => l.order));
        const hasDuplicates = uniqueOrders.size < links.length;

        if (hasDuplicates) {
          // Self-healing: normalize all links sequentially, applying the swap
          const sortedCopy = [...links]; // already sorted by current order
          const temp = sortedCopy[index];
          sortedCopy[index] = sortedCopy[targetIndex];
          sortedCopy[targetIndex] = temp;

          // Write sequential 0, 1, 2, ... order back to the cloud
          sortedCopy.forEach((item, idx) => {
            batch.update(doc(db, 'links', item.id), { order: idx });
          });
        } else {
          // Fast and efficient 2-item swap
          batch.update(doc(db, 'links', currentItem.id), { order: targetItem.order });
          batch.update(doc(db, 'links', targetItem.id), { order: currentItem.order });
        }

        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, 'links');
      }
    } else {
      // Local reorder
      const uniqueOrders = new Set(links.map((l) => l.order));
      const hasDuplicates = uniqueOrders.size < links.length;

      let updated: LinkItem[];

      if (hasDuplicates) {
        // Self-healing: normalize all local links sequentially, applying the swap
        const sortedCopy = [...links];
        const temp = sortedCopy[index];
        sortedCopy[index] = sortedCopy[targetIndex];
        sortedCopy[targetIndex] = temp;

        updated = sortedCopy.map((item, idx) => ({ ...item, order: idx }));
      } else {
        // Simple swap
        updated = links.map((item) => {
          if (item.id === currentItem.id) {
            return { ...item, order: targetItem.order };
          }
          if (item.id === targetItem.id) {
            return { ...item, order: currentItem.order };
          }
          return { ...item };
        });
        // Sort and save
        updated.sort((a, b) => a.order - b.order);
      }
      
      setLocalLinks(updated);
      setLinks(updated);
      localStorage.setItem('homepage_local_links', JSON.stringify(updated));
    }
  };

  const handleEditLinkFromCard = (link: LinkItem) => {
    setEditingLink(link);
    setIsAdminOpen(true);
  };

  const handleResetStyles = async () => {
    const defaultColor = PRESET_COLORS[0].class;
    
    if (user) {
      try {
        const batch = writeBatch(db);
        links.forEach((link) => {
          batch.update(doc(db, 'links', link.id), { color: defaultColor });
        });
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, 'links/reset-styles');
      }
    } else {
      const updated = links.map((link) => ({ ...link, color: defaultColor }));
      setLocalLinks(updated);
      setLinks(updated);
      localStorage.setItem('homepage_local_links', JSON.stringify(updated));
    }
  };

  const handleExportHtml = () => {
    const htmlContent = generateExportHtml(links, viewMode, isSoberMode, theme);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getContainerClasses = () => {
    switch (theme) {
      case 'sepia':
        return "min-h-screen w-screen bg-[#fbf6eb] text-[#433422] font-sans selection:bg-[#dfd0b0] selection:text-[#433422] flex flex-col relative overflow-hidden";
      case 'newspaper':
        return "min-h-screen w-screen bg-[#faf9f6] text-zinc-900 font-serif selection:bg-zinc-250 selection:text-zinc-900 flex flex-col relative overflow-hidden";
      case 'colorful':
        return "min-h-screen w-screen bg-[#09080e] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13111f] via-[#09080e] to-[#050507] text-purple-200/90 font-sans selection:bg-indigo-950 selection:text-white flex flex-col relative overflow-hidden";
      case 'dark':
      default:
        return "min-h-screen w-screen bg-[#080808] bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-zinc-950 via-[#060606] to-black text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white flex flex-col relative overflow-hidden";
    }
  };

  const getFooterClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'border-[#dfd0b0] bg-[#fbf6eb]/50 text-[#705d46]/75';
      case 'newspaper':
        return 'border-zinc-300 bg-white/50 text-zinc-500 font-sans border-t-2 border-zinc-900';
      case 'colorful':
        return 'border-indigo-950/40 bg-[#09080e]/50 text-indigo-400/70';
      case 'dark':
      default:
        return 'border-white/5 bg-black/20 text-zinc-500';
    }
  };

  const renderBackgroundOverlay = () => {
    switch (theme) {
      case 'sepia':
        return (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(67,52,34,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(67,52,34,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
        );
      case 'newspaper':
        return (
          <div className="absolute inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none z-0" />
        );
      case 'colorful':
        return (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
            <div className="absolute top-0 left-1/3 right-1/3 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full" />
          </>
        );
      case 'dark':
      default:
        return (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
        );
    }
  };

  return (
    <div className={getContainerClasses()}>
      {/* Background ambient themes overlays */}
      {renderBackgroundOverlay()}
      
      {/* Loading Cover */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-inherit z-50">
          <div className={`w-5 h-5 border rotate-45 flex items-center justify-center animate-spin ${theme === 'newspaper' ? 'border-zinc-900' : 'border-white/40'}`}>
            <div className={`w-1.5 h-1.5 ${theme === 'newspaper' ? 'bg-zinc-900' : 'bg-white'}`}></div>
          </div>
          <p className="text-[10px] font-mono tracking-widest uppercase mt-6 opacity-60">Cargando Inicio...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
          {/* Header Area */}
          <Header
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onOpenAdmin={() => setIsAdminOpen(true)}
            isEditMode={isEditMode}
            onToggleEditMode={() => setIsEditMode(!isEditMode)}
            totalLinks={links.length}
            onResetStyles={handleResetStyles}
            viewMode={viewMode}
            onChangeViewMode={handleViewModeChange}
            isSoberMode={isSoberMode}
            onToggleSoberMode={handleToggleSoberMode}
            onExportHtml={handleExportHtml}
            theme={theme}
            onChangeTheme={handleThemeChange}
          />

          {/* Core Content Area - Links grid taking up full space */}
          <main className="flex-1 flex items-center justify-center overflow-hidden">
            <LinkGrid
              links={links}
              isEditMode={isEditMode}
              onEditLink={handleEditLinkFromCard}
              onDeleteLink={handleDeleteLink}
              onMoveLink={handleMoveLink}
              onOpenAdmin={() => setIsAdminOpen(true)}
              viewMode={viewMode}
              isSoberMode={isSoberMode}
              theme={theme}
            />
          </main>

          {/* Footer with credit and version */}
          <footer className={`w-full py-2.5 text-center shrink-0 border-t ${getFooterClasses()} text-[10px] font-mono tracking-wider z-20`}>
            By @emagnare Version 1.7
          </footer>

          {/* Control Settings Sidebar */}
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={() => {
              setIsAdminOpen(false);
              setEditingLink(null);
            }}
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            links={links}
            onAddLink={handleAddLink}
            onUpdateLink={handleUpdateLink}
            onDeleteLink={handleDeleteLink}
            onMoveLink={handleMoveLink}
            initialEditingLink={editingLink}
            onSelectEditLink={setEditingLink}
            onCancelEdit={() => setEditingLink(null)}
          />
        </div>
      )}
    </div>
  );
}
