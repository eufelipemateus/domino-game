module.exports = {
  apps : [{
    name   : "domino-game",
    script : "./dist/Server.js",
    log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
		watch: true,
		kill_timeout: 10000,
		max_memory_restart: '512M',
		instances: 1,
		autorestart: true,
		env: {
				PORT: '8000',
        DEBUG: false,
        NODE_ENV: 'production'
		},
  }]
}

