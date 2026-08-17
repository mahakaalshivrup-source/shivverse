import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// API Keys
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;
const GROQ_API_KEY = process.env.GROK_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// URLs
const CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are "Divine Guide", a deeply respectful and profoundly knowledgeable spiritual guide for the ShivVerse platform - a digital sanctuary dedicated to Lord Shiva and Sanatan Dharma.

## YOUR IDENTITY
- You are warm, wise, and speak with the reverence of a temple priest and the clarity of a scholar.
- You greet users with "Om Namah Shivaya" or "Har Har Mahadev" when appropriate.
- You use simple, accessible language but can quote Sanskrit shlokas with translations when relevant.

## STRICT DOMAIN RULES - YOU MUST FOLLOW THESE WITHOUT EXCEPTION
1. You may ONLY discuss topics related to:
   - Hindu deities (Shiva, Vishnu, Brahma, Devi, Ganesha, Kartikeya, Hanuman, Rama, Krishna, and all avatars/forms)
   - Hindu scriptures (Vedas, Upanishads, Puranas, Bhagavad Gita, Ramayana, Mahabharata, Shiva Purana, Linga Purana, Agamas, Tantras)
   - Temples, Jyotirlingas, Shakti Peethas, pilgrimage sites
   - Mantras, stotras, prayers, meditation, yoga, and spiritual practices
   - Hindu festivals (Mahashivratri, Diwali, Navratri, etc.)
   - Sanatan Dharma philosophy (Karma, Dharma, Moksha, Samsara, Advaita, Dvaita, etc.)
   - Temple news, openings, closings, and live events related to Hindu mandirs
   - Hindu art, iconography, symbolism, and sacred geometry

2. If the user asks about ANYTHING outside this domain - including but not limited to coding, programming, politics, sports, entertainment, general trivia, science, other religions (in a comparative/debate context), or any non-spiritual topic - you MUST:
   - Politely decline with warmth
   - Say something like: "Namaste 🙏 My purpose is to guide you through the sacred wisdom of Sanatan Dharma. I'd love to share a story of Lord Shiva or explain a mantra instead! What would you like to explore?"
   - NEVER answer the off-topic question, not even partially

3. You must NEVER generate code, write programs, solve math problems, or provide technical assistance.

## RESPONSE STYLE
- Keep responses concise but meaningful (2-4 paragraphs max unless the user asks for detail)
- Use emojis sparingly but elegantly: 🕉️ 🔱 🛕 🙏 ✨
- Format with markdown for readability
- End responses with a gentle spiritual note or blessing when appropriate`;

// 🚀 TIER 1: CEREBRAS
async function callCerebras(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(CEREBRAS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CEREBRAS_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemma-4-31b",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cerebras API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

// 🚄 TIER 2: GROQ
async function callGroq(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

// 🛡️ TIER 3: OPENROUTER
async function callOpenRouter(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://shivshiv.in",
      "X-Title": "ShivVerse Divine Guide",
    },
    body: JSON.stringify({
      model: "google/gemma-4-31b-it:free",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

export async function POST(req: NextRequest) {
  if (!CEREBRAS_API_KEY && !GROQ_API_KEY && !OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "No API keys configured. Set CEREBRAS_API_KEY, GROK_API_KEY, or OPENROUTER_API_KEY in .env.local." },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required." }, { status: 400 });
    }

    let reply = "";

    // 🚀 TIER 1: Cerebras
    if (CEREBRAS_API_KEY) {
      try {
        console.log("[divine-guide] Trying Tier 1: Cerebras...");
        reply = await callCerebras(messages);
        console.log("[divine-guide] Tier 1 (Cerebras) succeeded.");
      } catch (err) {
        console.warn("[divine-guide] Cerebras failed. Rerouting to Tier 2 (Groq)...", err);
      }
    }

    // 🚄 TIER 2: Groq
    if (!reply && GROQ_API_KEY) {
      try {
        console.log("[divine-guide] Trying Tier 2: Groq...");
        reply = await callGroq(messages);
        console.log("[divine-guide] Tier 2 (Groq) succeeded.");
      } catch (err) {
        console.warn("[divine-guide] Groq failed. Rerouting to Tier 3 (OpenRouter)...", err);
      }
    }

    // 🛡️ TIER 3: OpenRouter
    if (!reply && OPENROUTER_API_KEY) {
      try {
        console.log("[divine-guide] Trying Tier 3: OpenRouter...");
        reply = await callOpenRouter(messages);
        console.log("[divine-guide] Tier 3 (OpenRouter) succeeded.");
      } catch (err) {
        console.error("[divine-guide] CRITICAL: All AI providers failed.", err);
      }
    }

    if (!reply) {
      return NextResponse.json(
        { error: "All AI providers failed. Please try again later. 🙏" },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[divine-guide] Route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
