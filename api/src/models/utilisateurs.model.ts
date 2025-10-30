import { DataTypes, Sequelize } from "sequelize";

export const utilisateursModelFactory = (sequelize: Sequelize) => {
  const Utilisateurs = sequelize.define("utilisateurs", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: DataTypes.STRING,
    },
  });
  return Utilisateurs;
};
