import React, { useState } from 'react';
import type { Food, MealType } from '../types';
import { searchFoods, FOOD_CATEGORIES } from '../data/foods';

interface FoodSearchProps {
  onAddFood: (food: Food, mealType: MealType, servings: number) => void;
}

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: '🌅 Breakfast' },
  { value: 'lunch', label: '☀️ Lunch' },
  { value: 'dinner', label: '🌙 Dinner' },
  { value: 'snack', label: '🍎 Snack' },
];

const FoodSearch: React.FC<FoodSearchProps> = ({ onAddFood }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [servings, setServings] = useState(1);
  const [addedId, setAddedId] = useState<string | null>(null);

  const results = searchFoods(query).filter(
    (f) => selectedCategory === 'All' || f.category === selectedCategory
  );

  const handleAdd = () => {
    if (!selectedFood) return;
    onAddFood(selectedFood, mealType, servings);
    setAddedId(selectedFood.id);
    setTimeout(() => {
      setAddedId(null);
      setSelectedFood(null);
      setServings(1);
    }, 1200);
  };

  return (
    <div className="food-search">
      <h2 className="section-title">Search & Add Food</h2>

      {/* Search input */}
      <div className="search-bar">
        <span className="search-bar__icon">🔍</span>
        <input
          className="search-bar__input"
          type="text"
          placeholder="Search foods (e.g. chicken, apple, oatmeal…)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedFood(null);
          }}
        />
        {query && (
          <button className="search-bar__clear" onClick={() => { setQuery(''); setSelectedFood(null); }}>
            ✕
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="category-filter">
        {['All', ...FOOD_CATEGORIES].map((cat) => (
          <button
            key={cat}
            className={`category-chip${selectedCategory === cat ? ' category-chip--active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="food-list">
        {results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <p className="empty-state__text">No foods found for "{query}"</p>
          </div>
        ) : (
          results.map((food) => (
            <div
              key={food.id}
              className={`food-item${selectedFood?.id === food.id ? ' food-item--selected' : ''}`}
              onClick={() => setSelectedFood(food === selectedFood ? null : food)}
            >
              <div className="food-item__header">
                <span className="food-item__name">{food.name}</span>
                <span className="food-item__cat">{food.category}</span>
              </div>
              <div className="food-item__meta">
                <span className="food-item__serving">{food.servingUnit}</span>
                <div className="food-item__macros">
                  <span className="macro-pill macro-pill--cal">{food.calories} kcal</span>
                  <span className="macro-pill macro-pill--protein">P: {food.protein}g</span>
                  <span className="macro-pill macro-pill--carbs">C: {food.carbs}g</span>
                  <span className="macro-pill macro-pill--fat">F: {food.fat}g</span>
                </div>
              </div>

              {/* Expanded add panel */}
              {selectedFood?.id === food.id && (
                <div className="add-panel" onClick={(e) => e.stopPropagation()}>
                  <div className="add-panel__row">
                    <label className="add-panel__label">Meal</label>
                    <div className="add-panel__meal-btns">
                      {MEAL_TYPES.map((m) => (
                        <button
                          key={m.value}
                          className={`meal-btn${mealType === m.value ? ' meal-btn--active' : ''}`}
                          onClick={() => setMealType(m.value)}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="add-panel__row">
                    <label className="add-panel__label">Servings</label>
                    <div className="add-panel__servings">
                      <button
                        className="serving-btn"
                        onClick={() => setServings((s) => Math.max(0.5, parseFloat((s - 0.5).toFixed(1))))}
                      >
                        −
                      </button>
                      <span className="serving-count">{servings}</span>
                      <button
                        className="serving-btn"
                        onClick={() => setServings((s) => parseFloat((s + 0.5).toFixed(1)))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="add-panel__preview">
                    <span>≈ {Math.round(food.calories * servings)} kcal</span>
                    <span>· P: {(food.protein * servings).toFixed(1)}g</span>
                    <span>· C: {(food.carbs * servings).toFixed(1)}g</span>
                    <span>· F: {(food.fat * servings).toFixed(1)}g</span>
                  </div>
                  <button
                    className={`btn btn--primary btn--full${addedId === food.id ? ' btn--success' : ''}`}
                    onClick={handleAdd}
                  >
                    {addedId === food.id ? '✓ Added!' : 'Add to Log'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodSearch;
