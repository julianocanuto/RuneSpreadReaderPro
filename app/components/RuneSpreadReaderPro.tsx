'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { translations, runeData, CARD_W, CARD_H, PAD } from '@/lib/constants';
import { getSpreadTypes, clamp, calcMotion } from '@/lib/utils';
import { Rune, Position, RevealedRune, Mode, Language } from '@/lib/types';

export default function RuneSpreadReaderPro() {
  const [lang, setLang] = useState<Language>('pt-BR');
  const t = translations[lang];
  const runes = runeData[lang];
  const spreads = getSpreadTypes(t);

  const [deck] = useState<(Rune & { deckId: string })[]>(() =>
    runeData['pt-BR'].map((r, i) => ({ ...r, deckId: `rune-${i}` }))
  );
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [mode, setMode] = useState<Mode>('shuffle');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderMap, setOrderMap] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<RevealedRune[]>([]);
  const [shuffling, setShuffling] = useState(false);
  const [shuffleAngle, setShuffleAngle] = useState(0);
  const [shuffleIntensity, setShuffleIntensity] = useState(0);
  const [spread, setSpread] = useState('past-present-future');
  const [showDeck, setShowDeck] = useState(false);
  const [showSpreadMenu, setShowSpreadMenu] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);
  const history = useRef<Array<{ x: number; y: number }>>([]);
  const currentSpread = spreads.find(s => s.id === spread)!;

  // Update revealed runes when language changes
  useEffect(() => {
    setRevealed(prev =>
      prev.map(item => {
        const newRune = runeData[lang].find(r => r.id === item.rune.id);
        return newRune ? { ...item, rune: { ...newRune, deckId: item.rune.deckId } } : item;
      })
    );
  }, [lang]);

  // Initialize positions
  useEffect(() => {
    const init = () => {
      const rect = tableRef.current?.getBoundingClientRect();
      const w = rect?.width || 600, h = rect?.height || 400;
      const cx = (w - CARD_W) / 2, cy = (h - CARD_H) / 2;
      const pos: Record<string, Position> = {};
      deck.forEach((r, i) => {
        pos[r.deckId] = {
          x: cx + Math.random() * 20 - 10,
          y: cy + Math.random() * 20 - 10,
          rot: Math.random() * 14 - 7,
          z: i
        };
      });
      setPositions(pos);
    };
    setTimeout(init, 100);
  }, [deck]);

  const shuffle = (intensity: number) => {
    const rect = tableRef.current?.getBoundingClientRect();
    const w = rect?.width || 600, h = rect?.height || 400;
    setPositions(prev => {
      const newPos = { ...prev };
      const ids = Object.keys(newPos);
      const swaps = Math.floor(intensity * 8);
      for (let i = 0; i < swaps; i++) {
        const a = Math.floor(Math.random() * ids.length), b = Math.floor(Math.random() * ids.length);
        const idA = ids[a];
        const idB = ids[b];
        if (idA && idB) {
          const tmp = newPos[idA]!.z;
          newPos[idA]!.z = newPos[idB]!.z;
          newPos[idB]!.z = tmp;
        }
      }
      ids.forEach(id => {
        const pos = newPos[id];
        if (!pos) return;
        const scatter = intensity * 70;
        const nx = pos.x + (Math.random() - 0.5) * scatter * 0.3;
        const ny = pos.y + (Math.random() - 0.5) * scatter * 0.3;
        const c = clamp(nx, ny, w, h, CARD_W, CARD_H, PAD);
        newPos[id] = {
          ...pos,
          x: c.x,
          y: c.y,
          rot: pos.rot + (Math.random() - 0.5) * intensity * 20
        };
      });
      return newPos;
    });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (mode !== 'shuffle' || !shuffling) return;
    const rect = tableRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left, y = clientY - rect.top;
    history.current.push({ x, y });
    if (history.current.length > 30) history.current.shift();
    const motion = calcMotion(history.current);
    setShuffleAngle(motion.angle);
    setShuffleIntensity(motion.intensity);
    if (motion.intensity > 0.2) shuffle(motion.intensity);
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX, touch.clientY);
    }
  };
  const handleDown = () => {
    if (mode === 'shuffle') {
      setShuffling(true);
      history.current = [];
    }
  };
  const handleUp = () => {
    setShuffling(false);
    setShuffleAngle(0);
    setShuffleIntensity(0);
    history.current = [];
  };

  const handleCardClick = (deckId: string) => {
    if (mode !== 'select') return;
    const max = currentSpread.count;
    if (selected.includes(deckId)) {
      setSelected(prev => prev.filter(id => id !== deckId));
      setOrderMap(prev => {
        const m = { ...prev };
        delete m[deckId];
        return m;
      });
    } else if (selected.length < max) {
      setOrderMap(prev => ({ ...prev, [deckId]: Math.max(0, ...Object.values(prev)) + 1 }));
      setSelected(prev => [...prev, deckId]);
    }
  };

  const revealNext = () => {
    const card = selected.find(id => !revealed.some(r => r.deckId === id));
    if (!card) return;
    const runeBase = deck.find(r => r.deckId === card);
    if (!runeBase) return;
    const runeTranslated = runeData[lang].find(r => r.id === runeBase.id);
    if (!runeTranslated) return;
    const rune = { ...runeTranslated, deckId: card };
    const order = orderMap[card] || 1;
    const pos = currentSpread.positions[order - 1] || '';
    setRevealed(prev => [...prev, { deckId: card, rune, order, position: pos }]);
    setSelected(prev => prev.filter(id => id !== card));
  };

  const revealAll = () => {
    const cards = selected.filter(id => !revealed.some(r => r.deckId === id));
    const newRevealed: RevealedRune[] = [];
    cards.forEach(id => {
      const runeBase = deck.find(r => r.deckId === id);
      if (!runeBase) return;
      const runeTranslated = runeData[lang].find(r => r.id === runeBase.id);
      if (!runeTranslated) return;
      const rune = { ...runeTranslated, deckId: id };
      const order = orderMap[id] || 1;
      newRevealed.push({ deckId: id, rune, order, position: currentSpread.positions[order - 1] || '' });
    });
    setRevealed(prev => [...prev, ...newRevealed]);
    setSelected([]);
  };

  const reset = () => {
    const rect = tableRef.current?.getBoundingClientRect();
    const w = rect?.width || 600, h = rect?.height || 400;
    const cx = (w - CARD_W) / 2, cy = (h - CARD_H) / 2;
    const pos: Record<string, Position> = {};
    deck.forEach((r, i) => {
      pos[r.deckId] = {
        x: cx + Math.random() * 20 - 10,
        y: cy + Math.random() * 20 - 10,
        rot: Math.random() * 14 - 7,
        z: i
      };
    });
    setPositions(pos);
    setSelected([]);
    setOrderMap({});
    setRevealed([]);
  };

  const spreadCardsOut = () => {
    const rect = tableRef.current?.getBoundingClientRect();
    const w = rect?.width || 600, h = rect?.height || 400;
    const cols = 8, rows = 3;
    const spX = Math.min(68, (w - PAD * 2 - CARD_W) / (cols - 1));
    const spY = Math.min(90, (h - PAD * 2 - CARD_H) / (rows - 1));
    const gw = (cols - 1) * spX + CARD_W, gh = (rows - 1) * spY + CARD_H;
    const sx = Math.max(PAD, (w - gw) / 2), sy = Math.max(PAD, (h - gh) / 2);
    const pos: Record<string, Position> = {};
    deck.forEach((r, i) => {
      const row = Math.floor(i / cols), col = i % cols;
      const c = clamp(sx + col * spX, sy + row * spY, w, h, CARD_W, CARD_H, PAD);
      pos[r.deckId] = { x: c.x, y: c.y, rot: 0, z: i };
    });
    setPositions(pos);
  };

  // Deck Viewer
  if (showDeck) {
    return (
      <div className="min-h-screen p-3 bg-gradient-to-br from-stone-950 via-indigo-950 to-stone-950 text-amber-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg text-amber-400 font-semibold">{t.deckTitle}</h1>
          <button
            onClick={() => setShowDeck(false)}
            className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded text-amber-400 text-xs hover:bg-amber-500/30"
          >
            {t.back}
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {runes.map((r, i) => (
            <div
              key={i}
              className="bg-stone-900/80 border border-amber-500/30 rounded p-2 text-center hover:border-amber-400/60 transition-colors"
            >
              <div className="text-2xl text-amber-400 mb-1">{r.symbol}</div>
              <div className="text-amber-300 text-xs font-semibold truncate">{r.name}</div>
              <div className="text-stone-400 text-xs truncate">{r.meaning}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getInstruction = () => {
    if (mode === 'shuffle') return t.shuffleInstruction;
    if (mode === 'select') return t.selectInstruction;
    return selected.length > 0
      ? t.readInstructionWithSelection.replace('{count}', selected.length.toString())
      : t.readInstructionNoSelection;
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-stone-950 via-indigo-950 to-stone-950 text-amber-100 overflow-hidden">
      {/* Compact Header Bar */}
      <header className="flex items-center justify-between px-3 py-2 bg-stone-900/80 border-b border-amber-500/20 flex-shrink-0">
        {/* Left: Title + Spread Selector */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg text-amber-400 font-semibold hidden sm:block">{t.appTitle}</h1>
          <h1 className="text-lg text-amber-400 font-semibold sm:hidden">᚛ Runas ᚛</h1>

          {/* Spread Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSpreadMenu(!showSpreadMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-stone-700"
            >
              <span className="text-amber-400 hidden sm:inline">{t.spread}:</span>
              <span className="font-medium">{currentSpread.label}</span>
              <span className="text-amber-500/60">
                ({selected.length}/{currentSpread.count})
              </span>
              <svg
                className={`w-3 h-3 transition-transform ${showSpreadMenu ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showSpreadMenu && (
              <div className="absolute top-full left-0 mt-1 bg-stone-900 border border-amber-500/30 rounded shadow-xl z-50 min-w-48">
                {spreads.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSpread(s.id);
                      setShowSpreadMenu(false);
                      reset();
                    }}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-stone-800 flex justify-between items-center ${
                      spread === s.id ? 'text-amber-400 bg-amber-500/10' : 'text-stone-300'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-stone-500">({s.count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Mode Buttons */}
        <div className="flex items-center gap-1">
          {[
            ['shuffle', '🌀', t.shuffleMode],
            ['select', '👆', t.selectMode],
            ['read', '🔮', t.readMode]
          ].map(([m, icon, label]) => (
            <button
              key={m}
              onClick={() => setMode(m as Mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                mode === m
                  ? 'bg-amber-500 text-stone-900'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions + Language */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeck(true)}
            className="px-2 py-1.5 bg-stone-800 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-stone-700"
          >
            📖
          </button>
          <div className="flex gap-0.5">
            <button
              onClick={() => setLang('pt-BR')}
              className={`px-2 py-1 rounded text-xs font-medium ${
                lang === 'pt-BR'
                  ? 'bg-amber-500 text-stone-900'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              PT
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded text-xs font-medium ${
                lang === 'en'
                  ? 'bg-amber-500 text-stone-900'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Table Area - Takes maximum space */}
      <div className="flex-1 flex flex-col p-2 gap-2 min-h-0">
        {/* Instruction + Read Controls - Compact */}
        <div className="flex items-center justify-center gap-3 flex-shrink-0">
          <span className="text-xs text-stone-400 bg-stone-900/60 px-3 py-1 rounded-full">
            {getInstruction()}
          </span>
          {mode === 'read' && selected.length > 0 && (
            <>
              <button
                onClick={revealNext}
                className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-500"
              >
                🎴 {t.revealNext}
              </button>
              <button
                onClick={revealAll}
                className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-medium hover:bg-amber-500"
              >
                🃏 {t.revealAll}
              </button>
            </>
          )}
        </div>

        {/* Table - Maximum height */}
        <div
          ref={tableRef}
          className="flex-1 relative rounded-xl overflow-hidden cursor-crosshair"
          style={{
            background: 'radial-gradient(ellipse at center, #0f5132 0%, #064e3b 50%, #022c22 100%)',
            boxShadow:
              'inset 0 0 80px rgba(0,0,0,0.5), 0 0 0 4px #2d1810, 0 0 0 6px #1a0f0a'
          }}
          onMouseDown={handleDown}
          onMouseUp={handleUp}
          onMouseLeave={handleUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleDown}
          onTouchEnd={handleUp}
          onTouchMove={handleTouchMove}
        >
          {/* Felt texture */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'
            }}
          />

          {/* Shuffle indicator */}
          {mode === 'shuffle' && shuffling && shuffleIntensity > 0.1 && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999
              }}
            >
              <div
                className="w-20 h-20 rounded-full border-4 border-dashed"
                style={{
                  transform: `rotate(${shuffleAngle}deg) scale(${1 + shuffleIntensity * 0.3})`,
                  borderColor: `rgba(212, 175, 55, ${0.3 + shuffleIntensity * 0.5})`
                }}
              />
            </div>
          )}

          {/* Rune Cards */}
          {deck
            .filter(r => !revealed.some(rv => rv.deckId === r.deckId))
            .map(r => {
              const p = positions[r.deckId] || { x: 250, y: 150, rot: 0, z: 0 };
              const isSel = selected.includes(r.deckId);
              const order = orderMap[r.deckId] || 0;
              return (
                <div
                  key={r.deckId}
                  onClick={() => handleCardClick(r.deckId)}
                  className={`absolute cursor-pointer select-none transition-all duration-300 ${
                    isSel ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-emerald-900' : ''
                  }`}
                  style={{
                    left: p.x,
                    top: p.y,
                    width: CARD_W,
                    height: CARD_H,
                    transform: `rotate(${p.rot}deg) ${isSel ? 'translateY(-8px) scale(1.05)' : ''}`,
                    zIndex: isSel ? 100 : p.z
                  }}
                >
                  {isSel && order > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-stone-900 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-lg">
                      {order}
                    </div>
                  )}
                  <div
                    className="w-full h-full rounded-lg shadow-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
                      border: '2px solid #d4af37'
                    }}
                  >
                    <div
                      className="w-10 h-14 rounded border border-amber-500/30 flex items-center justify-center"
                      style={{
                        background:
                          'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(212,175,55,0.08) 2px, rgba(212,175,55,0.08) 4px)'
                      }}
                    >
                      <span className="text-amber-500/50 text-lg">᚛</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Bottom Action Bar - Compact */}
        <div className="flex items-center justify-center gap-2 flex-shrink-0">
          <button
            onClick={reset}
            className="px-4 py-1.5 bg-rose-900/80 text-rose-200 rounded text-xs font-medium hover:bg-rose-800 transition-colors"
          >
            {t.resetDeck}
          </button>
          <button
            onClick={spreadCardsOut}
            className="px-4 py-1.5 bg-sky-900/80 text-sky-200 rounded text-xs font-medium hover:bg-sky-800 transition-colors"
          >
            {t.spreadCards}
          </button>
        </div>
      </div>

      {/* Revealed Runes - Horizontal scrollable bar at bottom */}
      {revealed.length > 0 && (
        <div className="bg-stone-900/90 border-t border-amber-500/30 px-3 py-2 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-amber-400/80 text-xs whitespace-nowrap flex-shrink-0">
              {t.revealedRunes}
            </span>
            <div className="flex gap-2 pb-1">
              {revealed
                .sort((a, b) => a.order - b.order)
                .map(item => (
                  <div
                    key={item.deckId}
                    className="flex-shrink-0 flex flex-col items-center p-2 bg-stone-800/80 rounded border border-amber-500/30 min-w-16"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-4 h-4 bg-amber-500 text-stone-900 rounded-full flex items-center justify-center text-xs font-bold">
                        {item.order}
                      </div>
                      <span className="text-amber-400/70 text-xs truncate max-w-12">
                        {item.position}
                      </span>
                    </div>
                    <div className="text-xl text-amber-400">{item.rune.symbol}</div>
                    <div className="text-amber-300 text-xs font-semibold truncate w-full text-center">
                      {item.rune.name}
                    </div>
                    <div className="text-stone-400 text-xs truncate w-full text-center">
                      {item.rune.meaning}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close spread menu */}
      {showSpreadMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSpreadMenu(false)}
        />
      )}
    </div>
  );
}
