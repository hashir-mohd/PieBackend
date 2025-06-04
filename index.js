import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;


app.on("error", (error) => {
  console.log("Server Run Failed :", error);
  throw error;
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`  ⚙️   Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed !! ", err);
  });

app.use(
  cors({
    origin:
        process.env.CORS_ORIGIN || "*",
        credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Routes
app.use('/api/videos', videoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


app.use('/', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});


