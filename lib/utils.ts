import { translations } from './constants';
import { Spread } from './types';

export const getSpreadTypes = (t: typeof translations['en']): Spread[] => [
  { id: 'single-rune', label: t.singleRune, count: 1, positions: [t.positions.guidance] },
  { id: 'past-present-future', label: t.pastPresentFuture, count: 3, positions: [t.positions.past, t.positions.present, t.positions.future] },
  { id: 'situation-action-outcome', label: t.situationActionOutcome, count: 3, positions: [t.positions.situation, t.positions.action, t.positions.outcome] },
  { id: 'mind-body-spirit', label: t.mindBodySpirit, count: 3, positions: [t.positions.mind, t.positions.body, t.positions.spirit] },
  { id: 'embrace-release-focus', label: t.embraceReleaseFocus, count: 3, positions: [t.positions.embrace, t.positions.release, t.positions.focus] },
  { id: 'five-rune', label: t.fiveRune, count: 5, positions: [t.positions.challenge, t.positions.path, t.positions.hidden, t.positions.outcome, t.positions.advice] },
  { id: 'celtic-cross', label: t.celticCross, count: 10, positions: [t.positions.core, t.positions.challenge, t.positions.desire, t.positions.subconscious, t.positions.past, t.positions.future, t.positions.influences, t.positions.attitude, t.positions.hopes, t.positions.outcome] },
];

export const clamp = (x: number, y: number, w: number, h: number, CARD_W: number, CARD_H: number, PAD: number) => ({
  x: Math.max(PAD, Math.min(x, w - CARD_W - PAD)),
  y: Math.max(PAD, Math.min(y, h - CARD_H - PAD))
});

export const calcMotion = (hist: Array<{ x: number; y: number }>) => {
  if (hist.length < 10) return { angle: 0, intensity: 0 };
  const recent = hist.slice(-20);
  let totAngle = 0, totDist = 0;
  for (let i = 1; i < recent.length; i++) {
    const curr = recent[i];
    const prev = recent[i - 1];
    if (!curr || !prev) continue;
    const dx = curr.x - prev.x, dy = curr.y - prev.y;
    const angle = Math.atan2(dy, dx), dist = Math.sqrt(dx * dx + dy * dy);
    if (i > 1) {
      const prevPrev = recent[i - 2];
      if (!prevPrev) continue;
      const pdx = prev.x - prevPrev.x, pdy = prev.y - prevPrev.y;
      let diff = angle - Math.atan2(pdy, pdx);
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      totAngle += diff;
    }
    totDist += dist;
  }
  return { angle: totAngle * 50, intensity: Math.min(totDist / 400, 1) };
};
