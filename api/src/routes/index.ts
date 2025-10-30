import { Express } from "express";
import catalogue from "./catalogue.routes";
import utilisateur from "./utilisateur.routes";

export default function routes(app: Express) {
  catalogue(app);
  utilisateur(app);
}
