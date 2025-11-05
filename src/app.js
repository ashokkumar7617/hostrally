import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import { runSyncJobs } from "./services/syncManager.js"; // We'll define this next

dotenv.config();
const app = express();

app.get("/", (req, res) => res.send("Unified Host Tool is running! ✅"));

// Manual sync endpoint (Render cron can call this)
app.get("/api/sync", async (req, res) => {
  await runSyncJobs();
  res.send("Manual sync triggered");
});

// Background job (every X minutes)
cron.schedule(`*/${process.env.SYNC_INTERVAL_MINUTES || 15} * * * *`, async () => {
  console.log("Running scheduled sync...");
  await runSyncJobs();
});

app.listen(process.env.PORT || 4000, () =>
  console.log(`Server running on port ${process.env.PORT || 4000}`)
);
