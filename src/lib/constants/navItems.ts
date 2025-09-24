export type NavItem = {
  label: string;
  href: string;
};

export const appNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Projects", href: "/projects" },
  { label: "Share Links", href: "/share" },
];
