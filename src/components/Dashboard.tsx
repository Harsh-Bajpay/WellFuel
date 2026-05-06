import React from 'react';
import type { MealEntry, UserGoals, NutritionSummary } from '../types';
import NutritionBar from './NutritionBar';
import { summarizeEntries, formatDate, formatNum } from '../utils/nutrition';

interface DashboardProps {
  entries: MealEntry[];
  goals: UserGoals;
  selectedDate: string;
  onNavigate: (tab: string) => void;
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: '🌅 Breakfast',
  lunch: '☀️ Lunch',
  dinner: '🌙 Dinner',
  snack: '🍎 Snack',
};

const Dashboard: React.FC<DashboardProps> = ({ entries, goals, selectedDate, onNavigate }) => {
  const summary: NutritionSummary = summarizeEntries(entries);
  const calPct = goals.calories > 0 ? Math.round((summary.calories / goals.calories) * 100) : 0;
  const remaining = Math.max(0, goals.calories - summary.calories);

  const mealGroups = entries.reduce<Record<string, MealEntry[]>>((acc, e) => {
    if (!acc[e.mealType]) acc[e.mealType] = [];
    acc[e.mealType].push(e);
    return acc;
  }, {});

  return (
    <div className="dashboard">
      {/* Date header */}
      <div className="dashboard__date-header">
        <span className="dashboard__date-label">{formatDate(selectedDate)}</span>
        <span className="dashboard__date-value">{selectedDate}</span>
      </div>

      {/* Calorie ring summary */}
      <div className="calorie-card">
        <div className="calorie-card__ring">
          <svg viewBox="0 0 120 120" className="calorie-card__svg">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#f97316"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${Math.min(calPct, 100) * 3.267} 326.7`}
              strokeDashoffset="81.675"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="calorie-card__center">
            <div className="calorie-card__consumed">{Math.round(summary.calories)}</div>
            <div className="calorie-card__label">kcal</div>
          </div>
        </div>
        <div className="calorie-card__stats">
          <div className="calorie-card__stat">
            <span className="calorie-card__stat-value calorie-card__stat-value--orange">
              {Math.round(summary.calories)}
            </span>
            <span className="calorie-card__stat-label">Consumed</span>
          </div>
          <div className="calorie-card__divider" />
          <div className="calorie-card__stat">
            <span className="calorie-card__stat-value">{goals.calories}</span>
            <span className="calorie-card__stat-label">Goal</span>
          </div>
          <div className="calorie-card__divider" />
          <div className="calorie-card__stat">
            <span className="calorie-card__stat-value calorie-card__stat-value--green">
              {remaining}
            </span>
            <span className="calorie-card__stat-label">Remaining</span>
          </div>
        </div>
      </div>

      {/* Macro bars */}
      <div className="card">
        <h2 className="card__title">Macronutrients</h2>
        <NutritionBar label="Protein" value={summary.protein} goal={goals.protein} unit="g" macro="protein" />
        <NutritionBar label="Carbohydrates" value={summary.carbs} goal={goals.carbs} unit="g" macro="carbs" />
        <NutritionBar label="Fat" value={summary.fat} goal={goals.fat} unit="g" macro="fat" />
        <NutritionBar label="Fiber" value={summary.fiber} goal={goals.fiber} unit="g" macro="fiber" />
      </div>

      {/* Meal breakdown */}
      <div className="card">
        <h2 className="card__title">Today's Meals</h2>
        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🍽️</div>
            <p className="empty-state__text">No meals logged yet</p>
            <button className="btn btn--primary" onClick={() => onNavigate('search')}>
              Log Your First Meal
            </button>
          </div>
        ) : (
          Object.entries(mealGroups).map(([mealType, mealEntries]) => (
            <div key={mealType} className="meal-group">
              <div className="meal-group__header">
                <span className="meal-group__name">{MEAL_LABELS[mealType] || mealType}</span>
                <span className="meal-group__cal">
                  {formatNum(mealEntries.reduce((s, e) => s + e.calories, 0), 0)} kcal
                </span>
              </div>
              {mealEntries.map((entry) => (
                <div key={entry.id} className="meal-group__item">
                  <span className="meal-group__food">{entry.foodName}</span>
                  <span className="meal-group__macros">
                    {formatNum(entry.servings, 1)}× · {Math.round(entry.calories)} kcal · P:{formatNum(entry.protein)}g
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
