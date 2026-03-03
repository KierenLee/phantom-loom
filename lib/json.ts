import { jsonrepair } from "jsonrepair";

export const safeParseJson = (json: string, fallback?: unknown) => {
  try {
    const removePrefix = json
      .trim()
      .replace(/^[^\[\{}]+/g, "")
      .replace(/[^\[\{}]+$/g, "");

    const result = JSON.parse(jsonrepair(removePrefix));
    return result;
  } catch (e) {
    return fallback;
  }
};
