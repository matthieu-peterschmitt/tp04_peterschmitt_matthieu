import { Express } from "express";

export default function routes(app: Express) {
  const utilisateur = require("../controllers/utilisateur.controllers.js");

  var router = require("express").Router();

  // login utilisateur
  router.post("/login", utilisateur.login);

  app.use("/api/utilisateur", router);
}
