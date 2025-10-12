"""
Ethical web scraping service for market research
Targets: Top 10 property management companies for competitive analysis
"""
import requests
from bs4 import BeautifulSoup
import time
import re
from typing import Dict, List, Optional
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser


class ScraperService:
    """Ethical web scraping service with rate limiting and robots.txt compliance"""
    
    # Top 10 property management companies from research
    TARGET_COMPANIES = [
        {"name": "Greystar", "url": "https://www.greystar.com"},
        {"name": "Asset Living", "url": "https://www.assetliving.com"},
        {"name": "RPM Living", "url": "https://www.rpmliving.com"},
        {"name": "Cushman & Wakefield", "url": "https://www.cushmanwakefield.com"},
        {"name": "FPI Management", "url": "https://www.fpimgt.com"},
        {"name": "Avenue5 Residential", "url": "https://www.avenue5.com"},
        {"name": "BH Management", "url": "https://www.bh-management.com"},
        {"name": "WinnCompanies", "url": "https://www.winnco.com"},
        {"name": "Bozzuto", "url": "https://www.bozzuto.com"},
    ]
    
    # Rate limiting: 1 request per 5 seconds (from plan)
    REQUEST_DELAY = 5
    
    USER_AGENT = "HappyEverydayBot/0.0.1 (Property Management Research; +https://happyeveryday.com/bot)"
    
    @staticmethod
    def check_robots_txt(url: str, user_agent: str = USER_AGENT) -> bool:
        """
        Check if scraping is allowed by robots.txt
        """
        try:
            parsed_url = urlparse(url)
            robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
            
            rp = RobotFileParser()
            rp.set_url(robots_url)
            rp.read()
            
            return rp.can_fetch(user_agent, url)
        except:
            # If can't read robots.txt, assume allowed but be cautious
            return True
    
    @staticmethod
    def fetch_page(url: str, delay: int = REQUEST_DELAY) -> Optional[str]:
        """
        Fetch a web page with rate limiting
        """
        try:
            # Check robots.txt
            if not ScraperService.check_robots_txt(url):
                print(f"❌ Scraping not allowed by robots.txt: {url}")
                return None
            
            # Rate limiting
            time.sleep(delay)
            
            headers = {
                "User-Agent": ScraperService.USER_AGENT,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            return response.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    @staticmethod
    def extract_company_info(html: str, company_name: str) -> Dict:
        """
        Extract company information from HTML
        """
        soup = BeautifulSoup(html, 'html.parser')
        
        info = {
            "company_name": company_name,
            "services": [],
            "locations": [],
            "property_count": None,
            "technology_mentions": [],
            "contact_info": {}
        }
        
        # Extract text content
        text_content = soup.get_text().lower()
        
        # Look for property/unit counts
        unit_patterns = [
            r'(\d+[\d,]*)\s*(?:units|apartments|properties)',
            r'manage(?:s|ing)?\s*(\d+[\d,]*)',
            r'portfolio of\s*(\d+[\d,]*)'
        ]
        
        for pattern in unit_patterns:
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            if matches:
                try:
                    count = int(matches[0].replace(',', ''))
                    info["property_count"] = count
                    break
                except:
                    pass
        
        # Service offerings
        services_keywords = [
            'property management', 'leasing', 'maintenance', 'landscaping',
            'snow removal', 'hvac', 'tenant services', 'asset management',
            'facilities management', 'construction management'
        ]
        
        for keyword in services_keywords:
            if keyword in text_content:
                info["services"].append(keyword)
        
        # Technology mentions
        tech_keywords = ['ai', 'artificial intelligence', 'machine learning', 'automation',
                        'smart home', 'iot', 'predictive', 'analytics', 'platform']
        
        for keyword in tech_keywords:
            if keyword in text_content:
                info["technology_mentions"].append(keyword)
        
        # Extract email and phone (simple patterns)
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text_content)
        phones = re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text_content)
        
        if emails:
            info["contact_info"]["emails"] = list(set(emails))[:3]  # Max 3
        if phones:
            info["contact_info"]["phones"] = list(set(phones))[:3]
        
        return info
    
    @classmethod
    def scrape_company(cls, company_data: Dict) -> Dict:
        """
        Scrape a single company's website
        """
        name = company_data["name"]
        url = company_data["url"]
        
        print(f"📊 Scraping {name}...")
        
        html = cls.fetch_page(url)
        
        if not html:
            return {
                "name": name,
                "url": url,
                "success": False,
                "error": "Failed to fetch page"
            }
        
        info = cls.extract_company_info(html, name)
        info["url"] = url
        info["success"] = True
        info["scraped_at"] = time.time()
        
        return info
    
    @classmethod
    def scrape_all_companies(cls) -> List[Dict]:
        """
        Scrape all target companies
        """
        results = []
        
        for company in cls.TARGET_COMPANIES:
            result = cls.scrape_company(company)
            results.append(result)
            
            # Additional delay between companies
            time.sleep(2)
        
        return results
    
    @staticmethod
    def search_company_news(company_name: str) -> List[Dict]:
        """
        Search for recent news about a company (placeholder for future enhancement)
        Could integrate with news APIs or RSS feeds
        """
        # TODO: Implement news aggregation
        return []

