// types/PhonePlan.ts

export interface PhonePlan {
  provider: string;
  plan_details: {
    price_per_month: number;
    hotspot_data: string;
    international: string;
    network_options: string[];
    plan_type: string;
  };
  link: string;
  coverage_map: string;
}
