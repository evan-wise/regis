import { Model, DataTypes } from 'sequelize';

export class PlayerState extends Model {
  id: number; 
  score: number;
  isHost: boolean;

  static columns = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isHost: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }
}