import { ROLES } from "./roles";

export const sidebarLinks = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    id: 2,
    name: "Admin Management",
    path: "admins",
    icon: "UserCheck",
    role: ROLES.SUPER_ADMIN,
  },
  {
    id: 3,
    name: "Student Management",
    path: "students",
    icon: "Users",
  },
  {
    id: 4,
    name: "Class Management",
    path: "classes",
    icon: "GraduationCap",
  },
  {
    id: 5,
    name: "Subject Management",
    path: "subjects",
    icon: "BookOpen",
  },
  {
    id: 6,
    name: "Chapter Management",
    path: "chapters",
    icon: "FileText",
  },
  {
    id: 7,
    name: "Subscription",
    path: "subscriptions",
    icon: "CreditCard",
  },
  // {
  //   id: 4,
  //   name: "Audio Lectures",
  //   path: "audio-lectures",
  //   icon: "Headphones",
  // },
  // {
  //   id: 5,
  //   name: "Keyword Revision",
  //   path: "keywords",
  //   icon: "KeyRound",
  // },
  // {
  //   id: 6,
  //   name: "MCQ Practice",
  //   path: "mcqs",
  //   icon: "NotebookPen",
  // },
];
