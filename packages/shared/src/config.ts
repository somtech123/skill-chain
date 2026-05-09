export const config = {
  dev: {
    BACKEND_URL: "http://localhost:3001",
    FRONTEND_URL: "http://localhost:3000",
  },
};

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? config.dev.BACKEND_URL;
