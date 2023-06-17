import { Note, User, TeamNote, TeamData } from "../models/user.js";

function createTeamNote(req, res) {
    console.log(req.body);
    const note = new TeamNote({
        name: req.body.username,
        title: req.body.title,
        content: req.body.content
    })
    TeamData.findOne({ teamname: req.body.teamname }).then(foundteam => {
        if (!foundteam) {
            const team = new TeamData({
                teamname: req.body.teamname,
                notes: note
            })
            team.save().then(data => {
                TeamData.findOne({ teamname: req.body.teamname }).then(foundteam => {
                    res.send({ notes: foundteam.notes });
                })
            })
        } else {
            TeamData.updateOne({ teamname: req.body.teamname }, { $push: { "notes": note } }).then(data => {
                TeamData.findOne({ teamname: req.body.teamname }).then(foundteam => {
                    res.send({ notes: foundteam.notes });
                })
            })
        }
    })
}

function getTeamNotes(req, res) {
    TeamData.findOne({ teamname: req.body.teamname }).then(foundteam => {
        if (!foundteam) {
            res.send({ notes: [] });
        } else {
            res.send({ notes: foundteam.notes });
        }
    })
}

function deleteTeamNote(req, res) {
    TeamData.updateOne({ teamname: req.body.teamname }, { $pull: { "notes": { name: req.body.username, title: req.body.title, content: req.body.content } } }).then(() => {
      TeamData.findOne({ teamname: req.body.teamname }).then(foundteam => {
        res.send({ notes: foundteam.notes });
      })
    })
  }

export {createTeamNote, getTeamNotes, deleteTeamNote};