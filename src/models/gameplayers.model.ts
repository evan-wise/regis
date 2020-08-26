import { Model, DataTypes } from 'sequelize';
import { Game } from './game.model';
import { Player } from './player.model';

export class GamePlayers extends Model {
  GameId: number;
  PlayerId: number;

  static columns = {
    GameId: {
      type: DataTypes.INTEGER,
      references: { model: Game, key: 'id' }
    },
    PlayerId: {
      type: DataTypes.INTEGER,
      references: { model: Player, key: 'id' }
    },
  }
}