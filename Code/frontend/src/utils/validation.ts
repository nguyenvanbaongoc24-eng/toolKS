import { surveySchema } from "@/schemas/surveySchema";

export interface ValidationResult {
  isValid: boolean;
  missingFields: { sectionId: string; sectionLabel: string, fieldLabel: string }[];
  progress: {
    percent: number;
    color: string;
    totalRequired: number;
    completedRequired: number;
  };
}

export function validateSurvey(data: any): ValidationResult {
  const missingFields: ValidationResult["missingFields"] = [];
  let totalRequired = 0;
  let completedRequired = 0;

  surveySchema.forEach(section => {
    section.questions.forEach(q => {
      if (q.required) {
        totalRequired++;
        const val = data[q.id];
        const isFilled = val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0);
        
        if (isFilled) {
          completedRequired++;
        } else {
          missingFields.push({
            sectionId: section.id,
            sectionLabel: section.label,
            fieldLabel: q.label
          });
        }
      }
    });
  });

  const percent = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 100;

  // Color rules: 0–20% → red, 20–60% → yellow, 60–90% → light green, 90–100% → green
  let color = "text-rose-500"; // Red
  if (percent > 20 && percent <= 60) color = "text-yellow-500";
  if (percent > 60 && percent <= 90) color = "text-emerald-400";
  if (percent > 90) color = "text-green-500";

  return {
    isValid: missingFields.length === 0,
    missingFields,
    progress: {
      percent,
      color,
      totalRequired,
      completedRequired
    }
  };
}
