import dotenv from "dotenv";

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeEnvUrl = (value?: string): string => {
  if (!value) return "";
  return value.replace(/^"(.*)"$/, "$1");
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: toNumber(process.env.PORT, 3000),
  databaseUrl: normalizeEnvUrl(process.env.DATABASE_URL),
};
