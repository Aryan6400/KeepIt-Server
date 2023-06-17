import { Note, User, TeamNote, TeamData } from "../models/user.js";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

passport.use(User.createStrategy());
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            username: user.username,
            picture: user.picture
        });
    });
});
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

function register(req, res) {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            const response = { status: false, value: "Already registered! Please login to continue." };
            res.send(response);
        } else {
            passport.authenticate("local")(req, res, function () {
                const response = { status: true, value: "Registered Successfully!" };
                User.updateOne({ username: req.body.username }, { $set: { "name": req.body.name } }).exec().then(() => { });
                res.send(response);
            })
        }
    })
}

function login(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    req.login(user, function (err) {
        if (err) {
            const response = { status: false, value: "Incorrect username or password!!" };
            res.send(response);
        }
        else {
            passport.authenticate("local")(req, res, function () {
                User.findOne({ username: req.body.username }).exec().then((founduser) => {
                    const response = { status: true, value: "Logged in Successfully!", name: founduser.name, teams: founduser.teams };
                    res.send(response);
                });
            })
        }
    })
}

function logout(req, res){
    req.logout(function (err) {
        if (err) { console.log(err); }
        else {
            const response = { status: true, value: "Logged Out Successfully!" };
            res.send(response);
        }
    });
}

export { register, login, logout };