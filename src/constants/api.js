import { isProduction } from "./staticData";
export const BASE_URL = isProduction
  ? "https://api-production.com"
  : "https://api-test.com";
