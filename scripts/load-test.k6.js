import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * HIGH-THROUGHPUT RAW POWER LOAD TEST SCRIPT
 *
 * Full-throttle constant VUs with minimal pacing for maximum iterations/sec.
 */
const VUS_COUNT = Number(__ENV.VUS) || 400;             // Default: 400 users
const TEST_DURATION = __ENV.DURATION || '30s';          // Default: 30s
const SLEEP_TIME = Number(__ENV.SLEEP !== undefined ? __ENV.SLEEP : 0.01); // 10ms default pacing

export const options = {
  // Ensure persistent TCP Keep-Alive sockets are actively reused
  noConnectionReuse: false,

  stages: [
    // 2-second quick warm-up (prevents millisecond-0 TCP socket drop)
    { duration: '2s', target: VUS_COUNT },
    // Steady peak load for the test duration
    { duration: TEST_DURATION, target: VUS_COUNT },
  ],

  // Quality of Service thresholds
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<150'],
  },
};

const BASE_URL = 'http://127.0.0.1:8080/api/v1/cities';

export default function () {
  const params = {
    headers: {
      'User-Agent': 'k6-LoadTester/1.0',
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'Connection': 'keep-alive',
    },
    tags: { name: 'GetCities' },
  };

  const res = http.get(BASE_URL, params);

  // Validate response status and payload
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response body received': (r) => r.body && r.body.length > 0,
    'latency is under 150ms': (r) => r.timings.duration < 150,
  });

  // Fast pacing for maximum iterations
  if (SLEEP_TIME > 0) {
    sleep(SLEEP_TIME);
  }
}
