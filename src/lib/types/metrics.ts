export type MetricCategory = "monetary" | "fx" | "markets" | "external" | "growth";

export interface Metric {
  id: string;
  label: string;
  unit: string;
  category: MetricCategory;
  source: string | null;
  source_url: string | null;
  decimals: number;
  higher_is_better: boolean | null;
}

export interface MetricObservation {
  id: string;
  metric_id: string;
  observed_on: string; // ISO date
  value: number;
  note: string | null;
}

export interface MetricWithHistory extends Metric {
  history: MetricObservation[];
  latest: MetricObservation | null;
  previous: MetricObservation | null;
  changeAbs: number | null;
  changePct: number | null;
}
