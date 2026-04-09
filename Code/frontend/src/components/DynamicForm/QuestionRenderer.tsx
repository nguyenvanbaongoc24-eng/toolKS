import React from 'react';
import { UseFormRegister, useFieldArray, Control } from 'react-hook-form';
import { SurveyQuestion } from '../../schemas/types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  question: SurveyQuestion;
  register: UseFormRegister<any>;
  control: Control<any>;
  watch?: any;
}

export const QuestionRenderer: React.FC<Props> = ({ question, register, control, watch }) => {
  const { id, label, type, options, required, columns, description } = question;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...register(id)}
            className="form-input text-xs min-h-[80px]"
            placeholder={label}
          />
        );
      case 'radio':
        return (
          <div className="flex flex-wrap gap-4 mt-2">
            {options?.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  value={opt}
                  {...register(id)}
                  className="w-4 h-4 text-emerald-500 bg-gray-800 border-gray-700 focus:ring-emerald-600"
                />
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'select':
        return (
          <select {...register(id)} className="form-input text-xs h-10 bg-gray-900 border-gray-700">
            <option value="">-- Chọn --</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register(id)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-emerald-500 checked:bg-emerald-500"
            />
            <span className="text-xs text-gray-300 group-hover:text-white">{label}</span>
          </label>
        );
      case 'fieldArray':
        return <FieldArrayRenderer id={id} columns={columns || []} control={control} register={register} />;
      case 'number':
        return <input type="number" {...register(id)} className="form-input text-xs h-10" placeholder="0" />;
      case 'date':
        return <input type="date" {...register(id)} className="form-input text-xs h-10 bg-gray-900" />;
      default:
        return <input type="text" {...register(id)} className="form-input text-xs h-10" placeholder={label} />;
    }
  };

  if (type === 'checkbox') return <div className="p-1">{renderInput()}</div>;

  return (
    <div className="space-y-1.5">
      <label className="form-label text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {description && <p className="text-[9px] text-gray-500 italic mb-1">{description}</p>}
      {renderInput()}
    </div>
  );
};

const FieldArrayRenderer: React.FC<{ id: string; columns: any[]; control: Control<any>; register: any }> = ({ id, columns, control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: id,
  });

  return (
    <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Danh sách chi tiết</span>
        <button
          type="button"
          onClick={() => append({})}
          className="btn-add py-1.5 px-3 text-[10px] flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm hàng
        </button>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white/5 p-4 rounded-xl relative group border border-white/5 hover:border-white/10 transition-all">
            {columns.map((col) => (
              <div key={col.id}>
                <label className="text-[9px] text-gray-500 uppercase block mb-1 font-semibold">{col.label}</label>
                {col.type === 'select' ? (
                  <select {...register(`${id}.${index}.${col.id}`)} className="form-input text-[11px] h-9 bg-gray-950 border-white/10">
                    <option value="">-- Chọn --</option>
                    {col.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : col.type === 'textarea' ? (
                  <textarea
                    {...register(`${id}.${index}.${col.id}`)}
                    className="form-input text-[11px] min-h-[60px] bg-gray-950 border-white/10 py-2"
                    placeholder={col.label}
                  />
                ) : (
                  <input
                    type={col.type}
                    {...register(`${id}.${index}.${col.id}`)}
                    className="form-input text-[11px] h-9 bg-gray-950 border-white/10"
                    placeholder={col.label}
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute -top-2 -right-2 p-1.5 bg-rose-500/20 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl text-gray-600 text-xs">
            Chưa có bản ghi nào. Bấm nút "Thêm hàng" để bắt đầu.
          </div>
        )}
      </div>
    </div>
  );
};
