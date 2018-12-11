var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: { type: String, unique: true },
    fname: String,
    lname: String,
    email: String,
    color: String,
    friends: [{uName: String, fullName: String}],
    hashed_password: String
});
mongoose.model('User', UserSchema);