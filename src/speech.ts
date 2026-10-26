import { getAccent } from './store';

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

let voices: SpeechSynthesisVoice[] = [];
if (canSpeak) {
  const load = () => (voices = speechSynthesis.getVoices());
  load();
  speechSynthesis.addEventListener('voiceschanged', load);
}

const GOOD_VOICE = /Google|Natural|Premium|Enhanced|Daniel|Serena|Kate|Samantha|Alex|Ava|Karen/i;

function pickVoice(lang: string) {
  const exact = voices.filter((v) => v.lang.replace('_', '-') === lang);
  return exact.find((v) => GOOD_VOICE.test(v.name)) ?? exact[0] ?? voices.find((v) => v.lang.startsWith('en'));
}

export function speak(text: string, rate = 0.95) {
  if (!canSpeak) return;
  speechSynthesis.cancel();
  const lang = getAccent();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const voice = pickVoice(lang);
  if (voice) u.voice = voice;
  u.rate = rate;
  speechSynthesis.speak(u);
}
