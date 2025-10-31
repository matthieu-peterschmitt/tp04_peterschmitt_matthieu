import { Express, Router } from "express";
import catalogue from "../controllers/catalogue.controllers.js";

export function catalogues(app: Express) {
  var router = Router();

  router.get("/", catalogue);

  app.use("/api/catalogue", router);
}
