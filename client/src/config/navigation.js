import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  ListTodo,
  Users,
  Settings,
} from "lucide-react";

export const sidebarNavigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "AI Requirements",
    path: "/requirements",
    icon: Sparkles,
  },
  {
    label: "Tasks",
    path: "/tasks",
    icon: ListTodo,
  },
  {
    label: "Team",
    path: "/team",
    icon: Users,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];