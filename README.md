# 🔥 Completion Drive

A productivity app that harnesses the **Zeigarnik Effect** to boost task completion rates. Real-time progress tracking with beautiful UI and smart insights.

---

## ⚡ Key Features

✅ **Real-Time Task Tracking** – Monitor daily goal completion with dynamic progress circles  
📊 **Smart Insights** – 7-day averages, streak tracking, and motivational feedback  
🔐 **Persistent Data** – Firebase integration with offline-first IndexedDB support  
🎨 **Dark-Mode UI** – Smooth animations and responsive design  
⚙️ **Clean Architecture** – Modular components, custom hooks, and organized styling

---

## 🛠️ Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| **Frontend**   | React 19 + TypeScript              |
| **Build Tool** | Vite 7                             |
| **Styling**    | SCSS (BEM methodology)             |
| **Backend**    | Firebase (Auth, Firestore)         |
| **Auth**       | Google OAuth 2.0                   |
| **Database**   | Firestore with offline persistence |
| **Linting**    | ESLint + TypeScript ESLint         |

---

## 🏗️ Project Structure

```
src/
├── components/          # React UI components
│   ├── ProgressCircle.tsx
│   ├── TaskCard.tsx
│   └── Insights.tsx
├── hooks/              # Custom React hooks
│   ├── useFirestore.ts
│   └── useDebounce.ts
├── lib/                # External service initialization
│   └── firebase.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── styles/             # SCSS modular architecture
│   ├── main.scss       # Entry point (imports partials)
│   ├── _variables.scss # Design tokens
│   ├── _mixins.scss    # Reusable mixins
│   ├── _base.scss      # Global styles
│   └── _components.scss # Component-scoped styles
├── App.tsx             # Main application
└── main.tsx            # React entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- pnpm (or npm/yarn)

### Installation

```bash
# Clone repo
git clone <repo-url>
cd Producity_App

# Install dependencies
pnpm install

# Start dev server
pnpm run dev

# Build for production
pnpm run build
```

---

## 💡 Architecture Highlights

### Modular & Scalable

- **Separated concerns** – Components, hooks, types, and services in dedicated folders
- **Custom hooks** – `useFirestore` handles all Firestore CRUD & real-time listeners
- **Type safety** – Full TypeScript with shared interfaces across modules

### Performance-Optimized

- **Debounced input** – `useDebounce` hook prevents excessive Firestore updates
- **Memoized insights** – `useMemo` prevents unnecessary recalculations
- **Offline support** – IndexedDB persistence keeps data accessible offline

### Design & UX

- **BEM methodology** – Scoped CSS for maintainability
- **HSL color gradients** – Dynamic progress indicators (red to green)
- **Responsive grid** – Mobile, tablet, and desktop layouts
- **Smooth animations** – Fade-in effects and hover transitions

---

## 📈 Key Implementations

### Firebase Offline Persistence

```typescript
enableIndexedDbPersistence(db).catch((err) => {
  // Graceful fallback if IndexedDB unavailable
});
```

### Real-Time Data Sync

Listens to Firestore documents and automatically updates UI on changes:

```typescript
const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
  const data = docSnap.data() as UserData;
  setTasks(data.tasks || []);
});
```

### Debounced Task Updates

Prevents rapid Firestore writes:

```typescript
const debouncedValue = useDebounce(localValue, 500);
```

---

## 🎯 Motivation

Built to leverage the **Zeigarnik Effect** – the psychological principle that incomplete tasks remain more memorable and motivating than completed ones. This app transforms daily goals into an engaging, streak-driven habit.

---

## 📦 Built With

- **Vite** – Lightning-fast development and optimized production builds
- **Firebase** – Serverless backend with real-time database
- **React 19** – Latest stable React with improved performance
- **SCSS** – Maintainable, scoped styling with variables and mixins

---

## 🔗 Live Demo

[View Live App](#) _(update with your deployment URL)_

---

## 📝 License

This project is open source and available under the MIT License.

---

**Made with ❤️ for personal productivity**
# Real_time_progress_tracking
