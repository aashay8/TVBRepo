const express = require('express')
const app = express()
const port = 3000

//Routing
//app.get('/', (req, res) => res.send('Hello World!')) --- For individual specs
//app.post('/', (req, res) => res.send('Hello World!')) ---- -Do-
app.all('/', (req, res) => res.send('Hello World!'))

app.get(/random.text/, function (req, res) {
    res.send('random.text')
})
app.get('/ab*cd', function (req, res) {
    res.send('ab*cd')
  })


//Server started
app.listen(port, (err,data) =>{ 
    if(err) console.log('Console error logging:' +err);
    else console.log(`Example app listening on port ${port}!`)
})