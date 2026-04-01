#!/usr/bin/env node
'use strict';

require('dotenv').config();
const https = require('https');

// ─── Config ────────────────────────────────────────────────────────────────
const BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID    = process.env.TELEGRAM_CHAT_ID;

const STUDY_START = new Date('2026-03-29T00:00:00Z');
const TRIP_DATE   = new Date('2026-05-22T00:00:00Z');

// ─── Study plan (mirrors index.html) ───────────────────────────────────────
const weeks = [
  {
    num: 1,
    title: 'Greetings & Basic Introductions',
    goal: 'Confidently greet people and introduce yourself in Guadalajara.',
    routine: ['Morning: Review 5 phrases out loud',
              'Afternoon: Flashcard drill for 10 minutes',
              'Evening: Practice one short conversation'],
    phrases: [
      { es: 'Hola, ¿cómo estás?',              en: 'Hello, how are you?' },
      { es: 'Muy bien, gracias. ¿Y tú?',        en: 'Very well, thanks. And you?' },
      { es: 'Me llamo [nombre].',               en: 'My name is [name].' },
      { es: 'Mucho gusto.',                     en: 'Nice to meet you.' },
      { es: '¿De dónde eres?',                  en: 'Where are you from?' },
      { es: 'Soy de los Estados Unidos.',       en: "I'm from the United States." },
      { es: '¿Hablas inglés?',                  en: 'Do you speak English?' },
      { es: 'Hablo un poco de español.',        en: 'I speak a little Spanish.' },
      { es: 'Por favor, habla más despacio.',   en: 'Please speak more slowly.' },
      { es: 'No entiendo.',                     en: "I don't understand." },
      { es: '¿Puedes repetir eso?',             en: 'Can you repeat that?' },
      { es: 'Encantado/Encantada.',             en: 'Pleased to meet you.' },
    ],
  },
  {
    num: 2,
    title: 'Numbers, Time & Dates',
    goal: 'Handle prices, schedules, and dates with ease.',
    routine: ['Morning: Count objects around you in Spanish',
              'Afternoon: Flashcard drill focusing on numbers',
              'Evening: Simulate buying a ticket or asking for the time'],
    phrases: [
      { es: '¿Cuánto cuesta?',            en: 'How much does it cost?' },
      { es: 'Son veinte pesos.',           en: "It's twenty pesos." },
      { es: '¿Qué hora es?',              en: 'What time is it?' },
      { es: 'Son las tres de la tarde.',  en: "It's 3 in the afternoon." },
      { es: '¿A qué hora abre?',          en: 'What time does it open?' },
      { es: '¿A qué hora cierra?',        en: 'What time does it close?' },
      { es: 'Hoy es lunes.',              en: 'Today is Monday.' },
      { es: 'Mañana es martes.',          en: 'Tomorrow is Tuesday.' },
      { es: 'La semana que viene.',       en: 'Next week.' },
      { es: '¿Cuántos años tienes?',      en: 'How old are you?' },
      { es: 'Tengo treinta años.',        en: 'I am thirty years old.' },
      { es: 'El cinco de mayo.',          en: 'The fifth of May.' },
    ],
  },
  {
    num: 3,
    title: 'Food & Ordering at Restaurants',
    goal: 'Order tapatío food confidently — tortas ahogadas, birria, and more.',
    routine: ['Morning: Review menu vocabulary',
              'Afternoon: Flashcard drill on food phrases',
              'Evening: Simulate ordering at a Guadalajara restaurant'],
    phrases: [
      { es: 'Una mesa para dos, por favor.',         en: 'A table for two, please.' },
      { es: '¿Me puede traer la carta?',             en: 'Can you bring me the menu?' },
      { es: '¿Qué recomienda usted?',                en: 'What do you recommend?' },
      { es: 'Quiero una torta ahogada, por favor.',  en: "I'd like a torta ahogada, please." },
      { es: '¿Tiene opciones vegetarianas?',         en: 'Do you have vegetarian options?' },
      { es: 'La cuenta, por favor.',                 en: 'The bill, please.' },
      { es: 'Está delicioso.',                       en: "It's delicious." },
      { es: 'Sin chile, por favor.',                 en: 'Without chili, please.' },
      { es: '¿Está incluida la propina?',            en: 'Is the tip included?' },
      { es: 'Dos cervezas, por favor.',              en: 'Two beers, please.' },
      { es: '¿Qué lleva este platillo?',             en: 'What does this dish have in it?' },
      { es: 'Me gustaría pedir...',                  en: 'I would like to order...' },
    ],
  },
  {
    num: 4,
    title: 'Directions & Getting Around',
    goal: "Navigate Guadalajara's streets, take the tren ligero, and find landmarks.",
    routine: ['Morning: Study a map of Guadalajara Centro and say directions out loud',
              'Afternoon: Flashcard drill on directions',
              'Evening: Simulate asking for directions to Hospicio Cabañas'],
    phrases: [
      { es: '¿Dónde está...?',                    en: 'Where is...?' },
      { es: '¿Cómo llego al centro histórico?',   en: 'How do I get to the historic center?' },
      { es: 'Siga recto.',                         en: 'Go straight.' },
      { es: 'Doble a la derecha.',                 en: 'Turn right.' },
      { es: 'Doble a la izquierda.',               en: 'Turn left.' },
      { es: 'Está a dos cuadras.',                 en: "It's two blocks away." },
      { es: '¿Hay una parada de metro cerca?',     en: 'Is there a metro stop nearby?' },
      { es: 'Quiero ir a Tlaquepaque.',            en: 'I want to go to Tlaquepaque.' },
      { es: '¿Cuánto tarda en llegar?',            en: 'How long does it take to get there?' },
      { es: 'Llámeme un taxi, por favor.',         en: 'Please call me a taxi.' },
      { es: '¿Para aquí el camión?',               en: 'Does the bus stop here?' },
      { es: 'Estoy perdido/perdida.',              en: "I'm lost." },
    ],
  },
  {
    num: 5,
    title: 'Shopping & Markets',
    goal: 'Bargain at Mercado San Juan de Dios and shop in Tlaquepaque.',
    routine: ['Morning: Review shopping vocabulary',
              'Afternoon: Flashcard drill on market phrases',
              'Evening: Simulate haggling at a craft market'],
    phrases: [
      { es: '¿Cuánto cuesta esto?',           en: 'How much is this?' },
      { es: '¿Tiene algo más barato?',         en: 'Do you have something cheaper?' },
      { es: '¿Me puede hacer un descuento?',   en: 'Can you give me a discount?' },
      { es: 'Me lo llevo.',                    en: "I'll take it." },
      { es: 'Solo estoy mirando.',             en: "I'm just browsing." },
      { es: '¿Aceptan tarjeta?',              en: 'Do you accept cards?' },
      { es: '¿Dónde están los artesanías?',   en: 'Where are the handicrafts?' },
      { es: 'Es un regalo.',                   en: "It's a gift." },
      { es: '¿Tiene esto en otro color?',      en: 'Do you have this in another color?' },
      { es: '¿Puedo probármelo?',              en: 'Can I try it on?' },
      { es: 'Es demasiado caro.',              en: "It's too expensive." },
      { es: 'Voy a pensarlo.',                 en: "I'll think about it." },
    ],
  },
  {
    num: 6,
    title: 'Social Situations & Making Friends',
    goal: 'Have real conversations with locals — at a cantina, a party, or on the street.',
    routine: ['Morning: Review social phrases and small talk',
              'Afternoon: Flashcard drill',
              'Evening: Simulate meeting someone at a tapatío cantina'],
    phrases: [
      { es: '¿Eres de Guadalajara?',                     en: 'Are you from Guadalajara?' },
      { es: '¿Qué haces aquí?',                          en: 'What are you doing here?' },
      { es: 'Estoy de visita.',                           en: "I'm visiting." },
      { es: 'Me encanta tu ciudad.',                      en: 'I love your city.' },
      { es: '¿Cuál es tu lugar favorito en Guadalajara?', en: "What's your favorite place in Guadalajara?" },
      { es: '¿Me recomiendas algún lugar?',               en: 'Do you recommend a place?' },
      { es: '¿Quieres tomar algo?',                       en: 'Do you want to grab a drink?' },
      { es: '¡Salud!',                                    en: 'Cheers!' },
      { es: 'Fue un placer conocerte.',                   en: 'It was a pleasure meeting you.' },
      { es: '¿Puedo tener tu número?',                    en: 'Can I have your number?' },
      { es: 'Nos vemos después.',                         en: 'See you later.' },
      { es: '¡Qué padre!',                               en: 'How cool! (Mexican slang)' },
    ],
  },
  {
    num: 7,
    title: 'Emergencies & Practical Needs',
    goal: 'Handle unexpected situations — health issues, getting help, and staying safe.',
    routine: ['Morning: Review emergency vocabulary',
              'Afternoon: Flashcard drill',
              'Evening: Simulate a scenario where you need help'],
    phrases: [
      { es: 'Necesito ayuda.',                       en: 'I need help.' },
      { es: '¡Llame a la policía!',                 en: 'Call the police!' },
      { es: 'Necesito un médico.',                   en: 'I need a doctor.' },
      { es: 'Me robaron.',                            en: 'I was robbed.' },
      { es: 'Perdí mi pasaporte.',                    en: 'I lost my passport.' },
      { es: '¿Dónde está el hospital más cercano?',  en: 'Where is the nearest hospital?' },
      { es: 'Me siento mal.',                         en: 'I feel sick.' },
      { es: 'Tengo alergias a...',                    en: "I'm allergic to..." },
      { es: '¿Hay una farmacia cerca?',               en: 'Is there a pharmacy nearby?' },
      { es: 'Necesito llamar a mi embajada.',         en: 'I need to call my embassy.' },
      { es: 'No hablo bien español.',                 en: "I don't speak Spanish well." },
      { es: '¿Hay alguien que hable inglés?',        en: 'Is there anyone who speaks English?' },
    ],
  },
  {
    num: 8,
    title: 'Review & Guadalajara Specifics',
    goal: 'Final polish — local slang, key landmarks, and full confidence.',
    routine: ['Morning: Full review of all weeks',
              'Afternoon: Rapid flashcard drill across all phrases',
              'Evening: Full conversation simulation covering multiple scenarios'],
    phrases: [
      { es: '¡Órale!',                                en: "All right! / Let's go! (Mexican)" },
      { es: '¡Está cañón!',                           en: "It's intense/tough! (Mexican slang)" },
      { es: '¿Qué onda?',                             en: "What's up? (Mexican casual)" },
      { es: 'Chido/Chida',                            en: 'Cool (Mexican slang)' },
      { es: 'No manches.',                            en: 'No way! / Are you serious? (Mexican)' },
      { es: 'Quiero visitar el Hospicio Cabañas.',    en: 'I want to visit Hospicio Cabañas.' },
      { es: '¿Dónde puedo ver la lucha libre?',      en: 'Where can I watch lucha libre?' },
      { es: '¿A qué hora es el partido de Chivas?',  en: 'What time is the Chivas game?' },
      { es: 'El mariachi es de Jalisco.',             en: 'Mariachi music is from Jalisco.' },
      { es: 'Quiero probar la birria de chivo.',      en: 'I want to try goat birria.' },
      { es: '¿Dónde queda la Catedral de Guadalajara?', en: 'Where is the Guadalajara Cathedral?' },
      { es: 'Muchas gracias por todo.',               en: 'Thank you for everything.' },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function getCurrentWeek() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const daysSinceStart = Math.floor((today - STUDY_START) / 86_400_000);
  const idx = Math.min(Math.max(0, Math.floor(daysSinceStart / 7)), 7);
  return weeks[idx];
}

function daysUntilTrip() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((TRIP_DATE - today) / 86_400_000));
}

// Pick 4 random phrases from the current week for the evening recap
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// ─── Message builders ──────────────────────────────────────────────────────
function buildMorningMessage(week) {
  const days = daysUntilTrip();
  const lines = [];

  lines.push(`🇲🇽 *Buenos días — Spanish Practice*`);
  lines.push(`_${days} days until Guadalajara_ ✈️`);
  lines.push('');
  lines.push(`*Week ${week.num} of 8: ${week.title}*`);
  lines.push(`_${week.goal}_`);
  lines.push('');
  lines.push(`*Today's Phrases*`);

  week.phrases.forEach(p => {
    lines.push(`• *${p.es}*`);
    lines.push(`  _${p.en}_`);
  });

  lines.push('');
  lines.push(`*Daily Routine*`);
  week.routine.forEach(r => lines.push(`• ${r}`));

  lines.push('');
  lines.push(`🎧 *Listen:* Language Transfer Complete Spanish — 10 min/lesson, great for commuting.`);
  lines.push('');
  lines.push(`¡Buena suerte hoy! 💪`);

  return lines.join('\n');
}

function buildEveningMessage(week) {
  const days = daysUntilTrip();
  const reviewPhrases = pickRandom(week.phrases, 4);
  const lines = [];

  lines.push(`🌙 *Buenas noches — Evening Review*`);
  lines.push(`_${days} days until Guadalajara_ ✈️`);
  lines.push('');
  lines.push(`*Week ${week.num}: ${week.title}*`);
  lines.push('');
  lines.push(`*Quick Recall — translate these:*`);

  reviewPhrases.forEach(p => {
    lines.push(`• *${p.es}*`);
    lines.push(`  ||${p.en}||`);   // Telegram spoiler tag — tap to reveal
  });

  lines.push('');
  lines.push(`*Evening task:* ${week.routine[2]}`);
  lines.push('');
  lines.push(`Open the app to practice with the Conversation Simulator! 📱`);
  lines.push(`_Tap the spoilers above to check your answers._`);
  lines.push('');
  lines.push(`🎧 *Listen:* Squeeze in a Language Transfer lesson before bed — 10 min is all it takes.`);

  return lines.join('\n');
}

// ─── Telegram sender ───────────────────────────────────────────────────────
function sendTelegram(text) {
  return new Promise((resolve, reject) => {
    if (!BOT_TOKEN) return reject(new Error('TELEGRAM_BOT_TOKEN is not set'));
    if (!CHAT_ID)   return reject(new Error('TELEGRAM_CHAT_ID is not set'));

    const body = JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'Markdown',
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.ok) {
          console.log(`✅  Message sent (message_id: ${json.result.message_id})`);
          resolve(json);
        } else {
          reject(new Error(`Telegram API error: ${json.description}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  // Accept explicit argument: node send-message.js morning|evening
  // Fall back to inferring from current UTC hour if no argument given.
  let timeOfDay = process.argv[2];

  if (!timeOfDay) {
    const utcHour = new Date().getUTCHours();
    // 15:00 UTC = 8 AM PDT  →  morning
    // 03:00 UTC = 8 PM PDT  →  evening
    timeOfDay = utcHour < 12 ? 'evening' : 'morning';
  }

  const week = getCurrentWeek();
  console.log(`📅  Week ${week.num} — ${week.title}`);
  console.log(`⏰  Sending ${timeOfDay} message…`);

  const text =
    timeOfDay === 'evening'
      ? buildEveningMessage(week)
      : buildMorningMessage(week);

  await sendTelegram(text);
}

main().catch(err => {
  console.error('❌ ', err.message);
  process.exit(1);
});
