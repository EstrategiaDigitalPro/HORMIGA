import { useState, useEffect, useCallback } from 'react';
import { MonthData, UserPreferences } from '../types/finance';
import {
  INITIAL_MONTH_DATA,
  INITIAL_PREFERENCES,
  PAST_MONTHS_DATA,
} from '../utils/initialData';
import { reconcileMonthData } from '../utils/financeCalculations';

const STORAGE_KEYS = {
  PREFERENCES: 'hormiga_user_prefs_v2',
  CURRENT_MONTH: 'hormiga_month_2026_10_v2',
  PAST_MONTHS: 'hormiga_past_months_v2',
};

export function useFinanceStorage() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return stored ? JSON.parse(stored) : INITIAL_PREFERENCES;
    } catch {
      return INITIAL_PREFERENCES;
    }
  });

  const [monthData, setMonthData] = useState<MonthData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_MONTH);
      const data = stored ? JSON.parse(stored) : INITIAL_MONTH_DATA;
      return reconcileMonthData(data);
    } catch {
      return INITIAL_MONTH_DATA;
    }
  });

  const [pastMonths, setPastMonths] = useState<MonthData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAST_MONTHS);
      return stored ? JSON.parse(stored) : PAST_MONTHS_DATA;
    } catch {
      return PAST_MONTHS_DATA;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (e) {
      console.error('Failed to save preferences', e);
    }
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_MONTH, JSON.stringify(monthData));
    } catch (e) {
      console.error('Failed to save month data', e);
    }
  }, [monthData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAST_MONTHS, JSON.stringify(pastMonths));
    } catch (e) {
      console.error('Failed to save past months', e);
    }
  }, [pastMonths]);

  const resetToInitialData = useCallback(() => {
    setMonthData(INITIAL_MONTH_DATA);
    setPastMonths(PAST_MONTHS_DATA);
    setPreferences(INITIAL_PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_MONTH);
    localStorage.removeItem(STORAGE_KEYS.PAST_MONTHS);
  }, []);

  const importUserData = useCallback((dataJson: string): boolean => {
    try {
      const parsed = JSON.parse(dataJson);
      if (parsed.monthData && parsed.preferences) {
        setMonthData(reconcileMonthData(parsed.monthData));
        setPreferences(parsed.preferences);
        if (parsed.pastMonths) setPastMonths(parsed.pastMonths.map(reconcileMonthData));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return {
    preferences,
    setPreferences,
    monthData,
    setMonthData,
    pastMonths,
    setPastMonths,
    resetToInitialData,
    importUserData,
  };
}
