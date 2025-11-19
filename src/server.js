import app from "./app.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.use(cookieParser());