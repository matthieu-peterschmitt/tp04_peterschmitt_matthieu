import { Sequelize } from "sequelize";
import { config } from "../config.js";
import { utilisateursModelFactory } from "./utilisateurs.model";

const { BDD } = config;

const sequelize = new Sequelize(
  `postgres://${BDD.user}:${BDD.password}@${BDD.host}/${BDD.bdname}`,
  {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: true,
      native: true,
    },
    define: {
      timestamps: false,
    },
  },
);

sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const Utilisateurs = utilisateursModelFactory(sequelize);

const db = {
  sequelize: sequelize,
  utilisateurs: Utilisateurs,
};

export default db;
