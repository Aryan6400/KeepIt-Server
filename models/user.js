import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
  })
  const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    notes: [noteSchema],
    bin: [noteSchema],
    status: Number,
    teams: []
  })
  const teamnoteSchema = new mongoose.Schema({
    name: String,
    title: String,
    content: String,
  })
  const teamSchema = new mongoose.Schema({
    teamname: String,
    notes: [teamnoteSchema]
  })
  
  userSchema.plugin(passportLocalMongoose);
  
  const Note = mongoose.model("Note", noteSchema);
  const User = mongoose.model("User", userSchema);
  const TeamNote = mongoose.model("TeamNote", teamnoteSchema);
  const TeamData = mongoose.model("TeamData", teamSchema);


  export {Note, User, TeamNote, TeamData};
