const crawler = require('./crawler');

crawler("http://localhost:8080")
.then(answer => console.log(answer));