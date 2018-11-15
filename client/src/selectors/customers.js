export default (customers, { search }) => {
  return customers.filter(customer => {
    return customer.company.toLowerCase().includes(search.toLowerCase());
  });
};
