# NEXUS CRM — ROUTES MAP

> Last Updated: 2026-08-25 | Branch: frontend  
> STATUS: NO ROUTES CURRENTLY IMPLEMENTED — This document defines the planned routing architecture.

---

## FRONTEND ROUTES (React — PLANNED)

### Public Routes (No Auth Required)
| Route | Component | Purpose | Notes |
|-------|-----------|---------|-------|
| /login | LoginPage | Tenant user authentication | Redirects to /dashboard if already logged in |
| /register | RegisterPage | New tenant onboarding | Creates tenant + first admin user |
| /forgot-password | ForgotPasswordPage | Password reset flow | Sends email reset link |
| /reset-password/:token | ResetPasswordPage | Complete password reset | Token from email link |

### Protected Routes (Auth Required)
| Route | Component | Purpose | Auth Level |
|-------|-----------|---------|------------|
| / | DashboardPage | Main overview with AI summaries | Any authenticated user |
| /leads | LeadsPage | Lead list with AI lead_hot scores | Any authenticated user |
| /leads/new | NewLeadPage | Create new lead | rep, manager, admin |
| /leads/:id | LeadDetailPage | Lead detail + score breakdown | Any authenticated user |
| /leads/:id/edit | LeadEditPage | Edit lead data | rep (own), manager, admin |
| /deals | PipelinePage | Kanban pipeline of deals | Any authenticated user |
| /deals/new | NewDealPage | Create new deal | rep, manager, admin |
| /deals/:id | DealDetailPage | Deal detail + close probability | Any authenticated user |
| /deals/:id/edit | DealEditPage | Edit deal data | rep (own), manager, admin |
| /accounts | AccountsPage | Account list with churn risk | Any authenticated user |
| /accounts/new | NewAccountPage | Create new account | manager, admin |
| /accounts/:id | AccountDetailPage | Account detail + churn score | Any authenticated user |
| /accounts/:id/edit | AccountEditPage | Edit account data | manager, admin |
| /contacts | ContactsPage | Contact list | Any authenticated user |
| /contacts/:id | ContactDetailPage | Contact detail | Any authenticated user |
| /activities | ActivitiesPage | Activity feed/timeline | Any authenticated user |
| /analytics | AnalyticsPage | Revenue, funnel, AI insights | manager, admin |
| /analytics/leads | LeadAnalyticsPage | Lead conversion analytics | manager, admin |
| /analytics/deals | DealAnalyticsPage | Deal pipeline analytics | manager, admin |
| /analytics/churn | ChurnAnalyticsPage | Churn risk analytics | manager, admin |
| /settings | SettingsPage | Tenant settings | admin |
| /settings/users | UserManagementPage | Manage tenant users | admin |
| /settings/integrations | IntegrationsPage | Configure integrations | admin |
| /settings/ai-models | AISettingsPage | AI model thresholds/config | admin |

### Super Admin Routes (Super Admin Only)
| Route | Component | Purpose | Auth Level |
|-------|-----------|---------|------------|
| /admin | SuperAdminDashboard | Platform overview | super_admin |
| /admin/tenants | TenantListPage | All tenants list | super_admin |
| /admin/tenants/new | NewTenantPage | Create new tenant | super_admin |
| /admin/tenants/:id | TenantDetailPage | Tenant management | super_admin |
| /admin/tenants/:id/impersonate | ImpersonatePage | Log in as tenant admin | super_admin |

---

## BACKEND API ROUTES (FastAPI — PLANNED)

### Authentication Endpoints
| Method | Route | Purpose | Request Body | Response | Auth |
|--------|-------|---------|-------------|---------|------|
| POST | /api/v1/auth/login | Log in, get JWT | { email, password } | { access_token, refresh_token, user } | No |
| POST | /api/v1/auth/logout | Invalidate token | {} | { message } | Yes |
| POST | /api/v1/auth/refresh | Get new access token | { refresh_token } | { access_token } | No |
| POST | /api/v1/auth/forgot-password | Request reset email | { email } | { message } | No |
| POST | /api/v1/auth/reset-password | Complete reset | { token, new_password } | { message } | No |
| GET | /api/v1/auth/me | Get current user | -- | { user } | Yes |

### Leads Endpoints
| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| GET | /api/v1/leads | List leads (paginated, filterable) | Any |
| POST | /api/v1/leads | Create lead | rep+ |
| GET | /api/v1/leads/{id} | Get lead detail with AI score | Any |
| PUT | /api/v1/leads/{id} | Update lead | rep (own), manager+ |
| DELETE | /api/v1/leads/{id} | Delete lead | admin |
| POST | /api/v1/leads/{id}/score | Force re-score lead | rep+ |
| GET | /api/v1/leads/{id}/activities | Lead activity timeline | Any |
| POST | /api/v1/leads/{id}/activities | Log activity against lead | rep+ |

### Deals Endpoints
| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| GET | /api/v1/deals | List deals (paginated, filterable) | Any |
| POST | /api/v1/deals | Create deal | rep+ |
| GET | /api/v1/deals/{id} | Get deal detail with close probability | Any |
| PUT | /api/v1/deals/{id} | Update deal | rep (own), manager+ |
| DELETE | /api/v1/deals/{id} | Delete deal | admin |
| POST | /api/v1/deals/{id}/score | Force re-score deal | rep+ |
| PATCH | /api/v1/deals/{id}/stage | Move deal to different pipeline stage | rep+ |

### Accounts Endpoints
| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| GET | /api/v1/accounts | List accounts with churn risk | Any |
| POST | /api/v1/accounts | Create account | manager+ |
| GET | /api/v1/accounts/{id} | Account detail with churn prediction | Any |
| PUT | /api/v1/accounts/{id} | Update account | manager+ |
| DELETE | /api/v1/accounts/{id} | Delete account | admin |
| POST | /api/v1/accounts/{id}/score | Force re-score churn | manager+ |
| GET | /api/v1/accounts/{id}/deals | Account's deals | Any |
| GET | /api/v1/accounts/{id}/activities | Account activity timeline | Any |

### Activities Endpoints
| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| GET | /api/v1/activities | List all activities (paginated) | Any |
| POST | /api/v1/activities | Log new activity | rep+ |
| GET | /api/v1/activities/{id} | Get activity detail | Any |
| DELETE | /api/v1/activities/{id} | Delete activity | rep (own), manager+ |

### Analytics Endpoints
| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| GET | /api/v1/analytics/summary | Overall KPI summary | manager+ |
| GET | /api/v1/analytics/leads | Lead conversion metrics | manager+ |
| GET | /api/v1/analytics/deals | Pipeline velocity metrics | manager+ |
| GET | /api/v1/analytics/churn | Churn risk summary | manager+ |
| GET | /api/v1/analytics/ai-insights | AI-generated narrative insights | manager+ |

### AI Model Endpoints
| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| POST | /api/v1/ai/score/lead | Score a single lead | Internal/rep+ |
| POST | /api/v1/ai/score/deal | Score a single deal | Internal/rep+ |
| POST | /api/v1/ai/score/account | Score a single account | Internal/manager+ |
| POST | /api/v1/ai/score/batch | Batch score all entities | admin |
| GET | /api/v1/ai/models/status | Health check for loaded models | admin |

### Admin Endpoints (Super Admin Only)
| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| GET | /api/v1/admin/tenants | List all tenants | super_admin |
| POST | /api/v1/admin/tenants | Create new tenant | super_admin |
| GET | /api/v1/admin/tenants/{id} | Get tenant details | super_admin |
| PUT | /api/v1/admin/tenants/{id} | Update tenant | super_admin |
| DELETE | /api/v1/admin/tenants/{id} | Deactivate tenant | super_admin |

---

## MIDDLEWARE EXECUTION ORDER (PLANNED)

```
Incoming Request
     |
     v
1. CORS Middleware
     |
     v
2. Request Logging Middleware
     |
     v
3. JWT Authentication Middleware
   - Validates Bearer token
   - Attaches user context to request state
     |
     v
4. Tenant Resolution Middleware
   - Extracts tenant_id from user context
   - Sets PostgreSQL search_path to tenant schema
     |
     v
5. Route Handler
     |
     v
6. Response Logging Middleware
     |
     v
Outgoing Response
```

---

## DYNAMIC ROUTES

### React Router Dynamic Segments
| Pattern | Example | Resolved Entity |
|---------|---------|----------------|
| /leads/:id | /leads/uuid-1234 | Lead with ID uuid-1234 |
| /deals/:id | /deals/uuid-5678 | Deal with ID uuid-5678 |
| /accounts/:id | /accounts/uuid-9012 | Account with ID uuid-9012 |
| /admin/tenants/:id | /admin/tenants/uuid-3456 | Tenant with ID uuid-3456 |
| /reset-password/:token | /reset-password/abc123xyz | Password reset token |

---

*Routes document generated from feature analysis — 2026-08-25*  
*All routes are PLANNED and not yet implemented.*
