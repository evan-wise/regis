import { Model, DataTypes } from 'sequelize';

export class League extends Model {
  id: number;
  discordId: string;
  name: string;

  static columns = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    discordId: {
      type: new DataTypes.STRING,
      allowNull: false,
    },
    guildName: {
      type: new DataTypes.STRING,
      allowNull: false,
    },
    leagueName: {
      type: new DataTypes.STRING,
      allowNull: true
    }
  }
}