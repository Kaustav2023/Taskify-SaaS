from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from pathlib import Path
import uuid
import os
from datetime import datetime, date
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    try:
        model = genai.GenerativeModel("gemini-pro")
    except Exception as e:
        print(f"Could not initialize Gemini model: {e}")
        model = None
else:
    model = None

app = FastAPI(title="Task Board API", version="2.0.0")

# Path to React build folder (relative to this file)
FRONTEND_BUILD_DIR = Path(__file__).parent.parent / "frontend" / "dist"

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory task storage
tasks_db: list = []

# Pydantic models
class TaskCreate(BaseModel):
    title: str
    pomodoro_minutes: Optional[int] = 25
    due_date: Optional[str] = None      # ISO date string: "2025-12-25"
    start_time: Optional[str] = None    # Time string: "10:00"

class Task(BaseModel):
    id: str
    title: str
    completed: bool = False
    category: str = "Personal"
    pomodoro_minutes: int = 25
    progress: int = 0                   # 0-100, starts at 0
    due_date: Optional[str] = None      # ISO date for days_left calc
    start_time: Optional[str] = None    # For scheduled tasks
    completed_at: Optional[str] = None  # ISO datetime when completed

class TaskUpdate(BaseModel):
    completed: Optional[bool] = None
    progress: Optional[int] = None
    due_date: Optional[str] = None
    start_time: Optional[str] = None


# Keyword-based categorization
CATEGORY_KEYWORDS = {
    "Health": ["gym", "exercise", "run", "jog", "yoga", "workout", "doctor", "dentist",
               "medicine", "meditation", "walk", "swim", "bike", "health", "fitness",
               "sleep", "diet", "water", "stretch", "sports"],
    "Learning": ["study", "learn", "course", "read", "book", "tutorial", "documentation",
                 "python", "javascript", "coding", "programming", "class", "lecture", "exam",
                 "certificate", "training", "skill", "chapter", "lesson", "practice"],
    "Ideas": ["brainstorm", "idea", "creative", "startup", "invention", "side project",
              "experiment", "prototype", "design", "concept", "innovation"],
    "Work": ["meeting", "presentation", "deadline", "project", "report", "client", "office", 
             "email", "call", "team", "manager", "boss", "quarterly", "sales", "job",
             "interview", "proposal", "budget", "stakeholder", "review", "sprint"],
}


def keyword_categorize(title: str) -> str:
    """Categorize using keyword matching."""
    title_lower = title.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in title_lower:
                return category
    return "Personal"


async def ai_categorize(title: str) -> str:
    """Try to use Gemini AI for categorization."""
    if not model:
        return None
    try:
        prompt = f"""Categorize this task into exactly ONE of: Work, Learning, Health, Ideas, Personal

Task: "{title}"

Answer with ONE word only:"""
        response = model.generate_content(prompt)
        category = response.text.strip().replace(".", "").replace(",", "").replace(":", "")
        valid_categories = ["Personal", "Work", "Learning", "Health", "Ideas"]
        if category in valid_categories:
            return category
        for valid in valid_categories:
            if valid.lower() in category.lower():
                return valid
        return None
    except Exception as e:
        print(f"AI error: {e}")
        return None


async def categorize_task(title: str) -> str:
    """Categorize a task using AI with keyword fallback."""
    keyword_result = keyword_categorize(title)
    if keyword_result != "Personal":
        return keyword_result
    ai_result = await ai_categorize(title)
    if ai_result:
        return ai_result
    return keyword_result


@app.get("/")
async def root():
    """Serve React frontend at root."""
    index_path = FRONTEND_BUILD_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    return {"message": "Task Board API v2.0 - Frontend not built"}


@app.post("/tasks", response_model=Task)
async def create_task(task: TaskCreate):
    """Create a new task with AI auto-categorization."""
    if not task.title.strip():
        raise HTTPException(status_code=400, detail="Task title cannot be empty")
    
    category = await categorize_task(task.title)
    
    # Default due_date to 7 days from now if not provided
    default_due = (datetime.now().date() + __import__('datetime').timedelta(days=7)).isoformat()
    
    new_task = Task(
        id=str(uuid.uuid4()),
        title=task.title.strip(),
        completed=False,
        category=category,
        pomodoro_minutes=task.pomodoro_minutes or 25,
        progress=0,  # Always starts at 0
        due_date=task.due_date or default_due,
        start_time=task.start_time,
        completed_at=None
    )
    tasks_db.append(new_task.model_dump())
    return new_task


@app.get("/tasks", response_model=list[Task])
async def list_tasks():
    """Get all tasks."""
    return tasks_db


@app.patch("/tasks/{task_id}/complete", response_model=Task)
async def toggle_complete(task_id: str):
    """Toggle task completion status."""
    for task in tasks_db:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]
            if task["completed"]:
                task["progress"] = 100
                task["completed_at"] = datetime.now().isoformat()
            else:
                task["completed_at"] = None
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.patch("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, update: TaskUpdate):
    """Update task fields (progress, due_date, start_time)."""
    for task in tasks_db:
        if task["id"] == task_id:
            if update.progress is not None:
                task["progress"] = max(0, min(100, update.progress))
                if task["progress"] == 100:
                    task["completed"] = True
                    task["completed_at"] = datetime.now().isoformat()
            if update.due_date is not None:
                task["due_date"] = update.due_date
            if update.start_time is not None:
                task["start_time"] = update.start_time
            if update.completed is not None:
                task["completed"] = update.completed
                if update.completed:
                    task["progress"] = 100
                    task["completed_at"] = datetime.now().isoformat()
                else:
                    task["completed_at"] = None
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task by ID."""
    global tasks_db
    for i, task in enumerate(tasks_db):
        if task["id"] == task_id:
            tasks_db.pop(i)
            return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")


# ===================== STATIC FILE SERVING (FOR REPLIT) =====================
# Mount static assets (JS, CSS, images) if build exists
if FRONTEND_BUILD_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_BUILD_DIR / "assets"), name="static_assets")

# Catch-all route for SPA - serves index.html for all non-API routes
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """Serve React SPA for any route not handled by API."""
    # Don't serve for API routes
    if full_path.startswith("api/") or full_path.startswith("tasks") or full_path.startswith("docs") or full_path.startswith("openapi"):
        raise HTTPException(status_code=404, detail="Not found")
    
    index_path = FRONTEND_BUILD_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    
    # Fallback message if no build exists
    return {"message": "Frontend not built. Run 'npm run build' in frontend folder."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
