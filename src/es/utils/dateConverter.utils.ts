export const currentDateConverter = (currentTime: Date) => {
  currentTime.setHours(currentTime.getHours() + 9);
  const dateString = currentTime.toISOString().substring(0, 10);

  return dateString;
};
