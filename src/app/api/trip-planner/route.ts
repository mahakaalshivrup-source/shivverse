import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROK_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function buildSystemPrompt(userCity: string, destination: string): string {
  return `You are a travel assistant guiding a devotee to a Jyotirlinga. Provide a concise, highly accurate route from "${userCity}" to "${destination}".
Return ONLY a valid JSON object in this exact format (no markdown blocks, no explanation, no extra text — just the raw JSON object):
{
  "intro": "A 2-3 sentence conversational paragraph mentioning the direction of the destination relative to the user's city, the approximate total distance, the terrain (e.g., mountainous, coastal), and overall travel time.",
  "road": {
    "details": "Distance, time, road conditions, and public transport options.",
    "searchQuery": "Google Maps query (e.g., ${userCity} to ${destination})"
  },
  "cheapest": {
    "details": "The most economical combination (Train + Road + Public transport). Include total journey time.",
    "searchQuery": "Google search query for trains (e.g., Trains from ${userCity} to nearest railway station)"
  },
  "fastest": {
    "details": "The fastest combination (Flight + Road). Include total journey time.",
    "searchQuery": "Google search query for flights (e.g., Flights from ${userCity} to nearest airport)"
  }
}`;
}

interface TripResponse {
  intro: string;
  road: { details: string; searchQuery: string };
  cheapest: { details: string; searchQuery: string };
  fastest: { details: string; searchQuery: string };
}

/* ─── Groq (primary) ─── */

async function callGroq(systemPrompt: string): Promise<TripResponse> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate the travel route now." },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const rawText = data?.choices?.[0]?.message?.content || "";

  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  return JSON.parse(cleaned);
}

/* ─── Gemini (fallback) ─── */

async function callGemini(systemPrompt: string): Promise<TripResponse> {
  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: systemPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return JSON.parse(rawText);
}

/* ─── Route handler ─── */

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY && !GEMINI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "No API keys configured. Set GROK_API_KEY (Groq) or GEMINI_API_KEY in .env.local.",
      },
      { status: 500 }
    );
  }

  try {
    const { userCity, destination } = await req.json();

    if (
      !userCity ||
      typeof userCity !== "string" ||
      !destination ||
      typeof destination !== "string"
    ) {
      return NextResponse.json(
        { error: "userCity and destination are required strings." },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(userCity, destination);

    let parsed: TripResponse | null = null;

    // ── Primary: Groq ──
    if (GROQ_API_KEY) {
      try {
        console.log("[trip-planner] Trying Groq…");
        parsed = await callGroq(systemPrompt);
        console.log("[trip-planner] Groq succeeded.");
      } catch (err) {
        console.warn(
          "[trip-planner] Groq failed, falling back to Gemini:",
          err
        );
      }
    }

    // ── Fallback: Gemini ──
    if (!parsed && GEMINI_API_KEY) {
      try {
        console.log("[trip-planner] Trying Gemini fallback…");
        parsed = await callGemini(systemPrompt);
        console.log("[trip-planner] Gemini succeeded.");
      } catch (err) {
        console.error("[trip-planner] Gemini fallback also failed:", err);
      }
    }

    if (!parsed) {
      return NextResponse.json(
        { error: "Both AI providers failed. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[trip-planner] Route error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
