<p align="center">
  <img src="public/assets/banner.svg" alt="TuringAI Banner" width="100%"/>
</p>

<p align="center">
  <strong>Your personal AI chat — fast, private, and beautiful.</strong>
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-8-34d399?style=for-the-badge" alt="Features"/></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js"/></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/NVIDIA-NIM-76b900?style=for-the-badge&logo=nvidia&logoColor=white" alt="NVIDIA"/></a>
</p>

---

## Features

<table>
<tr>
<td width="50%">

<img src="public/assets/logo.svg" width="48" align="left" style="margin-right: 12px"/>

### Streaming Chat
Real-time token-by-token responses from **Kimi K2.5** via NVIDIA NIM API. No waiting — watch answers appear as they're generated.

</td>
<td width="50%">

### Web Search
Toggle live web search to ground responses in real-time data. Powered by Serper.dev with 2,500 free queries.

</td>
</tr>
<tr>
<td>

### Conversation History
All chats persist in localStorage. Switch between conversations, pick up where you left off — even after closing the browser.

</td>
<td>

### Dark / Light Theme
One-click theme switching. Respects system preference on first load, remembers your choice after.

</td>
</tr>
<tr>
<td>

### Code Blocks
Syntax-highlighted code with dark backgrounds and a **one-click copy** button. Clean rendering for any language.

</td>
<td>

### Collapsible Sidebar
Smooth animated sidebar for managing conversations. Slides in on mobile, collapses on desktop.

</td>
</tr>
<tr>
<td>

### Floating Input
Modern elevated chat input with gradient fade, focus glow, and keyboard shortcuts (Enter to send, Shift+Enter for newline).

</td>
<td>

### Responsive Design
Desktop, tablet, mobile — adapts seamlessly. Hamburger menu on small screens, full sidebar on large.

</td>
</tr>
</table>

---

## Tech Stack

```
Frontend     Next.js 15  ·  TypeScript  ·  Tailwind CSS v4
AI Layer     Vercel AI SDK v5  ·  @ai-sdk/openai-compatible
LLM          Kimi K2.5 via NVIDIA NIM
Search       Serper.dev API
Storage      localStorage (zero backend)
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Himanshub15/TuringAI.git && cd TuringAI

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Add your NVIDIA_API_KEY (required) and SERPER_API_KEY (optional)

# 4. Run
npm run dev
```

Open **http://localhost:3000** and start chatting.

### Get API Keys

| Key | Where | Cost |
|-----|-------|------|
| `NVIDIA_API_KEY` | [build.nvidia.com](https://build.nvidia.com/) | Free tier available |
| `SERPER_API_KEY` | [serper.dev](https://serper.dev/) | 2,500 free queries |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts         # Streaming chat endpoint
│   │   └── search/route.ts       # Web search proxy
│   ├── login/page.tsx            # Login page (SSO ready)
│   ├── layout.tsx                # Root layout + theme
│   ├── page.tsx                  # Main chat page
│   └── globals.css               # Global styles
├── components/
│   ├── ChatInterface.tsx         # Chat orchestrator
│   ├── MessageList.tsx           # Message container
│   ├── MessageBubble.tsx         # Message rendering
│   ├── Sidebar.tsx               # Conversation sidebar
│   ├── SearchToggle.tsx          # Search toggle
│   └── ThemeToggle.tsx           # Theme switcher
├── lib/
│   ├── nim.ts                    # NVIDIA NIM config
│   └── conversations.ts         # localStorage CRUD
└── types/
    └── index.ts                  # Shared types
```

---

## Roadmap

- [ ] Google / Apple Sign-In integration
- [ ] Markdown rendering with `react-markdown`
- [ ] File upload support
- [ ] Export conversations
- [ ] Deploy to Vercel

---

<p align="center">
  <img src="public/assets/logo.svg" width="32"/>
  <br/>
  <sub>Built with Kimi K2.5 + NVIDIA NIM</sub>
</p>

## License

MIT
