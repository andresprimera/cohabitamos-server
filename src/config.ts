const configuration = () => ({
  PORT: parseInt(process.env.PORT as string, 10) || 8080,
  MONGO_CONNECTION_URL: process.env.MONGO_CONNECTION_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  FIREBASE_CREDENTIALS: process.env.FIREBASE_CREDENTIALS,
});

export default configuration;
