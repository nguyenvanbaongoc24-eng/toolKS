import React from 'react';
import { UseFormRegister, Control } from 'react-hook-form';
import { SurveySection } from '../../schemas/types';
import { QuestionRenderer } from './QuestionRenderer';

interface Props {
  section: SurveySection;
  register: UseFormRegister<any>;
  control: Control<any>;
  watch: any;
}

export const FormSection: React.FC<Props> = ({ section, register, control, watch }) => {
  // Group questions by subsection if they exist
  const subsectionsMap = section.questions.reduce((acc, q) => {
    const subId = q.subsectionId || 'general';
    if (!acc[subId]) acc[subId] = [];
    acc[subId].push(q);
    return acc;
  }, {} as Record<string, typeof section.questions>);

  const subIds = Object.keys(subsectionsMap);

  return (
    <div className="section-card">
      <h2 className="section-title">
        <span className="section-badge bg-indigo-500">{section.id}</span> {section.label}
      </h2>
      
      <div className="space-y-8">
        {subIds.map((subId) => (
          <div key={subId} className={subId !== 'general' ? "p-4 bg-white/5 rounded-2xl border border-white/5" : ""}>
            {subId !== 'general' && (
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-3">
                Tiểu mục {subId}
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {subsectionsMap[subId].map((q) => (
                <div key={q.id} className={q.type === 'textarea' || q.type === 'fieldArray' ? 'md:col-span-2' : ''}>
                  <QuestionRenderer question={q} register={register} control={control} watch={watch} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
