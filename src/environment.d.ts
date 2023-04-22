export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "staging";
      MONGODB_USER: string;
      MONGODB_PASSWORD: string;
      MONGODB_DATABASE: string;
      MONGODB_CONNECT_STRING: string;
      JWT_SECRET: string;
    }
  }
}
