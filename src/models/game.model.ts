import { Model, DataTypes } from 'sequelize';

export class Game extends Model {
  id: number; 
  scheduledStart: Date;
  start: Date;
  end: Date;

  static columns = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    scheduledStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }
}