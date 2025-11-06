[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 🎬 Scene Builder Agent — Synorus

The **Scene Builder Agent** converts natural-language prompts into structured **scene JSON** for AI-assisted video creation.  
Built with **Fastify + TypeScript + Gemini API**, enabling intelligent scene composition.

---

## 🚀 Quick Setup

### 1️⃣ Clone & Install
```bash
git clone https://github.com/ramakrishna67/scene-builder-agent.git
cd scene-builder-agent
npm install
```

### 2️⃣ Add Environment Variables
Create a `.env` file in the root:
```bash
GEMINI_API_KEY=your_google_api_key
PORT=3000
```

### 3️⃣ Run the Server
```bash
npm run dev
```

Server starts at:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧠 Example API Call(cURL)

```bash
curl -X POST http://localhost:3000/v1/agent/scene \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a 10s motivational intro with sunrise and quote 'Rise & Win'",
    "constraints": { "totalDurationSec": 10, "aspectRatio": "16:9", "fps": 30 }
  }'
```

✅ Returns structured scene JSON:
```json
{
  "scene": {
    "scenes": [...],
    "meta": { "aspectRatio": "16:9", "fps": 30, "totalDurationSec": 10 }
  }
}
```

---

## ⚙️ Tech Stack

- ⚡ **Fastify** — high-performance Node.js server  
- 🧠 **Gemini 2.5 Flash** — scene planning and content generation  
- 🛡️ **Zod** — input validation  
- 🔐 **dotenv** — environment management  
- 💡 **TypeScript** — type-safe backend  

---

## 🧩 Design Highlights

- Structured **Scene JSON** output for direct use in video renderers  
- Clean, modular architecture (`agents`, `providers`, `core`, `api`)  
- Extensible for **TTS, media integration, and rendering**  
- Built for **Synorus Studio** — modular AI scene editing system  

---

## ⚠️ Limitations

- No caching (every request hits Gemini API)  
- Placeholder media URLs  
- No persistence (stateless design) 

---

## 🔮 Next Steps

- 🎧 Add TTS & voiceover layers  
- 💾 Add PostgreSQL for scene storage  
- 🧠 Fine-tune JSON schema validation  
- 🌐 Build frontend visualization in Next.js  

---


