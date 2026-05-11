export const config = {
  dev: {
    BACKEND_URL: "http://localhost:3002",
    FRONTEND_URL: "http://localhost:3000",
  },
};

export const BACKEND_URL = process.env.BACKEND_URL ?? config.dev.BACKEND_URL;
