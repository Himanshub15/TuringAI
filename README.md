# TuringAI

A modern AI chat application powered by **Kimi K2.5** via **NVIDIA NIM**. Built with Next.js, featuring real-time streaming responses, web search integration, and a clean conversational interface.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)

## Features

- **Streaming Chat** — Real-time streamed responses from Kimi K2.5 via NVIDIA NIM API
- **Web Search** — Toggle web search to ground responses with live data (powered by Serper.dev)
- **Conversation History** — All chats saved locally with full persistence across sessions
- **Dark / Light Theme** — Seamless theme switching with system preference support
- **Code Blocks** — Syntax-highlighted code blocks with one-click copy
- **Collapsible Sidebar** — Smooth animated sidebar with conversation management
- **Responsive Design** — Works on desktop and mobile with adaptive layouts
- **Floating Chat Input** — Modern elevated input with gradient fade effect

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI SDK | Vercel AI SDK v5 (`@ai-sdk/openai-compatible`) |
| LLM | Kimi K2.5 via NVIDIA NIM |
| Search | Serper.dev API |
| Storage | localStorage |

## Getting Started

### Prerequisites

- Node.js 18+
- NVIDIA NIM API key ([get one here](https://build.nvidia.com/))
- Serper API key for web search (optional, [get one here](https://serper.dev/))

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Himanshub15/TuringAI.git
   cd TuringAI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:

   ```
   NVIDIA_API_KEY=your_nvidia_nim_api_key
   SERPER_API_KEY=your_serper_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # Streaming chat endpoint
│   │   └── search/route.ts     # Web search proxy
│   ├── login/page.tsx          # Login page (Google/Apple SSO ready)
│   ├── layout.tsx              # Root layout with theme support
│   ├── page.tsx                # Main chat page
│   └── globals.css             # Global styles
├── components/
│   ├── ChatInterface.tsx       # Chat orchestrator with search integration
│   ├── MessageList.tsx         # Scrollable message container
│   ├── MessageBubble.tsx       # Message rendering with code blocks
│   ├── Sidebar.tsx             # Collapsible conversation sidebar
│   ├── SearchToggle.tsx        # Web search toggle
│   └── ThemeToggle.tsx         # Dark/light theme switcher
├── lib/
│   ├── nim.ts                  # NVIDIA NIM provider config
│   └── conversations.ts       # localStorage helpers
└── types/
    └── index.ts                # Shared TypeScript types
```

## License

MIT
