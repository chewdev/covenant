export const treatAsUTC = date => {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
};

export const timeBetween = (startDate, endDate) => {
  let hoursBetween = Math.round(
    (treatAsUTC(endDate) - treatAsUTC(startDate)) / 3600000
  );
  if (hoursBetween >= 24) {
    return `${Math.floor(hoursBetween / 24)} Days Ago`;
  } else {
    return `${hoursBetween} Hours Ago`;
  }
};
