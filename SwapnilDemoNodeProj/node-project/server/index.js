var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function(req, res){
    var response = '';
    switch(req.url) {
        case "/":
            {
                return fs.readFile(path.join(__dirname, './../index.html'), 'utf8', function(err, data){
                    if(err) return console.log(err.message);
                    res.writeHeader(200, {"Content-Type": "text/html"});  
                    res.write(data);
                    res.end();  
                });
            }
            break;
        case "/users":
            response = 'User List';
            break;
        case "/posts":
            response = 'Post List';
            break;
        case "/distributionCenters":
            response = 'Distribution Centers List';
            break;

    }
    res.end(response);
}).listen(7872);