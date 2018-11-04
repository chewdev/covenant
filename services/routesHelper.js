module.exports.allowOnly = function(accessLevel, callback) {
  function checkUserRole(req, res) {
    if (!(accessLevel & req.user.role)) {
      res.status(403).json({ forbidden: "Access forbidden" });
      return;
    }

    callback(req, res);
  }

  return checkUserRole;
};
