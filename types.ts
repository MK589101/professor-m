
export interface FeedbackCategory {
  title: string;
  critique: string;
  suggestions: string[];
}

export interface CompositionAnalysis {
  overallScore: number;
  overallEvaluation: string;
  categories: {
    grammar: FeedbackCategory;
    vocabulary: FeedbackCategory;
    structure: FeedbackCategory;
    logic: FeedbackCategory;
  };
  revisedVersion: string;
}

export interface ChatMessage {
  role: 'user' | 'professor';
  content: string;
}
