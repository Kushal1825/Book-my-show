import http from 'node:http';
import { performance } from 'node:perf_hooks';

/**
 * Load Test Configuration
 * Concurrency: 100 concurrent simulated users (safely within Atlas M0 limits)
 * Duration: 60 seconds
 */
const CONFIG = {
  url: 'http://127.0.0.1:3000/api/v1/cities',
  concurrency: 100,
  durationSeconds: 60,
};

interface TestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  latencies: number[];
  startTime: number;
  endTime: number;
}

const metrics: TestMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  latencies: [],
  startTime: 0,
  endTime: 0,
};

// Reusable HTTP Agent with Keep-Alive for accurate high-throughput simulation
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: CONFIG.concurrency,
});

function makeRequest(): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    metrics.totalRequests++;

    const req = http.get(
      CONFIG.url,
      {
        agent,
        headers: {
          'Connection': 'keep-alive',
          'User-Agent': 'BookMyShow-LoadTester/1.0',
        },
      },
      (res) => {
        // Drain incoming response body to reuse the socket
        res.on('data', () => {});
        res.on('end', () => {
          const duration = performance.now() - start;
          metrics.latencies.push(duration);

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            metrics.successfulRequests++;
          } else {
            metrics.failedRequests++;
          }
          resolve();
        });
      },
    );

    req.on('error', () => {
      metrics.failedRequests++;
      resolve();
    });

    // Request timeout handled on the request instance
    req.setTimeout(10000, () => {
      req.destroy();
      metrics.failedRequests++;
      resolve();
    });
  });
}

async function runWorker(stopTime: number): Promise<void> {
  while (Date.now() < stopTime) {
    await makeRequest();
  }
}

function calculatePercentile(sorted: number[], percentile: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)] ?? 0;
}

async function startLoadTest(): Promise<void> {
  console.log('====================================================');
  console.log('   BookMyShow Backend — 1-Minute Stress Test       ');
  console.log('====================================================');
  console.log(`Target Endpoint : ${CONFIG.url}`);
  console.log(`Concurrent Users: ${CONFIG.concurrency}`);
  console.log(`Duration        : ${CONFIG.durationSeconds} seconds`);
  console.log(`Database Target : MongoDB Atlas Cloud\n`);

  metrics.startTime = Date.now();
  const stopTime = metrics.startTime + CONFIG.durationSeconds * 1000;

  // Progress ticker every 10 seconds
  const interval = setInterval(() => {
    const elapsed = Math.round((Date.now() - metrics.startTime) / 1000);
    const rps = elapsed > 0 ? (metrics.successfulRequests / elapsed).toFixed(1) : '0';
    console.log(
      `[${elapsed}s / ${CONFIG.durationSeconds}s] Completed: ${metrics.successfulRequests} reqs | Rate: ${rps} req/sec | Failed: ${metrics.failedRequests}`,
    );
  }, 10000);

  // Launch workers in parallel
  const workers = Array.from({ length: CONFIG.concurrency }, () => runWorker(stopTime));
  await Promise.all(workers);

  clearInterval(interval);
  metrics.endTime = Date.now();

  const totalTimeSeconds = (metrics.endTime - metrics.startTime) / 1000;
  const sortedLatencies = [...metrics.latencies].sort((a, b) => a - b);
  const avgLatency =
    sortedLatencies.length > 0
      ? sortedLatencies.reduce((acc, curr) => acc + curr, 0) / sortedLatencies.length
      : 0;

  const minLatency = sortedLatencies.length > 0 ? (sortedLatencies[0] ?? 0) : 0;
  const maxLatency =
    sortedLatencies.length > 0 ? (sortedLatencies[sortedLatencies.length - 1] ?? 0) : 0;
  const p50 = calculatePercentile(sortedLatencies, 50);
  const p95 = calculatePercentile(sortedLatencies, 95);
  const p99 = calculatePercentile(sortedLatencies, 99);
  const rps = (metrics.successfulRequests / totalTimeSeconds).toFixed(2);

  console.log('\n====================================================');
  console.log('              BENCHMARK RESULTS                     ');
  console.log('====================================================');
  console.log(`Total Duration        : ${totalTimeSeconds.toFixed(2)}s`);
  console.log(`Total Requests Sent   : ${metrics.totalRequests}`);
  console.log(`Successful (200 OK)   : ${metrics.successfulRequests}`);
  console.log(`Failed / Errors       : ${metrics.failedRequests}`);
  console.log(`Throughput (RPS)      : ${rps} req/sec`);
  console.log('----------------------------------------------------');
  console.log('Latency Statistics:');
  console.log(`  Min Latency         : ${minLatency.toFixed(2)} ms`);
  console.log(`  Average Latency     : ${avgLatency.toFixed(2)} ms`);
  console.log(`  50th Percentile (p50): ${p50.toFixed(2)} ms`);
  console.log(`  95th Percentile (p95): ${p95.toFixed(2)} ms`);
  console.log(`  99th Percentile (p99): ${p99.toFixed(2)} ms`);
  console.log(`  Max Latency         : ${maxLatency.toFixed(2)} ms`);
  console.log('====================================================\n');
}

void startLoadTest();
