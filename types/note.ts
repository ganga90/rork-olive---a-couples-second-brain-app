export interface Note {
  id: string;
  originalText: string;
  summary: string;
  category: string;
  dueDate?: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
  tags?: string[];
}

export interface ProcessedNote {
  summary: string;
  category: string;
  dueDate?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high";
}