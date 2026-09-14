from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime, timezone
from bson import ObjectId
from insights_data import INSIGHTS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
ADMIN_KEY = os.environ.get('ADMIN_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")

PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id", serialization_alias="id")

    def to_mongo(self):
        doc = self.model_dump()
        doc["_id"] = doc.pop("id")
        return doc

    @classmethod
    def from_mongo(cls, doc):
        if doc is None:
            return None
        return cls(**doc)


class EnquiryCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    country: Optional[str] = None
    business_activity: Optional[str] = None
    current_location: Optional[str] = None
    service_required: Optional[str] = None
    investment_size: Optional[str] = None
    message: Optional[str] = None
    consent: bool
    source: str = "contact"
    questionnaire: Optional[dict] = None


class Enquiry(BaseDocument):
    name: str
    company: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    country: Optional[str] = None
    business_activity: Optional[str] = None
    current_location: Optional[str] = None
    service_required: Optional[str] = None
    investment_size: Optional[str] = None
    message: Optional[str] = None
    consent: bool
    source: str = "contact"
    questionnaire: Optional[dict] = None
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusUpdate(BaseModel):
    status: str


class Insight(BaseDocument):
    title: str
    slug: str
    category: str
    excerpt: str
    author: str
    author_role: str
    published_at: str
    reading_time: str
    image: str
    content: List[dict]
    related: List[str] = []


@api_router.get("/")
async def root():
    return {"message": "Meridian Corporate Partners API"}


@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(input: EnquiryCreate):
    if not input.consent:
        raise HTTPException(status_code=422, detail="Consent is required")
    enquiry = Enquiry(**input.model_dump())
    await db.enquiries.insert_one(enquiry.to_mongo())
    return enquiry


def require_admin(x_admin_key: Optional[str]):
    if not ADMIN_KEY or x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")


@api_router.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries(x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    docs = await db.enquiries.find().sort("created_at", -1).to_list(500)
    return [Enquiry.from_mongo(d) for d in docs]


@api_router.patch("/enquiries/{enquiry_id}", response_model=Enquiry)
async def update_enquiry(enquiry_id: str, update: StatusUpdate, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    if update.status not in {"new", "in_review", "scheduled", "concluded"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.enquiries.find_one_and_update(
        {"_id": enquiry_id}, {"$set": {"status": update.status}}, return_document=True
    )
    if not res:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return Enquiry.from_mongo(res)


@api_router.get("/insights", response_model=List[Insight])
async def list_insights():
    docs = await db.insights.find().to_list(100)
    return [Insight.from_mongo(d) for d in docs]


@api_router.get("/insights/{slug}", response_model=Insight)
async def get_insight(slug: str):
    doc = await db.insights.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Article not found")
    return Insight.from_mongo(doc)


class InsightUpsert(BaseModel):
    title: str
    slug: str
    category: str
    excerpt: str = ""
    author: str = "Meridian Advisory Desk"
    author_role: str = ""
    published_at: str = ""
    reading_time: str = "5 min read"
    image: str = ""
    content: List[dict] = []
    related: List[str] = []


@api_router.post("/insights", response_model=Insight)
async def create_insight(input: InsightUpsert, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    if await db.insights.find_one({"slug": input.slug}):
        raise HTTPException(status_code=409, detail="An article with this slug already exists")
    insight = Insight(**input.model_dump())
    await db.insights.insert_one(insight.to_mongo())
    return insight


@api_router.put("/insights/{insight_id}", response_model=Insight)
async def update_insight(insight_id: str, input: InsightUpsert, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    res = await db.insights.find_one_and_update(
        {"_id": insight_id}, {"$set": input.model_dump()}, return_document=True
    )
    if not res:
        raise HTTPException(status_code=404, detail="Article not found")
    return Insight.from_mongo(res)


@api_router.delete("/insights/{insight_id}")
async def delete_insight(insight_id: str, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    res = await db.insights.delete_one({"_id": insight_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"deleted": True}


DEFAULT_CONTENT = {
    "site": {
        "name": "Meridian Corporate Partners",
        "shortName": "Meridian",
        "tagline": "Strategic corporate solutions for entrepreneurs, investors and international businesses establishing, expanding and operating in the UAE.",
        "phone": "+971 4 000 0000",
        "whatsapp": "971400000000",
        "email": "enquiries@meridiancorporate.ae",
        "address": "Level 14, Emirates Towers, Sheikh Zayed Road, Dubai, United Arab Emirates",
        "hours": "Monday – Friday · 9:00 – 18:00 GST",
        "linkedin": "https://www.linkedin.com",
        "instagram": "https://www.instagram.com",
        "youtube": "https://www.youtube.com",
    },
    "stats": [
        {"value": "15+", "label": "Businesses Supported"},
        {"value": "40+", "label": "Years of Combined Experience"},
        {"value": "21+", "label": "Markets Connected"},
        {"value": "18+", "label": "Professional Partnerships"},
    ],
}


@api_router.get("/content")
async def get_content():
    doc = await db.content.find_one({"_id": "site_content"})
    if not doc:
        return DEFAULT_CONTENT
    return {
        "site": {**DEFAULT_CONTENT["site"], **doc.get("site", {})},
        "stats": doc.get("stats") or DEFAULT_CONTENT["stats"],
    }


class ContentUpdate(BaseModel):
    site: dict
    stats: List[dict]


@api_router.put("/content")
async def update_content(input: ContentUpdate, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    await db.content.update_one(
        {"_id": "site_content"},
        {"$set": {"site": input.site, "stats": input.stats}},
        upsert=True,
    )
    return {"site": input.site, "stats": input.stats}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_insights():
    if await db.insights.count_documents({}) == 0:
        await db.insights.insert_many(INSIGHTS)
        logger.info("Seeded %s insight articles", len(INSIGHTS))


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
