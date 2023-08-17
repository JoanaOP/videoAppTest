const fs = require('fs')

module.exports = {
    devServer: {
      https: {
        key: fs.readFileSync('./localhostIP.key'),
        cert: fs.readFileSync('./localhostIP.crt'),
        ca: fs.readFileSync('./rootCA.crt'),
      }
    },

  }



  

     