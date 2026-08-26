# NEXUS CRM — DATABASE MAP

> Last Updated: 2026-08-25 | Branch: frontend  
> STATUS: NO ORM MODELS OR MIGRATIONS EXIST — Schema inferred from ML training feature columns in train_models.ipynb

---

## DATABASE ENGINE

| Property | Value |
|----------|-------|
| Engine | PostgreSQL |
| Multi-Tenancy Strategy | Schema-per-Tenant |
| ORM | UNKNOWN — NEEDS VERIFICATION (SQLAlchemy likely) |
| Migrations | UNKNOWN — NEEDS VERIFICATION (Alembic likely) |
| Connection Pooling | UNKNOWN (PgBouncer recommended) |

---

## SCHEMA LAYOUT

```
PostgreSQL Instance
|
+-- public (shared schema)
|   +-- tenants
|   +-- super_admins
|
+-- tenant_{uuid} (one schema per tenant)
    +-- users
    +-- leads
    +-- deals
    +-- accounts
    +-- contacts
    +-- activities
    +-- ai_scores_log
```

---

## PUBLIC SCHEMA TABLES

### `tenants`
**Purpose:** Registry of all organizations using the platform  
**Referenced by:** JWT tokens (tenant_id), all tenant schema creation

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique tenant identifier |
| name | VARCHAR(255) | NOT NULL | Organization display name |
| schema_name | VARCHAR(63) | NOT NULL, UNIQUE | PostgreSQL schema identifier (e.g., tenant_abc123) |
| subscription_tier | VARCHAR(50) | NOT NULL, DEFAULT 'free' | 'free', 'growth', 'enterprise' |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | 'active', 'suspended', 'cancelled' |
| admin_email | VARCHAR(254) | NOT NULL, UNIQUE | Primary contact email |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Tenant creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE (schema_name)
- UNIQUE (admin_email)

---

### `super_admins`
**Purpose:** Platform-level administrators who manage all tenants

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| email | VARCHAR(254) | NOT NULL, UNIQUE | Login email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash |
| name | VARCHAR(255) | NOT NULL | Display name |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Account enabled? |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

---

## TENANT SCHEMA TABLES (Replicated per Tenant)

### `users`
**Purpose:** CRM users belonging to this tenant

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique user identifier |
| email | VARCHAR(254) | NOT NULL, UNIQUE | Login email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash |
| name | VARCHAR(255) | NOT NULL | Display name |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'rep' | 'rep', 'manager', 'admin' |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Account enabled? |
| last_login_at | TIMESTAMP | NULL | Last successful login |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last profile update |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE (email)
- INDEX (role)

---

### `leads`
**Purpose:** Prospective customers being tracked by sales reps  
**AI Target Column:** `lead_hot` (XGBClassifier, Test AUC: 0.9576)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique lead identifier |
| company_name | VARCHAR(255) | NOT NULL | Company name |
| contact_name | VARCHAR(255) | NULL | Primary contact's name |
| email | VARCHAR(254) | NULL | Contact email |
| phone | VARCHAR(50) | NULL | Contact phone number |
| industry | VARCHAR(100) | NULL | Lead's industry (ML categorical feature) |
| country | VARCHAR(100) | NULL | Lead's country (ML categorical feature) |
| company_size | VARCHAR(50) | NULL | Size bucket: 'small','mid-market','enterprise' (ML categorical) |
| lead_source | VARCHAR(100) | NULL | Acquisition channel (ML categorical feature) |
| num_employees | INTEGER | NULL, CHECK >= 0 | Company headcount (ML numeric feature) |
| num_activities | INTEGER | NOT NULL, DEFAULT 0 | Total activities logged (ML numeric feature) |
| num_emails_sent | INTEGER | NOT NULL, DEFAULT 0 | Emails sent to lead (ML numeric feature) |
| num_calls | INTEGER | NOT NULL, DEFAULT 0 | Calls made to lead (ML numeric feature) |
| num_meetings | INTEGER | NOT NULL, DEFAULT 0 | Meetings held (ML numeric feature) |
| response_time_hrs | FLOAT | NULL | Avg response time in hours (ML numeric feature) |
| days_in_pipeline | INTEGER | NOT NULL, DEFAULT 0 | Days since lead entered pipeline (ML numeric feature) |
| sales_cycle_days | INTEGER | NULL | Completed sales cycle length (ML numeric feature) |
| deal_value_usd | FLOAT | NULL | Estimated deal value (ML numeric feature) |
| annual_contract_value | FLOAT | NULL | Expected ACV (ML numeric feature) |
| competitor_mentioned | BOOLEAN | NOT NULL, DEFAULT false | Competitor discussed? (ML numeric feature) |
| budget_confirmed | BOOLEAN | NOT NULL, DEFAULT false | Budget approved? (ML numeric feature) |
| decision_maker_contact | BOOLEAN | NOT NULL, DEFAULT false | Contact is a DM? (ML numeric feature) |
| previous_customer | BOOLEAN | NOT NULL, DEFAULT false | Returning customer? (ML numeric feature) |
| ai_assisted | BOOLEAN | NOT NULL, DEFAULT false | AI used in outreach? (ML numeric feature) |
| activity_per_day | FLOAT | NULL | Computed: num_activities / days_in_pipeline (ML numeric feature) |
| email_response_ratio | FLOAT | NULL | Computed: responses / emails_sent (ML numeric feature) |
| engagement_score | FLOAT | NULL | Composite engagement metric (ML numeric feature) |
| high_value_deal | BOOLEAN | NULL | Deal above value threshold (ML numeric feature) |
| fast_response | BOOLEAN | NULL | Responded within SLA (ML numeric feature) |
| above_avg_cycle | BOOLEAN | NULL | Sales cycle above average (ML numeric feature) |
| lead_hot | FLOAT | NULL, CHECK BETWEEN 0 AND 1 | **AI SCORE**: Lead conversion probability |
| lead_hot_scored_at | TIMESTAMP | NULL | When AI score was last computed |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'new' | 'new', 'contacted', 'qualified', 'converted', 'lost' |
| assigned_to | UUID | NULL, FK users(id) | Assigned sales rep |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Lead creation date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (assigned_to)
- INDEX (lead_hot DESC) -- for "top leads" queries
- INDEX (status)
- INDEX (created_at DESC)

**Relationships:**
- leads.assigned_to --> users.id (many leads to one user)
- leads (1) --> activities (many)

---

### `deals`
**Purpose:** Active sales opportunities in the pipeline  
**AI Target Column:** `deal_close_prob` (XGBRegressor, Test R²: 0.6384)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique deal identifier |
| title | VARCHAR(255) | NOT NULL | Deal display name |
| account_id | UUID | NULL, FK accounts(id) | Parent account |
| lead_id | UUID | NULL, FK leads(id) | Originating lead |
| deal_value_usd | FLOAT | NULL, CHECK >= 0 | Deal monetary value (ML numeric feature) |
| annual_contract_value | FLOAT | NULL | ACV (ML numeric feature) |
| subscription_tier | VARCHAR(50) | NULL | Product tier (ML categorical feature) |
| contract_length_months | INTEGER | NULL | Contract duration (ML numeric feature) |
| discount_given_pct | FLOAT | NULL, CHECK BETWEEN 0 AND 100 | Discount percentage (ML numeric feature) |
| sales_cycle_days | INTEGER | NULL | Days in current sales cycle (ML numeric feature) |
| ai_tools_used | VARCHAR(100) | NULL | AI tools used in deal (ML categorical feature) |
| assigned_role | VARCHAR(100) | NULL | Assigned rep's role (ML categorical feature) |
| stage | VARCHAR(50) | NOT NULL, DEFAULT 'prospecting' | Pipeline stage |
| deal_close_prob | FLOAT | NULL, CHECK BETWEEN 0 AND 1 | **AI SCORE**: Close probability |
| deal_close_prob_scored_at | TIMESTAMP | NULL | When AI score was last computed |
| expected_close_date | DATE | NULL | Anticipated close date |
| assigned_to | UUID | NULL, FK users(id) | Assigned sales rep |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Deal creation date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**Pipeline Stages (Ordered):**
1. prospecting
2. qualification
3. proposal
4. negotiation
5. closed_won
6. closed_lost

**Indexes:**
- PRIMARY KEY (id)
- INDEX (account_id)
- INDEX (stage)
- INDEX (assigned_to)
- INDEX (deal_close_prob DESC)

**Relationships:**
- deals.account_id --> accounts.id
- deals.lead_id --> leads.id (optional — deal may originate from lead)
- deals.assigned_to --> users.id
- deals (1) --> activities (many)

---

### `accounts`
**Purpose:** Organizations that are active or past customers  
**AI Target Column:** `churned` (XGBClassifier, Test AUC: 0.6655)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique account identifier |
| name | VARCHAR(255) | NOT NULL | Company name |
| industry | VARCHAR(100) | NULL | Industry sector (ML categorical feature) |
| country | VARCHAR(100) | NULL | Country (ML categorical feature) |
| company_size | VARCHAR(50) | NULL | Size category (ML categorical feature) |
| num_employees | INTEGER | NULL | Headcount (ML numeric feature) |
| subscription_tier | VARCHAR(50) | NULL | Current plan tier (ML categorical feature) |
| mrr_usd | FLOAT | NULL | Monthly Recurring Revenue (ML numeric feature) |
| monthly_revenue | FLOAT | NULL | Total monthly revenue from account (ML numeric feature) |
| contract_length_months | INTEGER | NULL | Contract duration (ML numeric feature) |
| months_as_customer | INTEGER | NOT NULL, DEFAULT 0 | Customer tenure (ML numeric feature) |
| support_tickets | INTEGER | NOT NULL, DEFAULT 0 | Tickets raised (ML numeric feature) |
| product_usage_score | FLOAT | NULL, CHECK BETWEEN 0 AND 1 | Platform usage metric (ML numeric feature) |
| login_frequency | FLOAT | NULL | Average logins per month (ML numeric feature) |
| feature_adoption_pct | FLOAT | NULL, CHECK BETWEEN 0 AND 1 | % of features actively used (ML numeric feature) |
| nps_score | FLOAT | NULL, CHECK BETWEEN 0 AND 10 | Net Promoter Score (ML numeric feature) |
| csat_score | FLOAT | NULL, CHECK BETWEEN 0 AND 10 | Customer Satisfaction Score (ML numeric feature) |
| usage_bucket | VARCHAR(50) | NULL | Usage category: 'low','medium','high' (ML categorical) |
| period_label | VARCHAR(50) | NULL | Time period label (ML categorical feature) |
| at_risk_churn | BOOLEAN | NOT NULL, DEFAULT false | Rule-based at-risk flag (ML numeric feature) |
| churned | FLOAT | NULL, CHECK BETWEEN 0 AND 1 | **AI SCORE**: Churn probability |
| churned_scored_at | TIMESTAMP | NULL | When AI score was last computed |
| is_churned | BOOLEAN | NOT NULL, DEFAULT false | Actual churned status (ground truth) |
| churned_at | TIMESTAMP | NULL | When account actually churned |
| csm_owner | UUID | NULL, FK users(id) | Assigned Customer Success Manager |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation date |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (churned DESC) -- for "at risk" queries
- INDEX (at_risk_churn) WHERE at_risk_churn = true
- INDEX (csm_owner)
- INDEX (subscription_tier)

**Relationships:**
- accounts (1) --> deals (many)
- accounts (1) --> contacts (many)
- accounts (1) --> activities (many)
- accounts.csm_owner --> users.id

---

### `contacts`
**Purpose:** Individual people at accounts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique contact identifier |
| account_id | UUID | NOT NULL, FK accounts(id) | Parent account |
| name | VARCHAR(255) | NOT NULL | Full name |
| email | VARCHAR(254) | NULL | Email address |
| phone | VARCHAR(50) | NULL | Phone number |
| title | VARCHAR(255) | NULL | Job title |
| is_decision_maker | BOOLEAN | NOT NULL, DEFAULT false | Is this contact a DM? |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

**Relationships:**
- contacts.account_id --> accounts.id (many contacts to one account)

---

### `activities`
**Purpose:** Log of all interactions (emails, calls, meetings) against entities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique activity identifier |
| entity_type | VARCHAR(20) | NOT NULL | 'lead', 'deal', or 'account' |
| entity_id | UUID | NOT NULL | FK to leads/deals/accounts |
| type | VARCHAR(20) | NOT NULL | 'email', 'call', 'meeting' |
| notes | TEXT | NULL | Activity notes/summary |
| duration_minutes | INTEGER | NULL | Duration of call/meeting |
| occurred_at | TIMESTAMP | NOT NULL | When activity happened |
| logged_by | UUID | NOT NULL, FK users(id) | Who logged it |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Log creation time |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (entity_type, entity_id) -- for "get activities for lead X" queries
- INDEX (logged_by)
- INDEX (occurred_at DESC)

**NOTE:** This uses a polymorphic association (entity_type + entity_id) rather than separate FKs. Alternative: use separate junction tables.

---

### `ai_scores_log`
**Purpose:** Audit trail of all AI scoring events (for model monitoring and debugging)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique log entry |
| entity_type | VARCHAR(20) | NOT NULL | 'lead', 'deal', or 'account' |
| entity_id | UUID | NOT NULL | The scored entity |
| model_name | VARCHAR(50) | NOT NULL | 'lead_scoring', 'churn', 'deal_prob' |
| model_version | VARCHAR(20) | NOT NULL | Model version string |
| score_before | FLOAT | NULL | Previous score |
| score_after | FLOAT | NOT NULL | New score |
| trigger | VARCHAR(50) | NOT NULL | 'auto', 'manual', 'batch' |
| scored_by | UUID | NULL, FK users(id) | User who triggered (null if auto) |
| scored_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When scored |

---

## ENTITY RELATIONSHIP DIAGRAM (TEXT)

```
tenants (public schema)
   |
   +-- [creates] --> tenant_{id} schema
                           |
                    +------+------+
                    |             |
                  users         leads
                    |             |
                    |        (assigned_to) --> users
                    |             |
                    |         activities
                    |
                  accounts
                    |
               +----+----+
               |         |
            deals      contacts
               |
           (lead_id) --> leads
           (account_id) --> accounts
           (assigned_to) --> users
               |
           activities
```

---

## AI SCORE COLUMNS SUMMARY

| Table | Column | AI Model | Type | Range |
|-------|--------|----------|------|-------|
| leads | lead_hot | XGBClassifier | FLOAT | 0.0 - 1.0 |
| deals | deal_close_prob | XGBRegressor | FLOAT | 0.0 - 1.0 |
| accounts | churned | XGBClassifier | FLOAT | 0.0 - 1.0 |

---

## CRITICAL DATABASE NOTES

1. **Preprocessor Alignment**: All 42 features (33 numeric + 9 categorical) in the database schema MUST match exactly what the ColumnTransformer was fitted on. Any schema change to ML feature columns requires model retraining.

2. **Schema Naming**: The `schema_name` field in `tenants` must use safe PostgreSQL identifier characters only (a-z, 0-9, _). Suggested format: `tenant_` + UUID with dashes removed.

3. **Search Path**: Every database query in the application MUST run after `SET search_path = tenant_{id}, public` to enforce tenant isolation.

4. **Boolean as Numeric**: Several boolean columns (competitor_mentioned, budget_confirmed, etc.) are used as INTEGER/FLOAT features in the ML models (True=1, False=0). Ensure proper type coercion in the inference pipeline.

5. **Computed Fields**: `activity_per_day`, `email_response_ratio`, `above_avg_cycle`, `high_value_deal` may be computed columns (PostgreSQL GENERATED) or computed in the application layer before scoring.

---

*Database map generated from ML feature analysis — 2026-08-25*  
*All schemas are INFERRED from training data features, not from existing ORM models.*
