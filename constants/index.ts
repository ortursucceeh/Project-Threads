import { TabsType } from "@/types/thread.types";

export const sidebarLinks = [
  {
    image: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    image: "/assets/search.svg",
    route: "/search",
    label: "Search",
  },
  {
    image: "/assets/heart.svg",
    route: "/activity",
    label: "Activity",
  },
  {
    image: "/assets/create.svg",
    route: "/create-thread",
    label: "Create Thread",
  },
  {
    image: "/assets/community.svg",
    route: "/communities",
    label: "Communities",
  },
  {
    image: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs: { value: TabsType; label: string; icon: string }[] = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
];
