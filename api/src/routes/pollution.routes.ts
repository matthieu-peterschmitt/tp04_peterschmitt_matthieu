import { Express, Router } from "express";
import {
  create,
  deleteOne,
  getAll,
  getOne,
  update,
} from "../controllers/pollution.controllers";

export function pollutions(app: Express) {
  const router = Router();

  router.get("/", getAll);
  router.get("/:id", getOne);
  router.post("/", create);
  router.put("/:id", update);
  router.delete("/:id", deleteOne);

  app.use("/api/pollutions", router);
}
