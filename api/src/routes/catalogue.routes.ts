import { Express, Router } from "express";
import catalogue from "../controllers/catalogue.controllers.js";

export default function routes(app: Express) {
  var router = Router();

  router.get("/", catalogue);

  app.use("/api/catalogue", router);
}
