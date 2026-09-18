from fastapi import FastAPI, APIRouter, HTTPException, Header, BackgroundTasks, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import smtplib
import json
import urllib.request
import cloudinary
import cloudinary.uploader
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime, timezone
from bson import ObjectId
from insights_data import INSIGHTS

from local_store import LocalDB

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://127.0.0.1:27017')
DB_NAME = os.environ.get('DB_NAME', 'probizuae')
ADMIN_KEY = os.environ.get('ADMIN_KEY', 'probizadminsecret123')

client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=1500)
mongo_db = client[DB_NAME]
local_db = LocalDB()

class DBProxy:
    def __init__(self, m_db, l_db):
        self.m_db = m_db
        self.l_db = l_db
        self.is_mongo_active = None

    async def check_mongo(self):
        if self.is_mongo_active is not None:
            return self.is_mongo_active
        try:
            await self.m_db.command("ping")
            self.is_mongo_active = True
            logging.getLogger(__name__).info("Connected to MongoDB successfully.")
        except Exception:
            self.is_mongo_active = False
            logging.getLogger(__name__).info("MongoDB not connected; using local file store.")
        return self.is_mongo_active

    def __getitem__(self, name):
        return CollectionProxy(name, self)

    def __getattr__(self, name):
        return self[name]

class CollectionProxy:
    def __init__(self, name, db_proxy):
        self.name = name
        self.db_proxy = db_proxy

    async def _target(self):
        use_mongo = await self.db_proxy.check_mongo()
        if use_mongo:
            return self.db_proxy.m_db[self.name]
        return self.db_proxy.l_db[self.name]

    async def count_documents(self, *args, **kwargs):
        t = await self._target()
        return await t.count_documents(*args, **kwargs)

    async def find_one(self, *args, **kwargs):
        t = await self._target()
        return await t.find_one(*args, **kwargs)

    def find(self, *args, **kwargs):
        if self.db_proxy.is_mongo_active:
            return self.db_proxy.m_db[self.name].find(*args, **kwargs)
        return self.db_proxy.l_db[self.name].find(*args, **kwargs)

    async def insert_one(self, *args, **kwargs):
        t = await self._target()
        return await t.insert_one(*args, **kwargs)

    async def insert_many(self, *args, **kwargs):
        t = await self._target()
        return await t.insert_many(*args, **kwargs)

    async def find_one_and_update(self, *args, **kwargs):
        t = await self._target()
        return await t.find_one_and_update(*args, **kwargs)

    async def update_one(self, *args, **kwargs):
        t = await self._target()
        return await t.update_one(*args, **kwargs)

    async def delete_one(self, *args, **kwargs):
        t = await self._target()
        return await t.delete_one(*args, **kwargs)

db = DBProxy(mongo_db, local_db)

SMTP_HOST = os.environ.get('SMTP_HOST')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD')
SMTP_FROM_EMAIL = os.environ.get('SMTP_FROM_EMAIL') or SMTP_USER
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', 'enquiries@probizuae.com')
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

app = FastAPI()
api_router = APIRouter(prefix="/api")

@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    try:
        contents = await file.read()
        res = cloudinary.uploader.upload(
            contents,
            folder="probiz-uae/uploads",
            resource_type="auto"
        )
        return {"url": res.get("secure_url"), "public_id": res.get("public_id")}
    except Exception as e:
        logging.getLogger(__name__).error("Cloudinary upload error: %s", e)
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

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
    model_config = ConfigDict(extra="ignore")
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
    return {"message": "Pro Biz UAE API"}


def send_enquiry_notification(data: dict):
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        logging.getLogger(__name__).info("SMTP not fully configured; skipping email dispatch.")
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"New Enquiry from {data.get('name', 'Client')} - Pro Biz UAE"
        msg["From"] = SMTP_FROM_EMAIL
        msg["To"] = NOTIFICATION_EMAIL

        q_html = ""
        if data.get('questionnaire'):
            q_rows = "".join([f"<tr><td style='padding: 4px 0; font-weight: bold;'>{k.replace('_', ' ').capitalize()}:</td><td>{v}</td></tr>" for k, v in data['questionnaire'].items() if v])
            if q_rows:
                q_html = f"<h3 style='color: #333; margin-top: 20px;'>Questionnaire Responses:</h3><table style='width: 100%; border-collapse: collapse;'>{q_rows}</table>"

        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; background: #fafafa;">
            <h2 style="color: #CE1126; margin-top: 0;">New Client Enquiry - Pro Biz UAE</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>{data.get('name')}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Company:</td><td>{data.get('company') or 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:{data.get('email')}">{data.get('email')}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>{data.get('phone') or 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Country:</td><td>{data.get('country') or 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td>{data.get('service_required') or 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Investment:</td><td>{data.get('investment_size') or 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Source:</td><td>{data.get('source') or 'N/A'}</td></tr>
            </table>
            {q_html}
            <h3 style="color: #333; margin-top: 20px;">Message:</h3>
            <p style="background: #fff; padding: 12px; border-left: 3px solid #CE1126; border-radius: 4px;">
                {data.get('message') or 'No message provided.'}
            </p>
        </div>
        """
        msg.attach(MIMEText(html, "html"))

        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as s:
                s.login(SMTP_USER, SMTP_PASSWORD)
                s.sendmail(SMTP_FROM_EMAIL, [NOTIFICATION_EMAIL], msg.as_string())
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as s:
                s.starttls()
                s.login(SMTP_USER, SMTP_PASSWORD)
                s.sendmail(SMTP_FROM_EMAIL, [NOTIFICATION_EMAIL], msg.as_string())
        logging.getLogger(__name__).info("Notification email sent to %s", NOTIFICATION_EMAIL)
    except Exception as exc:
        logging.getLogger(__name__).error("Failed to send notification email: %s", exc)


def sync_enquiry_to_supabase(data: dict):
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        return
    try:
        url = f"{SUPABASE_URL}/rest/v1/enquiries"
        payload = {
            "name": data.get("name"),
            "email": data.get("email"),
            "company": data.get("company"),
            "phone": data.get("phone"),
            "country": data.get("country"),
            "service_required": data.get("service_required"),
            "investment_size": data.get("investment_size"),
            "message": data.get("message"),
            "source": data.get("source", "contact"),
            "status": "new"
        }
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=body, method="POST")
        req.add_header("apikey", SUPABASE_SERVICE_ROLE_KEY)
        req.add_header("Authorization", f"Bearer {SUPABASE_SERVICE_ROLE_KEY}")
        req.add_header("Content-Type", "application/json")
        req.add_header("Prefer", "return=minimal")
        with urllib.request.urlopen(req, timeout=5) as resp:
            logging.getLogger(__name__).info("Synced enquiry to Supabase: status %s", resp.status)
    except Exception as e:
        logging.getLogger(__name__).warning("Failed to sync enquiry to Supabase: %s", e)


@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(input: EnquiryCreate, background_tasks: BackgroundTasks):
    if not input.consent:
        raise HTTPException(status_code=422, detail="Consent is required")
    enquiry = Enquiry(**input.model_dump())
    await db.enquiries.insert_one(enquiry.to_mongo())
    background_tasks.add_task(send_enquiry_notification, input.model_dump())
    background_tasks.add_task(sync_enquiry_to_supabase, input.model_dump())
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
    author: str = "Pro Biz UAE Advisory Desk"
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
        "name": "Pro Biz UAE",
        "shortName": "Pro Biz UAE",
        "tagline": "Strategic corporate solutions for entrepreneurs, investors and international businesses establishing, expanding and operating in the UAE.",
        "phone": "+971 50 118 4777",
        "whatsapp": "971501184777",
        "email": "enquiries@probizuae.com",
        "address": "M11, Ibn Battuta Gate, Jebel Ali, Dubai, United Arab Emirates",
        "hours": "Monday – Friday · 9:00 – 18:00 GST",
        "linkedin": "https://www.linkedin.com",
        "instagram": "https://www.instagram.com",
        "youtube": "https://www.youtube.com",
    },
    "stats": [
        {"value": "150+", "label": "Businesses Supported"},
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


class ProjectUpsert(BaseModel):
    title: str = ""
    client_name: str = ""
    industry: str = ""
    location: str = ""
    project_type: str = ""
    category: str = "Corporate Websites"
    requirement: str = ""
    solution: str = ""
    images: List[str] = []
    logo: str = ""
    features: List[str] = []
    tech: List[str] = []
    outcome: str = ""
    url: str = ""
    testimonial: str = ""
    testimonial_author: str = ""
    published: bool = False
    confidential: bool = False
    sample: bool = False
    order: int = 0


class Project(BaseDocument):
    title: str = ""
    client_name: str = ""
    industry: str = ""
    location: str = ""
    project_type: str = ""
    category: str = "Corporate Websites"
    requirement: str = ""
    solution: str = ""
    images: List[str] = []
    logo: str = ""
    features: List[str] = []
    tech: List[str] = []
    outcome: str = ""
    url: str = ""
    testimonial: str = ""
    testimonial_author: str = ""
    published: bool = False
    confidential: bool = False
    sample: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


def public_project(p: Project) -> Project:
    if p.confidential:
        p.client_name = "Confidential Client"
        p.url = ""
        p.logo = ""
        p.testimonial = ""
        p.testimonial_author = ""
    return p


@api_router.get("/projects", response_model=List[Project])
async def list_projects():
    docs = await db.projects.find({"published": True}).sort("order", 1).to_list(200)
    return [public_project(Project.from_mongo(d)) for d in docs]


@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    doc = await db.projects.find_one({"_id": project_id, "published": True})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return public_project(Project.from_mongo(doc))


@api_router.get("/admin/projects", response_model=List[Project])
async def admin_list_projects(x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    docs = await db.projects.find().sort("order", 1).to_list(500)
    return [Project.from_mongo(d) for d in docs]


@api_router.post("/projects", response_model=Project)
async def create_project(input: ProjectUpsert, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    project = Project(**input.model_dump())
    await db.projects.insert_one(project.to_mongo())
    return project


@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, input: ProjectUpsert, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    res = await db.projects.find_one_and_update(
        {"_id": project_id}, {"$set": input.model_dump()}, return_document=True
    )
    if not res:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project.from_mongo(res)


@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    res = await db.projects.delete_one({"_id": project_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"deleted": True}


SAMPLE_PROJECTS = [
    {
        "_id": str(ObjectId()),
        "title": "Sample Project — Corporate Advisory Website",
        "client_name": "Sample Client (Placeholder)",
        "industry": "Professional Services",
        "location": "Dubai, UAE",
        "project_type": "Corporate Website",
        "category": "Corporate Websites",
        "requirement": "SAMPLE PLACEHOLDER — A professional services firm required a credible, content-managed corporate website with confidential enquiry capture and a premium brand presence. This sample entry demonstrates the case-study format until real client projects are published.",
        "solution": "SAMPLE PLACEHOLDER — Design and development of a bespoke corporate website with CMS-managed content, consultation enquiry forms, WhatsApp integration and SEO-ready architecture.",
        "images": [
            "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "features": ["Corporate website design", "CMS-managed content", "Enquiry & consultation forms", "WhatsApp integration", "SEO-ready development"],
        "tech": ["React", "Tailwind CSS", "FastAPI", "MongoDB"],
        "outcome": "SAMPLE PLACEHOLDER — Outcome details will be published together with real client projects.",
        "url": "",
        "testimonial": "",
        "published": True,
        "confidential": False,
        "sample": True,
        "order": 1,
    },
    {
        "_id": str(ObjectId()),
        "title": "Sample Project — E-Commerce Storefront",
        "client_name": "Sample Client (Placeholder)",
        "industry": "Retail",
        "location": "Dubai, UAE",
        "project_type": "E-Commerce Website",
        "category": "E-Commerce",
        "requirement": "SAMPLE PLACEHOLDER — A retail business required a mobile-first online store with payment gateway integration and order management. This sample entry demonstrates the case-study format until real client projects are published.",
        "solution": "SAMPLE PLACEHOLDER — Development of a responsive e-commerce storefront with secure payment gateway integration, product management and customer enquiry flows.",
        "images": [
            "https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=srgb&fm=jpg&q=85",
        ],
        "features": ["E-commerce website", "Payment gateway integration", "Mobile-first design", "Product management", "Maintenance & support"],
        "tech": ["React", "Tailwind CSS", "Payment Gateway API"],
        "outcome": "SAMPLE PLACEHOLDER — Outcome details will be published together with real client projects.",
        "url": "",
        "testimonial": "",
        "published": True,
        "confidential": False,
        "sample": True,
        "order": 2,
    },
]


class ServiceUpsert(BaseModel):
    slug: str
    group: str
    title: str
    summary: str = ""
    what: str = ""
    who: List[str] = []
    why: str = ""
    process: List[dict] = []
    considerations: List[str] = []
    role: str = ""
    partners: str = ""
    timeline: List[dict] = []
    documents: List[str] = []
    faqs: List[dict] = []
    order: int = 0


class ServiceDoc(BaseDocument):
    slug: str
    group: str
    title: str
    summary: str = ""
    what: str = ""
    who: List[str] = []
    why: str = ""
    process: List[dict] = []
    considerations: List[str] = []
    role: str = ""
    partners: str = ""
    timeline: List[dict] = []
    documents: List[str] = []
    faqs: List[dict] = []
    order: int = 0


@api_router.get("/services", response_model=List[ServiceDoc])
async def list_services():
    docs = await db.services.find().sort("order", 1).to_list(100)
    return [ServiceDoc.from_mongo(d) for d in docs]


@api_router.get("/services/{slug}", response_model=ServiceDoc)
async def get_service(slug: str):
    doc = await db.services.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceDoc.from_mongo(doc)


@api_router.post("/services", response_model=ServiceDoc)
async def create_service(input: ServiceUpsert, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    if await db.services.find_one({"slug": input.slug}):
        raise HTTPException(status_code=409, detail="A service with this slug already exists")
    service = ServiceDoc(**input.model_dump())
    await db.services.insert_one(service.to_mongo())
    return service


@api_router.put("/services/{service_id}", response_model=ServiceDoc)
async def update_service(service_id: str, input: ServiceUpsert, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    res = await db.services.find_one_and_update(
        {"_id": service_id}, {"$set": input.model_dump()}, return_document=True
    )
    if not res:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceDoc.from_mongo(res)


@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str, x_admin_key: Optional[str] = Header(None)):
    require_admin(x_admin_key)
    res = await db.services.delete_one({"_id": service_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"deleted": True}


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
    if await db.projects.count_documents({}) == 0:
        await db.projects.insert_many(SAMPLE_PROJECTS)
        logger.info("Seeded %s sample projects", len(SAMPLE_PROJECTS))
    if await db.services.count_documents({}) == 0:
        import json
        seed = json.loads((ROOT_DIR / 'services_seed.json').read_text())
        await db.services.insert_many([{"_id": str(ObjectId()), "order": i, **s} for i, s in enumerate(seed)])
        logger.info("Seeded %s services", len(seed))


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
