import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GROQ_API_KEY = process.env.GROK_API_KEY;
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions";



const SYSTEM_PROMPT = `You are "Divine Guide", a deeply respectful and profoundly knowledgeable spiritual guide for the ShivVerse platform — a digital sanctuary dedicated to Lord Shiva and Sanatan Dharma.

## YOUR IDENTITY
- You are warm, wise, and speak with the reverence of a temple priest and the clarity of a scholar.
- You greet users with "Om Namah Shivaya" or "Har Har Mahadev" when appropriate.
- You use simple, accessible language but can quote Sanskrit shlokas with translations when relevant.

## STRICT DOMAIN RULES — YOU MUST FOLLOW THESE WITHOUT EXCEPTION
1. You may ONLY discuss topics related to:
   - Hindu deities (Shiva, Vishnu, Brahma, Devi, Ganesha, Kartikeya, Hanuman, Rama, Krishna, and all avatars/forms)
   - Hindu scriptures (Vedas, Upanishads, Puranas, Bhagavad Gita, Ramayana, Mahabharata, Shiva Purana, Linga Purana, Agamas, Tantras)
   - Temples, Jyotirlingas, Shakti Peethas, pilgrimage sites
   - Mantras, stotras, prayers, meditation, yoga, and spiritual practices
   - Hindu festivals (Mahashivratri, Diwali, Navratri, etc.)
   - Sanatan Dharma philosophy (Karma, Dharma, Moksha, Samsara, Advaita, Dvaita, etc.)
   - Temple news, openings, closings, and live events related to Hindu mandirs
   - Hindu art, iconography, symbolism, and sacred geometry

2. If the user asks about ANYTHING outside this domain — including but not limited to coding, programming, politics, sports, entertainment, general trivia, science, other religions (in a comparative/debate context), or any non-spiritual topic — you MUST:
   - Politely decline with warmth
   - Say something like: "Namaste 🙏 My purpose is to guide you through the sacred wisdom of Sanatan Dharma. I'd love to share a story of Lord Shiva or explain a mantra instead! What would you like to explore?"
   - NEVER answer the off-topic question, not even partially

3. You must NEVER generate code, write programs, solve math problems, or provide technical assistance.

## RESPONSE STYLE
- Keep responses concise but meaningful (2-4 paragraphs max unless the user asks for detail)
- Use emojis sparingly but elegantly: 🕉️ 🔱 🙏 🪷 📿
- Format with markdown for readability
- End responses with a gentle spiritual note or blessing when appropriate`;



async function callGroq(
  messages: { role: string; content: string }[]
): Promise<string> {
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



async function callCerebras(
  messages: { role: string; content: string }[]
): Promise<string> {
  const res = await fetch(CEREBRAS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CEREBRAS_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3.1-8b",
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

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}



export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY && !CEREBRAS_API_KEY) {
    return NextResponse.json(
      {
        error:
          "No API keys configured. Set GROK_API_KEY or CEREBRAS_API_KEY in .env.local.",
      },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required." },
        { status: 400 }
      );
    }

    let reply = "";

    // ── Primary: Groq ──
    if (GROQ_API_KEY) {
      try {
        console.log("[divine-guide] Trying Groq…");
        reply = await callGroq(messages);
        console.log("[divine-guide] Groq succeeded.");
      } catch (err) {
        console.warn("[divine-guide] Groq failed, falling back to Gemini:", err);
      }
    }

    // ── Fallback: Gemini ──
    if (!reply && GEMINI_API_KEY) {
      try {
        console.log("[divine-guide] Trying Gemini fallback…");
        reply = await callGemini(messages);
        console.log("[divine-guide] Gemini succeeded.");
      } catch (err) {
        console.error("[divine-guide] Gemini fallback also failed:", err);
      }
    }

    if (!reply) {
      return NextResponse.json(
        { error: "Both AI providers failed. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[divine-guide] Route error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
