export default (projectlocations, search) => {
  return projectlocations.filter(projectlocation => {
    return (
      projectlocation.locationname &&
      projectlocation.locationname.toLowerCase().includes(search.toLowerCase())
    );
  });
};
