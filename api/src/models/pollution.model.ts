import { DataTypes, Sequelize } from "sequelize";

export const pollutionModelFactory = (sequelize: Sequelize) => {
  return sequelize.define("pollution", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lieu: {
      type: DataTypes.STRING,
    },
    date_observation: {
      type: DataTypes.DATE,
    },
    type_pollution: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    latitude: {
      // stocke les coordonnées GPS avec 6 décimales
      type: DataTypes.DECIMAL(9, 6),
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
    },
    photo_url: {
      type: DataTypes.STRING,
    },
  });
};
