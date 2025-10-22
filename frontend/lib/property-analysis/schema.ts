import { z } from "zod";

export const CrimeSeverityEnum = z.enum(["Very Low", "Low", "Moderate", "High", "Very High"]);
export const RiskLevelEnum = z.enum(["LOW", "MODERATE", "HIGH", "VERY HIGH"]);
export const VacancyTrendEnum = z.enum(["Rising", "Stable", "Falling"]);
export const MarketDemandEnum = z.enum(["Weak", "Moderate", "Strong", "Very Strong"]);
export const GrowthTrendEnum = z.enum(["Declining", "Stable", "Growing", "Rapidly Growing"]);
export const InvestDecisionEnum = z.enum(["STRONG BUY", "BUY", "HOLD", "AVOID", "STRONG AVOID"]);

export const PropertyAnalysisSchema = z.object({
  property_overview: z.object({
    address: z.string(),
    property_type: z.string(),
    units: z.number().nullable(),
    year_built: z.number().nullable(),
    purchase_price: z.number().nullable(),
    price_per_unit: z.number().nullable(),
    cap_rate: z.number().nullable(),
    occupancy_rate: z.number().nullable(),
    is_hud_property: z.boolean().nullable(),
  }),
  investment_ratings: z.object({
    cap_rate_score: z.number(),
    market_stability_score: z.number(),
    crime_safety_score: z.number(),
    overall_score: z.number(),
  }),
  crime_analysis: z.object({
    risk_level: RiskLevelEnum,
    risk_score: z.number(),
    total_crime_rate: z.number().nullable(),
    violent_crime_rate: z.number().nullable(),
    property_crime_rate: z.number().nullable(),
    theft_rate: z.number().nullable(),
    national_avg_total: z.number().nullable(),
    national_avg_violent: z.number().nullable(),
    national_avg_property: z.number().nullable(),
    national_avg_theft: z.number().nullable(),
    state_avg_total: z.number().nullable(),
    state_avg_violent: z.number().nullable(),
    state_avg_property: z.number().nullable(),
    state_avg_theft: z.number().nullable(),
    victimization_chance: z.union([z.string(), z.literal("DATA_NOT_FOUND")]),
    yoy_crime_change: z.number().nullable(),
    summary: z.string(),
  }),
  crime_breakdown_2023: z.object({
    total_crimes: z.number().nullable(),
    violent_crimes: z.object({
      total: z.number().nullable(),
      murder: z.object({ count: z.number().nullable(), vs_national: z.number().nullable(), severity: CrimeSeverityEnum.nullable() }),
      rape: z.object({ count: z.number().nullable(), vs_national: z.number().nullable(), severity: CrimeSeverityEnum.nullable() }),
      robbery: z.object({ count: z.number().nullable(), vs_national: z.number().nullable(), severity: CrimeSeverityEnum.nullable() }),
      aggravated_assault: z.object({ count: z.number().nullable(), vs_national: z.number().nullable(), severity: CrimeSeverityEnum.nullable() }),
    }),
    property_crimes: z.object({
      total: z.number().nullable(),
      theft_larceny: z.object({ count: z.number().nullable(), vs_national: z.number().nullable(), severity: CrimeSeverityEnum.nullable() }),
      motor_vehicle_theft: z.object({ count: z.number().nullable(), vs_national: z.number().nullable(), severity: CrimeSeverityEnum.nullable() }),
      burglary: z.object({ count: z.number().nullable(), vs_national: z.number().nullable(), severity: CrimeSeverityEnum.nullable() }),
    }),
  }),
  crime_trend_5year: z
    .array(
      z.object({
        year: z.number(),
        total_crimes: z.number().nullable(),
      })
    )
    .length(5),
  crime_type_distribution: z.object({
    theft_larceny_percentage: z.number().nullable(),
    aggravated_assault_percentage: z.number().nullable(),
    motor_vehicle_theft_percentage: z.number().nullable(),
    burglary_percentage: z.number().nullable(),
    rape_percentage: z.number().nullable(),
    robbery_percentage: z.number().nullable(),
    murder_percentage: z.number().nullable(),
  }),
  security_recommendations: z.array(z.string()),
  market_data: z.object({
    median_rent: z.number().nullable(),
    rent_trend_yoy: z.number().nullable(),
    vacancy_rate: z.number().nullable(),
    vacancy_trend: VacancyTrendEnum.nullable(),
    market_demand: MarketDemandEnum.nullable(),
    rental_rates_by_bedroom: z.array(
      z.object({
        type: z.string(),
        avg_rent: z.number().nullable(),
        avg_sqft: z.number().nullable(),
      })
    ),
  }),
  dining_retail_analysis: z.object({
    total_restaurants: z.number().nullable(),
    restaurants_per_1000: z.number().nullable(),
    restaurant_distribution: z.object({
      american: z.number().nullable(),
      fast_food_chains: z.number().nullable(),
      bars_pubs: z.number().nullable(),
      asian: z.number().nullable(),
      mexican: z.number().nullable(),
      other: z.number().nullable(),
    }),
    market_gap: z.union([z.string(), z.literal("DATA_NOT_FOUND")]),
    dominant_categories: z.array(z.string()),
  }),
  economic_indicators: z.object({
    population: z.number().nullable(),
    median_household_income: z.number().nullable(),
    unemployment_rate: z.number().nullable(),
    poverty_rate: z.number().nullable(),
    median_home_value: z.number().nullable(),
    cost_of_living_index: z.number().nullable(),
    major_employers: z.array(z.string()),
    economic_growth_trend: GrowthTrendEnum.nullable(),
  }),
  recommendation: z.object({
    invest_decision: InvestDecisionEnum,
    confidence_level: z.number(),
    key_strengths: z.array(z.string()),
    key_concerns: z.array(z.string()),
    required_actions: z.array(z.string()),
    executive_summary: z.string(),
  }),
});

export type PropertyAnalysis = z.infer<typeof PropertyAnalysisSchema>;

export function clampAnalysisScores(data: PropertyAnalysis): PropertyAnalysis {
  const clamp = (value: number, min: number, max: number) => {
    if (!Number.isFinite(value)) return value;
    return Math.min(Math.max(value, min), max);
  };

  data.investment_ratings.cap_rate_score = clamp(data.investment_ratings.cap_rate_score, 1, 10);
  data.investment_ratings.market_stability_score = clamp(data.investment_ratings.market_stability_score, 1, 10);
  data.investment_ratings.crime_safety_score = clamp(data.investment_ratings.crime_safety_score, 1, 10);
  data.investment_ratings.overall_score = clamp(data.investment_ratings.overall_score, 1, 10);
  data.crime_analysis.risk_score = clamp(data.crime_analysis.risk_score, 1, 5);

  return data;
}



