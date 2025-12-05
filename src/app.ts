import express, { type Request, type Response } from "express";
import cors from "cors";
import routes from "./app/routes";

const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.use("/api/v1", routes);

// root
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

export default app;
