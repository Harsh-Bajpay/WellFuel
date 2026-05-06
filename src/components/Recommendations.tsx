import React from 'react';
import type { MealEntry, UserGoals, Recommendation } from '../types';
import { summarizeEntries, generateRecommendations } from '../utils/nutrition';

interface RecommendationsProps {
  entries: MealEntry[];
  goals: UserGoals;
  onNavigate: (tab: string) => void;
}

const PRIORITY_BADGE: Record<string, string> = {
  high: 'rec-badge--high',
  medium: 'rec-badge--medium',
  low: 'rec-badge--low',
};

const Recommendations: React.FC<RecommendationsProps> = ({ entries, goals, onNavigate }) => {
  const summary = summarizeEntries(entries);
  const recs: Recommendation[] = generateRecommendations(summary, goals, entries);

  return (
    <div className="recommendations">
      <h2 className="section-title">Smart Recommendations</h2>
      <p className="section-subtitle">
        Personalized suggestions based on today's meals and your nutrition goals.
      </p>

      {recs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🌟</div>
          <p className="empty-state__text">You're on track! Keep it up.</p>
        </div>
      ) : (
        <div className="rec-list">
          {recs.map((rec) => (
            <div key={rec.id} className={`rec-card rec-card--${rec.category}`}>
              <div className="rec-card__top">
                <span className="rec-card__icon">{rec.icon}</span>
                <div className="rec-card__content">
                  <div className="rec-card__title-row">
                    <span className="rec-card__title">{rec.title}</span>
                    <span className={`rec-badge ${PRIORITY_BADGE[rec.priority]}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="rec-card__desc">{rec.description}</p>
                </div>
              </div>
              {rec.foods && rec.foods.length > 0 && (
                <div className="rec-card__foods">
                  <span className="rec-card__foods-label">Try: </span>
                  {rec.foods.map((food) => (
                    <span key={food} className="food-tag">
                      {food}
                    </span>
                  ))}
                </div>
              )}
              {rec.category === 'habit' && (
                <button
                  className="btn btn--outline btn--small"
                  onClick={() => onNavigate('search')}
                >
                  Log Meal →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Nutrition Tips */}
      <div className="tips-section">
        <h3 className="tips-section__title">💡 Healthy Eating Tips</h3>
        <div className="tips-grid">
          {[
            { icon: '🥗', tip: 'Fill half your plate with vegetables and fruits at every meal.' },
            { icon: '🌾', tip: 'Choose whole grains over refined grains for more fiber and nutrients.' },
            { icon: '⏰', tip: 'Eat at regular intervals to keep your blood sugar stable.' },
            { icon: '🍽️', tip: 'Use smaller plates to help with portion control naturally.' },
            { icon: '📱', tip: 'Logging meals consistently leads to better awareness of eating habits.' },
            { icon: '🛒', tip: 'Plan your meals and grocery list in advance to make healthier choices.' },
          ].map(({ icon, tip }) => (
            <div key={tip} className="tip-card">
              <span className="tip-card__icon">{icon}</span>
              <p className="tip-card__text">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
