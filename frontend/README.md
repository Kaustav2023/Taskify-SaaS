# Taskify - AI-Powered Productivity Dashboard

A full-stack productivity application built for the **Fluid AI Vibe Coding Assignment**, demonstrating modern web development practices and AI integration.

---

## 🎯 The Problem

Modern productivity tools often suffer from:
- **Manual Categorization Overhead**: Users waste time organizing tasks instead of completing them.
- **Generic Interfaces**: Cookie-cutter designs that fail to inspire engagement.
- **Complex Deployment**: Separate frontend/backend URLs that complicate sharing and collaboration.

---

## 💡 The Solution

**Taskify** addresses these pain points with a purpose-built architecture:

| Challenge | Solution |
|-----------|----------|
| Manual categorization | **Gemini Pro AI** auto-categorizes tasks based on title semantics |
| Boring interfaces | **3D SVG Badges** with metallic gradients for visual delight |
| Deployment complexity | **Unified FastAPI + React** serving from a single URL |

### Tech Stack
- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Google Generative AI (Gemini Pro)
- **Deployment**: Replit-ready with Nix configuration

---

## 📈 The Impact

- ⏱️ **Zero-config task organization** - AI handles categorization instantly
- 🎨 **Premium UX** - Micro-animations and modern glassmorphism design
- 🚀 **One-click deployment** - Single preview URL for stakeholders
- 📊 **Real-time analytics** - Progress tracking with visual charts

---

## 🛠️ Instructions

### Prerequisites
- Node.js v18+
- Python 3.10+
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/taskify-dashboard.git
cd taskify-dashboard

# 2. Backend setup
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 3. Configure environment
echo "GEMINI_API_KEY=your_key_here" > .env

# 4. Frontend build
cd ../frontend
npm install
npm run build

# 5. Run the unified app
cd ../backend
python main.py
```

Visit **http://localhost:8000** - Both UI and API served from one URL!

### Replit Deployment

1. Upload project (excluding `node_modules`, `.venv`)
2. Add `GEMINI_API_KEY` to **Secrets**
3. Run in Shell:
   ```bash
   cd frontend && npm install && npm run build
   cd ../backend && pip install -r requirements.txt
   python main.py
   ```
4. Share the Replit preview URL ✅

---

## 📂 Project Structure

```  
├── backend/  
│   ├── main.py           # FastAPI + Static file server  
│   ├── requirements.txt  
│   └── .env.example  
├── frontend/   
│   ├── src/App.jsx       # Main React application  
│   └── dist/             # Production build  
└── README.md  
```

---

## 🔗 Live Demo

**Replit Preview**: [[Your Replit Link Here]](https://2ce9f214-978b-43cf-8384-fd0585b5c2fd-00-1ep4q1l95qxr4.sisko.replit.dev/)
**Loom Video**: https://www.loom.com/share/17bd6bfd368d4718b1e345449558190e

---

## 📜 License

Built for educational and assessment purposes.
