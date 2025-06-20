import express from "express";
import cors from "cors";
import router from "./routes/connections.route.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
