import db from "@/models";
import { Request, Response } from "express";

export async function getAll(req: Request, res: Response) {
  const data = await db.pollutions.findAll().catch((err) => {
    res.status(400).send(err);
  });

  res.setHeader("Content-Type", "application/json");
  res.send(data);
}

export async function getOne(req: Request, res: Response) {
  const { id } = req.params;

  const data = await db.pollutions.findByPk(id).catch((err) => {
    res.status(400).send(err);
  });

  res.setHeader("Content-Type", "application/json");
  res.send(data);
}
