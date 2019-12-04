
var express = require('express');
var router = express.Router();
var path = require('path')

const fs = require('fs');
const cryptoRandomString = require('crypto-random-string');

/* GET home page. */
router.get('/', function(req, res, next) {

 let rawdata = fs.readFileSync(path.join(__dirname, '../userList.json'));
 let users = JSON.parse(rawdata);

//  'Require' caches the data which is why the delete functionality is not correctly firing
//  let users = require(path.join(__dirname, '../userList.json'))

 res.render('index', { title: 'User List', userList: users });
});


//Add User form page
router.get('/add', function(req, res, next) {
  if(Object.keys(req.query).length != 0){
    let receivedKey = ''
    for(let i in req.query){
      receivedKey = i;
    }
    let users = require(path.join(__dirname, '../userList.json'));
    let user = '';
    for(let i in users){
      if(users[i].key == receivedKey)
        user = users[i]
    }
    if(user == '')
      res.end('Invalid user ID');

    res.render('adduser', { title: 'Add User', user: user })
  }
  res.render('adduser', { title: 'Add User' });
});

//Edit User API
router.post('/userToAdd/:id?', function(req, res, next){
  let users = require(path.join(__dirname, '../userList.json'))
  let userData = req.body;
  if(req.params.id){
    let id = req.params.id;
    let validUserFlag = false;
    for(let i in users){
      if(users[i].key == id){
        users[i].name = userData['name'];
        users[i].age = userData['age'];
        validUserFlag = true;
        break;
      }
    }
    if(!validUserFlag)
      res.end('Invalid User key')
  }
  else{
  userData['key'] = cryptoRandomString({length: 10, type: 'url-safe'});
  users.push(userData);
  }
  fs.writeFileSync(path.join(__dirname, '../userList.json'),JSON.stringify(users,null,2));
  
  res.redirect('/');
});


// Add User API
// router.post('/userToAdd/', function(req, res, next){
//   let users = require(path.join(__dirname, '../userList.json'))
//   let userData = req.body;
//   userData['key'] = cryptoRandomString({length: 10, type: 'url-safe'});
//   users.push(userData);
//   fs.writeFileSync(path.join(__dirname, '../userList.json'),JSON.stringify(users,null,2));
//   res.redirect('/');
// });

//Delete User API
router.get('/delete/:id', function(req, res, next) {
  let users = require(path.join(__dirname, '../userList.json'))
  //let id = req.params.id;
  let { id } = req.params;
  
  let users2 = users.filter(v=>v['key']!=id)

  if(users2.length == users.length)
    res.end('Invalid User key')
  fs.writeFileSync(path.join(__dirname, '../userList.json'),JSON.stringify(users2,null,2));
  
  res.redirect('/');
});

module.exports = router;
