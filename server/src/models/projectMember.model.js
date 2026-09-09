import mongoose from "mongoose";

const projectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: [
        "Project Manager",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "UI/UX Designer",
        "QA Tester",
        "DevOps Engineer",
        "AI Engineer",
        "Developer",
        "Other"
    ],
      required: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

projectMemberSchema.index(
  { projectId: 1, userId: 1 },
  { unique: true }
);

const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMemberSchema
);

export default ProjectMember;