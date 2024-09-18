import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import { addDummyAdmin } from "./controller/adminController.js";
const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// CORS configuration for allowing localhost:3000 and its subdomains
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from localhost:3000 or any of its subdomains
    if (!origin || origin === 'http://localhost:3000' || origin.endsWith('.localhost:3000')) {
      callback(null, true);
    } else {
      // Reject the request
      callback(new Error('Not allowed by CORS')); 
    }
  },
  // Specify allowed methods
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  // Specify allowed headers
  allowedHeaders: ['Content-Type', 'Authorization'], 
  // Allow cookies and credentials to be sent
  credentials: true, 
};

// Apply the CORS middleware with the options
app.use(cors(corsOptions));

// Handling CORS errors globally
app.use((err, req, res, next) => {
  if (err instanceof Error && err.message === 'Not allowed by CORS') {
    res.status(403).json({ message: 'CORS policy does not allow access from this origin.' });
  } else {
    next(err); // Pass on any other errors
  }
});

app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

const PORT = process.env.PORT || 5001;
app.get("/", (req, res) => {
  res.send("Hello to college erp API");
});
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    addDummyAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log("Mongo Error", error.message));
