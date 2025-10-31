import { Express, Router } from "express";
import { getAll, getOne } from "../controllers/pollution.controllers";

export function pollutions(app: Express) {
  const router = Router();

  router.get("/", getAll);
  router.get("/:id", getOne);
  app.use("/api/pollutions", router);
}
