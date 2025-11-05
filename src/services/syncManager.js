import { pool } from "../db/index.js";
import { syncAirbnbListing } from "./airbnbService.js";
import { syncVrboListing } from "./vrboService.js";

export async function runSyncJobs() {
  try {
    const { rows: listings } = await pool.query("SELECT * FROM listings");

    for (const listing of listings) {
      if (listing.platform === "airbnb") {
        await syncAirbnbListing(listing);
      } else if (listing.platform === "vrbo") {
        await syncVrboListing(listing);
      }
    }

    console.log("✅ Sync complete at", new Date());
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
  }
}
