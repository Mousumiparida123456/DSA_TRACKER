from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class Status(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Category(str, Enum):
    ARRAYS = "Arrays"
    STRINGS = "Strings"
    LINKED_LISTS = "Linked Lists"
    STACKS = "Stacks"
    QUEUES = "Queues"
    TREES = "Trees"
    GRAPHS = "Graphs"
    DYNAMIC_PROGRAMMING = "Dynamic Programming"
    RECURSION = "Recursion"
    BACKTRACKING = "Backtracking"
    RECURSION_BACKTRACKING = "Recursion & Backtracking"
    GREEDY = "Greedy"
    SORTING = "Sorting"
    SEARCHING = "Searching"
    BINARY_SEARCH = "Binary Search"
    HASHING = "Hashing"
    HEAPS = "Heaps"
    TRIE = "Trie"
    BIT_MANIPULATION = "Bit Manipulation"
    TWO_POINTERS = "Two Pointers"
    SLIDING_WINDOW = "Sliding Window"
    INTERVALS = "Intervals"
    MATRIX = "Matrix"
    DESIGN = "Design"
    MATH = "Math"
    OTHER = "Other"

# Models
class TopicBase(BaseModel):
    name: str
    category: Category
    difficulty: Difficulty
    notes: Optional[str] = ""
    problem_link: Optional[str] = ""

class TopicCreate(TopicBase):
    pass

class TopicUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[Category] = None
    difficulty: Optional[Difficulty] = None
    status: Optional[Status] = None
    notes: Optional[str] = None
    problem_link: Optional[str] = None

class Topic(TopicBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    status: Status = Status.NOT_STARTED
    created_at: str
    last_reviewed: Optional[str] = None
    next_review: Optional[str] = None

class Stats(BaseModel):
    total: int
    completed: int
    in_progress: int
    not_started: int
    by_difficulty: dict
    by_category: dict

def calculate_next_review(last_review_str: str, review_count: int) -> str:
    """Calculate next review date based on spaced repetition"""
    last_review = datetime.fromisoformat(last_review_str)
    if review_count == 0:
        next_date = last_review + timedelta(days=1)
    elif review_count == 1:
        next_date = last_review + timedelta(days=3)
    elif review_count == 2:
        next_date = last_review + timedelta(days=7)
    else:
        next_date = last_review + timedelta(days=30)
    return next_date.isoformat()

# Routes
@api_router.get("/")
async def root():
    return {"message": "DSA Tracker API"}

@api_router.get("/topics", response_model=List[Topic])
async def get_topics(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    query = {}
    
    if category:
        query["category"] = category
    if difficulty:
        query["difficulty"] = difficulty
    if status:
        query["status"] = status
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    topics = await db.topics.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return topics

@api_router.post("/topics", response_model=Topic)
async def create_topic(topic: TopicCreate):
    import uuid
    
    topic_dict = topic.model_dump()
    topic_obj = Topic(
        id=str(uuid.uuid4()),
        created_at=datetime.now(timezone.utc).isoformat(),
        **topic_dict
    )
    
    doc = topic_obj.model_dump()
    await db.topics.insert_one(doc)
    return topic_obj

@api_router.put("/topics/{topic_id}", response_model=Topic)
async def update_topic(topic_id: str, update: TopicUpdate):
    existing = await db.topics.find_one({"id": topic_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    update_data = update.model_dump(exclude_unset=True)
    
    # If status is being changed to completed, set last_reviewed and next_review
    if "status" in update_data and update_data["status"] == Status.COMPLETED:
        now = datetime.now(timezone.utc).isoformat()
        update_data["last_reviewed"] = now
        # First review after 1 day
        review_count = existing.get("review_count", 0)
        update_data["next_review"] = calculate_next_review(now, review_count)
    
    await db.topics.update_one({"id": topic_id}, {"$set": update_data})
    
    updated = await db.topics.find_one({"id": topic_id}, {"_id": 0})
    return Topic(**updated)

@api_router.delete("/topics/{topic_id}")
async def delete_topic(topic_id: str):
    result = await db.topics.delete_one({"id": topic_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Topic deleted successfully"}

@api_router.get("/topics/reminders/due", response_model=List[Topic])
async def get_due_reminders():
    now = datetime.now(timezone.utc).isoformat()
    
    topics = await db.topics.find(
        {
            "status": Status.COMPLETED,
            "next_review": {"$lte": now}
        },
        {"_id": 0}
    ).to_list(1000)
    
    return topics

@api_router.post("/topics/{topic_id}/review")
async def mark_reviewed(topic_id: str):
    existing = await db.topics.find_one({"id": topic_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    now = datetime.now(timezone.utc).isoformat()
    review_count = existing.get("review_count", 0) + 1
    next_review = calculate_next_review(now, review_count)
    
    await db.topics.update_one(
        {"id": topic_id},
        {
            "$set": {
                "last_reviewed": now,
                "next_review": next_review,
                "review_count": review_count
            }
        }
    )
    
    return {"message": "Topic reviewed successfully", "next_review": next_review}

@api_router.get("/stats", response_model=Stats)
async def get_stats():
    topics = await db.topics.find({}, {"_id": 0}).to_list(10000)
    
    total = len(topics)
    completed = sum(1 for t in topics if t["status"] == Status.COMPLETED)
    in_progress = sum(1 for t in topics if t["status"] == Status.IN_PROGRESS)
    not_started = sum(1 for t in topics if t["status"] == Status.NOT_STARTED)
    
    by_difficulty = {
        "easy": sum(1 for t in topics if t["difficulty"] == Difficulty.EASY),
        "medium": sum(1 for t in topics if t["difficulty"] == Difficulty.MEDIUM),
        "hard": sum(1 for t in topics if t["difficulty"] == Difficulty.HARD)
    }
    
    by_category = {}
    for topic in topics:
        cat = topic["category"]
        by_category[cat] = by_category.get(cat, 0) + 1
    
    return Stats(
        total=total,
        completed=completed,
        in_progress=in_progress,
        not_started=not_started,
        by_difficulty=by_difficulty,
        by_category=by_category
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()