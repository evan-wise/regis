import { Player } from './player.model';
import { Game } from './game.model';
import { League } from './league.model';
import { Sequelize } from 'sequelize/types';

export const initModels = (sequelize: Sequelize) => {
  Player.init(Player.columns, { timestamps: true, sequelize });
  Game.init(Game.columns, { timestamps: true, sequelize });
  League.init(League.columns, { timestamps: true, sequelize });

  Player.belongsToMany(League, { through: 'LeaguesPlayers' });
  Player.belongsToMany(Game, { through: 'GamesPlayers' });
};