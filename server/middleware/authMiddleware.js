const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // gets token after 'Bearer '
  console.log("Received Token:", token);

  if (!token) return res.status(403).json({ msg: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded data for later use
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired, please log in again" });
    }
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = verifyToken;

