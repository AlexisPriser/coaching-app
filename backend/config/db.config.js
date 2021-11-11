const DB=require("./env.js");

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DB);
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.utilisateur = require('../models/utilisateur.js')(sequelize, Sequelize);
db.role = require('../models/role.js')(sequelize, Sequelize);
db.objectif = require('../models/objectif.js')(sequelize, Sequelize);
 
db.role.belongsToMany(db.utilisateur, { through: 'roles_utilisateurs', foreignKey: 'id_role', otherKey: 'id_utilisateur'});
db.utilisateur.belongsToMany(db.role, { through: 'roles_utilisateurs', foreignKey: 'id_utilisateur', otherKey: 'id_role'});

db.objectif.belongsToMany(db.utilisateur, { through: 'objectifs_utilisateurs', foreignKey: 'id_objectif', otherKey: 'id_utilisateur'});
db.utilisateur.belongsToMany(db.objectif, { through: 'objectifs_utilisateurs', foreignKey: 'id_utilisateur', otherKey: 'id_objectif'});

module.exports = db;