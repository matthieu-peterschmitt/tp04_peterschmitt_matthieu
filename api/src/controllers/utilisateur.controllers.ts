import { Request, Response } from "express";
import { v7 } from "uuid";
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
  await Utilisateurs.findAll().then((data) => res.send(data)).catch((err) => res.sendStatus(400).send(err));
}

export async function createUser(req: Request, res: Response) {
  const id = v7();

  const user = {
    id: id,
    login: req.body.login,
    pass: req.body.pass,
    nom: req.body.nom,
    prenom: req.body.prenom,
  };

  if (user.login && user.pass && user.nom && user.prenom) {
    return Utilisateurs.create(user).then((data) => {
      res.send(data);
    });
  }
  // missing parameters
  let message = "missing parameters";
 if (!user.login) {
   message += " login";
 }
 if (!user.pass) {
   message += " password";
 }
 if (!user.nom) {
   message += " nom";
 }
 if (!user.prenom) {
   message += " prenom";
 }

 res.status(400).send({ message: message });
}
