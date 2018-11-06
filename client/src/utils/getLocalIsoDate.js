const getLocalIsoDate = providedDate => {
  let date = providedDate ? new Date(providedDate) : new Date();
  date = new Date(date - date.getTimezoneOffset() * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  return date;
};

export default getLocalIsoDate;
