import type { MealEntry, NutritionSummary, UserGoals, Recommendation } from '../types';

export const DEFAULT_GOALS: UserGoals = {
  calories: 2000,
  protein: 50,
  carbs: 250,
  fat: 65,
  fiber: 28,
  waterGlasses: 8,
};

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function summarizeEntries(entries: MealEntry[]): NutritionSummary {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
      fiber: acc.fiber + e.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

export function getPercentage(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(Math.round((value / goal) * 100), 100);
}

export function formatNum(n: number, decimals = 1): string {
  return Number(n.toFixed(decimals)).toString();
}

export function generateRecommendations(
  summary: NutritionSummary,
  goals: UserGoals,
  entries: MealEntry[]
): Recommendation[] {
  const recs: Recommendation[] = [];
  const mealTypes = new Set(entries.map((e) => e.mealType));
  const caloriePct = goals.calories > 0 ? summary.calories / goals.calories : 0;

  // Protein gap
  if (summary.protein < goals.protein * 0.6) {
    recs.push({
      id: 'low-protein',
      title: 'Boost Your Protein Intake',
      description: `You've only consumed ${formatNum(summary.protein)}g of protein (goal: ${goals.protein}g). Protein keeps you full and supports muscle health.`,
      icon: '🥩',
      category: 'protein',
      foods: ['Chicken Breast', 'Greek Yogurt', 'Eggs', 'Lentils', 'Tofu'],
      priority: 'high',
    });
  }

  // Fiber gap
  if (summary.fiber < goals.fiber * 0.5) {
    recs.push({
      id: 'low-fiber',
      title: 'Add More Fiber',
      description: `You've had ${formatNum(summary.fiber)}g of fiber (goal: ${goals.fiber}g). Fiber aids digestion and promotes satiety.`,
      icon: '🥦',
      category: 'fiber',
      foods: ['Broccoli', 'Black Beans', 'Chia Seeds', 'Avocado', 'Oatmeal'],
      priority: 'high',
    });
  }

  // Too many calories
  if (caloriePct >= 0.95) {
    recs.push({
      id: 'high-calories',
      title: 'Near Your Calorie Limit',
      description: `You've reached ${Math.round(caloriePct * 100)}% of your daily calorie goal. Choose low-calorie, nutrient-dense options for remaining meals.`,
      icon: '⚠️',
      category: 'calories',
      foods: ['Spinach', 'Cucumber', 'Green Tea', 'Strawberries', 'Bell Pepper'],
      priority: 'high',
    });
  }

  // Under-eating
  if (caloriePct < 0.4 && entries.length > 0) {
    recs.push({
      id: 'low-calories',
      title: 'You May Be Under-eating',
      description: `You've only consumed ${Math.round(caloriePct * 100)}% of your calorie goal. Ensure you're eating enough to fuel your body.`,
      icon: '🍽️',
      category: 'calories',
      foods: ['Oatmeal', 'Brown Rice', 'Quinoa', 'Banana', 'Peanut Butter'],
      priority: 'medium',
    });
  }

  // Skipping breakfast
  if (!mealTypes.has('breakfast') && entries.length > 0) {
    recs.push({
      id: 'skip-breakfast',
      title: "Don't Skip Breakfast",
      description:
        'Starting your day with a balanced meal can improve focus, energy levels, and help regulate appetite throughout the day.',
      icon: '🌅',
      category: 'habit',
      foods: ['Oatmeal', 'Eggs', 'Greek Yogurt', 'Banana', 'Whole Wheat Bread'],
      priority: 'medium',
    });
  }

  // Balanced macros
  if (entries.length > 0 && summary.calories > 0) {
    const proteinCal = summary.protein * 4;
    const carbsCal = summary.carbs * 4;
    const fatCal = summary.fat * 9;
    const total = proteinCal + carbsCal + fatCal;
    const fatPct = total > 0 ? fatCal / total : 0;

    if (fatPct > 0.45) {
      recs.push({
        id: 'high-fat',
        title: 'High Fat Ratio',
        description:
          'Over 45% of your calories come from fat today. Balance with more complex carbs and lean proteins.',
        icon: '⚖️',
        category: 'balance',
        foods: ['Brown Rice', 'Sweet Potato', 'Quinoa', 'Lentils', 'Chicken Breast'],
        priority: 'medium',
      });
    }
  }

  // Hydration reminder
  recs.push({
    id: 'hydration',
    title: 'Stay Hydrated',
    description: `Aim for ${goals.waterGlasses} glasses of water daily. Staying hydrated supports metabolism, digestion, and energy levels.`,
    icon: '💧',
    category: 'hydration',
    priority: 'low',
  });

  // Variety reminder
  if (entries.length >= 3) {
    const categories = new Set(entries.map((e) => e.foodName));
    if (categories.size < 4) {
      recs.push({
        id: 'variety',
        title: 'Eat a Rainbow',
        description:
          'Try to include at least 5 different food types daily. A varied diet ensures a wider range of micronutrients.',
        icon: '🌈',
        category: 'balance',
        foods: ['Spinach', 'Carrots', 'Blueberries', 'Orange', 'Bell Pepper'],
        priority: 'low',
      });
    }
  }

  // No entries yet
  if (entries.length === 0) {
    recs.push({
      id: 'start-logging',
      title: 'Start Logging Your Meals',
      description:
        'Track what you eat to get personalized nutrition insights and smart recommendations tailored to your goals.',
      icon: '📋',
      category: 'habit',
      priority: 'high',
    });
  }

  // Sort by priority
  const order = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]);
}

export function getMacroColor(macro: 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber'): string {
  const colors: Record<string, string> = {
    calories: '#f97316',
    protein: '#3b82f6',
    carbs: '#eab308',
    fat: '#ec4899',
    fiber: '#22c55e',
  };
  return colors[macro] || '#6b7280';
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
