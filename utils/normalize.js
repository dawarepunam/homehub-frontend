export const normalizeStr = (value) => {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

export const formatLabel = (value) => {
  if (!value) return "";
  const normalized = normalizeStr(value);
  return normalized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
