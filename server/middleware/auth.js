import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedData;
    if (token) {
      decodedData = jwt.verify(token, "sEcReT");
      req.userId = decodedData?.id;
    }
    next();
  } catch (error) {
    console.log("Authentication Error:", error.message);
    return res.status(401).json({ message: "Unauthorized" }); // Respond with an error
  }
};

export default auth;
