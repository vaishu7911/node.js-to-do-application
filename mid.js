const jwt = require("jsonwebtoken");

const mid1 = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ status: false, message: "JWT Token must be present" });

    const splittoken = token.split(' ');
    jwt.verify(splittoken[1], "manu@07", (err, decode) => {
      if (err) {
        return res.status(401).json({ status: false, message: err.message });
      } else {
        req.decodeToken = decode;
        next();
      }
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = { mid1 };