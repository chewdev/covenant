import { priorityMap } from "../components/project/projectSelectOptions";

export default (projects, { search, searchBy, sortBy }) => {
  return projects
    .filter(project => {
      if (searchBy === "customer") {
        return project.customer.company
          .toLowerCase()
          .includes(search.toLowerCase());
      } else {
        return project[searchBy].toLowerCase().includes(search.toLowerCase());
      }
    })
    .sort((a, b) => {
      if (sortBy === "datenew") {
        return Date(a.date) < Date(b.date) ? -1 : 1;
      } else if (sortBy === "dateold") {
        return Date(a.date) < Date(b.date) ? 1 : -1;
      } else {
        return priorityMap[a.currentstatus] < priorityMap[b.currentstatus]
          ? -1
          : 1;
      }
    });
};
