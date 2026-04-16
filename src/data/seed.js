const toDataUri = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const createAvatar = (name, primary, secondary) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="100%" stop-color="${secondary}" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="48" fill="url(#grad)" />
      <circle cx="120" cy="94" r="42" fill="rgba(255,255,255,0.18)" />
      <path d="M56 198c16-34 42-50 64-50s48 16 64 50" fill="rgba(255,255,255,0.16)" />
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="54" font-weight="700">${initials}</text>
    </svg>
  `);
};

export const teamSeed = [];
export const newsSeed = [];
export const eventsSeed = [];
export const membersSeed = [];
export const joinRequestsSeed = [];

export const navigationLinks = [
  { to: "/", label: "Home" },
  { to: "/sobre", label: "Quem Somos" },
  { to: "/noticias", label: "Notícias" },
  { to: "/eventos", label: "Eventos" },
  { to: "/junta-te", label: "Junta-te" }
];

export const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/jsd.alcochete/", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/jsd.alcochete/", icon: "instagram" }
];

export const seedData = {
  news: newsSeed,
  events: eventsSeed,
  team: teamSeed,
  members: membersSeed,
  joinRequests: joinRequestsSeed
};
