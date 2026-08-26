# 🧠 NEXUS CRM — PROJECT MEMORY
> **Last Updated:** 2026-08-25  
> **Analyzed Branch:** `frontend`  
> **Status:** Early-stage — AI/ML layer built; Frontend & Backend not yet committed  
> **Purpose:** Permanent knowledge base for any engineer joining this project

---

## TABLE OF CONTENTS
1. [Project Overview](#1-project-overview)
2. [Business Purpose](#2-business-purpose)
3. [Tech Stack](#3-tech-stack)
4. [Repository Structure](#4-repository-structure)
5. [System Architecture](#5-system-architecture)
6. [Routing Map](#6-routing-map)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Backend Architecture](#8-backend-architecture)
9. [Database Architecture](#9-database-architecture)
10. [Authentication Flow](#10-authentication-flow)
11. [API Inventory](#11-api-inventory)
12. [Data Flow Diagrams](#12-data-flow-diagrams)
13. [ML Model Architecture](#13-ml-model-architecture)
14. [Environment Variables](#14-environment-variables)
15. [Third-Party Integrations](#15-third-party-integrations)
16. [Feature Inventory](#16-feature-inventory)
17. [Dependency Graph](#17-dependency-graph)
18. [Important Files](#18-important-files)
19. [Performance Notes](#19-performance-notes)
20. [Technical Debt](#20-technical-debt)
21. [Development Workflow](#21-development-workflow)
22. [Deployment Process](#22-deployment-process)
23. [Known Risks](#23-known-risks)
24. [Future Recommendations](#24-future-recommendations)

---

## 1. PROJECT OVERVIEW

| Field | Detail |
|-------|--------|
| **Name** | Nexus CRM |
| **Type** | AI-first, Multi-Tenant B2B SaaS Platform |
| **Stage** | Early Development (ML layer complete; frontend/backend scaffolding pending) |
| **Version** | 1.0.x (per SECURITY.md) |
| **License** | CONFLICT — README says "Proprietary"; LICENSE file is MIT — NEEDS RESOLUTION |
| **Security Contact** | security@nexus-crm.com |
| **Active Branch** | `frontend` |

### What Is It?
Nexus CRM unifies **customer intelligence**, **pipeline management**, and **revenue automation** for growing enterprise B2B sales teams. Its primary differentiator is deep AI integration — three trained XGBoost models power real-time predictive scoring that lives inside the CRM workflow.

### What Makes It Different?
Unlike standard CRMs (Salesforce, HubSpot), Nexus CRM:
- Trains its own ML models on the customer's own historical data
- Predicts lead conversion probability in real-time
- Flags at-risk customer accounts before churn occurs
- Gives deal close probability scores on active deals
- Runs in a multi-tenant architecture where each tenant's data is schema-isolated

---

## 2. BUSINESS PURPOSE

### Problem Being Solved
Enterprise sales teams lose revenue because:
1. **Lead prioritization is manual** — reps waste time on low-probability leads
2. **Churn is reactive** — customer success only acts after churn has occurred
3. **Deal forecasting is guesswork** — managers cannot accurately predict quarter-end revenue
4. **Intelligence is siloed** — email, call, and CRM data are not unified

### Target Users
- **Sales Representatives** — Manage leads, track deals in pipeline
- **Sales Managers** — Monitor team performance, forecast revenue
- **Customer Success Teams** — Monitor churn signals, manage accounts
- **Revenue Operations** — Analyze AI insights, configure scoring models

### User Workflow (Intended)
```
Rep creates lead → AI scores lead (lead_hot probability) →
Rep works hot leads → Deal moves into pipeline → AI scores deal close probability →
Deal closes or flags as at-risk → AI predicts churn → CS team intervenes
```

### Primary Business Entities
| Entity | Description |
|--------|-------------|
| **Lead** | A potential customer contact with scored conversion probability |
| **Deal** | An active sales opportunity in the pipeline |
| **Account** | A company/organization (parent of contacts and deals) |
| **Contact** | An individual at an account |
| **Activity** | Emails, calls, meetings logged against a lead or deal |
| **Tenant** | An isolated organization using the SaaS platform |
| **Subscription** | The tier/plan a tenant is on |

---

## 3. TECH STACK

### Confirmed (Present in Codebase)
| Layer | Technology | Evidence |
|-------|-----------|----------|
| **ML Framework** | XGBoost (Python) | train_models.ipynb, generate_notebook.py |
| **ML Preprocessing** | scikit-learn (StandardScaler, OneHotEncoder, ColumnTransformer, Pipeline) | generate_notebook.py |
| **Data Processing** | pandas, numpy | generate_notebook.py |
| **Model Serialization** | pickle, joblib | generate_notebook.py |
| **Notebook Format** | Jupyter Notebook (nbformat) | train_models.ipynb |
| **Python Version** | 3.10+ (3.14.3 used during training) | README, notebook metadata |
| **Database** | PostgreSQL | README explicit mention |
| **Version Control** | Git (GitHub) | .git/, .github/ |

### Inferred from Documents + README (NOT YET IN CODE)
| Layer | Technology | Evidence Source |
|-------|-----------|-----------------|
| **Frontend Framework** | React (Node.js + npm mentioned) | README: "Node.js & npm (for frontend)" |
| **Backend Framework** | FastAPI (Python) | PR template: "Local environment testing (FastAPI / React)" |
| **Authentication** | UNKNOWN — NEEDS VERIFICATION | No auth code present yet |
| **State Management** | UNKNOWN — NEEDS VERIFICATION | No frontend code present yet |
| **Styling** | UNKNOWN — NEEDS VERIFICATION | No frontend code present yet |
| **ORM** | UNKNOWN — NEEDS VERIFICATION | No backend code present yet |
| **Infrastructure** | UNKNOWN — NEEDS VERIFICATION | No deployment files present |

### Development Tooling
| Tool | Purpose |
|------|---------|
| **Impeccable** | AI-assisted code quality hooks (post-edit hook via impeccable.json) |
| **Hallmark** | AI skill framework (.agents/skills/hallmark/) |
| **nbformat** | Jupyter notebook generation script |

---

## 4. REPOSITORY STRUCTURE

```
AI-Enhanced-CRM-Multi-Tenant-SaaS-Platform/
|
+-- README.md                          # Project overview, setup instructions
+-- CONTRIBUTING.md                    # Contribution guidelines
+-- SECURITY.md                        # Vulnerability reporting policy
+-- CODE_OF_CONDUCT.md                 # Community behavior standards
+-- LICENSE                            # MIT License (CONFLICTS with README "Proprietary")
+-- .gitignore                         # Excludes: venv, .env, CSV/XLSX/JSON, PKL/H5, PDFs, models/
+-- skills-lock.json                   # Locks "hallmark" AI skill to nutlope/hallmark@GitHub
|
+-- generate_notebook.py               # Script to regenerate train_models.ipynb programmatically
+-- train_models.ipynb                 # Main ML training notebook (EXECUTED - has real outputs)
|
+-- models/ [GITIGNORED]               # Trained .pkl model files live here
|   +-- lead_scoring_model.pkl         # XGBoost classifier for lead_hot target
|   +-- churn_model.pkl                # XGBoost classifier for churned target
|   +-- deal_prob_model.pkl            # XGBoost regressor for deal_close_prob target
|   +-- preprocessor.pkl               # Fitted sklearn ColumnTransformer
|
+-- .github/                           # GitHub-specific configuration
|   +-- PULL_REQUEST_TEMPLATE.md       # PR checklist (references FastAPI + React)
|   +-- ISSUE_TEMPLATE/
|   |   +-- bug_report.md              # Bug reporting template
|   |   +-- feature_request.md         # Feature request template
|   +-- agents/                        # AI agent definitions (Impeccable system)
|   |   +-- impeccable-asset-producer.agent.md
|   |   +-- impeccable-documenter.agent.md
|   |   +-- impeccable-finish-reviewer.agent.md
|   |   +-- impeccable-manual-edit-applier.agent.md
|   +-- hooks/
|   |   +-- impeccable.json            # Post-edit hook: runs impeccable after file edits
|   +-- skills/
|       +-- impeccable/                # Impeccable skill (code quality enforcement)
|           +-- SKILL.md
|           +-- reference/
|           +-- scripts/
|               +-- hook.mjs           # Hook script (runs on Node.js >= 22)
|
+-- .agents/                           # Local agent skills
|   +-- skills/
|       +-- hallmark/                  # Hallmark skill for AI-assisted generation
|           +-- SKILL.md               # 68KB skill instructions
|           +-- references/
|
+-- .impeccable/
    +-- config.local.json              # Impeccable hook consent accepted
```

### What Is Missing (NEEDS IMPLEMENTATION)
```
MISSING: /frontend/          -> No React application exists yet
MISSING: /backend/           -> No FastAPI application exists yet
MISSING: /migrations/        -> No database migration files
MISSING: requirements.txt    -> No Python dependency manifest
MISSING: package.json        -> No Node.js dependency manifest
MISSING: docker-compose.yml  -> No containerization setup
MISSING: .env.example        -> No environment variable template
MISSING: /tests/             -> No test suite
```

---

## 5. SYSTEM ARCHITECTURE

### Current State Architecture
```
DATA SCIENCE LAYER (COMPLETE)

  crm_cleaned_2023_2026.csv (gitignored)
           |
           v
  train_models.ipynb (Jupyter)
           |
           v
  sklearn ColumnTransformer (preprocessor)
  - StandardScaler (33 numeric features)
  - OneHotEncoder (9 categorical features)
           |
           v
  [Lead Scoring]    [Churn Prediction]    [Deal Probability]
  XGBClassifier     XGBClassifier         XGBRegressor
  AUC: 0.9576       AUC: 0.6655           R2: 0.6384
           |
           v
  models/*.pkl (gitignored, local disk only)
```

### Intended Full Architecture (PLANNED)
```
Browser / React SPA
       |
       v
FastAPI Backend (Python)
       |
       +---> PostgreSQL (per-tenant schema isolation)
       |
       +---> ML Model Inference Layer
             (loads .pkl files, scores leads/deals/accounts)
```

### Multi-Tenancy Architecture (Design Intent)
- **Strategy**: Schema Isolation — each tenant gets its own PostgreSQL schema
- **Routing**: Every API request must identify and resolve the tenant
- **ML Models**: Global (shared across tenants), inference runs on per-tenant data

---

## 6. ROUTING MAP

> STATUS: NOT YET IMPLEMENTED — No frontend or backend routing exists in the repository.

### Planned Frontend Routes (React)
| Route | Page | Purpose | Auth Required |
|-------|------|---------|---------------|
| / | Dashboard | Main entry point | Yes |
| /login | Login | Tenant authentication | No |
| /register | Registration | Tenant onboarding | No |
| /leads | Lead List | View/manage all leads with AI scores | Yes |
| /leads/:id | Lead Detail | Individual lead with scoring breakdown | Yes |
| /deals | Pipeline View | Kanban/table view of deals | Yes |
| /deals/:id | Deal Detail | Deal with close probability score | Yes |
| /accounts | Account List | All accounts | Yes |
| /accounts/:id | Account Detail | Account with churn risk indicator | Yes |
| /analytics | Analytics Dashboard | Revenue, conversion, churn metrics | Yes |
| /settings | Settings | Tenant configuration | Yes (Admin) |
| /admin | Admin Panel | Super-admin multi-tenant management | Yes (Super Admin) |

---

## 7. FRONTEND ARCHITECTURE

> STATUS: NOT YET IMPLEMENTED — The `frontend` branch exists but no React code has been committed.

### Planned Stack
- **Framework**: React (Node.js + npm)
- **State Management**: UNKNOWN — NEEDS VERIFICATION
- **Styling**: UNKNOWN — NEEDS VERIFICATION
- **Build Tool**: UNKNOWN — NEEDS VERIFICATION

### Key UI Features to Build
1. **Lead Score Card** — Shows lead_hot probability (0-100%) per lead
2. **Churn Risk Indicator** — Shows churned probability per account
3. **Deal Close Probability Bar** — Shows deal_close_prob score per deal
4. **Pipeline Kanban Board** — Drag-and-drop deals through stages
5. **Activity Timeline** — Shows emails, calls, meetings per entity
6. **Analytics Dashboard** — Revenue charts, funnel visualization

### Recommended Component Hierarchy
```
App
+-- AuthProvider
    +-- TenantProvider
        +-- Layout
            +-- Sidebar
            +-- Header
            +-- MainContent
                +-- LeadsPage
                |   +-- LeadTable
                |   |   +-- LeadRow (with AIScoreBadge)
                |   +-- LeadDetailPanel
                +-- PipelinePage
                |   +-- KanbanBoard
                |   |   +-- DealCard (with CloseProbabilityBar)
                |   +-- DealDetailPanel
                +-- AccountsPage
                |   +-- AccountTable
                |   |   +-- AccountRow (with ChurnRiskBadge)
                |   +-- AccountDetailPanel
                +-- AnalyticsPage
                    +-- RevenueChart
                    +-- FunnelChart
                    +-- AIInsightsWidget
```

---

## 8. BACKEND ARCHITECTURE

> STATUS: NOT YET IMPLEMENTED — No FastAPI code exists in the repository.

### Planned Stack
- **Framework**: FastAPI (Python)
- **ORM**: UNKNOWN — NEEDS VERIFICATION (likely SQLAlchemy given Python/PostgreSQL stack)
- **Migrations**: UNKNOWN — NEEDS VERIFICATION (likely Alembic)
- **ML Serving**: Loads .pkl files at startup, exposes inference endpoints

### Intended Layer Structure
```
FastAPI Application
+-- Routers (API endpoints)
|   +-- /auth           -> Authentication endpoints
|   +-- /leads          -> Lead CRUD + AI scoring
|   +-- /deals          -> Deal CRUD + close probability
|   +-- /accounts       -> Account CRUD + churn prediction
|   +-- /activities     -> Activity logging
|   +-- /analytics      -> Aggregated metrics
|   +-- /admin          -> Multi-tenant management
+-- Services
|   +-- AuthService     -> Token validation, session management
|   +-- LeadService     -> Lead business logic
|   +-- AIService       -> Loads pkl models, runs inference
|   +-- TenantService   -> Schema routing per tenant
+-- Models (Database)
|   +-- SQLAlchemy models per entity
+-- Schemas (Pydantic)
|   +-- Request/Response validation
+-- Middleware
    +-- TenantMiddleware -> Resolves tenant from request
    +-- AuthMiddleware   -> Validates JWT/session
```

---

## 9. DATABASE ARCHITECTURE

> STATUS: PARTIALLY INFERRED — No migration files or ORM models exist yet.
> Schema inferred from the ML training data feature columns.

### Database: PostgreSQL

### Multi-Tenancy Pattern
- Strategy: Schema-per-tenant
- Public schema: tenant registry + super-admin tables
- Per-tenant schema: leads, deals, accounts, activities, contacts

### Inferred Tables from ML Feature Columns

#### leads table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| tenant_id | UUID | FK to tenants |
| created_date | TIMESTAMP | Lead creation date |
| industry | VARCHAR | Lead industry (categorical) |
| country | VARCHAR | Lead country |
| company_size | VARCHAR | Size category |
| lead_source | VARCHAR | Acquisition source |
| num_employees | INTEGER | Company headcount |
| num_activities | INTEGER | Total activities logged |
| num_emails_sent | INTEGER | Emails sent to lead |
| num_calls | INTEGER | Calls made to lead |
| num_meetings | INTEGER | Meetings held |
| response_time_hrs | FLOAT | Average response time |
| days_in_pipeline | INTEGER | Days since entered pipeline |
| competitor_mentioned | BOOLEAN | Competitor discussed? |
| budget_confirmed | BOOLEAN | Budget confirmed? |
| decision_maker_contact | BOOLEAN | Is contact a DM? |
| previous_customer | BOOLEAN | Returning customer? |
| ai_assisted | BOOLEAN | AI used in outreach? |
| activity_per_day | FLOAT | Activity rate |
| email_response_ratio | FLOAT | Email response rate |
| engagement_score | FLOAT | Composite engagement metric |
| high_value_deal | BOOLEAN | Above deal value threshold |
| fast_response | BOOLEAN | Responded within SLA |
| above_avg_cycle | BOOLEAN | Sales cycle above average |
| lead_hot | BOOLEAN | TARGET: AI-predicted hot lead |

#### deals table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| tenant_id | UUID | FK to tenants |
| deal_value_usd | FLOAT | Deal monetary value |
| annual_contract_value | FLOAT | ACV |
| sales_cycle_days | INTEGER | Days in current sales cycle |
| discount_given_pct | FLOAT | Discount percentage offered |
| subscription_tier | VARCHAR | Product tier |
| contract_length_months | INTEGER | Contract duration |
| ai_tools_used | VARCHAR | AI tools used in deal |
| assigned_role | VARCHAR | Assigned rep role |
| deal_close_prob | FLOAT | TARGET: AI-predicted close probability (0.0-1.0) |

#### accounts table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| tenant_id | UUID | FK to tenants |
| months_as_customer | INTEGER | Customer tenure |
| monthly_revenue | FLOAT | MRR from account |
| mrr_usd | FLOAT | Monthly Recurring Revenue |
| support_tickets | INTEGER | Tickets raised |
| product_usage_score | FLOAT | Platform usage metric |
| login_frequency | FLOAT | Login frequency |
| feature_adoption_pct | FLOAT | Percentage of features adopted |
| nps_score | FLOAT | Net Promoter Score |
| csat_score | FLOAT | Customer Satisfaction Score |
| usage_bucket | VARCHAR | Usage category label |
| period_label | VARCHAR | Time period label |
| at_risk_churn | BOOLEAN | Rule-based at-risk flag |
| churned | BOOLEAN | TARGET: AI-predicted churn |

#### activities table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| tenant_id | UUID | FK to tenants |
| entity_type | VARCHAR | 'lead', 'deal', or 'account' |
| entity_id | UUID | FK to related entity |
| type | VARCHAR | 'email', 'call', 'meeting' |
| created_at | TIMESTAMP | Activity timestamp |

#### tenants table (Public Schema)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Tenant organization name |
| schema_name | VARCHAR | PostgreSQL schema identifier |
| subscription_tier | VARCHAR | 'free', 'growth', 'enterprise' |
| created_at | TIMESTAMP | Tenant creation date |

### Entity Relationships
```
tenants (1) ---> (many) leads
tenants (1) ---> (many) deals
tenants (1) ---> (many) accounts
leads    (1) ---> (many) activities
deals    (1) ---> (many) activities
accounts (1) ---> (many) activities
accounts (1) ---> (many) deals
```

---

## 10. AUTHENTICATION FLOW

> STATUS: NOT YET IMPLEMENTED — No auth code in the repository.

### Inferred Requirements
- Multi-tenant: Each login must resolve to a specific tenant
- Role system: rep / manager / admin / super-admin
- PR template references FastAPI + React local testing

### Recommended Design
```
1. User POSTs credentials to /auth/login
2. FastAPI validates against tenant's user table
3. FastAPI issues JWT: { user_id, tenant_id, role }
4. React stores JWT in httpOnly cookie (recommended)
5. Every request includes JWT in Authorization header
6. FastAPI middleware extracts tenant_id from JWT
7. All DB queries route to tenant's schema
```

---

## 11. API INVENTORY

> STATUS: NOT YET IMPLEMENTED — Planned endpoints based on feature analysis.

| Method | Route | Purpose | Used By |
|--------|-------|---------|---------|
| POST | /auth/login | Authenticate user, return JWT | Login page |
| POST | /auth/logout | Invalidate session | Global |
| POST | /auth/refresh | Refresh JWT token | Auth middleware |
| GET | /leads | List leads with AI scores | Leads page |
| POST | /leads | Create new lead | New lead form |
| GET | /leads/{id} | Get lead detail with score breakdown | Lead detail |
| PUT | /leads/{id} | Update lead data | Lead edit form |
| DELETE | /leads/{id} | Delete lead | Lead management |
| POST | /leads/{id}/score | Re-run AI lead scoring | Lead detail |
| GET | /deals | List deals in pipeline | Pipeline page |
| POST | /deals | Create new deal | New deal form |
| GET | /deals/{id} | Get deal with close probability | Deal detail |
| PUT | /deals/{id} | Update deal | Deal edit form |
| POST | /deals/{id}/score | Re-run AI deal scoring | Deal detail |
| GET | /accounts | List accounts with churn risk | Accounts page |
| POST | /accounts | Create account | New account form |
| GET | /accounts/{id} | Account detail with churn prediction | Account detail |
| POST | /accounts/{id}/score | Re-run churn prediction | Account detail |
| GET | /activities | List activities | Timeline view |
| POST | /activities | Log new activity | Activity form |
| GET | /analytics/summary | Revenue + funnel metrics | Analytics page |
| GET | /analytics/ai-insights | AI-generated insights | AI insights widget |
| GET | /admin/tenants | List all tenants | Super admin |
| POST | /admin/tenants | Create new tenant | Super admin |

---

## 12. DATA FLOW DIAGRAMS

### Flow 1: Lead Scoring
```
1. Sales Rep creates/updates a lead via React form
2. POST /leads (or PUT /leads/{id}) sent to FastAPI
3. FastAPI validates data via Pydantic schema
4. FastAPI saves lead to PostgreSQL (tenant schema)
5. FastAPI calls AIService.score_lead(lead_data)
6. AIService loads preprocessor.pkl + lead_scoring_model.pkl
7. Preprocessor transforms 42 features (33 numeric + 9 categorical)
8. XGBClassifier outputs probability [0.0, 1.0] for lead_hot
9. Score saved to lead record in PostgreSQL
10. FastAPI returns lead object with score to React
11. React renders LeadScoreBadge showing probability %
```

### Flow 2: Churn Prediction
```
1. Nightly cron job (or event trigger) calls AIService.score_churn()
2. Fetches all active accounts for all tenants
3. For each account: loads churn_model.pkl + preprocessor.pkl
4. XGBClassifier outputs churn probability
5. Accounts above threshold flagged as at_risk_churn = True
6. Customer Success team sees flagged accounts in dashboard
7. CS rep triggers intervention workflow
```

### Flow 3: Deal Close Probability
```
1. Sales Rep views deal in pipeline
2. GET /deals/{id} triggers FastAPI to fetch deal
3. FastAPI calls AIService.score_deal(deal_data)
4. deal_prob_model.pkl (XGBRegressor) outputs probability float
5. Score stored and returned to React
6. React renders CloseProbabilityBar (0-100%)
```

---

## 13. ML MODEL ARCHITECTURE

### Training Data
| Attribute | Value |
|-----------|-------|
| Source File | crm_cleaned_2023_2026.csv (gitignored) |
| Time Split | Train: 2023-2024 (1,583 rows) / Val: 2025 (791 rows) / Test: 2026 (126 rows) |
| Total Records | ~2,500 CRM records |

### Feature Engineering
| Category | Count | Features |
|----------|-------|---------|
| Numeric | 33 | deal_value_usd, annual_contract_value, num_employees, num_activities, num_emails_sent, num_calls, num_meetings, response_time_hrs, days_in_pipeline, sales_cycle_days, competitor_mentioned, budget_confirmed, decision_maker_contact, previous_customer, nps_score, csat_score, months_as_customer, monthly_revenue, mrr_usd, support_tickets, product_usage_score, login_frequency, feature_adoption_pct, contract_length_months, discount_given_pct, activity_per_day, email_response_ratio, engagement_score, high_value_deal, fast_response, at_risk_churn, ai_assisted, above_avg_cycle |
| Categorical | 9 | industry, country, company_size, lead_source, subscription_tier, ai_tools_used, assigned_role, usage_bucket, period_label |

### Preprocessing Pipeline
```python
ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
])
```
NOTE: preprocessor MUST be fitted on training data only. Never refit on production data.

### Model 1: Lead Scoring
| Parameter | Value |
|-----------|-------|
| Algorithm | XGBClassifier |
| Target | lead_hot (binary 0/1) |
| n_estimators | 500 (early stopping) |
| learning_rate | 0.05 |
| max_depth | 6 |
| Class Balancing | scale_pos_weight = neg_count / pos_count |
| Eval Metric | AUC |
| Val AUC | 0.9748 (stopped at epoch 72) |
| Test AUC | 0.9576 — PRODUCTION READY |
| Output File | models/lead_scoring_model.pkl |

### Model 2: Churn Prediction
| Parameter | Value |
|-----------|-------|
| Algorithm | XGBClassifier |
| Target | churned (binary 0/1) |
| n_estimators | 500 (early stopping) |
| learning_rate | 0.05 |
| max_depth | 6 |
| Eval Metric | AUC |
| Val AUC | 0.6729 (stopped at epoch 12 — very early) |
| Test AUC | 0.6655 — NEEDS IMPROVEMENT |
| Output File | models/churn_model.pkl |

### Model 3: Deal Close Probability
| Parameter | Value |
|-----------|-------|
| Algorithm | XGBRegressor |
| Target | deal_close_prob (float 0.0-1.0) |
| n_estimators | 500 (early stopping) |
| learning_rate | 0.05 |
| max_depth | 6 |
| Eval Metric | RMSE |
| Test MSE | 0.0106 |
| Test R2 | 0.6384 — ACCEPTABLE |
| Output File | models/deal_prob_model.pkl |

### Shared Preprocessor
| File | Content |
|------|---------|
| models/preprocessor.pkl | Fitted ColumnTransformer — REQUIRED for all inference |

---

## 14. ENVIRONMENT VARIABLES

> WARNING: NO .env.example FILE EXISTS — This is a critical gap.

### Expected Variables (Inferred)
| Variable | Purpose | Secret? |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection string | YES |
| SECRET_KEY | JWT signing secret | YES |
| MODEL_PATH | Path to models/ directory | No |
| ALLOWED_ORIGINS | CORS origins for FastAPI | No |
| DEBUG | Enable debug mode | No |
| ENVIRONMENT | development/staging/production | No |
| SUPERADMIN_EMAIL | Initial super-admin account | YES |
| SUPERADMIN_PASSWORD | Initial super-admin password | YES |

---

## 15. THIRD-PARTY INTEGRATIONS

> STATUS: NONE CONFIRMED — No integration code exists. Inferred from product design.

| Integration | Purpose | Status |
|-------------|---------|--------|
| Email Provider (SendGrid/Mailgun) | Automated email sequencing | NOT IMPLEMENTED |
| Analytics (Mixpanel/Amplitude) | User behavior tracking | NOT IMPLEMENTED |
| Payment (Stripe) | Subscription billing for tenants | NOT IMPLEMENTED |
| LLM API (OpenAI?) | Generative AI Workflows feature | NOT IMPLEMENTED |

---

## 16. FEATURE INVENTORY

| Feature | ML Status | Frontend | Backend | DB Tables | External Services |
|---------|-----------|----------|---------|-----------|-------------------|
| Lead Scoring Engine | COMPLETE (AUC 0.9576) | Not built | Not built | leads | None |
| Churn Propensity Model | COMPLETE (AUC 0.6655) | Not built | Not built | accounts | None |
| Deal Close Probability | COMPLETE (R2 0.6384) | Not built | Not built | deals | None |
| Multi-Tenant Architecture | Designed | Not built | Not built | tenants | None |
| Generative AI Workflows | Planned | Not built | Not built | -- | LLM API |
| Email Sequencing | Planned | Not built | Not built | activities | Email provider |
| Pipeline Management | Planned | Not built | Not built | deals | None |
| Next-Best-Action | Planned | Not built | Not built | -- | LLM API |

---

## 17. DEPENDENCY GRAPH

### Current File Dependencies (Existing Code Only)
```
generate_notebook.py
    +-- nbformat                     (generates .ipynb structure)
    +-- [produces] train_models.ipynb

train_models.ipynb
    +-- pandas                       (data loading + manipulation)
    +-- numpy                        (numerical operations)
    +-- xgboost                      (ML model training)
    +-- sklearn.model_selection      (train_test_split - imported but UNUSED in training)
    +-- sklearn.preprocessing        (StandardScaler, OneHotEncoder)
    +-- sklearn.compose              (ColumnTransformer)
    +-- sklearn.pipeline             (Pipeline - imported but UNUSED)
    +-- sklearn.metrics              (roc_auc_score, accuracy_score, mse, r2)
    +-- pickle                       (model serialization)
    +-- joblib                       (imported but UNUSED — dead import)
    +-- os                           (directory creation)
    +-- [reads] crm_cleaned_2023_2026.csv     (gitignored)
    +-- [writes] models/preprocessor.pkl      (gitignored)
    +-- [writes] models/lead_scoring_model.pkl (gitignored)
    +-- [writes] models/churn_model.pkl        (gitignored)
    +-- [writes] models/deal_prob_model.pkl    (gitignored)
```

### Critical Files — DO NOT MODIFY LIGHTLY
| File | Reason |
|------|--------|
| models/preprocessor.pkl | Must match training-time state exactly; breaks all 3 models if changed |
| train_models.ipynb | Training canonical record; changes invalidate model provenance |
| generate_notebook.py | Source of truth for notebook structure; keep in sync with .ipynb |
| .gitignore | Prevents data leakage — DO NOT weaken without security review |

---

## 18. IMPORTANT FILES

| File | Importance | Notes |
|------|-----------|-------|
| train_models.ipynb | CRITICAL | Contains trained model outputs and full training history |
| generate_notebook.py | CRITICAL | Source script for regenerating the notebook |
| models/preprocessor.pkl | CRITICAL | Must be loaded alongside any model for inference |
| models/lead_scoring_model.pkl | CRITICAL | Production lead scoring model (AUC 0.9576) |
| models/churn_model.pkl | IMPORTANT | Churn model — needs improvement (AUC 0.6655) |
| models/deal_prob_model.pkl | IMPORTANT | Deal probability model (R2 0.6384) |
| .gitignore | CRITICAL | Prevents data leakage — DO NOT weaken |
| .github/hooks/impeccable.json | NORMAL | Post-edit quality hook — requires Node.js >= 22 |

---

## 19. PERFORMANCE NOTES

### ML Model Performance
- **Lead Scoring**: AUC 0.9576 — Production ready
- **Churn Prediction**: AUC 0.6655 — Barely better than random
  - Stopped very early (epoch 12 of 500) — insufficient signal or heavy class imbalance
  - Recommendation: More data, feature engineering, or SMOTE oversampling
- **Deal Close Probability**: R2 0.6384 — Acceptable but 36% unexplained variance

### Architectural Concerns (For Planned System)
- **Model Loading**: Load models ONCE at server startup, not per-request
- **Inference Latency**: XGBoost inference is fast (~1-5ms per record) but preprocessing adds overhead
- **Multi-Tenancy Overhead**: Schema-per-tenant scales well but adds connection pool complexity
- **N+1 Risk**: Scoring many accounts for churn in a loop without batching will be slow
- **Training Data Size**: 2,500 records is very small for production ML — performance will degrade on unseen distributions

---

## 20. TECHNICAL DEBT

| Item | Severity | Description |
|------|----------|-------------|
| joblib imported but not used | LOW | Dead import in training notebook |
| Pipeline imported but not used | LOW | Dead import in training notebook |
| No requirements.txt | HIGH | Cannot reproduce training environment |
| No .env.example | HIGH | New engineers cannot configure their environment |
| LICENSE conflict | HIGH | README says "Proprietary", LICENSE file is MIT |
| Models not versioned | MEDIUM | No MLflow/DVC — no model version tracking or rollback |
| Churn model weak | MEDIUM | AUC 0.6655 is near-random, production risk |
| No test suite | HIGH | Zero tests in the entire repository |
| No Docker/CI configuration | HIGH | Cannot automate builds or tests |
| PDF files present in repo | MEDIUM | PRD/SDD PDFs committed (gitignore has rule but files are tracked) |
| Training data very small | HIGH | ~2,500 records may not generalize to production scale |

---

## 21. DEVELOPMENT WORKFLOW

### Branch Strategy
```
main            -> Production-ready code
frontend        -> React frontend development (CURRENT ACTIVE BRANCH)
(implied) backend -> FastAPI backend development
```

### PR Process
1. Create feature branch from appropriate base
2. Follow PR template checklist (in .github/PULL_REQUEST_TEMPLATE.md)
3. Ensure NO sensitive data (CSV, PDF, model files) is in the commit
4. Verify .gitignore compliance
5. Pass all CI checks (none configured yet — gap)
6. Get maintainer review

### AI Development Tools Active in This Repo
- **Impeccable**: Runs automatically after every file edit (post-tool hook via impeccable.json)
  - Requires Node.js >= 22 to execute
  - Script: .github/skills/impeccable/scripts/hook.mjs
- **Hallmark**: AI-assisted asset generation skill (.agents/skills/hallmark/)
- **GitHub Agents**: 4 agent definitions for AI-assisted code review and documentation

---

## 22. DEPLOYMENT PROCESS

> STATUS: NOT CONFIGURED — No Docker, CI/CD, or deployment files exist.

### Recommended Setup (Not Yet Built)
```
Local Development:
- Docker Compose
  - nexus-backend  (FastAPI container)
  - nexus-frontend (React/Nginx container)
  - postgres       (PostgreSQL container)

CI/CD Pipeline (GitHub Actions):
- On PR:          lint + unit tests + integration tests
- On merge to main: build Docker images + deploy

Infrastructure (TBD):
- Railway / Render / AWS / Fly — NEEDS DECISION
```

---

## 23. KNOWN RISKS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Churn model misses real churn | High | High | Retrain with more data, SMOTE, lower threshold |
| Model files lost (not in git) | Medium | Critical | Use DVC or cloud model registry (MLflow, S3) |
| Data leakage via CSV/PKL committed | Medium | Critical | .gitignore exists but must be enforced in CI |
| License ambiguity | Low | High | Resolve immediately with project owner |
| No auth = data leak risk | N/A (not built) | Critical | Build auth before any data APIs |
| Preprocessor/model version mismatch | Medium | High | Version and test inference pipeline |
| Training data too small for prod | High | Medium | Collect more real customer data before launch |

---

## 24. FUTURE RECOMMENDATIONS

### Immediate Priorities (Before Writing Frontend Code)
1. Create requirements.txt with pinned versions
2. Create .env.example file
3. Resolve LICENSE conflict (Proprietary vs MIT)
4. Set up FastAPI backend skeleton with multi-tenant middleware
5. Set up PostgreSQL with Alembic migrations
6. Implement JWT authentication with tenant resolution
7. Create model serving service (AIService loads pkl, exposes inference)
8. Add .github/workflows/ CI pipeline

### ML Improvements
1. Retrain churn model with more data and SMOTE oversampling
2. Add model versioning via MLflow or DVC
3. Add feature importance API endpoint for explainability
4. Implement SHAP values for explaining individual predictions
5. Add data drift detection for production model monitoring
6. Collect more training data (target 10k+ records minimum)

### Architecture Improvements
1. Add Redis for session caching and rate limiting
2. Add background task queue (Celery or FastAPI BackgroundTasks) for batch scoring
3. Implement API versioning (/api/v1/...)
4. Add WebSocket or SSE for real-time score updates in the UI
5. Set up MLflow tracking server for experiment management

---

*Document generated by automated codebase analysis — 2026-08-25*
*All "UNKNOWN - NEEDS VERIFICATION" items require code examination after implementation.*
*Branch analyzed: frontend | Commits analyzed: 6 total across all branches*
