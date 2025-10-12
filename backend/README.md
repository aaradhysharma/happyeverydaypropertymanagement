# Happy Everyday Property Management - Backend

AI-Powered Property Management Platform Backend

## Version: 0.0.1

## Technology Stack

- **FastAPI** + **Django** (unified ASGI)
- **PostgreSQL** database
- **Celery** for background tasks
- **Redis** for caching and task queue
- **OpenAI GPT-4V** for property inspection
- **Anthropic Claude** for market analysis

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Install Playwright for web scraping:
```bash
playwright install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run Django migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Start the server:
```bash
# FastAPI server
uvicorn main:app --reload --port 8000

# Or using Python
python main.py
```

8. Start Celery worker (in separate terminal):
```bash
celery -A celery_app worker --loglevel=info
```

9. Start Celery beat for scheduled tasks (in separate terminal):
```bash
celery -A celery_app beat --loglevel=info
```

## API Endpoints

### Analytics & BI
- `GET /api/analytics/dashboard` - Complete dashboard summary
- `GET /api/analytics/occupancy` - Occupancy rate metrics
- `GET /api/analytics/noi` - Net Operating Income
- `GET /api/analytics/cash-flow` - Cash flow analysis
- `GET /api/analytics/maintenance-costs` - Maintenance cost per unit
- `GET /api/analytics/tenant-retention` - Tenant retention rate
- `GET /api/analytics/response-times` - Response time metrics

### Property Inspections
- `POST /api/inspections/analyze` - Analyze property images with AI
- `GET /api/inspections/property/{property_id}` - Get inspection history
- `GET /api/inspections/{inspection_id}` - Get inspection details

### Service Providers
- `GET /api/providers/list` - List service providers
- `POST /api/providers/assign/{request_id}` - Auto-assign provider
- `GET /api/providers/schedule/{provider_id}` - Get provider schedule
- `GET /api/providers/route/{provider_id}` - Get optimized route

### Privacy & Compliance
- `POST /api/privacy/data-access-request` - GDPR/CCPA data access
- `POST /api/privacy/data-deletion-request` - Right to be forgotten
- `GET /api/privacy/audit-log` - Audit log entries
- `GET /api/privacy/compliance-report` - Compliance report

## Django Admin

Access Django admin at: `http://localhost:8000/admin/`

## Key Features

### BI Analytics (Research-Based KPIs)
- **Occupancy Rate**: Target 85-95%
- **Net Operating Income (NOI)**: Gross Income - Operating Expenses
- **Cash Flow Analysis**: Monthly income vs expenses tracking
- **Maintenance Cost Per Unit**: Operational efficiency metric
- **Tenant Retention Rate**: Relationship management effectiveness
- **Response Time Metrics**: Tenant satisfaction indicator

### AI Property Inspection
- GPT-4V powered image analysis
- Automated damage detection
- Severity scoring (1-10)
- Repair cost estimation
- Specialized roof condition assessment

### Market Research
- Ethical web scraping (respects robots.txt)
- Rate limiting: 1 request/5 seconds
- Targets top 10 property management companies
- Claude AI competitive analysis
- Market trend insights
- Pricing strategy recommendations

### Service Provider Dispatch
- AI-powered triage and categorization
- Automated provider assignment
- Route optimization
- Real-time schedule management
- Performance tracking

### Data Privacy & Compliance
- GDPR compliance (data access, deletion)
- CCPA compliance (opt-out mechanisms)
- Fair Housing Act algorithmic fairness
- SOC 2 Type 2 framework
- ISO 27001 security controls
- Complete audit logging

## Development

Run tests:
```bash
pytest
```

Format code:
```bash
black .
```

Check linting:
```bash
flake8
```

## Deployment

See main README for deployment instructions to Railway/Render.

## License

Proprietary - Happy Everyday Property Management

