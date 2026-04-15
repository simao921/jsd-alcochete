import type { DashboardSnapshot, ProgressPoint } from "@/types";
import { readJson, writeJson } from "@/services/storage/offlineCache";

const DASHBOARD_KEY = "nutriai-dashboard";
const WEIGHT_LOG_KEY = "nutriai-weight-log";

export const saveDashboardSnapshot = async (snapshot: DashboardSnapshot) => {
  await writeJson(DASHBOARD_KEY, snapshot);
};

export const loadDashboardSnapshot = async (fallback: DashboardSnapshot) => {
  return readJson(DASHBOARD_KEY, fallback);
};

export const saveWeightLog = async (points: ProgressPoint[]) => {
  await writeJson(WEIGHT_LOG_KEY, points);
};

export const loadWeightLog = async (fallback: ProgressPoint[]) => {
  return readJson(WEIGHT_LOG_KEY, fallback);
};
