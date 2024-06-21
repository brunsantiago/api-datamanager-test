const config = require ("dotenv").config;
config();

const PORT = process.env.PORT || 3000;
//const PORT_HTTPS = process.env.PORT || 443;

// const DB_HOST = "186.182.25.11";
// const DB_USER = "firebasetest";
// const DB_PASSWORD = "N1l9wza3eB4y";
// const DB_DATABASE = "gsmreplica";
// const DB_PORT = 3306;
// const DB_FLAGS = "-FOUND_ROWS";

const DB_HOST = "app-server.com.ar";
const DB_USER = "sab5_user_db";
const DB_PASSWORD = "#1Raf23g2";
const DB_DATABASE = "sab5_dm";
const DB_PORT = 3306;
const DB_FLAGS = "-FOUND_ROWS";

module.exports = { PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_FLAGS };
