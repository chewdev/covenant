export const formatPhoneNumber = phonenumber =>
  phonenumber.length === 10
    ? `(${phonenumber.slice(0, 3)}) ${phonenumber.slice(
        3,
        6
      )}-${phonenumber.slice(6)}`
    : phonenumber;
