import json
import os
import asyncio
from pathlib import Path
from bson import ObjectId

DB_FILE = Path(__file__).parent / 'local_data.json'

class LocalCursor:
    def __init__(self, items):
        self.items = list(items)

    def sort(self, key, direction=1):
        reverse = (direction == -1)
        def _sort_val(x):
            v = x.get(key, "")
            if v is None:
                return ""
            if hasattr(v, "isoformat"):
                return v.isoformat()
            if isinstance(v, (int, float)):
                return v
            return str(v)
        self.items.sort(key=_sort_val, reverse=reverse)
        return self

    async def to_list(self, limit=100):
        return self.items[:limit]

class LocalCollection:
    def __init__(self, name, db):
        self.name = name
        self.db = db

    def _get_docs(self):
        return self.db.data.setdefault(self.name, [])

    def _match(self, doc, query):
        if not query:
            return True
        for k, v in query.items():
            if k == '_id':
                if str(doc.get('_id')) != str(v):
                    return False
            elif doc.get(k) != v:
                return False
        return True

    async def count_documents(self, query):
        return len([d for d in self._get_docs() if self._match(d, query)])

    async def find_one(self, query):
        for d in self._get_docs():
            if self._match(d, query):
                return dict(d)
        return None

    def find(self, query=None):
        results = [dict(d) for d in self._get_docs() if self._match(d, query)]
        return LocalCursor(results)

    async def insert_one(self, doc):
        d = dict(doc)
        if '_id' not in d:
            d['_id'] = str(ObjectId())
        self._get_docs().append(d)
        self.db.save()
        return d

    async def insert_many(self, docs):
        res = []
        for doc in docs:
            d = dict(doc)
            if '_id' not in d:
                d['_id'] = str(ObjectId())
            self._get_docs().append(d)
            res.append(d)
        self.db.save()
        return res

    async def find_one_and_update(self, query, update, return_document=True):
        for idx, d in enumerate(self._get_docs()):
            if self._match(d, query):
                if "$set" in update:
                    d.update(update["$set"])
                else:
                    d.update(update)
                self.db.save()
                return dict(d)
        return None

    async def update_one(self, query, update, upsert=False):
        for d in self._get_docs():
            if self._match(d, query):
                if "$set" in update:
                    d.update(update["$set"])
                else:
                    d.update(update)
                self.db.save()
                return
        if upsert:
            new_doc = dict(query)
            if "$set" in update:
                new_doc.update(update["$set"])
            else:
                new_doc.update(update)
            if '_id' not in new_doc:
                new_doc['_id'] = str(ObjectId())
            self._get_docs().append(new_doc)
            self.db.save()

    async def delete_one(self, query):
        docs = self._get_docs()
        class Res:
            deleted_count = 0
        res = Res()
        for idx, d in enumerate(docs):
            if self._match(d, query):
                docs.pop(idx)
                self.db.save()
                res.deleted_count = 1
                return res
        return res

class LocalDB:
    def __init__(self):
        self.data = {}
        if DB_FILE.exists():
            try:
                self.data = json.loads(DB_FILE.read_text(encoding='utf-8'))
            except Exception:
                self.data = {}

    def save(self):
        try:
            DB_FILE.write_text(json.dumps(self.data, indent=2, default=str), encoding='utf-8')
        except Exception as e:
            print('Error saving local_data.json:', e)

    def __getitem__(self, name):
        return LocalCollection(name, self)

    def __getattr__(self, name):
        return self[name]
