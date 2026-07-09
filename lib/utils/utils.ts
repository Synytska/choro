//Get only first two letters of name
export const getInitials = (name: string) => {
  if (!name) return;

  return name.slice(0, 2).toUpperCase();
};
