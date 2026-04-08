import { surveySchema } from "@/schemas/surveySchema";

export interface ValidationResult {
  isValid: boolean;
  missingFields: { sectionId: string; sectionLabel: string, fieldLabel: string }[];
}

export function validateSurvey(data: any): ValidationResult {
  const missingFields: ValidationResult["missingFields"] = [];

  surveySchema.forEach(section => {
    section.subsections.forEach(sub => {
      sub.questions.forEach(q => {
        // Simple required check
        if (q.required) {
          const val = data[q.id];
          if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
            missingFields.push({
              sectionId: section.id,
              sectionLabel: section.label,
              fieldLabel: q.label
            });
          }
        }
      });
    });
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}
