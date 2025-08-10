import { Note, ProcessedNote } from "@/types/note";
import { categories } from "@/constants/categories";

export async function processNoteWithAI(text: string, addedBy: string): Promise<Note> {
  try {
    const response = await fetch("https://toolkit.rork.com/text/llm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that processes raw notes for a couples' second-brain app.
Return a single valid JSON object only. Do not include markdown, code fences, or any extra text.
Fields:
- summary: concise summary
- category: one of [${categories.join(", ")}]
- dueDate: ISO 8601 string if a date is detected (support phrases like "tomorrow", "next week", weekdays), else null
- tags: string[] (max 3)
- priority: "low" | "medium" | "high"
- items: string[] for actionable atomic items (e.g., split groceries by commas or "and")

Rules:
- If the text clearly describes groceries or a shopping list, set category to "Groceries" and split into items.
- Prefer "Groceries" over generic "Task" for phrases like "buy" + food or store items.
- Do not invent fields. Always return valid JSON only.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("processNoteWithAI: raw LLM response", data);

    let processed: ProcessedNote | undefined;
    try {
      processed = JSON.parse(data?.completion ?? "");
      console.log("processNoteWithAI: parsed AI JSON", processed);
    } catch (_e) {
      console.warn("processNoteWithAI: AI JSON parse failed, completion was:", data?.completion);
    }

    // Heuristics fallback to classify groceries and extract simple items when AI fails
    const lower = text.toLowerCase();
    const isGroceriesHeuristic = /\b(buy|get|grab|pick up|purchase|shop for)\b/.test(lower) && /\b(lemons?|bread|milk|eggs?|tomatoes?|apples?|bananas?|cheese|butter|yogurt|flour|sugar|rice|pasta|coffee|tea|onions?|garlic|lettuce|spinach|berries|meat|chicken|beef|fish)\b/.test(lower);

    const itemsHeuristic = (() => {
      const raw = text
        .split(/,|\band\b|\n/gi)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const cleaned = raw
        .map((s) => s.replace(/^\b(buy|get|grab|pick up|purchase|shop for)\b\s+/i, "").trim())
        .map((s) => s.replace(/^\b(some|a|an|the)\b\s+/i, "").trim())
        .filter((s) => s.length > 0 && s.length <= 50);

      if (cleaned.length > 1) return cleaned;
      return undefined;
    })();

    const category = processed?.category || (isGroceriesHeuristic ? "Groceries" : "Task");

    const note: Note = {
      id: Date.now().toString(),
      originalText: text,
      summary: processed?.summary ?? text.slice(0, 100),
      category,
      dueDate: processed?.dueDate,
      addedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      priority: processed?.priority,
      tags: processed?.tags ?? [],
      items: processed?.items ?? itemsHeuristic,
    };

    return note;
  } catch (error) {
    console.error("Error processing note with AI:", error);

    return {
      id: Date.now().toString(),
      originalText: text,
      summary: text.slice(0, 100),
      category: "Task",
      addedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
    };
  }
}