export default (employees, { search, searchBy }) => {
  return employees.filter(employee => {
    return employee[searchBy].toLowerCase().includes(search.toLowerCase());
  });
};
