const express = require("express");
const { ObjectId } = require("mongodb"); // To use ObjectId
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/demo");
  console.log("db connected");
}

const userSchema = new mongoose.Schema({
  // Modify the schema to include the necessary fields
  name: String,
  email: String,
  role: String,
  id: Number,
  assistantId: String,
});

const User = mongoose.model("User", userSchema);

const server = express();
server.use(cors());
server.use(bodyParser.json());
//CRUD-create
server.post("/demo", async (req, res) => {
  try {
    // Extract user data from the request body
    const { name, email, role, id, assistantId } = req.body;

    // Create a new User instance with the extracted data
    const newUser = new User({
      name,
      email,
      role,
      id,
      assistantId,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Get the count of users after adding the latest user
    const userCount = await User.countDocuments();

    console.log(savedUser);

    res.json({ savedUser, userCount });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
server.put("/demo", async (req, res) => {
  try {
    const { assistantId, id } = req.body;
    if (assistantId && id) {
      const updatedUser = await User.findOneAndUpdate(
        { assistantId, id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
          },
        },
        { new: true }
      );
      console.log(updatedUser);
      res.json(updatedUser);
    } else {
      console.error("Error user not found");
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
server.delete("/demo", async (req, res) => {
  try {
    const { assistantId, id } = req.body;
    console.log(assistantId, id, "inside the function");
    if (assistantId && id) {
      const deletedUser = await User.deleteOne({ assistantId, id: id });
      if (deletedUser.deletedCount > 0) {
        console.log("User deleted successfully");

        const remainingUsers = await User.find({}); // Fetch updated list of users
        const count = await User.countDocuments();

        console.log("Remaining Users:", remainingUsers, count);

        res.json({
          remainingUsers,
          count,
        });
      } else {
        console.error("Error user not found");
        res.status(404).json({ error: "User not found" });
      }
    } else {
      console.error("Error: 'assistantId' and 'id' are required");
      res.status(400).json({ error: "'assistantId' and 'id' are required" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.get("/demo", async (req, res) => {
  const count = await User.countDocuments();
  const docs = await User.find({});

  res.json({ docs, count });
});

server.listen(8080, () => {
  console.log("server started");
});
