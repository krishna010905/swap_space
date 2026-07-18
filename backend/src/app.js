import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// --------------------------------------------------------------------------

app.use(cors({
    origin: process.env.CORS_ORIGIN  || process.env.FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
  }));


app.use(express.json({
    limit: "20kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(cookieParser())

app.use((err, req, res, next) => {
    console.error('Global Error Middleware:', {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      body: req.body,
      query: req.query,
      error: {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code
      },
    });
  
    res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });


// ----------------------------------------------------------------------------

import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import categoryRouter from "./routes/category.routes.js"
import orderRouter from "./routes/order.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/orders", orderRouter)


app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});
//---------------------------------------------------------------------------------

export {app};