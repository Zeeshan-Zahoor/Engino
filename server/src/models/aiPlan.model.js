import mongoose from "mongoose";

const aiPlanSchema = new mongoose.Schema(
  {
    requirementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement",
      required: true,
    },

    generatedBy: {
      type: String,
      enum: ["AI", "User"],
      required: true,
    },

    status: {
        type: String,
        enum: ["Generated", "Under Review", "Approved"],
        default: "Generated",
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    version: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

aiPlanSchema.index({ requirementId: 1 });

const AIPlan = mongoose.model("AIPlan", aiPlanSchema);

export default AIPlan;