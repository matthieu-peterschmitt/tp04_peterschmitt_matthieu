import { Request, Response } from "express";
import db from "../models";

const Utilisateurs = db.utilisateurs;

// Find a single Utilisateur with an login
export const login = (req: Request, res: Response) => {
  const utilisateur = {
    login: req.body.login,
    password: req.body.password,
  };

  // Test
  let pattern = /^[A-Za-z0-9]{1,20}$/;
  if (pattern.test(utilisateur.login) && pattern.test(utilisateur.password)) {
    Utilisateurs.findOne({ where: { login: utilisateur.login } })
      .then((data) => {
        if (data) {
          // const user = {
          //   id: data.id,
          //   name: data.nom,
          //   email: data.email
          // };

          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Utilisateur with login=${utilisateur.login}.`,
          });
        }
      })
      .catch((_) => {
        res.status(400).send({
          message:
            "Error retrieving Utilisateur with login=" + utilisateur.login,
        });
      });
  } else {
    res.status(400).send({
      message: "Login ou password incorrect",
    });
  }
};

export async function getUsers(req: Request, res: Response) {
  return await Utilisateurs.findAll().catch((err) => res.status(400).send(err));
}

export async function createUser(req: Request, res: Response) {
  return await Utilisateurs.create(req.body).catch((err) =>
    res.status(400).send(err),
  );
}
