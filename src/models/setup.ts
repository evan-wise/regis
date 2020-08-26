import { Sequelize } from 'sequelize/types';
import { Player } from './player.model';
import { Game } from './game.model';
import { League } from './league.model';
import { GamePlayers } from './gameplayers.model';
import { PlayerState } from './playerstate.model';


export const initModels = (sequelize: Sequelize) => {
  Player.init(Player.columns, { timestamps: true, sequelize });
  Game.init(Game.columns, { timestamps: true, sequelize });
  League.init(League.columns, { timestamps: true, sequelize });
  PlayerState.init(PlayerState.columns, {timestamps: true, sequelize });
  GamePlayers.init(GamePlayers.columns, {timestamps: true, sequelize });

  // League structure.
  Player.belongsToMany(League, { through: 'LeaguePlayers' });
  Game.belongsTo(League);

  // Game structure.
  Player.belongsToMany(Game, { through: GamePlayers });
  GamePlayers.hasOne(PlayerState);
};