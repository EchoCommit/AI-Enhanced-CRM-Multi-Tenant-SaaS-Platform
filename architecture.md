# NEXUS CRM — SYSTEM ARCHITECTURE

> Last Updated: 2026-08-25 | Branch: frontend

---

## 1. HIGH-LEVEL ARCHITECTURE

```
+------------------------------------------------------------------+
|                        NEXUS CRM PLATFORM                        |
|                                                                    |
|  +------------------+     HTTPS      +------------------------+  |
|  |   Browser/Client |  <-----------> |   React SPA (PLANNED)  |  |
|  +------------------+                +------------------------+  |
|                                               |                    |
|                                     REST API (JSON)               |
|                                               |                    |
|                               +----------------------------+      |
|                               |  FastAPI Backend (PLANNED) |      |
|                               |  - JWT Middleware           |      |
|                               |  - Tenant Middleware        |      |
|                               |  - Pydantic Validation     |      |
|                               +----------------------------+      |
|                                    |              |               |
|                    +---------------+              +----------+    |
|                    |                                         |    |
|           +--------+--------+              +----------------++   |
|           |  PostgreSQL DB   |              |  AI Inference  |    |
|           |  (Per-Tenant     |              |  Layer         |    |
|           |   Schema Isol.)  |              |  (pkl models)  |    |
|           +-----------------+              +----------------+    |
|                                                                    |
+------------------------------------------------------------------+
```

---

## 2. CURRENT STATE vs. PLANNED STATE

### Current State (As of 2026-08-25)
```
WHAT EXISTS:
+-------------------------------------------------+
|            DATA SCIENCE / ML LAYER              |
|                                                  |
|  Input: crm_cleaned_2023_2026.csv (gitignored)  |
|           |                                      |
|           v                                      |
|  Jupyter Notebook: train_models.ipynb            |
|           |                                      |
|           v                                      |
|  ColumnTransformer Preprocessor                  |
|  - StandardScaler (33 numeric features)          |
|  - OneHotEncoder (9 categorical features)        |
|           |                                      |
|           v                                      |
|  Model 1: XGBClassifier                         |
|  Target: lead_hot                                |
|  Test AUC: 0.9576 (EXCELLENT)                   |
|           |                                      |
|  Model 2: XGBClassifier                         |
|  Target: churned                                 |
|  Test AUC: 0.6655 (NEEDS IMPROVEMENT)           |
|           |                                      |
|  Model 3: XGBRegressor                          |
|  Target: deal_close_prob                         |
|  Test R2: 0.6384 (ACCEPTABLE)                   |
|           |                                      |
|           v                                      |
|  Output: models/*.pkl (gitignored, local)        |
+-------------------------------------------------+
```

### Planned State (To Be Built)
```
+-------------------+     +---------------------+
|   React Frontend  |     |   FastAPI Backend    |
|   (Not Built)     | --> |   (Not Built)        |
+-------------------+     +---------------------+
                                    |
                   +----------------+---------------+
                   |                                |
          +--------+-------+          +------------+----------+
          |  PostgreSQL DB  |          |  ML Inference Service |
          |  Schema/Tenant  |          |  Loads pkl at startup |
          |  Isolation      |          |  Runs on request      |
          +----------------+          +----------------------+
```

---

## 3. MULTI-TENANCY ARCHITECTURE

### Schema Isolation Pattern
```
PostgreSQL Instance
|
+-- public schema
|   +-- tenants         (tenant registry)
|   +-- super_admins    (platform admins)
|
+-- tenant_001 schema   (Company A's data)
|   +-- leads
|   +-- deals
|   +-- accounts
|   +-- activities
|   +-- contacts
|   +-- users
|
+-- tenant_002 schema   (Company B's data)
|   +-- leads
|   +-- deals
|   +-- accounts
|   +-- activities
|   +-- contacts
|   +-- users
|
+-- tenant_003 schema   ...
```

### Request Flow with Tenancy
```
HTTP Request
     |
     v
JWT Middleware: Extract token
     |
     v
Validate token: { user_id, tenant_id, role }
     |
     v
Tenant Middleware: SET search_path = tenant_{id}
     |
     v
Business Logic (tenant-scoped queries)
     |
     v
Response
```

---

## 4. ML SERVICE ARCHITECTURE

### Model Loading Strategy
```
FastAPI Startup Event
     |
     v
Load models/preprocessor.pkl      -> global preprocessor instance
Load models/lead_scoring_model.pkl -> global lead_model instance
Load models/churn_model.pkl        -> global churn_model instance
Load models/deal_prob_model.pkl    -> global deal_model instance
     |
     v
All inference endpoints share these singleton instances
(Fast: no disk I/O on each request)
```

### Inference Pipeline
```
Raw entity data (dict)
     |
     v
Extract 42 features (33 numeric + 9 categorical)
     |
     v
preprocessor.transform(features) -> normalized array
     |
     v
model.predict_proba(array)[:, 1] -> probability score
     |
     v
Round to 4 decimal places
     |
     v
Store in DB + return in API response
```

---

## 5. AI AGENT TOOLING ARCHITECTURE

The repository uses an AI agent framework (Impeccable + Hallmark):

```
Developer makes file edit
     |
     v
impeccable.json hook fires (postToolUse)
     |
     v
Checks for .github/skills/impeccable/scripts/hook.mjs
     |
     v
Checks Node.js >= 22
     |
     v
Runs hook.mjs for code quality check
     |
     v
Hallmark skill (.agents/skills/hallmark/)
Used for AI-assisted asset generation
```

### Agent Definitions
| Agent | File | Role |
|-------|------|------|
| impeccable-asset-producer | .github/agents/impeccable-asset-producer.agent.md | Generates production UI assets from mockups |
| impeccable-documenter | .github/agents/impeccable-documenter.agent.md | Generates documentation |
| impeccable-finish-reviewer | .github/agents/impeccable-finish-reviewer.agent.md | Reviews final code quality |
| impeccable-manual-edit-applier | .github/agents/impeccable-manual-edit-applier.agent.md | Applies manual edits safely |

---

## 6. DATA ARCHITECTURE

### Training Data Pipeline
```
Raw CRM data
     |
     v
crm_cleaned_2023_2026.csv (gitignored, pre-cleaned)
     |
     v
Time-based split:
- Train: 2023-2024 (1,583 rows)
- Val:   2025 (791 rows)
- Test:  2026 (126 rows)
     |
     v
ColumnTransformer.fit_transform(train)
ColumnTransformer.transform(val, test)
     |
     v
XGBoost training with early stopping on validation AUC/RMSE
     |
     v
Serialized to models/*.pkl
```

### Production Data Flow (Planned)
```
User creates entity (lead/deal/account) via UI
     |
     v
FastAPI POST /leads
     |
     v
Save to PostgreSQL (tenant schema)
     |
     v
Pass entity features to AIService
     |
     v
AIService.score(entity) -> probability
     |
     v
Update entity record with AI score
     |
     v
Return scored entity to frontend
     |
     v
Display score in UI
```

---

## 7. SECURITY ARCHITECTURE

### Current Security Posture
| Control | Status |
|---------|--------|
| .gitignore blocks data files | ACTIVE |
| .gitignore blocks model files | ACTIVE |
| .gitignore blocks .env | ACTIVE |
| SECURITY.md vulnerability policy | ACTIVE |
| Authentication | NOT BUILT |
| Authorization (RBAC) | NOT BUILT |
| API rate limiting | NOT BUILT |
| Data encryption at rest | UNKNOWN |
| HTTPS/TLS | NOT CONFIGURED |
| Input validation | NOT BUILT |

### Planned Security Controls
- JWT authentication with tenant isolation
- RBAC: super_admin > admin > manager > rep > viewer
- Pydantic input validation on all API endpoints
- httpOnly cookie storage for JWT (prevents XSS theft)
- Rate limiting on auth endpoints
- Audit log for sensitive operations

---

*Architecture document generated from codebase analysis — 2026-08-25*
