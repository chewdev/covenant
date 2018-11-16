export default (schedules, projects, { search }) => {
  return schedules.filter(schedule => {
    return projects
      .find(project => project._id === schedule.project)
      .projectname.toLowerCase()
      .includes(search.toLowerCase());
  });
};
