import type { PropertyAnalysis } from "./schema";

export function createFallbackAnalysis(address: string): PropertyAnalysis {
  return {
    property_overview: {
      address,
      property_type: "Unknown",
      units: null,
      year_built: null,
      purchase_price: null,
      price_per_unit: null,
      cap_rate: null,
      occupancy_rate: null,
      is_hud_property: null,
    },
    investment_ratings: {
      cap_rate_score: 1,
      market_stability_score: 1,
      crime_safety_score: 1,
      overall_score: 1,
    },
    crime_analysis: {
      risk_level: "MODERATE",
      risk_score: 3,
      total_crime_rate: null,
      violent_crime_rate: null,
      property_crime_rate: null,
      theft_rate: null,
      national_avg_total: null,
      national_avg_violent: null,
      national_avg_property: null,
      national_avg_theft: null,
      state_avg_total: null,
      state_avg_violent: null,
      state_avg_property: null,
      state_avg_theft: null,
      victimization_chance: "DATA_NOT_FOUND",
      yoy_crime_change: null,
      summary:
        "We could not locate reliable crime data for this address. Please verify the address or consult local data sources for more precise insights.",
    },
    crime_breakdown_2023: {
      total_crimes: null,
      violent_crimes: {
        total: null,
        murder: { count: null, vs_national: null, severity: null },
        rape: { count: null, vs_national: null, severity: null },
        robbery: { count: null, vs_national: null, severity: null },
        aggravated_assault: { count: null, vs_national: null, severity: null },
      },
      property_crimes: {
        total: null,
        theft_larceny: { count: null, vs_national: null, severity: null },
        motor_vehicle_theft: { count: null, vs_national: null, severity: null },
        burglary: { count: null, vs_national: null, severity: null },
      },
    },
    crime_trend_5year: [
      { year: 2019, total_crimes: null },
      { year: 2020, total_crimes: null },
      { year: 2021, total_crimes: null },
      { year: 2022, total_crimes: null },
      { year: 2023, total_crimes: null },
    ],
    crime_type_distribution: {
      theft_larceny_percentage: null,
      aggravated_assault_percentage: null,
      motor_vehicle_theft_percentage: null,
      burglary_percentage: null,
      rape_percentage: null,
      robbery_percentage: null,
      murder_percentage: null,
    },
    security_recommendations: [
      "Install high-quality security lighting around entrances and parking areas.",
      "Engage with local law enforcement or neighborhood watch groups for regular updates.",
      "Implement controlled access systems such as key fobs or smart locks.",
      "Encourage residents to report suspicious activity promptly via community channels.",
    ],
    market_data: {
      median_rent: null,
      rent_trend_yoy: null,
      vacancy_rate: null,
      vacancy_trend: null,
      market_demand: null,
      rental_rates_by_bedroom: [
        { type: "Studio", avg_rent: null, avg_sqft: null },
        { type: "1 Bedroom", avg_rent: null, avg_sqft: null },
        { type: "2 Bedroom", avg_rent: null, avg_sqft: null },
        { type: "3 Bedroom", avg_rent: null, avg_sqft: null },
      ],
    },
    dining_retail_analysis: {
      total_restaurants: null,
      restaurants_per_1000: null,
      restaurant_distribution: {
        american: null,
        fast_food_chains: null,
        bars_pubs: null,
        asian: null,
        mexican: null,
        other: null,
      },
      market_gap: "DATA_NOT_FOUND",
      dominant_categories: [],
    },
    economic_indicators: {
      population: null,
      median_household_income: null,
      unemployment_rate: null,
      poverty_rate: null,
      median_home_value: null,
      cost_of_living_index: null,
      major_employers: [],
      economic_growth_trend: null,
    },
    recommendation: {
      invest_decision: "HOLD",
      confidence_level: 0,
      key_strengths: [
        "Further due diligence can uncover localized advantages once data is available.",
      ],
      key_concerns: [
        "Insufficient public data available through automated sources to perform a reliable assessment.",
        "Manual outreach to local officials or property managers is required before investment decisions.",
      ],
      required_actions: [
        "Contact local authorities or property management for verified crime and occupancy data.",
        "Conduct on-site inspections to confirm property condition and neighborhood amenities.",
        "Gather rental comps from local brokers or MLS sources for accurate market metrics.",
      ],
      executive_summary:
        "Automated data providers reported insufficient information for this property. Reach out to local data sources, brokers, and municipal records to build a complete investment profile before proceeding.",
    },
  };
}


