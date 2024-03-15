const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const ai_config = require('../config/config').ai;
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
); 

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.openAPI_raw = require('./openAPI_raw')(sequelize, Sequelize);
// db.openAPI_case = require('./openAPI_case')(sequelize, Sequelize);
// db.inflearn = require('./inflearn')(sequelize, Sequelize);
db.openapi_casenotes = require('./openapi_casenotes')(sequelize, Sequelize);

const ai_db = new Sequelize({
    dialect: 'mysql',
    host: ai_config.host,
    port: 3306,
    database: ai_config.basename,
    username: ai_config.username,
    password: ai_config.password
})

db.ai_db = ai_db;

module.exports = db;
