import mongoose from "mongoose";

const TripPlanSchema = new mongoose.Schema({
  userId: { type: String },  // If you plan to add user accounts
  destination: String,
  dates: [String],           // Could be ["2025-06-01", "2025-06-07"] or {start, end}
  people: Number,
  budget: Number,
  preferences: [String],
  answers: Object,
  itinerary: Object,         // Or [Object] for day-by-day events
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TripPlan || mongoose.model("TripPlan", TripPlanSchema);
