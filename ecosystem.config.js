
module.exports = {
  apps : [{
    name   : "domino-game",
    script : "./._build/Server.js",
    watch: true,
    deploy : {
        production : {
                "user" : "root",
                // "host" : ["192.168.0.13", "192.168.0.14", "192.168.0.15"],
                "ref"  : "origin/master",
                "repo" : "git@github.com:eufelipemateus/domino-game.git",
                "path" : "/var/www/domino.felipefm32.com",
                "post-deploy" : "npm install"
          }
    }

  }]
}

