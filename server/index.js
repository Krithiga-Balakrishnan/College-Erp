import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from 'helmet'; // Helmet already imported here, so no need to declare again

import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import { addDummyAdmin } from "./controller/adminController.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));


app.disable('x-powered-by');

// CORS configuration for allowing localhost:3000 and its subdomains
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from localhost:3000 or its subdomains
    if (!origin || origin === 'http://localhost:3000' || origin.endsWith('.localhost:3000')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handling CORS errors globally
app.use((err, req, res, next) => {
  if (err instanceof Error && err.message === 'Not allowed by CORS') {
    res.status(403).json({ message: 'CORS policy does not allow access from this origin.' });
  } else {
    next(err);
  }
});

// Security headers using Helmet
app.use(helmet());
app.disable('x-powered-by'); // Remove X-Powered-By header
app.use(helmet.noSniff()); // Prevent MIME type sniffing
app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
app.use(helmet.referrerPolicy({ policy: 'no-referrer' })); // Set referrer policy
app.use(helmet.hsts({ // Enable HTTP Strict Transport Security
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
}));

// Content Security Policy configuration
const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://apis.google.com", "https://accounts.google.com"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"], // Removed 'unsafe-inline'
    imgSrc: ["'self'", "data:"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    connectSrc: ["'self'", "http://localhost:5001"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"],
  },
};

app.use(helmet.contentSecurityPolicy(cspOptions));

// Static files for robots.txt and sitemap.xml
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow:");
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    </urlset>`);
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
