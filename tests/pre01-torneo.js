import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const serverErrors = new Rate("server_errors");

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_failed: [
      { threshold: "rate<=0.01", abortOnFail: true, delayAbortEval: "5s" },
    ],
    http_req_duration: ["p(95)<=1000"],
    server_errors: [{ threshold: "rate==0", abortOnFail: true }],
    checks: ["rate==1"],
  },
};

const apiUrl = __ENV.DPORTII_API_URL;
const token = __ENV.DPORTII_TEST_TOKEN;

if (apiUrl !== "http://127.0.0.1:3315" || !token) {
  throw new Error("PRE-01 requiere la API local y un token temporal");
}

export default function () {
  const response = http.get(`${apiUrl}/torneo`, {
    headers: { Authorization: `Bearer ${token}` },
    redirects: 0,
    tags: { test_case: "PRE-01" },
  });

  serverErrors.add(response.status >= 500);
  check(response, {
    "GET /torneo responde HTTP 200": (result) => result.status === 200,
  });

  sleep(1);
}
