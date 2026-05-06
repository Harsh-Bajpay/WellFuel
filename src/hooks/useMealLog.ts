import { useState, useCallback, useEffect } from 'react';
import type { MealEntry, MealType, DailyLog, UserGoals } from '../types';
import type { Food } from '../types';
import { getTodayDate, DEFAULT_GOALS } from '../utils/nutrition';

const STORAGE_KEY = 'wellfuel_logs';
const GOALS_KEY = 'wellfuel_goals';

function loadLogs(): DailyLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: DailyLog[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function loadGoals(): UserGoals {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    return raw ? { ...DEFAULT_GOALS, ...JSON.parse(raw) } : DEFAULT_GOALS;
  } catch {
    return DEFAULT_GOALS;
  }
}

function saveGoals(goals: UserGoals): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function useMealLog() {
  const [logs, setLogs] = useState<DailyLog[]>(loadLogs);
  const [goals, setGoalsState] = useState<UserGoals>(loadGoals);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  // Persist on change
  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  const todayEntries = useCallback((): MealEntry[] => {
    const log = logs.find((l) => l.date === selectedDate);
    return log ? log.entries : [];
  }, [logs, selectedDate]);

  const addEntry = useCallback(
    (food: Food, mealType: MealType, servings: number) => {
      const factor = servings;
      const entry: MealEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        foodId: food.id,
        foodName: food.name,
        mealType,
        servings,
        calories: Math.round(food.calories * factor),
        protein: parseFloat((food.protein * factor).toFixed(1)),
        carbs: parseFloat((food.carbs * factor).toFixed(1)),
        fat: parseFloat((food.fat * factor).toFixed(1)),
        fiber: parseFloat((food.fiber * factor).toFixed(1)),
        loggedAt: new Date().toISOString(),
      };

      setLogs((prev) => {
        const existing = prev.find((l) => l.date === selectedDate);
        if (existing) {
          return prev.map((l) =>
            l.date === selectedDate ? { ...l, entries: [...l.entries, entry] } : l
          );
        }
        return [...prev, { date: selectedDate, entries: [entry] }];
      });
    },
    [selectedDate]
  );

  const removeEntry = useCallback((entryId: string) => {
    setLogs((prev) =>
      prev.map((l) => ({
        ...l,
        entries: l.entries.filter((e) => e.id !== entryId),
      }))
    );
  }, []);

  const updateGoals = useCallback((newGoals: UserGoals) => {
    setGoalsState(newGoals);
    saveGoals(newGoals);
  }, []);

  return {
    logs,
    goals,
    selectedDate,
    setSelectedDate,
    todayEntries,
    addEntry,
    removeEntry,
    updateGoals,
  };
}
