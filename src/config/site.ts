export type SiteConfig = {
  name: string;
  description: string;
  landing?: {
    heroTitle?: string;
    heroDescription?: string;
    features?: Array<{
      title: string;
      description: string;
      icon?: "Zap" | "Users" | "Share2" | "ShieldCheck";
    }>;
    ctaTitle?: string;
    ctaDescription?: string;
  };
  footer?: {
    links?: Array<{ label: string; href: string; external?: boolean }>;
  };
};

export const siteConfig: SiteConfig = {
  name: "ZIPPI",
  description: "Admin + Client updates and changelog sharing platform",
  landing: {
    heroTitle: "Share project updates with clients effortlessly",
    heroDescription:
      "Create projects, publish changelogs, and securely share progress with clients. Collaborate with your team using roles.",
    features: [
      {
        title: "Fast & Server-first",
        description: "Next.js App Router with RSC for complete, fast page loads.",
        icon: "Zap",
      },
      {
        title: "Collaborate with roles",
        description: "Invite teammates as Editors/Viewers per project.",
        icon: "Users",
      },
      {
        title: "Share securely",
        description: "Public links with optional password, visibility, and tag filters.",
        icon: "Share2",
      },
      {
        title: "Reliable & safe",
        description: "Type-safe endpoints with validation and consistent errors.",
        icon: "ShieldCheck",
      },
    ],
    ctaTitle: "Start sharing updates today",
    ctaDescription: "Create your first project and invite collaborators. It only takes a minute.",
  },
  footer: {
    links: [
      { label: "Home", href: "/" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "GitHub", href: "https://github.com/", external: true },
    ],
  },
};
