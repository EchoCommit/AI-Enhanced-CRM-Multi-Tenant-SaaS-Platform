# NEXUS CRM — API MAP

> Last Updated: 2026-08-25 | Branch: frontend  
> STATUS: NO APIs CURRENTLY IMPLEMENTED — This document defines the complete planned API contract.

---

## API CONVENTIONS

### Base URL
```
Development: http://localhost:8000/api/v1
Staging:     https://staging.nexus-crm.com/api/v1
Production:  https://app.nexus-crm.com/api/v1
```

### Authentication
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```
- All protected endpoints require the Authorization header
- JWT payload: { user_id, tenant_id, role, exp }
- Access tokens expire: UNKNOWN (recommended 15 min)
- Refresh tokens expire: UNKNOWN (recommended 30 days)

### Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead with ID xyz does not exist",
    "details": {}
  }
}
```

### Pagination Query Parameters
```
?page=1&per_page=25&sort_by=created_at&order=desc
```

### Standard Filtering
```
?status=active&industry=SaaS&country=US&min_score=0.7
```

---

## AUTHENTICATION API

### POST /api/v1/auth/login
**Purpose:** Authenticate a user and issue JWT tokens  
**Auth Required:** No

**Request:**
```json
{
  "email": "rep@company.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR...",
    "token_type": "bearer",
    "user": {
      "id": "uuid",
      "email": "rep@company.com",
      "name": "John Smith",
      "role": "rep",
      "tenant_id": "uuid",
      "tenant_name": "Acme Corp"
    }
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "error": { "code": "INVALID_CREDENTIALS", "message": "Email or password is incorrect" }
}
```

---

### POST /api/v1/auth/refresh
**Purpose:** Exchange refresh token for new access token  
**Auth Required:** No

**Request:**
```json
{ "refresh_token": "eyJhbGciOiJIUzI1NiIsInR..." }
```

**Response (200):**
```json
{
  "success": true,
  "data": { "access_token": "eyJhbGciOiJIUzI1NiIsInR..." }
}
```

---

### GET /api/v1/auth/me
**Purpose:** Get current authenticated user profile  
**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "rep@company.com",
    "name": "John Smith",
    "role": "rep",
    "tenant_id": "uuid",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

---

## LEADS API

### GET /api/v1/leads
**Purpose:** List leads with AI scores (paginated, filterable)  
**Auth Required:** Yes (any role)

**Query Parameters:**
```
?page=1&per_page=25&sort_by=lead_hot&order=desc
&lead_source=inbound&industry=SaaS&min_score=0.7&assigned_to=uuid
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company_name": "TechCorp Inc",
      "contact_name": "Jane Doe",
      "email": "jane@techcorp.com",
      "industry": "SaaS",
      "country": "US",
      "company_size": "mid-market",
      "lead_source": "inbound",
      "lead_hot": 0.9412,
      "days_in_pipeline": 14,
      "num_activities": 8,
      "created_at": "2025-03-01T09:00:00Z",
      "assigned_to": { "id": "uuid", "name": "John Smith" }
    }
  ],
  "meta": { "page": 1, "per_page": 25, "total": 142 }
}
```

---

### POST /api/v1/leads
**Purpose:** Create a new lead (triggers AI scoring automatically)  
**Auth Required:** Yes (rep+)

**Request:**
```json
{
  "company_name": "TechCorp Inc",
  "contact_name": "Jane Doe",
  "email": "jane@techcorp.com",
  "industry": "SaaS",
  "country": "US",
  "company_size": "mid-market",
  "lead_source": "inbound",
  "num_employees": 250,
  "deal_value_usd": 45000,
  "annual_contract_value": 45000,
  "assigned_to": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "lead_hot": 0.8734,
    "created_at": "2025-08-25T10:30:00Z",
    ...all fields
  }
}
```

---

### GET /api/v1/leads/{id}
**Purpose:** Get lead detail with full AI score breakdown  
**Auth Required:** Yes (any role)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "lead_hot": 0.9412,
    "score_breakdown": {
      "engagement_score": 0.85,
      "response_time_hrs": 2.3,
      "budget_confirmed": true,
      "decision_maker_contact": true,
      "days_in_pipeline": 14
    },
    "recent_activities": [...],
    ...all lead fields
  }
}
```

---

### POST /api/v1/leads/{id}/score
**Purpose:** Force re-run AI scoring for a lead  
**Auth Required:** Yes (rep+)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "lead_id": "uuid",
    "previous_score": 0.72,
    "new_score": 0.89,
    "scored_at": "2025-08-25T10:30:00Z"
  }
}
```

---

## DEALS API

### GET /api/v1/deals
**Purpose:** List deals in pipeline with close probability  
**Auth Required:** Yes (any role)

**Query Parameters:**
```
?page=1&per_page=25&stage=negotiation&min_value=10000&assigned_to=uuid
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Acme Corp - Enterprise Plan",
      "deal_value_usd": 120000,
      "annual_contract_value": 120000,
      "stage": "negotiation",
      "deal_close_prob": 0.7824,
      "sales_cycle_days": 45,
      "subscription_tier": "enterprise",
      "assigned_to": { "id": "uuid", "name": "John Smith" },
      "account": { "id": "uuid", "name": "Acme Corp" },
      "created_at": "2025-06-01T09:00:00Z"
    }
  ],
  "meta": { "page": 1, "per_page": 25, "total": 38 }
}
```

---

### POST /api/v1/deals
**Purpose:** Create a new deal (triggers AI close probability scoring)  
**Auth Required:** Yes (rep+)

**Request:**
```json
{
  "title": "Acme Corp - Enterprise Plan",
  "account_id": "uuid",
  "deal_value_usd": 120000,
  "annual_contract_value": 120000,
  "subscription_tier": "enterprise",
  "contract_length_months": 12,
  "assigned_to": "uuid"
}
```

---

### POST /api/v1/deals/{id}/score
**Purpose:** Force re-run AI close probability scoring  
**Auth Required:** Yes (rep+)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deal_id": "uuid",
    "previous_score": 0.61,
    "new_score": 0.78,
    "scored_at": "2025-08-25T10:30:00Z"
  }
}
```

---

## ACCOUNTS API

### GET /api/v1/accounts
**Purpose:** List accounts with churn risk scores  
**Auth Required:** Yes (any role)

**Query Parameters:**
```
?page=1&per_page=25&at_risk=true&min_churn_score=0.5&subscription_tier=enterprise
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "industry": "Manufacturing",
      "country": "US",
      "subscription_tier": "enterprise",
      "mrr_usd": 10000,
      "churned": 0.7234,
      "at_risk_churn": true,
      "months_as_customer": 18,
      "nps_score": 6.5,
      "product_usage_score": 0.42,
      "csm_owner": { "id": "uuid", "name": "Sarah Lee" }
    }
  ],
  "meta": { "page": 1, "per_page": 25, "total": 89 }
}
```

---

### POST /api/v1/accounts/{id}/score
**Purpose:** Force re-run churn prediction for an account  
**Auth Required:** Yes (manager+)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "account_id": "uuid",
    "previous_churn_score": 0.45,
    "new_churn_score": 0.72,
    "at_risk_churn": true,
    "scored_at": "2025-08-25T10:30:00Z"
  }
}
```

---

## ACTIVITIES API

### POST /api/v1/activities
**Purpose:** Log a new activity (email, call, meeting) against any entity  
**Auth Required:** Yes (rep+)

**Request:**
```json
{
  "entity_type": "lead",
  "entity_id": "uuid",
  "type": "call",
  "notes": "Discussed budget requirements. Decision maker confirmed.",
  "duration_minutes": 30,
  "occurred_at": "2025-08-25T14:00:00Z"
}
```

---

## ANALYTICS API

### GET /api/v1/analytics/summary
**Purpose:** Overall KPI dashboard metrics  
**Auth Required:** Yes (manager+)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "2025-Q3",
    "total_leads": 142,
    "hot_leads": 67,
    "conversion_rate": 0.23,
    "total_pipeline_value": 4500000,
    "avg_deal_close_prob": 0.61,
    "at_risk_accounts": 12,
    "total_mrr": 485000,
    "churn_risk_mrr": 87000
  }
}
```

---

## AI MODELS API

### GET /api/v1/ai/models/status
**Purpose:** Check health/status of loaded ML models  
**Auth Required:** Yes (admin+)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "lead_scoring_model": {
      "loaded": true,
      "version": "v1.0",
      "trained_at": "2026-06-25T11:39:59Z",
      "test_auc": 0.9576
    },
    "churn_model": {
      "loaded": true,
      "version": "v1.0",
      "trained_at": "2026-06-25T11:39:59Z",
      "test_auc": 0.6655
    },
    "deal_prob_model": {
      "loaded": true,
      "version": "v1.0",
      "trained_at": "2026-06-25T11:40:00Z",
      "test_r2": 0.6384
    },
    "preprocessor": {
      "loaded": true,
      "n_features_numeric": 33,
      "n_features_categorical": 9
    }
  }
}
```

### POST /api/v1/ai/score/batch
**Purpose:** Trigger batch re-scoring of all entities for all tenants  
**Auth Required:** Yes (admin+)

**Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "status": "queued",
    "estimated_completion": "2025-08-25T11:00:00Z"
  }
}
```

---

## SUPER ADMIN API

### GET /api/v1/admin/tenants
**Purpose:** List all tenants on the platform  
**Auth Required:** Yes (super_admin only)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "schema_name": "tenant_001",
      "subscription_tier": "enterprise",
      "lead_count": 142,
      "deal_count": 38,
      "account_count": 89,
      "mrr_usd": 10000,
      "created_at": "2024-01-15T09:00:00Z",
      "status": "active"
    }
  ]
}
```

---

## HTTP STATUS CODES USED

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (new resource) |
| 202 | Accepted | Async job queued |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error / malformed request |
| 401 | Unauthorized | Missing or invalid JWT |
| 403 | Forbidden | Valid JWT but insufficient role |
| 404 | Not Found | Resource does not exist in tenant's schema |
| 409 | Conflict | Duplicate resource (e.g., email already exists) |
| 422 | Unprocessable Entity | Pydantic validation failure |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled server exception |
| 503 | Service Unavailable | ML model not loaded or DB unreachable |

---

## PYDANTIC VALIDATION RULES (PLANNED)

| Field | Rule |
|-------|------|
| email | Valid email format, max 254 chars |
| deal_value_usd | Float, min=0 |
| num_employees | Integer, min=1 |
| nps_score | Float, min=0, max=10 |
| feature_adoption_pct | Float, min=0.0, max=1.0 |
| deal_close_prob | Float, min=0.0, max=1.0 |
| churned | Float, min=0.0, max=1.0 |
| lead_hot | Float, min=0.0, max=1.0 |

---

*API map generated from feature and ML model analysis — 2026-08-25*  
*All endpoints are PLANNED and not yet implemented.*
