import React, { useState } from 'react';
import type { UserGoals } from '../types';
import { DEFAULT_GOALS } from '../utils/nutrition';

interface GoalSettingProps {
  goals: UserGoals;
  onSave: (goals: UserGoals) => void;
}

const PRESETS = [
  {
    name: 'Weight Loss',
    icon: '📉',
    description: '1500 kcal – moderate protein, lower carbs',
    goals: { calories: 1500, protein: 100, carbs: 150, fat: 50, fiber: 30, waterGlasses: 8 },
  },
  {
    name: 'Maintenance',
    icon: '⚖️',
    description: '2000 kcal – balanced macros',
    goals: { calories: 2000, protein: 50, carbs: 250, fat: 65, fiber: 28, waterGlasses: 8 },
  },
  {
    name: 'Muscle Gain',
    icon: '💪',
    description: '2500 kcal – high protein, higher carbs',
    goals: { calories: 2500, protein: 150, carbs: 300, fat: 70, fiber: 30, waterGlasses: 10 },
  },
  {
    name: 'Athletic',
    icon: '🏃',
    description: '3000 kcal – high carbs, high protein',
    goals: { calories: 3000, protein: 180, carbs: 400, fat: 80, fiber: 35, waterGlasses: 12 },
  },
];

type FieldKey = keyof Omit<UserGoals, 'waterGlasses'>;

const FIELDS: { key: FieldKey; label: string; unit: string; min: number; max: number; step: number }[] = [
  { key: 'calories', label: 'Daily Calories', unit: 'kcal', min: 800, max: 5000, step: 50 },
  { key: 'protein', label: 'Protein', unit: 'g', min: 10, max: 300, step: 5 },
  { key: 'carbs', label: 'Carbohydrates', unit: 'g', min: 20, max: 600, step: 10 },
  { key: 'fat', label: 'Fat', unit: 'g', min: 10, max: 300, step: 5 },
  { key: 'fiber', label: 'Fiber', unit: 'g', min: 5, max: 60, step: 1 },
];

const GoalSetting: React.FC<GoalSettingProps> = ({ goals, onSave }) => {
  const [form, setForm] = useState<UserGoals>({ ...goals });
  const [saved, setSaved] = useState(false);

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setForm(preset.goals);
    setSaved(false);
  };

  const handleChange = (key: keyof UserGoals, value: number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_GOALS });
    setSaved(false);
  };

  // Estimated macros from calorie target
  const proteinCal = form.protein * 4;
  const carbsCal = form.carbs * 4;
  const fatCal = form.fat * 9;
  const totalMacroCal = proteinCal + carbsCal + fatCal;
  const proteinPct = totalMacroCal > 0 ? Math.round((proteinCal / totalMacroCal) * 100) : 0;
  const carbsPct = totalMacroCal > 0 ? Math.round((carbsCal / totalMacroCal) * 100) : 0;
  const fatPct = totalMacroCal > 0 ? Math.round((fatCal / totalMacroCal) * 100) : 0;

  return (
    <div className="goal-setting">
      <h2 className="section-title">Nutrition Goals</h2>
      <p className="section-subtitle">Set your daily targets to get personalized tracking and recommendations.</p>

      {/* Presets */}
      <div className="presets">
        <h3 className="presets__title">Quick Presets</h3>
        <div className="presets__grid">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              className="preset-card"
              onClick={() => handlePreset(p)}
            >
              <span className="preset-card__icon">{p.icon}</span>
              <span className="preset-card__name">{p.name}</span>
              <span className="preset-card__desc">{p.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom goal fields */}
      <div className="goal-fields card">
        <h3 className="card__title">Custom Goals</h3>
        {FIELDS.map((field) => (
          <div key={field.key} className="goal-field">
            <div className="goal-field__header">
              <label className="goal-field__label">{field.label}</label>
              <span className="goal-field__value">
                {form[field.key]} {field.unit}
              </span>
            </div>
            <input
              type="range"
              className="goal-field__slider"
              min={field.min}
              max={field.max}
              step={field.step}
              value={form[field.key]}
              onChange={(e) => handleChange(field.key, Number(e.target.value))}
            />
            <div className="goal-field__range">
              <span>{field.min}</span>
              <span>{field.max}</span>
            </div>
          </div>
        ))}

        <div className="goal-field">
          <div className="goal-field__header">
            <label className="goal-field__label">💧 Daily Water</label>
            <span className="goal-field__value">{form.waterGlasses} glasses</span>
          </div>
          <input
            type="range"
            className="goal-field__slider"
            min={4}
            max={16}
            step={1}
            value={form.waterGlasses}
            onChange={(e) => handleChange('waterGlasses', Number(e.target.value))}
          />
          <div className="goal-field__range">
            <span>4</span>
            <span>16</span>
          </div>
        </div>
      </div>

      {/* Macro distribution preview */}
      <div className="macro-dist card">
        <h3 className="card__title">Macro Distribution</h3>
        <div className="macro-dist__bar">
          <div className="macro-dist__seg macro-dist__seg--protein" style={{ width: `${proteinPct}%` }} />
          <div className="macro-dist__seg macro-dist__seg--carbs" style={{ width: `${carbsPct}%` }} />
          <div className="macro-dist__seg macro-dist__seg--fat" style={{ width: `${fatPct}%` }} />
        </div>
        <div className="macro-dist__legend">
          <span className="macro-dist__item macro-dist__item--protein">Protein {proteinPct}%</span>
          <span className="macro-dist__item macro-dist__item--carbs">Carbs {carbsPct}%</span>
          <span className="macro-dist__item macro-dist__item--fat">Fat {fatPct}%</span>
        </div>
        <p className="macro-dist__note">
          Macro calories: {totalMacroCal} kcal · Goal: {form.calories} kcal
          {Math.abs(totalMacroCal - form.calories) > 100 && (
            <span className="macro-dist__warning">
              {' '}⚠️ Macros are {totalMacroCal > form.calories ? 'above' : 'below'} calorie goal
            </span>
          )}
        </p>
      </div>

      {/* Action buttons */}
      <div className="goal-actions">
        <button className="btn btn--outline" onClick={handleReset}>
          Reset to Default
        </button>
        <button
          className={`btn btn--primary${saved ? ' btn--success' : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ Saved!' : 'Save Goals'}
        </button>
      </div>
    </div>
  );
};

export default GoalSetting;
