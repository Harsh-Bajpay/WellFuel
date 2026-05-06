import React, { useState } from 'react';
import type { MealEntry } from '../types';
import { summarizeEntries, formatNum } from '../utils/nutrition';

interface MealLogProps {
  entries: MealEntry[];
  onRemove: (id: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_LABELS: Record<string, string> = {
  breakfast: '🌅 Breakfast',
  lunch: '☀️ Lunch',
  dinner: '🌙 Dinner',
  snack: '🍎 Snack',
};

const MealLog: React.FC<MealLogProps> = ({ entries, onRemove, selectedDate, onDateChange }) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const summary = summarizeEntries(entries);

  const grouped = MEAL_ORDER.reduce<Record<string, MealEntry[]>>((acc, m) => {
    const items = entries.filter((e) => e.mealType === m);
    if (items.length) acc[m] = items;
    return acc;
  }, {});

  const handleRemove = (id: string) => {
    if (confirmDelete === id) {
      onRemove(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="meal-log">
      <h2 className="section-title">Meal Log</h2>

      {/* Date picker */}
      <div className="date-picker">
        <label className="date-picker__label">📅 Date</label>
        <input
          type="date"
          className="date-picker__input"
          value={selectedDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      {/* Summary row */}
      {entries.length > 0 && (
        <div className="log-summary">
          <div className="log-summary__item">
            <span className="log-summary__val log-summary__val--orange">{Math.round(summary.calories)}</span>
            <span className="log-summary__lbl">kcal</span>
          </div>
          <div className="log-summary__item">
            <span className="log-summary__val log-summary__val--blue">{formatNum(summary.protein)}g</span>
            <span className="log-summary__lbl">protein</span>
          </div>
          <div className="log-summary__item">
            <span className="log-summary__val log-summary__val--yellow">{formatNum(summary.carbs)}g</span>
            <span className="log-summary__lbl">carbs</span>
          </div>
          <div className="log-summary__item">
            <span className="log-summary__val log-summary__val--pink">{formatNum(summary.fat)}g</span>
            <span className="log-summary__lbl">fat</span>
          </div>
          <div className="log-summary__item">
            <span className="log-summary__val log-summary__val--green">{formatNum(summary.fiber)}g</span>
            <span className="log-summary__lbl">fiber</span>
          </div>
        </div>
      )}

      {/* Meal groups */}
      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <p className="empty-state__text">No meals logged for this date</p>
          <p className="empty-state__sub">Use the Search tab to add foods</p>
        </div>
      ) : (
        Object.entries(grouped).map(([mealType, mealEntries]) => {
          const mealCal = mealEntries.reduce((s, e) => s + e.calories, 0);
          return (
            <div key={mealType} className="log-group card">
              <div className="log-group__header">
                <span className="log-group__name">{MEAL_LABELS[mealType]}</span>
                <span className="log-group__cal">{Math.round(mealCal)} kcal</span>
              </div>
              {mealEntries.map((entry) => (
                <div key={entry.id} className="log-entry">
                  <div className="log-entry__info">
                    <span className="log-entry__name">{entry.foodName}</span>
                    <span className="log-entry__detail">
                      {entry.servings}× serving · {Math.round(entry.calories)} kcal
                    </span>
                    <div className="log-entry__macros">
                      <span className="macro-pill macro-pill--protein">P: {formatNum(entry.protein)}g</span>
                      <span className="macro-pill macro-pill--carbs">C: {formatNum(entry.carbs)}g</span>
                      <span className="macro-pill macro-pill--fat">F: {formatNum(entry.fat)}g</span>
                      <span className="macro-pill macro-pill--fiber">Fiber: {formatNum(entry.fiber)}g</span>
                    </div>
                  </div>
                  <button
                    className={`remove-btn${confirmDelete === entry.id ? ' remove-btn--confirm' : ''}`}
                    onClick={() => handleRemove(entry.id)}
                    title={confirmDelete === entry.id ? 'Click again to confirm' : 'Remove'}
                  >
                    {confirmDelete === entry.id ? '✓?' : '✕'}
                  </button>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MealLog;
