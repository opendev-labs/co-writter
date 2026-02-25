
# Ebook-Studio by OpenDev Labs

## The Professional AI Publishing Platform

Welcome to **Ebook-Studio**, the definitive platform for creating, refining, and selling digital literature. Powered by the proprietary **Co-Author** neural engine, this software bridges the gap between human creativity and machine intelligence.

---

## 🚀 Quick Start (Linux/Unix)

### Step 1: Installation
Run the installer script to set up the environment and dependencies.

```bash
chmod +x install-ebook-engine.sh
./install-ebook-engine.sh
```

### Step 2: Launch Studio
Start the development server with hot-reloading enabled.

```bash
chmod +x run-ebook-engine.sh
./run-ebook-engine.sh --dev
```

---

## 🏗 Architecture & Core Systems

**Ebook-Studio** is architected as a high-performance, serverless Single Page Application (SPA).

*   **Frontend**: React 18 + Vite (TypeScript)
*   **Neural Engine**: Co-Author (powered by Google Gemini 2.5 Flash)
*   **Styling**: Tailwind CSS with custom `obsidian` easing
*   **State Management**: React Context + LocalStorage Persistence

### The Co-Author Engine
The heart of Ebook-Studio is **Co-Author**, an advanced AI agent designed for narrative consistency.
*   **Context Awareness**: Remembers previous chapters and character arcs.
*   **Visual Synthesis**: Generates cover art and inline illustrations via Gemini 2.5 Image.
*   **Spectral Analysis**: Analyzes PDF manuscripts for genre, tone, and pacing.

---

## 🌐 Deployment (GitHub Pages)

To host your own instance of Ebook-Studio:

1.  **Build**: `npm run build`
2.  **Deploy**: Push the `dist` folder to your `gh-pages` branch.
3.  **Access**: Visit `https://your-username.github.io/ebook-studio/`

---

## 🎨 Professional Suite

*   **Studio Editor**: A distraction-free markdown environment with slash commands (`/img`, `/h1`).
*   **Marketplace**: A fully functional digital store for selling your creations.
*   **Writer Dashboard**: Real-time analytics, revenue tracking, and audience insights.

---

**© OpenDev Labs.** *Where Thought Becomes Literature.*
