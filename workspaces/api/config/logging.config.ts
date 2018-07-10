export const config = {
  logDir: 'logs',
  winston: {
    level: 'debug',
    enableMiddleware: true,
    transports: {
      console: {
        colorize: true,
        timestamp: true,
        json: false,
        showLevel: true,
      },
      file: {
        json: true,
        maxsize: '10485760',
        maxfile: '5',
      },
    },
    target: {
      trace: 'trace.log',
      debug: 'debug.log',
      error: 'error.log',
      warn: 'info.log',
      info: 'info.log',
    },
  },
};
