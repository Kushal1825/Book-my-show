module.exports = {
  apps: [
    {
      name: 'bms-backend',
      script: './dist/server.js',

      // Run in cluster mode
      instances: 2,
      exec_mode: 'cluster',

      // Auto-restart if any instance crashes
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,

      // Maximum memory threshold per worker before auto-restart
      max_memory_restart: '300M',

      // Force Round-Robin connection scheduling on Windows
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        NODE_CLUSTER_SCHED_POLICY: 'rr',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NODE_CLUSTER_SCHED_POLICY: 'rr',
      },
    },
  ],
};
