# NEXUS CRM — DEPENDENCY GRAPH

> Last Updated: 2026-08-25 | Branch: frontend  
> STATUS: Only ML/Data Science layer exists. Frontend and Backend dependencies are PLANNED.

---

## 1. CURRENT DEPENDENCY GRAPH (Existing Code Only)

### Python File Dependencies
```
generate_notebook.py
  IMPORTS:
    +-- nbformat          (external: pip install nbformat)
    +-- os                (stdlib)
  PRODUCES:
    +-- train_models.ipynb (writes to disk)

train_models.ipynb
  IMPORTS:
    +-- pandas            (external: pip install pandas)
    +-- numpy             (external: pip install numpy)
    +-- xgboost           (external: pip install xgboost)
    +-- sklearn.model_selection.train_test_split  (IMPORTED BUT UNUSED - dead import)
    +-- sklearn.preprocessing.StandardScaler      (external: pip install scikit-learn)
    +-- sklearn.preprocessing.OneHotEncoder       (external: pip install scikit-learn)
    +-- sklearn.compose.ColumnTransformer         (external: pip install scikit-learn)
    +-- sklearn.pipeline.Pipeline                 (IMPORTED BUT UNUSED - dead import)
    +-- sklearn.metrics.roc_auc_score             (external: pip install scikit-learn)
    +-- sklearn.metrics.accuracy_score            (IMPORTED BUT UNUSED - dead import)
    +-- sklearn.metrics.mean_squared_error        (external: pip install scikit-learn)
    +-- sklearn.metrics.r2_score                  (external: pip install scikit-learn)
    +-- pickle                                    (stdlib)
    +-- joblib            (IMPORTED BUT UNUSED - dead import; external: pip install joblib)
    +-- os                                        (stdlib)
  READS:
    +-- crm_cleaned_2023_2026.csv  (gitignored, must be supplied externally)
  WRITES:
    +-- models/preprocessor.pkl
    +-- models/lead_scoring_model.pkl
    +-- models/churn_model.pkl
    +-- models/deal_prob_model.pkl
```

### Configuration File Dependencies
```
.github/hooks/impeccable.json
  DEPENDS ON:
    +-- .github/skills/impeccable/scripts/hook.mjs  (Node.js script)
    +-- Node.js >= 22                                (runtime requirement)
    +-- git                                          (uses git rev-parse)

skills-lock.json
  REFERENCES:
    +-- .agents/skills/hallmark/  (local skill directory)
    +-- nutlope/hallmark @ GitHub (source registry)
```

---

## 2. CRITICAL FILE DEPENDENCY CHAIN

```
crm_cleaned_2023_2026.csv  [EXTERNAL — MUST EXIST TO TRAIN]
           |
           | (read by)
           v
   train_models.ipynb
           |
           | (fits and saves)
           v
   models/preprocessor.pkl  [CRITICAL — ALL 3 MODELS DEPEND ON THIS]
           |
           +----> models/lead_scoring_model.pkl  [DEPENDS ON preprocessor.pkl]
           |
           +----> models/churn_model.pkl         [DEPENDS ON preprocessor.pkl]
           |
           +----> models/deal_prob_model.pkl     [DEPENDS ON preprocessor.pkl]
```

> **CRITICAL RULE**: If `preprocessor.pkl` is lost, corrupted, or regenerated with different data,
> ALL THREE model files become invalid and inference will produce incorrect results.
> All four files must always be from the SAME training run.

---

## 3. PLANNED DEPENDENCY GRAPH (Backend — FastAPI)

### Python Package Dependencies (To Be Created: requirements.txt)
```
fastapi          -> Web framework
uvicorn          -> ASGI server to run FastAPI
pydantic         -> Request/Response validation
sqlalchemy       -> ORM for PostgreSQL
alembic          -> Database migrations
psycopg2-binary  -> PostgreSQL adapter
python-jose      -> JWT encoding/decoding
passlib[bcrypt]  -> Password hashing
python-multipart -> Form data support
pickle           -> Model loading (stdlib)
pandas           -> Feature preparation for inference
numpy            -> Numerical operations for inference
xgboost          -> ML model inference
scikit-learn     -> Preprocessor (ColumnTransformer) for inference
```

### Backend Module Dependency Graph (Planned)
```
main.py (FastAPI app entry point)
  +-- routers/
  |   +-- auth.py         DEPENDS ON: services/auth.py, schemas/auth.py
  |   +-- leads.py        DEPENDS ON: services/leads.py, services/ai.py, schemas/leads.py
  |   +-- deals.py        DEPENDS ON: services/deals.py, services/ai.py, schemas/deals.py
  |   +-- accounts.py     DEPENDS ON: services/accounts.py, services/ai.py, schemas/accounts.py
  |   +-- activities.py   DEPENDS ON: services/activities.py, schemas/activities.py
  |   +-- analytics.py    DEPENDS ON: services/analytics.py, schemas/analytics.py
  |   +-- admin.py        DEPENDS ON: services/admin.py, schemas/admin.py
  +-- services/
  |   +-- auth.py         DEPENDS ON: db/models.py, core/security.py
  |   +-- leads.py        DEPENDS ON: db/models.py, db/repositories/leads.py
  |   +-- deals.py        DEPENDS ON: db/models.py, db/repositories/deals.py
  |   +-- accounts.py     DEPENDS ON: db/models.py, db/repositories/accounts.py
  |   +-- ai.py           DEPENDS ON: models/*.pkl (disk), preprocessor.pkl (disk)
  |   +-- analytics.py    DEPENDS ON: db/repositories/ (multiple)
  |   +-- admin.py        DEPENDS ON: db/models.py (public schema)
  +-- db/
  |   +-- database.py     DEPENDS ON: sqlalchemy, config.py
  |   +-- models.py       DEPENDS ON: sqlalchemy, database.py
  |   +-- repositories/
  |       +-- leads.py    DEPENDS ON: db/models.py, db/database.py
  |       +-- deals.py    DEPENDS ON: db/models.py, db/database.py
  |       +-- accounts.py DEPENDS ON: db/models.py, db/database.py
  +-- schemas/
  |   +-- auth.py         DEPENDS ON: pydantic
  |   +-- leads.py        DEPENDS ON: pydantic
  |   +-- deals.py        DEPENDS ON: pydantic
  |   +-- accounts.py     DEPENDS ON: pydantic
  +-- middleware/
  |   +-- auth.py         DEPENDS ON: core/security.py
  |   +-- tenant.py       DEPENDS ON: db/database.py
  +-- core/
      +-- config.py       DEPENDS ON: os / pydantic-settings
      +-- security.py     DEPENDS ON: python-jose, passlib
```

---

## 4. PLANNED DEPENDENCY GRAPH (Frontend — React)

### Node.js Package Dependencies (To Be Created: package.json)
```
react             -> UI framework
react-dom         -> DOM rendering
react-router-dom  -> Client-side routing
axios             -> HTTP client for API calls

State Management (choose one):
  zustand         -> Lightweight state management (recommended)
  OR
  @tanstack/react-query -> Server state + caching

UI Components (choose one):
  shadcn/ui       -> Headless components
  OR
  @radix-ui       -> Primitive components

Charts:
  recharts        -> Revenue and analytics charts
  OR
  chart.js

Build Tool:
  vite            -> Fast dev server + build

Styling:
  TBD             -> CSS Modules / SCSS / Tailwind
```

### Frontend Module Dependency Graph (Planned)
```
src/main.jsx (entry point)
  +-- src/App.jsx
      +-- src/providers/AuthProvider.jsx
      |   DEPENDS ON: hooks/useAuth.js, api/auth.js
      +-- src/providers/TenantProvider.jsx
      |   DEPENDS ON: hooks/useTenant.js
      +-- src/router/index.jsx
      |   DEPENDS ON: react-router-dom, all page components
      +-- src/pages/
      |   +-- LeadsPage.jsx        DEPENDS ON: components/LeadTable, hooks/useLeads
      |   +-- PipelinePage.jsx     DEPENDS ON: components/KanbanBoard, hooks/useDeals
      |   +-- AccountsPage.jsx     DEPENDS ON: components/AccountTable, hooks/useAccounts
      |   +-- AnalyticsPage.jsx    DEPENDS ON: components/Charts, hooks/useAnalytics
      |   +-- LoginPage.jsx        DEPENDS ON: hooks/useAuth, api/auth
      +-- src/components/
      |   +-- AIScoreBadge.jsx     DEPENDS ON: (standalone)
      |   +-- ChurnRiskBadge.jsx   DEPENDS ON: (standalone)
      |   +-- CloseProbBar.jsx     DEPENDS ON: (standalone)
      |   +-- KanbanBoard.jsx      DEPENDS ON: components/DealCard
      |   +-- LeadTable.jsx        DEPENDS ON: components/AIScoreBadge
      |   +-- AccountTable.jsx     DEPENDS ON: components/ChurnRiskBadge
      +-- src/api/
      |   +-- client.js            DEPENDS ON: axios (base axios instance with JWT interceptor)
      |   +-- leads.js             DEPENDS ON: api/client.js
      |   +-- deals.js             DEPENDS ON: api/client.js
      |   +-- accounts.js          DEPENDS ON: api/client.js
      |   +-- auth.js              DEPENDS ON: api/client.js
      +-- src/hooks/
          +-- useLeads.js          DEPENDS ON: api/leads.js, react-query
          +-- useDeals.js          DEPENDS ON: api/deals.js, react-query
          +-- useAccounts.js       DEPENDS ON: api/accounts.js, react-query
          +-- useAuth.js           DEPENDS ON: api/auth.js
```

---

## 5. HIGH-IMPACT FILES (Highest Risk to Modify)

### Extreme Risk — Do Not Touch Without Full Understanding
| File | Risk | Reason |
|------|------|--------|
| models/preprocessor.pkl | CRITICAL | Invalidates ALL 3 models if changed |
| train_models.ipynb | CRITICAL | Changing training logic changes model behavior |
| .gitignore | CRITICAL | Weakening it risks data/model leakage |

### High Risk — Modify With Caution
| File | Risk | Reason |
|------|------|--------|
| generate_notebook.py | HIGH | Must stay in sync with train_models.ipynb |
| (future) middleware/tenant.py | HIGH | Any bug here breaks multi-tenant isolation |
| (future) core/security.py | HIGH | JWT logic is security-critical |
| (future) db/database.py | HIGH | Connection pool + schema routing |

### Medium Risk — Test After Changes
| File | Risk | Reason |
|------|------|--------|
| (future) services/ai.py | MEDIUM | Model loading logic affects all inference |
| (future) schemas/*.py | MEDIUM | Pydantic changes affect all API consumers |
| (future) api/client.js | MEDIUM | JWT interceptor — affects all API calls |

---

## 6. DEAD CODE (Confirmed in Existing Codebase)

| File | Dead Symbol | Type | Action |
|------|-------------|------|--------|
| train_models.ipynb | `from sklearn.model_selection import train_test_split` | Unused import | Remove |
| train_models.ipynb | `from sklearn.pipeline import Pipeline` | Unused import | Remove |
| train_models.ipynb | `from sklearn.metrics import accuracy_score` | Unused import | Remove |
| train_models.ipynb | `import joblib` | Unused import (use joblib.dump instead of pickle for pkl files) | Either use or remove |

---

## 7. CIRCULAR DEPENDENCY RISKS (Planned Architecture)

| Risk | Location | Mitigation |
|------|----------|-----------|
| AuthService <-> UserService | Both need user data and token data | Use shared db models, inject dependencies |
| TenantMiddleware <-> DB | Middleware needs DB to resolve tenant | Use connection factory, not service |
| AIService loading at import | If models are loaded at module import | Use singleton + lifespan event in FastAPI |

---

*Dependency graph generated from codebase analysis — 2026-08-25*  
*Planned dependencies are based on the intended technology stack (FastAPI + React).*
