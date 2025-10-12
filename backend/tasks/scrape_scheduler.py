"""
Celery tasks for scheduled web scraping
"""
from celery import shared_task
from services.scraper_service import ScraperService
from services.market_analyzer import MarketAnalyzer
from core.models import MarketResearch
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

