"""
Property market scraping utilities.
"""

from __future__ import annotations

import math
import random
import time
from dataclasses import dataclass
from typing import Iterable, List, Optional
from urllib.parse import urlencode

import requests
from bs4 import BeautifulSoup


USER_AGENT = "HappyEverydayBot/0.0.1 (Market Insights; +https://happyeveryday.com/bot)"
REQUEST_DELAY_SECONDS = 3
MAX_RETRIES = 3

ZILLOW_BASE_URL = "https://www.zillow.com/homes/"


@dataclass
class ComparableData:
    title: str
    url: str
    price: Optional[float] = None
    rent: Optional[float] = None
    beds: Optional[float] = None
    baths: Optional[float] = None
    square_feet: Optional[int] = None
    distance_miles: Optional[float] = None
    property_type: Optional[str] = None
    meta: dict | None = None


@dataclass
class PropertyMarketData:
    listing_price: Optional[float] = None
    rent_estimate: Optional[float] = None
    price_per_sqft: Optional[float] = None
    beds: Optional[float] = None
    baths: Optional[float] = None
    square_feet: Optional[int] = None
    year_built: Optional[int] = None
    lot_size_sqft: Optional[int] = None
    confidence_score: Optional[float] = None
    source: str = "zillow"
    source_url: Optional[str] = None
    meta: dict | None = None
    comparables: List[ComparableData] | None = None


class PropertyMarketScraperError(Exception):
    """Base error for property market scraping."""


class PropertyMarketScraper:
    @staticmethod
    def build_search_url(address: str, city: str, state: str, zip_code: str) -> str:
        query = f"{address}, {city}, {state} {zip_code}"
        params = {"searchQueryState": {"pagination": {}, "usersSearchTerm": query}}
        encoded = urlencode({"searchQueryState": str(params["searchQueryState"])})
        return f"{ZILLOW_BASE_URL}?{encoded}"

    @classmethod
    def fetch_page(cls, url: str, delay: int = REQUEST_DELAY_SECONDS) -> Optional[str]:
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                time.sleep(delay + random.uniform(0, 1))
                response = requests.get(
                    url,
                    headers={
                        "User-Agent": USER_AGENT,
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.8",
                    },
                    timeout=10,
                )
                response.raise_for_status()
                return response.text
            except Exception as exc:
                if attempt == MAX_RETRIES:
                    raise PropertyMarketScraperError(str(exc)) from exc
                time.sleep(math.pow(2, attempt))
        return None

    @staticmethod
    def parse_market_data(html: str) -> PropertyMarketData:
        soup = BeautifulSoup(html, "html.parser")

        meta = {}
        listing_price = None
        rent_estimate = None
        price_per_sqft = None
        beds = None
        baths = None
        square_feet = None
        year_built = None
        lot_size = None

        price_span = soup.find("span", string=lambda text: text and "$" in text)
        if price_span:
            listing_price = PropertyMarketScraper.extract_currency(price_span.text)

        rent_span = soup.find("span", string=lambda text: text and "rent" in text.lower())
        if rent_span:
            rent_estimate = PropertyMarketScraper.extract_currency(rent_span.text)

        specs = soup.select("ul li")
        for spec in specs:
            text = spec.get_text(" ", strip=True).lower()
            if "bed" in text and beds is None:
                beds = PropertyMarketScraper.extract_number(text)
            if "bath" in text and baths is None:
                baths = PropertyMarketScraper.extract_number(text)
            if "sqft" in text and square_feet is None:
                square_feet = PropertyMarketScraper.extract_int(text)
            if "built" in text and year_built is None:
                year_built = PropertyMarketScraper.extract_int(text)
            if "lot" in text and lot_size is None:
                lot_size = PropertyMarketScraper.extract_int(text)

        comparables = PropertyMarketScraper.parse_comparables(soup)

        if listing_price and square_feet:
            price_per_sqft = listing_price / square_feet

        # Confidence heuristic based on parsed values count
        populated_fields = [listing_price, rent_estimate, price_per_sqft, beds, baths, square_feet]
        confidence = sum(1 for item in populated_fields if item is not None) / len(populated_fields)

        return PropertyMarketData(
            listing_price=listing_price,
            rent_estimate=rent_estimate,
            price_per_sqft=price_per_sqft,
            beds=beds,
            baths=baths,
            square_feet=square_feet,
            year_built=year_built,
            lot_size_sqft=lot_size,
            confidence_score=round(confidence, 2) if populated_fields else None,
            meta=meta,
            comparables=comparables,
        )

    @staticmethod
    def parse_comparables(soup: BeautifulSoup) -> List[ComparableData]:
        comparables: List[ComparableData] = []
        cards = soup.select("a[data-test='property-card-link']")
        for card in cards[:5]:
            title = card.get_text(" ", strip=True)
            url = card.get("href")
            if not url:
                continue
            if url.startswith("/"):
                url = f"https://www.zillow.com{url}"

            price = PropertyMarketScraper.extract_currency(title)
            beds = PropertyMarketScraper.extract_number(title)
            baths = PropertyMarketScraper.extract_number(title.split("bed")[-1]) if "bed" in title else None
            sqft = PropertyMarketScraper.extract_int(title)

            comparables.append(
                ComparableData(
                    title=title or "Comparable Listing",
                    url=url,
                    price=price,
                    beds=beds,
                    baths=baths,
                    square_feet=sqft,
                    meta={"raw": title},
                )
            )
        return comparables

    @staticmethod
    def extract_currency(value: str) -> Optional[float]:
        digits = [char for char in value if char.isdigit() or char == "."]
        if not digits:
            return None
        try:
            return float("".join(digits))
        except ValueError:
            return None

    @staticmethod
    def extract_number(value: str) -> Optional[float]:
        number = ""
        for char in value:
            if char.isdigit() or char == ".":
                number += char
            elif number:
                break
        return float(number) if number else None

    @staticmethod
    def extract_int(value: str) -> Optional[int]:
        number = ""
        for char in value:
            if char.isdigit():
                number += char
            elif number:
                break
        return int(number) if number else None

    @classmethod
    def scrape_property(cls, *, address: str, city: str, state: str, zip_code: str) -> PropertyMarketData:
        search_url = cls.build_search_url(address, city, state, zip_code)
        html = cls.fetch_page(search_url)
        if not html:
            raise PropertyMarketScraperError("Empty response from source")
        data = cls.parse_market_data(html)
        data.source_url = search_url
        return data

    @classmethod
    def scrape_properties(cls, properties: Iterable[dict]) -> List[PropertyMarketData]:
        results: List[PropertyMarketData] = []
        for property_info in properties:
            try:
                result = cls.scrape_property(**property_info)
                results.append(result)
            except Exception:
                continue
        return results
