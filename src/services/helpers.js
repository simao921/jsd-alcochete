export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const generateId = (prefix = "id") => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
};

export const formatDate = (value, options = {}) => {
  if (!value) return "Data não definida";
  const d = new Date(value);
  if (isNaN(d.valueOf())) return "Data inválida";
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options
  }).format(d);
};

export const formatCompactDate = (value) => {
  if (!value) return "--";
  const d = new Date(value);
  if (isNaN(d.valueOf())) return "--";
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short"
  }).format(d);
};

export const formatDateTime = (value) => {
  if (!value) return "S/ Data";
  const d = new Date(value);
  if (isNaN(d.valueOf())) return "Data inválida";
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(d);
};

export const sortByNewest = (items, key) =>
  [...items].sort((left, right) => new Date(right[key]).getTime() - new Date(left[key]).getTime());

export const normaliseText = (value = "") => value.trim().toLowerCase();

export const createAvatarPlaceholder = (name, primary = "#FF9900", secondary = "#A84F00") =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
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
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="54" font-weight="700">${name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}</text>
    </svg>
  `)}`;
