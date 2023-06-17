import { Note, User, TeamNote, TeamData } from "../models/user.js";

function createTeam(req, res) {
    User.updateOne({ username: req.body.username }, { $push: { "teams": req.body.team } }).then(data => {
        User.find({ username: req.body.username }).then(founduser => {
            console.log(founduser[0].teams);
            const response = {
                username: founduser[0].username,
                name: founduser[0].name,
                teams: founduser[0].teams
            }
            res.send(response);
        })
    });
}

function joinTeam(req, res) {
    User.find({ teams: { $elemMatch: { $in: req.body.teamname } } }).then(foundUser => {
        if (foundUser.length === 0) {
            const response = { status: false, value: "Team doesn't exist!" };
            res.send(response);
        } else {
            User.updateOne({ username: req.body.username }, { $push: { "teams": req.body.teamname } }).then(data => {
                User.findOne({ username: req.body.username }).then(founduser => {
                    const response = {
                        status: true,
                        username: founduser.username,
                        name: founduser.name,
                        teams: founduser.teams,
                        value: "Joined Successfully!"
                    }
                    res.send(response);
                })
            });
        }
    });
}

export {createTeam, joinTeam};