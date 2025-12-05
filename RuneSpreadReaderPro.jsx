import React, { useState, useRef, useCallback, useEffect } from 'react';

// Translations
const translations = {
  'pt-BR': {
    appTitle: '᚛ Leitor de Runas ᚛',
    shuffleMode: 'Embaralhar', selectMode: 'Selecionar', readMode: 'Ler',
    shuffleInstruction: '🌀 Movimentos circulares para embaralhar',
    selectInstruction: '👆 Toque nas runas para selecionar',
    readInstructionWithSelection: '🔮 Revelar {count} runa(s) selecionada(s)',
    readInstructionNoSelection: '🔮 Selecione runas primeiro',
    revealNext: 'Revelar', revealAll: 'Todas', resetDeck: 'Reiniciar', spreadCards: 'Espalhar',
    viewDeck: 'Ver Deck', back: '← Voltar',
    spread: 'Leitura',
    singleRune: 'Runa Única', pastPresentFuture: 'Passado/Presente/Futuro',
    situationActionOutcome: 'Situação/Ação/Resultado', mindBodySpirit: 'Mente/Corpo/Espírito',
    embraceReleaseFocus: 'Abraçar/Liberar/Focar', fiveRune: 'Cinco Runas', celticCross: 'Cruz Celta',
    positions: { guidance: 'Orientação', past: 'Passado', present: 'Presente', future: 'Futuro', situation: 'Situação', action: 'Ação', outcome: 'Resultado', mind: 'Mente', body: 'Corpo', spirit: 'Espírito', embrace: 'Abraçar', release: 'Liberar', focus: 'Focar', challenge: 'Desafio', path: 'Caminho', hidden: 'Oculto', advice: 'Conselho', core: 'Central', desire: 'Desejo', subconscious: 'Subconsciente', influences: 'Influências', attitude: 'Atitude', hopes: 'Esperanças' },
    selected: 'selecionadas',
    revealedRunes: '✦ Runas Reveladas ✦',
    deckTitle: '᚛ Elder Futhark ᚛', firstAett: 'Primeiro Aett', secondAett: 'Segundo Aett', thirdAett: 'Terceiro Aett',
  },
  'en': {
    appTitle: '᚛ Rune Reader ᚛',
    shuffleMode: 'Shuffle', selectMode: 'Select', readMode: 'Read',
    shuffleInstruction: '🌀 Circular motions to shuffle',
    selectInstruction: '👆 Tap runes to select',
    readInstructionWithSelection: '🔮 Reveal {count} selected rune(s)',
    readInstructionNoSelection: '🔮 Select runes first',
    revealNext: 'Reveal', revealAll: 'All', resetDeck: 'Reset', spreadCards: 'Spread',
    viewDeck: 'View Deck', back: '← Back',
    spread: 'Spread',
    singleRune: 'Single Rune', pastPresentFuture: 'Past/Present/Future',
    situationActionOutcome: 'Situation/Action/Outcome', mindBodySpirit: 'Mind/Body/Spirit',
    embraceReleaseFocus: 'Embrace/Release/Focus', fiveRune: 'Five Rune', celticCross: 'Celtic Cross',
    positions: { guidance: 'Guidance', past: 'Past', present: 'Present', future: 'Future', situation: 'Situation', action: 'Action', outcome: 'Outcome', mind: 'Mind', body: 'Body', spirit: 'Spirit', embrace: 'Embrace', release: 'Release', focus: 'Focus', challenge: 'Challenge', path: 'Path', hidden: 'Hidden', advice: 'Advice', core: 'Core', desire: 'Desire', subconscious: 'Subconscious', influences: 'Influences', attitude: 'Attitude', hopes: 'Hopes' },
    selected: 'selected',
    revealedRunes: '✦ Revealed Runes ✦',
    deckTitle: '᚛ Elder Futhark ᚛', firstAett: 'First Aett', secondAett: 'Second Aett', thirdAett: 'Third Aett',
  }
};

const runeData = {
  'pt-BR': [
    { id: 'fehu', name: "Fehu", symbol: "ᚠ", meaning: "Riqueza", description: "Abundância e prosperidade" },
    { id: 'uruz', name: "Uruz", symbol: "ᚢ", meaning: "Força", description: "Força primordial e coragem" },
    { id: 'thurisaz', name: "Thurisaz", symbol: "ᚦ", meaning: "Espinho", description: "Proteção e conflito" },
    { id: 'ansuz', name: "Ansuz", symbol: "ᚨ", meaning: "Divino", description: "Sabedoria e inspiração" },
    { id: 'raidho', name: "Raidho", symbol: "ᚱ", meaning: "Jornada", description: "Viagem e ciclos da vida" },
    { id: 'kenaz', name: "Kenaz", symbol: "ᚲ", meaning: "Tocha", description: "Conhecimento e iluminação" },
    { id: 'gebo', name: "Gebo", symbol: "ᚷ", meaning: "Presente", description: "Equilíbrio e parceria" },
    { id: 'wunjo', name: "Wunjo", symbol: "ᚹ", meaning: "Alegria", description: "Alegria e harmonia" },
    { id: 'hagalaz', name: "Hagalaz", symbol: "ᚺ", meaning: "Granizo", description: "Crise e transformação" },
    { id: 'nauthiz', name: "Nauthiz", symbol: "ᚾ", meaning: "Necessidade", description: "Restrição e crescimento" },
    { id: 'isa', name: "Isa", symbol: "ᛁ", meaning: "Gelo", description: "Pausa e introspecção" },
    { id: 'jera', name: "Jera", symbol: "ᛃ", meaning: "Colheita", description: "Ciclos e recompensas" },
    { id: 'eihwaz', name: "Eihwaz", symbol: "ᛇ", meaning: "Teixo", description: "Resiliência e transformação" },
    { id: 'perthro', name: "Perthro", symbol: "ᛈ", meaning: "Destino", description: "Mistério e acaso" },
    { id: 'algiz', name: "Algiz", symbol: "ᛉ", meaning: "Proteção", description: "Proteção divina" },
    { id: 'sowilo', name: "Sowilo", symbol: "ᛊ", meaning: "Sol", description: "Sucesso e vitória" },
    { id: 'tiwaz', name: "Tiwaz", symbol: "ᛏ", meaning: "Justiça", description: "Honra e coragem" },
    { id: 'berkano', name: "Berkano", symbol: "ᛒ", meaning: "Nascimento", description: "Novos começos" },
    { id: 'ehwaz', name: "Ehwaz", symbol: "ᛖ", meaning: "Cavalo", description: "Parceria e confiança" },
    { id: 'mannaz', name: "Mannaz", symbol: "ᛗ", meaning: "Humanidade", description: "Consciência e amizade" },
    { id: 'laguz', name: "Laguz", symbol: "ᛚ", meaning: "Água", description: "Intuição e fluxo" },
    { id: 'ingwaz', name: "Ingwaz", symbol: "ᛜ", meaning: "Fertilidade", description: "Completude e potencial" },
    { id: 'dagaz', name: "Dagaz", symbol: "ᛞ", meaning: "Dia", description: "Despertar e avanço" },
    { id: 'othala', name: "Othala", symbol: "ᛟ", meaning: "Lar", description: "Herança e ancestralidade" }
  ],
  'en': [
    { id: 'fehu', name: "Fehu", symbol: "ᚠ", meaning: "Wealth", description: "Abundance and prosperity" },
    { id: 'uruz', name: "Uruz", symbol: "ᚢ", meaning: "Strength", description: "Primal strength and courage" },
    { id: 'thurisaz', name: "Thurisaz", symbol: "ᚦ", meaning: "Thorn", description: "Protection and conflict" },
    { id: 'ansuz', name: "Ansuz", symbol: "ᚨ", meaning: "Divine", description: "Wisdom and inspiration" },
    { id: 'raidho', name: "Raidho", symbol: "ᚱ", meaning: "Journey", description: "Travel and life cycles" },
    { id: 'kenaz', name: "Kenaz", symbol: "ᚲ", meaning: "Torch", description: "Knowledge and illumination" },
    { id: 'gebo', name: "Gebo", symbol: "ᚷ", meaning: "Gift", description: "Balance and partnership" },
    { id: 'wunjo', name: "Wunjo", symbol: "ᚹ", meaning: "Joy", description: "Joy and harmony" },
    { id: 'hagalaz', name: "Hagalaz", symbol: "ᚺ", meaning: "Hail", description: "Crisis and transformation" },
    { id: 'nauthiz', name: "Nauthiz", symbol: "ᚾ", meaning: "Need", description: "Constraint and growth" },
    { id: 'isa', name: "Isa", symbol: "ᛁ", meaning: "Ice", description: "Pause and introspection" },
    { id: 'jera', name: "Jera", symbol: "ᛃ", meaning: "Harvest", description: "Cycles and rewards" },
    { id: 'eihwaz', name: "Eihwaz", symbol: "ᛇ", meaning: "Yew", description: "Resilience and transformation" },
    { id: 'perthro', name: "Perthro", symbol: "ᛈ", meaning: "Fate", description: "Mystery and chance" },
    { id: 'algiz', name: "Algiz", symbol: "ᛉ", meaning: "Protection", description: "Divine protection" },
    { id: 'sowilo', name: "Sowilo", symbol: "ᛊ", meaning: "Sun", description: "Success and victory" },
    { id: 'tiwaz', name: "Tiwaz", symbol: "ᛏ", meaning: "Justice", description: "Honor and courage" },
    { id: 'berkano', name: "Berkano", symbol: "ᛒ", meaning: "Birth", description: "New beginnings" },
    { id: 'ehwaz', name: "Ehwaz", symbol: "ᛖ", meaning: "Horse", description: "Partnership and trust" },
    { id: 'mannaz', name: "Mannaz", symbol: "ᛗ", meaning: "Humanity", description: "Consciousness and friendship" },
    { id: 'laguz', name: "Laguz", symbol: "ᛚ", meaning: "Water", description: "Intuition and flow" },
    { id: 'ingwaz', name: "Ingwaz", symbol: "ᛜ", meaning: "Fertility", description: "Completion and potential" },
    { id: 'dagaz', name: "Dagaz", symbol: "ᛞ", meaning: "Day", description: "Awakening and breakthrough" },
    { id: 'othala', name: "Othala", symbol: "ᛟ", meaning: "Home", description: "Heritage and ancestry" }
  ]
};

const getSpreadTypes = (t) => [
  { id: 'single-rune', label: t.singleRune, count: 1, positions: [t.positions.guidance] },
  { id: 'past-present-future', label: t.pastPresentFuture, count: 3, positions: [t.positions.past, t.positions.present, t.positions.future] },
  { id: 'situation-action-outcome', label: t.situationActionOutcome, count: 3, positions: [t.positions.situation, t.positions.action, t.positions.outcome] },
  { id: 'mind-body-spirit', label: t.mindBodySpirit, count: 3, positions: [t.positions.mind, t.positions.body, t.positions.spirit] },
  { id: 'embrace-release-focus', label: t.embraceReleaseFocus, count: 3, positions: [t.positions.embrace, t.positions.release, t.positions.focus] },
  { id: 'five-rune', label: t.fiveRune, count: 5, positions: [t.positions.challenge, t.positions.path, t.positions.hidden, t.positions.outcome, t.positions.advice] },
  { id: 'celtic-cross', label: t.celticCross, count: 10, positions: [t.positions.core, t.positions.challenge, t.positions.desire, t.positions.subconscious, t.positions.past, t.positions.future, t.positions.influences, t.positions.attitude, t.positions.hopes, t.positions.outcome] },
];

const CARD_W = 56, CARD_H = 80, PAD = 8;

export default function RuneSpreadReaderPro() {
  const [lang, setLang] = useState('pt-BR');
  const t = translations[lang];
  const runes = runeData[lang];
  const spreads = getSpreadTypes(t);
  
  const [deck] = useState(() => runeData['pt-BR'].map((r, i) => ({ ...r, deckId: `rune-${i}` })));
  const [positions, setPositions] = useState({});
  const [mode, setMode] = useState('shuffle');
  const [selected, setSelected] = useState([]);
  const [orderMap, setOrderMap] = useState({});
  const [revealed, setRevealed] = useState([]);
  const [shuffling, setShuffling] = useState(false);
  const [shuffleAngle, setShuffleAngle] = useState(0);
  const [shuffleIntensity, setShuffleIntensity] = useState(0);
  const [spread, setSpread] = useState('past-present-future');
  const [showDeck, setShowDeck] = useState(false);
  const [showSpreadMenu, setShowSpreadMenu] = useState(false);
  
  const tableRef = useRef(null);
  const history = useRef([]);
  const currentSpread = spreads.find(s => s.id === spread);

  // Update revealed runes when language changes
  useEffect(() => {
    setRevealed(prev => prev.map(item => {
      const newRune = runeData[lang].find(r => r.id === item.rune.id);
      return newRune ? { ...item, rune: { ...newRune, deckId: item.rune.deckId } } : item;
    }));
  }, [lang]);

  // Initialize positions
  useEffect(() => {
    const init = () => {
      const rect = tableRef.current?.getBoundingClientRect();
      const w = rect?.width || 600, h = rect?.height || 400;
      const cx = (w - CARD_W) / 2, cy = (h - CARD_H) / 2;
      const pos = {};
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

  const clamp = (x, y, w, h) => ({ 
    x: Math.max(PAD, Math.min(x, w - CARD_W - PAD)), 
    y: Math.max(PAD, Math.min(y, h - CARD_H - PAD)) 
  });

  const calcMotion = (hist) => {
    if (hist.length < 10) return { angle: 0, intensity: 0 };
    const recent = hist.slice(-20);
    let totAngle = 0, totDist = 0;
    for (let i = 1; i < recent.length; i++) {
      const dx = recent[i].x - recent[i-1].x, dy = recent[i].y - recent[i-1].y;
      const angle = Math.atan2(dy, dx), dist = Math.sqrt(dx*dx + dy*dy);
      if (i > 1) {
        const pdx = recent[i-1].x - recent[i-2].x, pdy = recent[i-1].y - recent[i-2].y;
        let diff = angle - Math.atan2(pdy, pdx);
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        totAngle += diff;
      }
      totDist += dist;
    }
    return { angle: totAngle * 50, intensity: Math.min(totDist / 400, 1) };
  };

  const shuffle = (intensity) => {
    const rect = tableRef.current?.getBoundingClientRect();
    const w = rect?.width || 600, h = rect?.height || 400;
    setPositions(prev => {
      const newPos = { ...prev };
      const ids = Object.keys(newPos);
      const swaps = Math.floor(intensity * 8);
      for (let i = 0; i < swaps; i++) {
        const a = Math.floor(Math.random() * ids.length), b = Math.floor(Math.random() * ids.length);
        const tmp = newPos[ids[a]].z; newPos[ids[a]].z = newPos[ids[b]].z; newPos[ids[b]].z = tmp;
      }
      ids.forEach(id => {
        const scatter = intensity * 70;
        const nx = newPos[id].x + (Math.random() - 0.5) * scatter * 0.3;
        const ny = newPos[id].y + (Math.random() - 0.5) * scatter * 0.3;
        const c = clamp(nx, ny, w, h);
        newPos[id] = { ...newPos[id], x: c.x, y: c.y, rot: newPos[id].rot + (Math.random() - 0.5) * intensity * 20 };
      });
      return newPos;
    });
  };

  const handleMove = (clientX, clientY) => {
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

  const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const handleTouchMove = (e) => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); };
  const handleDown = () => { if (mode === 'shuffle') { setShuffling(true); history.current = []; } };
  const handleUp = () => { setShuffling(false); setShuffleAngle(0); setShuffleIntensity(0); history.current = []; };

  const handleCardClick = (deckId) => {
    if (mode !== 'select') return;
    const max = currentSpread.count;
    if (selected.includes(deckId)) {
      setSelected(prev => prev.filter(id => id !== deckId));
      setOrderMap(prev => { const m = { ...prev }; delete m[deckId]; return m; });
    } else if (selected.length < max) {
      setOrderMap(prev => ({ ...prev, [deckId]: Math.max(0, ...Object.values(prev)) + 1 }));
      setSelected(prev => [...prev, deckId]);
    }
  };

  const revealNext = () => {
    const card = selected.find(id => !revealed.some(r => r.deckId === id));
    if (!card) return;
    const runeBase = deck.find(r => r.deckId === card);
    const runeTranslated = runeData[lang].find(r => r.id === runeBase.id);
    const rune = { ...runeTranslated, deckId: card };
    const order = orderMap[card] || 1;
    const pos = currentSpread.positions[order - 1] || '';
    setRevealed(prev => [...prev, { deckId: card, rune, order, position: pos }]);
    setSelected(prev => prev.filter(id => id !== card));
  };

  const revealAll = () => {
    const cards = selected.filter(id => !revealed.some(r => r.deckId === id));
    const newRevealed = cards.map(id => {
      const runeBase = deck.find(r => r.deckId === id);
      const runeTranslated = runeData[lang].find(r => r.id === runeBase.id);
      const rune = { ...runeTranslated, deckId: id };
      const order = orderMap[id] || 1;
      return { deckId: id, rune, order, position: currentSpread.positions[order - 1] || '' };
    });
    setRevealed(prev => [...prev, ...newRevealed]);
    setSelected([]);
  };

  const reset = () => {
    const rect = tableRef.current?.getBoundingClientRect();
    const w = rect?.width || 600, h = rect?.height || 400;
    const cx = (w - CARD_W) / 2, cy = (h - CARD_H) / 2;
    const pos = {};
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
    const pos = {};
    deck.forEach((r, i) => {
      const row = Math.floor(i / cols), col = i % cols;
      const c = clamp(sx + col * spX, sy + row * spY, w, h);
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
          <button onClick={() => setShowDeck(false)} className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded text-amber-400 text-xs hover:bg-amber-500/30">{t.back}</button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {runes.map((r, i) => (
            <div key={i} className="bg-stone-900/80 border border-amber-500/30 rounded p-2 text-center hover:border-amber-400/60 transition-colors">
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
    return selected.length > 0 ? t.readInstructionWithSelection.replace('{count}', selected.length) : t.readInstructionNoSelection;
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
              <span className="text-amber-500/60">({selected.length}/{currentSpread.count})</span>
              <svg className={`w-3 h-3 transition-transform ${showSpreadMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showSpreadMenu && (
              <div className="absolute top-full left-0 mt-1 bg-stone-900 border border-amber-500/30 rounded shadow-xl z-50 min-w-48">
                {spreads.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => { setSpread(s.id); setShowSpreadMenu(false); reset(); }}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-stone-800 flex justify-between items-center ${spread === s.id ? 'text-amber-400 bg-amber-500/10' : 'text-stone-300'}`}
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
          {[['shuffle', '🌀', t.shuffleMode], ['select', '👆', t.selectMode], ['read', '🔮', t.readMode]].map(([m, icon, label]) => (
            <button 
              key={m} 
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${mode === m ? 'bg-amber-500 text-stone-900' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions + Language */}
        <div className="flex items-center gap-2">
          <button onClick={() => setShowDeck(true)} className="px-2 py-1.5 bg-stone-800 border border-amber-500/30 rounded text-xs text-amber-300 hover:bg-stone-700">📖</button>
          <div className="flex gap-0.5">
            <button onClick={() => setLang('pt-BR')} className={`px-2 py-1 rounded text-xs font-medium ${lang === 'pt-BR' ? 'bg-amber-500 text-stone-900' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}>PT</button>
            <button onClick={() => setLang('en')} className={`px-2 py-1 rounded text-xs font-medium ${lang === 'en' ? 'bg-amber-500 text-stone-900' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}>EN</button>
          </div>
        </div>
      </header>

      {/* Main Table Area - Takes maximum space */}
      <div className="flex-1 flex flex-col p-2 gap-2 min-h-0">
        
        {/* Instruction + Read Controls - Compact */}
        <div className="flex items-center justify-center gap-3 flex-shrink-0">
          <span className="text-xs text-stone-400 bg-stone-900/60 px-3 py-1 rounded-full">{getInstruction()}</span>
          {mode === 'read' && selected.length > 0 && (
            <>
              <button onClick={revealNext} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-500">🎴 {t.revealNext}</button>
              <button onClick={revealAll} className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-medium hover:bg-amber-500">🃏 {t.revealAll}</button>
            </>
          )}
        </div>

        {/* Table - Maximum height */}
        <div 
          ref={tableRef} 
          className="flex-1 relative rounded-xl overflow-hidden cursor-crosshair"
          style={{ 
            background: 'radial-gradient(ellipse at center, #0f5132 0%, #064e3b 50%, #022c22 100%)', 
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5), 0 0 0 4px #2d1810, 0 0 0 6px #1a0f0a' 
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
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
          
          {/* Shuffle indicator */}
          {mode === 'shuffle' && shuffling && shuffleIntensity > 0.1 && (
            <div className="absolute pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
              <div className="w-20 h-20 rounded-full border-4 border-dashed" style={{ transform: `rotate(${shuffleAngle}deg) scale(${1 + shuffleIntensity * 0.3})`, borderColor: `rgba(212, 175, 55, ${0.3 + shuffleIntensity * 0.5})` }} />
            </div>
          )}

          {/* Rune Cards */}
          {deck.filter(r => !revealed.some(rv => rv.deckId === r.deckId)).map(r => {
            const p = positions[r.deckId] || { x: 250, y: 150, rot: 0, z: 0 };
            const isSel = selected.includes(r.deckId);
            const order = orderMap[r.deckId] || 0;
            return (
              <div 
                key={r.deckId} 
                onClick={() => handleCardClick(r.deckId)}
                className={`absolute cursor-pointer select-none transition-all duration-300 ${isSel ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-emerald-900' : ''}`}
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
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-stone-900 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-lg">{order}</div>
                )}
                <div className="w-full h-full rounded-lg shadow-xl flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)', border: '2px solid #d4af37' }}>
                  <div className="w-10 h-14 rounded border border-amber-500/30 flex items-center justify-center" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(212,175,55,0.08) 2px, rgba(212,175,55,0.08) 4px)' }}>
                    <span className="text-amber-500/50 text-lg">᚛</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Bar - Compact */}
        <div className="flex items-center justify-center gap-2 flex-shrink-0">
          <button onClick={reset} className="px-4 py-1.5 bg-rose-900/80 text-rose-200 rounded text-xs font-medium hover:bg-rose-800 transition-colors">{t.resetDeck}</button>
          <button onClick={spreadCardsOut} className="px-4 py-1.5 bg-sky-900/80 text-sky-200 rounded text-xs font-medium hover:bg-sky-800 transition-colors">{t.spreadCards}</button>
        </div>
      </div>

      {/* Revealed Runes - Horizontal scrollable bar at bottom */}
      {revealed.length > 0 && (
        <div className="bg-stone-900/90 border-t border-amber-500/30 px-3 py-2 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-amber-400/80 text-xs whitespace-nowrap flex-shrink-0">{t.revealedRunes}</span>
            <div className="flex gap-2 pb-1">
              {revealed.sort((a, b) => a.order - b.order).map(item => (
                <div key={item.deckId} className="flex-shrink-0 flex flex-col items-center p-2 bg-stone-800/80 rounded border border-amber-500/30 min-w-16">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-4 h-4 bg-amber-500 text-stone-900 rounded-full flex items-center justify-center text-xs font-bold">{item.order}</div>
                    <span className="text-amber-400/70 text-xs truncate max-w-12">{item.position}</span>
                  </div>
                  <div className="text-xl text-amber-400">{item.rune.symbol}</div>
                  <div className="text-amber-300 text-xs font-semibold truncate w-full text-center">{item.rune.name}</div>
                  <div className="text-stone-400 text-xs truncate w-full text-center">{item.rune.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close spread menu */}
      {showSpreadMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowSpreadMenu(false)} />
      )}
    </div>
  );
}
