import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, mimeType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!audio) {
      throw new Error("Audio data is required");
    }

    const systemPrompt = `You are a Quran recitation recognition expert. When given an audio recording of Quran recitation, you must:

1. Identify the exact Surah name and number
2. Identify the exact Ayah (verse) number(s) being recited
3. Provide the full Arabic text of those ayahs
4. Provide a brief Uzbek translation

RESPONSE FORMAT (always use this exact format):
📖 **Sura:** [Surah name in Arabic] - [Surah name in Uzbek/Latin] (Sura [number])
🔢 **Oyat:** [Ayah number(s)]

---

**Arab matni:**
[Full Arabic text of the identified ayah(s) - use proper Arabic script]

---

**Tarjima (O'zbekcha):**
[Uzbek translation of the identified ayah(s)]

---

**Qo'shimcha ma'lumot:**
[Any relevant context about this ayah - when/why it was revealed, its significance]

If you cannot clearly identify the recitation, say so honestly and ask the user to try again with clearer audio.
If multiple ayahs are recited, identify all of them.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "input_audio",
                input_audio: {
                  data: audio,
                  format: mimeType === "audio/webm" ? "webm" : mimeType === "audio/mp4" ? "mp4" : "wav",
                },
              },
              {
                type: "text",
                text: "Bu Qur'on tilovatidir. Qaysi sura va oyat ekanligini aniqlang. Arab matnini va o'zbekcha tarjimasini bering.",
              },
            ],
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Juda ko'p so'rov. Iltimos, biroz kuting." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI xizmati uchun kredit yetarli emas." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI xizmatida xatolik yuz berdi" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Quran audio recognition error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Noma'lum xatolik" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
