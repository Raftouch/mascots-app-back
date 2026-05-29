function isAdmin(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Not allowed" });
}

module.exports = { isAdmin };
