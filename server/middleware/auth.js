import jwt from "jsonwebtoken";

// const auth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     let decodedData;
//     if (token) {
//       decodedData = jwt.verify(token, process.env.JWT_SECRET);
//       req.userId = decodedData?.id;
//       console.log("User Role:", req.userRole);
//     }
//     next();
//   } catch (error) {
//     console.log("Authentication Error:", error.message);
//     return res.status(401).json({ message: "Unauthorized" }); // Respond with an error
//   }
// };


// const auth = (roles = []) => {
//   return (req, res, next) => {
//     try {
//       const token = req.headers.authorization.split(" ")[1];
//       if (!token) return res.status(401).json({ message: "Unauthorized" });

//       const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//       req.userId = decodedData?.id;
//       req.userRole = decodedData?.role;

//       // Check if the user has one of the allowed roles
//       if (roles.length && !roles.includes(req.userRole)) {
//         return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
//       }

//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//   };
// };

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; 
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the userId and userRole to the request object
    req.userId = decodedData?.id;
    req.userRole = decodedData?.role; // Extract role from decoded token
    console.log("User Role:", req.userRole); // This will log the user's role

    next();
  } catch (error) {
    console.log("Authentication Error:", error.message);
    return res.status(401).json({ message: "Unauthorized" }); // Respond with an error
  }
};

export default auth;



