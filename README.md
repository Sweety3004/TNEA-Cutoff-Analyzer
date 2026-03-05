# TNEA Cutoff Analyzer 🎓

A professional, modular web application for analyzing TNEA (Tamil Nadu Engineering Admissions) cutoff data. This tool helps 12th-grade students make data-driven career decisions through college prediction, course insights, and historical cutoff analysis.

## 🚀 Key Features

*   **College Predictor:** Personalized college recommendations based on your cutoff marks.
*   **Assessment Tool:** A guided quiz to help you discover the engineering branch that best fits your interests and strengths.
*   **Cutoff Search:** Historical cutoff data (2023-2024) for 400+ colleges across all categories (OC, BC, MBC, SC, etc.).
*   **Course Insights:** Detailed professional insights for 50+ engineering branches, including career prospects and market demand.
*   **AI Chatbot:** An intelligent assistant to answer your queries about college rankings and course details.
*   **Favorites System:** Save your preferred colleges and branches for easy access.

## 📂 Project Architecture

The project follows a modular JavaScript architecture (ES Modules) for better maintainability and scalability:

- `index.html`: The main UI structure (clean and optimized).
- `index.css`: Centralized styling with a premium design system.
- `app.js`: Application entry point and global orchestration.
- `js/`: Core logic modules:
    - `api.js`: Data fetching and JSON processing.
    - `auth.js`: Authentication and favorites management.
    - `state.js`: Centralized application state.
    - `ui.js`: DOM orchestration and UI components.
    - `assessment.js`: Quiz logic and navigation.
    - `chatbot.js`: AI conversational logic.
    - `predictor.js`: College prediction algorithms.
    - `constants.js`: Shared data constants.

## 🛠️ Getting Started

### Prerequisites
- A modern web browser (supports ES Modules).
- A local server (e.g., Live Server, Python's `http.server`, or Node's `serve`).

### Quick Start
1. Clone the repository.
2. Open the project folder in your editor.
3. Start a local development server.
4. Access the application at `http://localhost:3000` (or similar).

## 📄 Disclaimer
This platform is a professional engineering guide based on 2024 academic data. It is not affiliated with the official TNEA counseling authority. Users should always verify data with official sources before making final admission decisions.

---
*Created with focus on clarity, accuracy, and student success.*
