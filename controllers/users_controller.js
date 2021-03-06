var crypto = require('crypto');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
}
exports.signup = function(req, res){
  console.log("Begin exports.signup");
  var user = new User({username:req.body.username});
  console.log("after new user exports.signup");
  user.set('hashed_password', hashPW(req.body.password));
  console.log("after hashing user exports.signup");
  user.set('email', req.body.email);
  console.log("after email user exports.signup");
  user.save(function(err) {
    console.log("In exports.signup");
    console.log(err);
    if (err){
      res.session.error = err;
      res.redirect('/signup');
    } else {
      req.session.user = user.id;
      req.session.username = user.username;
      req.session.msg = 'Authenticated as ' + user.username;
      res.redirect('/');
    }
  });
};
exports.login = function(req, res){
  User.findOne({ username: req.body.username })
  .exec(function(err, user) {
    if (!user){
      err = 'User Not Found.';
    } else if (user.hashed_password ===
               hashPW(req.body.password.toString())) {
      req.session.regenerate(function(){
        console.log("login");
        console.log(user);
        req.session.user = user.id;
        req.session.username = user.username;
        req.session.fname = user.fname;
        req.session.lname = user.lname;
        req.session.msg = 'Authenticated as ' + user.username;
        req.session.color = user.color;
        res.redirect('/');
      });
    }else{
      err = 'Authentication failed.';
    }
    if(err){
      req.session.regenerate(function(){
        req.session.msg = err;
        res.redirect('/login');
      });
    }
  });
};
exports.getUserProfile = function(req, res) {
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    if (!user){
      res.json(404, {err: 'User Not Found.'});
    } else {
      res.json(user);
    }
  });
};
exports.updateUser = function(req, res){
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    user.set('fname', req.body.fname);
    user.set('lname', req.body.lname);
    user.set('email', req.body.email);
    user.set('color', req.body.color);
    user.save(function(err) {
      if (err){
        res.sessor.error = err;
      } else {
        req.session.msg = 'User Updated.';
        req.session.fname = req.body.fname;
        req.session.lname = req.body.lname;
        req.session.color = req.body.color;
      }
      res.redirect('/user');
    });
  });
};
exports.getAllUsers = function(req, res) {
  User.find({}, function(err, users) {
    res.send(users);
  });
};
exports.deleteUser = function(req, res){
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    if(user){
      user.remove(function(err){
        if (err){
          req.session.msg = err;
        }
        req.session.destroy(function(){
          res.redirect('/login');
        });
      });
    } else{
      req.session.msg = "User Not Found!";
      req.session.destroy(function(){
        res.redirect('/login');
      });
    }
  });
};

exports.removeFriend = function(req, res) {
  var user = req.session.user;
  var friend = req.params.id;
  
  User.findOne({_id: user})
  .exec(function(err, user) {
    
    var i;
    for (i=0; i < user.friends.length; i++) {
      if (user.friends[i].uName == friend) {
        user.friends.splice(i, 1);
        user.save(function(err) {
          if (err){
            res.sessor.error = err;
          } else {
            console.log("User's friend successfully deleted");
          }
          res.set("Connection", "close");
        });
      }
    }
  });
}

exports.addFriend = function(req, res) {
  var user = req.session.user;
  var friend_id = req.params.id;
  
  User.findOne({_id: user})
  .exec(function(err, user) {
    
    User.findOne({username: friend_id})
    .exec(function(err, friend) {
      var new_friend = {uName: friend.username};
      if(friend.fname && friend.lname) {
        new_friend['fullName'] = friend.fname + ' ' + friend.lname;
      } else {
        new_friend['fullName'] = '';
      }
      user.friends.push(new_friend);
      user.save(function(err) {
        if (err){
          res.sessor.error = err;
        } else {
          console.log("User's friend successfully added");
        }
        res.set("Connection", "close");
      });
    });
  });
}