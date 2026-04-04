import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'survey_profiler_draft';

export function useAutoSave(data: any, delay: number = 10000) {
  const saveDraft = useCallback(() => {
    if (!data) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Auto-saved draft at', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error auto-saving draft:', error);
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      saveDraft();
    }, delay);

    return () => clearInterval(timer);
  }, [saveDraft, delay]);

  // Optionally trigger save on unmount/unload
  useEffect(() => {
    const handleBeforeUnload = () => saveDraft();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveDraft(); // save on component unmount
    };
  }, [saveDraft]);
}

export function getSavedDraft() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export function clearSavedDraft() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
