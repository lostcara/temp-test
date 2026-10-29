import type { FilterQuery } from "mongoose";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const applyFuzzySearch = <T>(
  filter: FilterQuery<T>,
  field: keyof T | string,
  keyword?: string | null
) => {
  if (!keyword) {
    return filter;
  }

  return Object.assign(filter, {
    [field as string]: {
      $regex: escapeRegex(keyword),
      $options: "i",
    },
  });
};
