# 🥗 WellFuel

**Smart nutrition tracking for healthier eating habits.**

WellFuel is a React + TypeScript web application that helps individuals make better food choices by leveraging nutritional data, user meal logs, and personalized recommendations.

![WellFuel Dashboard](https://github.com/user-attachments/assets/f12419b8-c51f-40fb-a616-672cf37bb986)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Daily calorie ring, macro progress bars, and meal breakdown |
| 🔍 **Food Search** | Search 35+ foods by name, category, or tag with full nutritional data |
| 📋 **Meal Log** | Log breakfast, lunch, dinner & snacks with adjustable servings; delete entries |
| 💡 **Smart Insights** | Personalized recommendations based on nutritional gaps, eating habits & goals |
| 🎯 **Goal Setting** | Custom calorie & macro targets with quick-select presets (Weight Loss, Maintenance, Muscle Gain, Athletic) |
| 💾 **Persistence** | All data stored in `localStorage` — no backend required |

---

## 🧠 Smart Recommendation Engine

WellFuel analyses your logged meals in real time and surfaces contextual nudges such as:

- **Low protein** – suggests high-protein foods when below 60% of goal
- **Low fiber** – recommends fiber-rich options when under 50% of goal
- **Calorie alerts** – warns when approaching or exceeding daily limit
- **Skipped breakfast** – encourages a morning meal for better energy regulation
- **Macronutrient imbalance** – flags an unusually high fat ratio
- **Food variety** – encourages eating a wider range of food groups
- **Hydration** – daily water intake reminder

---

## 🏗️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool & dev server)
- Pure CSS (no UI library dependencies)
- `localStorage` for data persistence

---

## 🚀 Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx        # Calorie ring + macro bars + meal summary
│   ├── FoodSearch.tsx       # Searchable food database with add panel
│   ├── MealLog.tsx          # View & delete logged meals by date
│   ├── Recommendations.tsx  # AI-style nutrition insights
│   ├── GoalSetting.tsx      # Slider-based goal editor with presets
│   └── NutritionBar.tsx     # Reusable macro progress bar
├── data/
│   └── foods.ts             # 35+ foods with full nutrition data + search helper
├── hooks/
│   └── useMealLog.ts        # Central state: logs, goals, CRUD ops
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
│   └── nutrition.ts         # Summarise, recommend, format helpers
├── App.tsx                  # App shell + bottom navigation
└── index.css                # Full design system
```
