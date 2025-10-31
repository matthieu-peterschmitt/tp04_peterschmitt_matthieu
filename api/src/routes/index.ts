import { Express } from "express";
import { catalogues } from "./catalogue.routes";
import { pollutions } from "./pollution.routes";
import { utilisateurs } from "./utilisateur.routes";

export default function routes(app: Express) {
  catalogues(app);
  utilisateurs(app);
  pollutions(app);
}
