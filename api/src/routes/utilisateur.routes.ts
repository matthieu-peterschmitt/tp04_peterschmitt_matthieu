import { Express } from "express";
import {
  createUser,
  getUsers,
  login,
} from "../controllers/utilisateur.controllers";

export function utilisateurs(app: Express) {
  var router = require("express").Router();

  router.post("/login", login);
  router.get("/", getUsers);
  router.post("/", createUser);

  app.use("/api/users", router);
}
