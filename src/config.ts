const configuration = () => ({
  PORT: parseInt(process.env.PORT as string, 10) || 8080,
  MONGO_CONNECTION_URL: process.env.MONGO_CONNECTION_URL,
});

export default configuration;
