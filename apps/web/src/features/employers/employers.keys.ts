export const employersKeys = {
  all: ["employers"] as const,
  list: () => [...employersKeys.all, "list"] as const,
};
