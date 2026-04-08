export type QuestionType = 
  | 'text' 
  | 'textarea' 
  | 'radio' 
  | 'checkbox' 
  | 'select' 
  | 'fieldArray' 
  | 'date' 
  | 'number';

export interface SurveyQuestion {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  options?: string[];
  placeholder?: string; // Word template placeholder mapping
  description?: string;
  sectionId: string;
  subsectionId?: string;
  defaultValue?: any;
  // Metadata for complex mapping
  checkboxMap?: Record<string, string>; // Value -> Placeholder
  // For fieldArray
  columns?: Array<{ id: string; label: string; type: 'text' | 'number' | 'select'; options?: string[] }>;
}

export interface SurveySection {
  id: string;
  label: string;
  icon?: string;
  questions: SurveyQuestion[];
}
