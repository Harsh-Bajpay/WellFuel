import React from 'react';
import { getPercentage, getMacroColor, formatNum } from '../utils/nutrition';

interface NutritionBarProps {
  label: string;
  value: number;
  goal: number;
  unit: string;
  macro: 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber';
}

const NutritionBar: React.FC<NutritionBarProps> = ({ label, value, goal, unit, macro }) => {
  const pct = getPercentage(value, goal);
  const color = getMacroColor(macro);
  const over = value > goal;

  return (
    <div className="nutrition-bar">
      <div className="nutrition-bar__header">
        <span className="nutrition-bar__label">{label}</span>
        <span className="nutrition-bar__values">
          <span className="nutrition-bar__current" style={{ color }}>
            {formatNum(value, macro === 'calories' ? 0 : 1)}
          </span>
          <span className="nutrition-bar__sep"> / </span>
          <span className="nutrition-bar__goal">{goal}{unit}</span>
        </span>
      </div>
      <div className="nutrition-bar__track">
        <div
          className="nutrition-bar__fill"
          style={{
            width: `${pct}%`,
            backgroundColor: over ? '#ef4444' : color,
          }}
        />
      </div>
      <div className="nutrition-bar__pct" style={{ color: over ? '#ef4444' : color }}>
        {pct}%{over ? ' (over goal)' : ''}
      </div>
    </div>
  );
};

export default NutritionBar;
