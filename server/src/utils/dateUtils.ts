export const getCurrentDate = (): string | undefined => {
  return new Date().toISOString().split("T")[0];
};
