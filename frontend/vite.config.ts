import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@nutricare/user-access": fileURLToPath(new URL("../01-user-access-IT25101803/frontend/src/index.ts", import.meta.url)),
      "@nutricare/appointment-billing": fileURLToPath(new URL("../02-appointment-billing-IT25103681/frontend/src/index.ts", import.meta.url)),
      "@nutricare/health-check": fileURLToPath(new URL("../03-health-check-IT25102636/frontend/src/index.ts", import.meta.url)),
      "@nutricare/diet-progress": fileURLToPath(new URL("../04-diet-progress-IT25101696/frontend/src/index.ts", import.meta.url)),
      "@nutricare/messaging-reminders": fileURLToPath(new URL("../05-messaging-reminders-IT25103601/frontend/src/index.ts", import.meta.url)),
      "@nutricare/feedback-analytics": fileURLToPath(new URL("../06-feedback-analytics-IT25100792/frontend/src/index.ts", import.meta.url)),
    },
  },
  server: { port: 5173 },
  preview: { port: 4173 },
});
