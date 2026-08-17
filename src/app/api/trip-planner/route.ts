import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GROQ_API_KEY_1 = process.env.GROQ_API_KEY_1;
const GROQ_API_KEY_2 = process.env.GROK_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function buildSystemPrompt(userCity: string, destination: string): string {
  return `You are a travel assistant guiding a devotee to a Jyotirlinga. Provide a concise, highly accurate route from "${userCity}" to "${destination}".
Return ONLY a valid JSON object in this exact format (no markdown blocks, no explanation, no extra text - just the raw JSON object):
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

async function callGroq(systemPrompt: string, key: string): Promise<TripResponse> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
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

async function callOpenRouter(systemPrompt: string, modelName: string): Promise<TripResponse> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://shivshiv.in",
      "X-Title": "ShivVerse Travel Planner",
    },
    body: JSON.stringify({
      model: modelName,
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
    throw new Error(`OpenRouter API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const rawText = data?.choices?.[0]?.message?.content || "";

  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY_1 && !GROQ_API_KEY_2 && !OPENROUTER_API_KEY) {
    return NextResponse.json(
      {
        error:
          "No API keys configured. Set GROQ_API_KEY_1, GROK_API_KEY, or OPENROUTER_API_KEY in .env.local.",
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

    // 🚀 TIER 1: Groq Account 1
    if (GROQ_API_KEY_1) {
      try {
        console.log("[trip-planner] Trying Tier 1: Groq Account 1...");
        parsed = await callGroq(systemPrompt, GROQ_API_KEY_1);
        console.log("[trip-planner] Tier 1 succeeded.");
      } catch (err) {
        console.warn("[trip-planner] Groq Account 1 failed. Rerouting to Tier 2...");
      }
    }

    // 🚄 TIER 2: Groq Account 2
    if (!parsed && GROQ_API_KEY_2) {
      try {
        console.log("[trip-planner] Trying Tier 2: Groq Account 2...");
        parsed = await callGroq(systemPrompt, GROQ_API_KEY_2);
        console.log("[trip-planner] Tier 2 succeeded.");
      } catch (err) {
        console.warn("[trip-planner] Groq Account 2 failed. Rerouting to OpenRouter...");
      }
    }

    // 🛡️ TIERS 3, 4: OpenRouter Waterfall
    const openRouterModels = [
      "poolside/laguna-s-2.1:free",
      "google/gemma-4-26b-a4b-it:free"
    ];

    for (let i = 0; i < openRouterModels.length; i++) {
      if (!parsed && OPENROUTER_API_KEY) {
        try {
          console.log(`[trip-planner] Trying Tier ${i + 3}: OpenRouter (${openRouterModels[i]})...`);
          parsed = await callOpenRouter(systemPrompt, openRouterModels[i]);
          console.log(`[trip-planner] Tier ${i + 3} succeeded.`);
          break;
        } catch (err) {
          console.warn(`[trip-planner] Tier ${i + 3} failed. Trying next...`);
        }
      }
    }

    if (!parsed) {
      return NextResponse.json(
        { error: "Both AI providers failed to parse route. Please try again later." },
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
