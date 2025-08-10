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
            content: `You are an AI assistant that processes raw notes for a couples' task management app. 
            Extract and return a JSON object with:
            - summary: A clear, concise summary of the main task or idea
            - category: One of these categories: ${categories.join(", ")}
            - dueDate: ISO date string if a date is mentioned (like "tomorrow", "next week", etc.), otherwise null
            - tags: Array of relevant tags (max 3)
            - priority: "low", "medium", or "high" based on urgency
            
            Be smart about date extraction - "tomorrow" means the next day, "next week" means 7 days from now, etc.
            Return ONLY valid JSON, no additional text.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();
    let processed: ProcessedNote;
    
    try {
      processed = JSON.parse(data.completion);
    } catch {
      // Fallback if AI doesn't return valid JSON
      processed = {
        summary: text.slice(0, 100),
        category: "Task",
        tags: [],
      };
    }

    const note: Note = {
      id: Date.now().toString(),
      originalText: text,
      summary: processed.summary || text,
      category: processed.category || "Task",
      dueDate: processed.dueDate,
      addedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      priority: processed.priority,
      tags: processed.tags,
    };

    return note;
  } catch (error) {
    console.error("Error processing note with AI:", error);
    
    // Fallback note creation
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