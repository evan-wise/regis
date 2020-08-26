import { Model, DataTypes } from 'sequelize';

export class League extends Model {
  id: number;
  discordId: string;
  guildName: string;
  leagueName: string;
  weekDay: number;

  static columns = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    discordId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guildName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leagueName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    weekDay: {
      type: DataTypes.INTEGER,
      defaultValue: 4
    }
  }
}