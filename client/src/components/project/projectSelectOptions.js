export const searchOptions = [
  {
    label: "Project Name",
    value: "projectname"
  },
  {
    label: "Customer Name",
    value: "customer"
  },
  {
    label: "Current Status",
    value: "currentstatus"
  }
];

export const sortOptions = [
  {
    label: "Last Updated - Newest",
    value: "datenew"
  },
  {
    label: "Last Updated - Oldest",
    value: "dateold"
  },
  {
    label: "Priority",
    value: "priority"
  }
];

export const showCompletedOptions = [
  {
    label: "Not Completed",
    value: "notcomplete"
  },
  {
    label: "Completed",
    value: "complete"
  },
  {
    label: "All",
    value: "all"
  }
];

export const priorityMap = {
  "Request Received": 0,
  "Needs Bid- Simple": 1,
  "Needs Bid- Complicated": 2,
  "Bid Sent- Awaiting Approval": 3,
  "Need To Order Parts": 4,
  "Waiting on Parts": 5,
  "Need To Schedule": 6,
  "Scheduled- Waiting": 7,
  "Needs Invoice": 8,
  "Invoiced- Awaiting Payment": 9,
  Completed: 10
};
