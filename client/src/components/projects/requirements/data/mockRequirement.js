export const workflowSteps = [
  {
    id: "requirement",
    label: "Requirement",
  },
  {
    id: "analysis",
    label: "AI Analysis",
  },
  {
    id: "plan",
    label: "AI Plan",
  },
  {
    id: "review",
    label: "Admin Review",
  },
  {
    id: "tasks",
    label: "Tasks",
  },
];

export const mockRequirement = {
  id: "REQ-001",

  name: "User Authentication",

  projectName: "Student Portal",

  status: "Needs Clarification",

  updated: "58 minutes ago",

  description:
    "Users should be able to securely log into the student portal using their registered credentials.",

  owner: {
    name: "Zeeshan Zahoor",
    initials: "ZZ",
  },

  complexity: "Medium",

  created: "Sep 11, 2026",

  acceptanceCriteria: [
    "Users should be able to log in using their registered email and password.",
    "Invalid credentials should display an appropriate error message.",
    "Users should remain authenticated while using the portal.",
    "Users should be able to log out securely.",
  ],

  aiAnalysis: {
    status: "Needs Clarification",

    clarity: 72,

    summary:
      "The requirement describes a basic authentication flow, but several implementation and security details are not specified. Clarification is required before generating the final engineering plan.",

    findings: [
      {
        type: "Missing Information",
        title: "Authentication method",
        description:
          "The requirement does not specify whether authentication should use sessions, JWT, OAuth, or another mechanism.",
      },
      {
        type: "Ambiguity",
        title: "Password requirements",
        description:
          "Minimum password requirements and validation rules are not defined.",
      },
      {
        type: "Missing Information",
        title: "Account recovery",
        description:
          "It is unclear whether users should be able to reset or recover forgotten passwords.",
      },
    ],
  },

  clarificationQuestions: [
    {
      id: 1,
      question:
        "Which authentication mechanism should be used: session-based authentication, JWT, OAuth, or another approach?",
      answer: null,
      status: "pending",
    },
    {
      id: 2,
      question:
        "What password requirements should be enforced?",
      answer: null,
      status: "pending",
    },
    {
      id: 3,
      question:
        "Should users be able to reset their password if they forget it?",
      answer: null,
      status: "pending",
    },
  ],

  plannedTasks: [
    {
      id: "TASK-001",
      title: "Create authentication API",
      type: "Backend",
      complexity: "Medium",
      assignee: "Unassigned",
      status: "Planned",
    },
    {
      id: "TASK-002",
      title: "Build login interface",
      type: "Frontend",
      complexity: "Medium",
      assignee: "Unassigned",
      status: "Planned",
    },
    {
      id: "TASK-003",
      title: "Implement authentication state",
      type: "Frontend",
      complexity: "Medium",
      assignee: "Unassigned",
      status: "Planned",
    },
  ],

  activity: [
    {
      id: 1,
      type: "requirement_created",
      title: "Requirement created",
      description: "The requirement was added to the project.",
      time: "1 hour ago",
    },
    {
      id: 2,
      type: "ai_analysis",
      title: "AI analysis completed",
      description:
        "Engino AI analyzed the requirement and identified missing information.",
      time: "58 minutes ago",
    },
    {
      id: 3,
      type: "clarification_requested",
      title: "Clarification requested",
      description:
        "Engino AI requested additional information before creating the plan.",
      time: "57 minutes ago",
    },
  ],
};