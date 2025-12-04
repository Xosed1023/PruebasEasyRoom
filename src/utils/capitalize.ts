export const capitalize = (value?: string | null) => {
  if (value == null) return "";
  const s = String(value).trim();
  if (!s) return "";
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};
