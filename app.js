import dotenv from "dotenv"
import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";


import { Note, User, TeamNote, TeamData } from "./models/user.js";
import {register, login, logout} from "./authentication/auth.js";
import {createTeamNote, getTeamNotes, deleteTeamNote} from "./teamRoutes/teamNote.js";
import {createTeam, joinTeam} from "./teamRoutes/team.js";


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
dotenv.config();
app.use(express.json());

app.use(session({
  secret: "My Little Project.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/keeperDB", { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get("/", (req, res) => {
  Note.find({}).exec().then((foundNotes) => {
    res.send(foundNotes);
  })
})

app.post("/", (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content
  })
  const username = req.body.username;
  User.updateOne({ username: username }, { $push: { "notes": note } }).exec().then((foundNotes) => { })
  User.find({ username: username }).exec().then((founduser) => {
    res.send(founduser[0].notes);
  })
})

app.delete("/", (req, res) => {
  const username = req.body.user;
  User.updateOne({ username: username }, { $pull: { "notes": { title: req.body.title, content: req.body.content } } }).exec().then(() => { });
  User.updateOne({ username: username }, { $push: { "bin": { title: req.body.title, content: req.body.content } } }).exec().then(() => { });
  User.find({ username: username }).exec().then((founduser) => {
    res.send(founduser[0].notes);
  })
})

app.post("/bin", (req, res) => {
  User.find({ username: req.body.username }).exec().then((founduser) => {
    res.send(founduser[0].bin);
  })
})

app.post("/restore", (req, res) => {
  const username = req.body.user;
  User.updateOne({ username: username }, { $pull: { "bin": { title: req.body.title, content: req.body.content } } }).exec().then(() => { });
  User.updateOne({ username: username }, { $push: { "notes": { title: req.body.title, content: req.body.content } } }).exec().then(() => { });
  User.find({ username: username }).exec().then((founduser) => {
    res.send(founduser[0].bin);
  })
})


app.delete("/bin", (req, res) => {
  const username = req.body.user;
  User.updateOne({ username: username }, { $pull: { "bin": { title: req.body.title, content: req.body.content } } }).exec().then(() => { });
  User.find({ username: username }).exec().then((founduser) => {
    res.send(founduser[0].bin);
  })
})

app.post("/find", (req, res) => {
  User.find({ username: req.body.username }).exec().then((founduser) => {
    res.send(founduser[0].notes);
  })
})

app.get("/signup", (req, res) => {
  res.send(req.body);
})

app.post("/signup", register);
app.post("/login", login);

app.post("/createteam", createTeam);

app.post("/jointeam", joinTeam);

app.post("/getTeamNotes", getTeamNotes);

app.delete("/teamNotes", deleteTeamNote);

app.post("/createTeamNotes", createTeamNote)

app.get("/logout", logout);

app.listen(8080, function () {
  console.log("Server started on port 8080");
});
