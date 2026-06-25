import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  storeName: process.env.STORE_NAME || 'MiTiendaOnline',
  maintenance: process.env.MAINTENANCE === 'true',
  workers: Number(process.env.CLUSTER_WORKERS) || 2,
  isProd: process.env.NODE_ENV === 'production',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/backend3-ecommerce',
  mongoUriTest: process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/backend3-ecommerce-test',
  seedDb: process.env.SEED_DB === 'true',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  sessionSecret: process.env.SESSION_SECRET || 'super-secret-session-key',
  githubClientId: process.env.GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  githubCallbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:8080/auth/github/callback',
  processMode: process.env.PROCESS_MODE || 'NORMAL',
  configLevel: process.env.CONFIG_LEVEL || 'low',
  simulationMode: process.env.SIMULATION_MODE || 'normal',
};
