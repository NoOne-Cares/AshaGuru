# ASHA Guru

AI-Powered Training & Clinical Decision Support for India's Frontline Health Workers  
Built with Google Gemma 4 31B | Next.js 14 | TypeScript | LangGraph.js

---

## Overview

ASHA Guru empowers India's 1.04 million ASHA workers through two AI agents:

- **Trainer Agent** - Infinite role-play scenarios with virtual patients in local languages
- **Clinician Agent** - Real-time triage support grounded in WHO protocols

ASHA workers receive 23 days of training but serve 1,000-1,500 people each. ASHA Guru bridges this gap.

---

## Quick Start

```bash
git clone https://github.com/yourusername/ashaguru.git
cd ashaguru
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

Create `.env.local`:

```bash
# Required: Google AI Studio API key
# Get yours at: https://aistudio.google.com/apikey
GOOGLE_API_KEY=your_google_api_key_here

# Optional: Use local Ollama models instead of API
USE_OLLAMA=false

# Optional: PostgreSQL database for server-side storage
DATABASE_URL=postgresql://user:password@localhost:5432/ashaguru
```

---

## Running Options

### Option 1: Google AI Studio API (Default)

```bash
# .env.local
GOOGLE_API_KEY=your_actual_key_here
USE_OLLAMA=false

npm run dev
```

### Option 2: Local Ollama (No Internet)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull gemma4:4b

# .env.local
GOOGLE_API_KEY=placeholder
USE_OLLAMA=true

npm run dev
```

`docker-compose.yml` for starting local database is included in the repository.


---

## Usage

| Action | How |
|---|---|
| Training | Type `"train me"` or click `"Role-Play Training"` |
| Clinical Support | Describe symptoms or click `"Clinical Support"` |
| Upload Photo | Click camera icon to capture patient condition |
| Record Voice | Click microphone to describe symptoms |
| New Patient | Click `"+ New Patient"` in sidebar |
| Switch Patient | Click patient name in sidebar |
|

---

## License

MIT License.

Built for the Google Gemma 4 Impact Challenge.
