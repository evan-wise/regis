import { Player } from './player.model';
import { Game } from './game.model';
import { League } from './league.model';

export const initModels = (sequelize) => {
  Player.init(Player.columns, { timestamps: true, sequelize });
  Game.init(Game.columns, { timestamps: true, sequelize });
  League.init(League.columns, { timestamps: true, sequelize });
};