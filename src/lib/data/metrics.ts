import { createClient } from "@/lib/supabase/server";
import type { Metric, MetricObservation, MetricWithHistory } from "@/lib/types/metrics";

export async function getMetricsWithHistory(): Promise<MetricWithHistory[]> {
  const supabase = await createClient();

  const { data: metrics, error: metricsError } = await supabase
    .from("metrics")
    .select("*")
    .order("category", { ascending: true });

  if (metricsError || !metrics) {
    console.error("Failed to load metrics:", metricsError);
    return [];
  }

  const { data: observations, error: obsError } = await supabase
    .from("metric_observations")
    .select("*")
    .order("observed_on", { ascending: true });

  if (obsError) {
    console.error("Failed to load observations:", obsError);
  }

  const obsByMetric = new Map<string, MetricObservation[]>();
  for (const obs of observations ?? []) {
    const list = obsByMetric.get(obs.metric_id) ?? [];
    list.push(obs);
    obsByMetric.set(obs.metric_id, list);
  }

  return (metrics as Metric[]).map((metric) => {
    const history = obsByMetric.get(metric.id) ?? [];
    const latest = history.length > 0 ? history[history.length - 1] : null;
    const previous = history.length > 1 ? history[history.length - 2] : null;

    const changeAbs = latest && previous ? latest.value - previous.value : null;
    const changePct =
      latest && previous && previous.value !== 0
        ? ((latest.value - previous.value) / Math.abs(previous.value)) * 100
        : null;

    return {
      ...metric,
      history,
      latest,
      previous,
      changeAbs,
      changePct,
    };
  });
}
