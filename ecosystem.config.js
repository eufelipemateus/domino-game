const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  apps : [{
    name   : "domino-game",
    script : "./._build/Server.js",
    watch: true,
  }],
    deploy : {
        production : {
                "pem": "/home/felipemateus/Documentos/eu.pub",
                "host": process.env.SERVER_IP,
                "user": process.env.SERVER_USER,
                "ref"  : "origin/master",
                "repo" : "git@github.com:eufelipemateus/domino-game.git",
                "path" : "/var/www/domino.felipefm32.com",
                "post-deploy" : "npm install && pm2 reload ecosystem.config.js  && pm2 save"
          }
    }




}

