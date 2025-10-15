"""
Celery tasks for scheduled web scraping
"""
from celery import shared_task
from services.scraper_service import ScraperService
from services.market_analyzer import MarketAnalyzer
from services.property_market_scraper import PropertyMarketScraper
from core.models import MarketResearch, Property, PropertyMarketSnapshot, ComparableListing
from django.db import transaction
from datetime import datetime


@shared_task
def scrape_competitors():
    """
    Scheduled task to scrape competitor data
    Run this weekly or monthly
    """
    print("🕷️ Starting competitor scraping task...")
    
    # Scrape all companies
    results = ScraperService.scrape_all_companies()
    
    # Analyze with Claude
    analysis = MarketAnalyzer.analyze_competitive_landscape(results)
    
    # Save to database
    for company_data in results:
        if company_data.get('success'):
            MarketResearch.objects.create(
                competitor_name=company_data['name'],
                competitor_url=company_data['url'],
                scraped_data=company_data,
                units_managed=company_data.get('property_count'),
                service_offerings=company_data.get('services', []),
                pricing_data={},
                ai_insights=analysis.get('analysis', '') if analysis.get('success') else ''
            )
    
    print(f"✅ Scraping complete. Analyzed {len(results)} companies.")
    
    return {
        "success": True,
        "companies_scraped": len(results),
        "timestamp": datetime.now().isoformat()
    }


@shared_task
def scrape_property_market():
    """Scrape market data for active properties."""
    print("🏠 Starting property market scraping task...")

    properties = Property.objects.filter(status='active').values(
        'id', 'address', 'city', 'state', 'zip_code', 'name'
    )

    results = []
    for item in properties:
        address = item['address'].split('\n')[0] if '\n' in item['address'] else item['address']
        data = PropertyMarketScraper.scrape_property(
            address=address,
            city=item['city'],
            state=item['state'],
            zip_code=item['zip_code']
        )
        results.append((item, data))

    for property_info, data in results:
        with transaction.atomic():
            snapshot = PropertyMarketSnapshot.objects.create(
                property_id=property_info['id'],
                source=data.source,
                source_url=data.source_url or '',
                listing_price=data.listing_price,
                rent_estimate=data.rent_estimate,
                price_per_sqft=data.price_per_sqft,
                beds=data.beds,
                baths=data.baths,
                square_feet=data.square_feet,
                year_built=data.year_built,
                lot_size_sqft=data.lot_size_sqft,
                confidence_score=data.confidence_score,
                meta=data.meta or {}
            )

            for comparable in data.comparables or []:
                ComparableListing.objects.create(
                    snapshot=snapshot,
                    title=comparable.title,
                    address=comparable.meta.get('address', '') if comparable.meta else '',
                    distance_miles=comparable.distance_miles,
                    price=comparable.price,
                    rent=comparable.rent,
                    beds=comparable.beds,
                    baths=comparable.baths,
                    square_feet=comparable.square_feet,
                    property_type=comparable.property_type or '',
                    url=comparable.url,
                    meta=comparable.meta or {}
                )

    print(f"✅ Property market scraping complete for {len(results)} properties.")
    return {'success': True, 'properties_scraped': len(results)}


@shared_task
def generate_market_report():
    """
    Generate comprehensive market intelligence report
    """
    print("📊 Generating market intelligence report...")
    
    # Get recent market research data
    recent_data = MarketResearch.objects.all().order_by('-analysis_date')[:10]
    
    scraped_data = [item.scraped_data for item in recent_data]
    
    # Generate report
    report = MarketAnalyzer.generate_market_report(scraped_data)
    
    print("✅ Market report generated.")
    
    return report


@shared_task
def update_pricing_strategy():
    """
    Update pricing strategy based on latest market data
    """
    print("💰 Updating pricing strategy...")
    
    market_data = {}
    strategy = MarketAnalyzer.suggest_pricing_strategy(market_data)
    
    print("✅ Pricing strategy updated.")
    
    return strategy

