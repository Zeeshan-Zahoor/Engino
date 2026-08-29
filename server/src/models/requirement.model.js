import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
    },

    aiStatus: {
      type: String,
      required: true,
    },

    complexity: {
      type: String,
      required: true,
    },

    estimatedEffortMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    aiConfidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    acceptanceCriteria: {
      type: [String],
      default: [],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Requirement = mongoose.model("Requirement", requirementSchema);

export default Requirement;