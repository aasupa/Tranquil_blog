// import jwt from "jsonwebtoken";

// export const verifyToken = async (req, res, next) => {
//   try {
//     let token = req.header("Authorization");

//     if (!token) {
//       console.log("No token provided");
//       return res.status(403).send("Access Denied");
//     }

//     if (token.startsWith("Bearer ")) {
//       token = token.slice(7, token.length).trimLeft();
//     }

//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Verified token:", verified);
//     req.user = verified.id;
//     console.log("User ID set in req.user:", req.user);
//     next();
//   } catch (err) {
//     console.log("Error verifying token:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      console.log("No token provided");
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified token:", verified);

    // Attach user ID from token payload to request object
    req.user = verified.id;
    console.log("User ID set in req.user:", req.user);

    next(); // Move to the next middleware or route handler
  } catch (err) {
    console.error("Error verifying token:", err.message);

    if (err.name === "JsonWebTokenError") {
      // Invalid token or malformed token
      return res.status(401).json({ error: "Invalid token" });
    }

    if (err.name === "TokenExpiredError") {
      // Token expired
      return res.status(401).json({ error: "Token expired" });
    }

    // Other unexpected errors
    res.status(500).json({ error: err.message });
  }
};
