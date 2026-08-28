export const tasks = [
  {
    id: "task-001",
    projectId: "PRJ-001",
    requirementId: "req-001",

    title: "Set up authentication system",
    description:
      "Implement the authentication and authorization system for students and administrators.",

    status: "Completed",
    priority: "High",

    assignee: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    reporter: {
      id: "user-003",
      name: "Areeb",
      initials: "AR",
    },

    dueDate: "Sept 12, 2026",

    effort: "8h",
    timeSpent: "8h",
    progress: 100,

    type: "Development",
    complexity: "Medium",

    tags: ["backend", "authentication", "authorization"],
  },

  {
    id: "task-002",
    projectId: "PRJ-001",
    requirementId: "req-002",

    title: "Design student dashboard",
    description:
      "Design and implement the student dashboard and profile interface.",

    status: "Completed",
    priority: "High",

    assignee: {
      id: "user-002",
      name: "Ganga",
      initials: "GA",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 16, 2025",

    effort: "6h",
    timeSpent: "6h",
    progress: 100,

    type: "Design",
    complexity: "Medium",

    tags: ["frontend", "ui", "dashboard"],
  },

  {
    id: "task-003",
    projectId: "PRJ-001",
    requirementId: "req-003",

    title: "Implement attendance module",
    description:
      "Develop the attendance management functionality for recording and retrieving student attendance.",

    status: "In Progress",
    priority: "High",

    assignee: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    reporter: {
      id: "user-003",
      name: "Areeb",
      initials: "AR",
    },

    dueDate: "May 20, 2025",

    effort: "10h",
    timeSpent: "6h",
    progress: 60,

    type: "Development",
    complexity: "High",

    tags: ["backend", "api", "attendance"],
  },

  {
    id: "task-004",
    projectId: "PRJ-001",
    requirementId: "req-004",

    title: "Build assignment management",
    description:
      "Implement assignment creation, management, and submission functionality.",

    status: "In Progress",
    priority: "Medium",

    assignee: {
      id: "user-003",
      name: "Areeb",
      initials: "AR",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 22, 2025",

    effort: "8h",
    timeSpent: "3h 36m",
    progress: 45,

    type: "Development",
    complexity: "Medium",

    tags: ["backend", "assignments", "api"],
  },

  {
    id: "task-005",
    projectId: "PRJ-001",
    requirementId: "req-005",

    title: "Implement notification system",
    description:
      "Develop the notification system for delivering important updates to students.",

    status: "Todo",
    priority: "Medium",

    assignee: {
      id: "user-004",
      name: "Ahmed Khan",
      initials: "AK",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 25, 2025",

    effort: "6h",
    timeSpent: "0h",
    progress: 0,

    type: "Development",
    complexity: "Medium",

    tags: ["backend", "notifications"],
  },

  {
    id: "task-006",
    projectId: "PRJ-002",
    requirementId: "req-006",

    title: "Create book catalog",
    description:
      "Build the book catalog management functionality for the library system.",

    status: "Completed",
    priority: "High",

    assignee: {
      id: "user-005",
      name: "Sara Khan",
      initials: "SK",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 18, 2025",

    effort: "8h",
    timeSpent: "8h",
    progress: 100,

    type: "Development",
    complexity: "Medium",

    tags: ["backend", "books", "catalog"],
  },

  {
    id: "task-007",
    projectId: "PRJ-002",
    requirementId: "req-007",

    title: "Implement member management",
    description:
      "Implement functionality for creating, updating, and managing library members.",

    status: "In Progress",
    priority: "Medium",

    assignee: {
      id: "user-006",
      name: "Rahul Sharma",
      initials: "RS",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 24, 2025",

    effort: "7h",
    timeSpent: "3h 51m",
    progress: 55,

    type: "Development",
    complexity: "Low",

    tags: ["backend", "members"],
  },

  {
    id: "task-008",
    projectId: "PRJ-002",
    requirementId: "req-008",

    title: "Implement borrowing workflow",
    description:
      "Develop the workflow for borrowing and returning books in the library system.",

    status: "Todo",
    priority: "High",

    assignee: {
      id: "user-005",
      name: "Sara Khan",
      initials: "SK",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 30, 2025",

    effort: "10h",
    timeSpent: "0h",
    progress: 0,

    type: "Development",
    complexity: "High",

    tags: ["backend", "borrowing", "workflow"],
  },

  {
    id: "task-009",
    projectId: "PRJ-003",
    requirementId: "req-009",

    title: "Create customer database",
    description:
      "Set up the customer data model and implement customer management functionality.",

    status: "Completed",
    priority: "High",

    assignee: {
      id: "user-007",
      name: "Aman Gupta",
      initials: "AG",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 12, 2025",

    effort: "7h",
    timeSpent: "7h",
    progress: 100,

    type: "Development",
    complexity: "Medium",

    tags: ["backend", "database", "customers"],
  },

  {
    id: "task-010",
    projectId: "PRJ-003",
    requirementId: "req-010",

    title: "Build sales pipeline",
    description:
      "Develop the sales pipeline for tracking and managing customer opportunities.",

    status: "In Progress",
    priority: "High",

    assignee: {
      id: "user-008",
      name: "Priya Singh",
      initials: "PS",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 22, 2025",

    effort: "9h",
    timeSpent: "5h 51m",
    progress: 65,

    type: "Development",
    complexity: "High",

    tags: ["frontend", "sales", "pipeline"],
  },

  {
    id: "task-011",
    projectId: "PRJ-004",
    requirementId: "req-014",

    title: "Complete payment integration",
    description:
      "Integrate the payment processing system into the e-commerce application.",

    status: "Completed",
    priority: "High",

    assignee: {
      id: "user-010",
      name: "Arjun Nair",
      initials: "AN",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 01, 2025",

    effort: "10h",
    timeSpent: "10h",
    progress: 100,

    type: "Development",
    complexity: "High",

    tags: ["backend", "payment", "integration"],
  },

  {
    id: "task-012",
    projectId: "PRJ-004",
    requirementId: "req-012",

    title: "Deploy production application",
    description:
      "Prepare and deploy the completed application to the production environment.",

    status: "Completed",
    priority: "High",

    assignee: {
      id: "user-011",
      name: "Neha Verma",
      initials: "NV",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "May 18, 2025",

    effort: "6h",
    timeSpent: "6h",
    progress: 100,

    type: "Deployment",
    complexity: "Medium",

    tags: ["deployment", "production", "devops"],
  },

  {
    id: "task-013",
    projectId: "PRJ-005",
    requirementId: "req-015",

    title: "Design attendance workflow",
    description:
      "Design the workflow for recording and managing attendance data.",

    status: "Todo",
    priority: "Medium",

    assignee: {
      id: "user-012",
      name: "Imran Ali",
      initials: "IA",
    },

    reporter: {
      id: "user-001",
      name: "Zeeshan Zahoor",
      initials: "ZZ",
    },

    dueDate: "Jun 08, 2025",

    effort: "5h",
    timeSpent: "0h",
    progress: 0,

    type: "Design",
    complexity: "Medium",

    tags: ["attendance", "workflow", "design"],
  },
];