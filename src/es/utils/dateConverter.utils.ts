export const currentDateConverter = (currentTime: Date) => {
  // const year = currentTime.getFullYear();
  // const month = ('0' + (currentTime.getMonth() + 1)).slice(-2);
  // const day = ('0' + currentTime.getDate()).slice(-2);

  // const dateString = year + '-' + month + '-' + day;

  currentTime.setHours(currentTime.getHours() + 9);
  const dateString = currentTime.toISOString().substring(0, 10);

  return dateString;
};
