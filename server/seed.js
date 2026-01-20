const mongoose = require("mongoose");
const User = require("./models/User");
const Workspace = require("./models/Workspace");
const Request = require("./models/request");
require("dotenv").config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding");

    //clear existing data
    await User.deleteMany({});
    await Workspace.deleteMany({});
    await Request.deleteMany({});

    //create a dummy user
    const user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      passwordHash: "hashedpassword123",
    });
    console.log("Dummy user created", user.username);

    //create a dummy workspace
    const workspace = await Workspace.create({
      name: "Test Workspace",
      owner: user._id,
      members: [user._id],
    });
    console.log("Dummy workspace created", workspace.name);

    //create a dummy request
    const request = await Request.create({
      workspaceId: workspace._id,
      title: "Sample Request",
      method: "GET",
      url: "https://api.example.com/data",
      headers: [
        { key: "Authorization", value: "Bearer token123", isChecked: true },
      ],
      queryParams: [{ key: "search", value: "test", isChecked: true }],
      bodyContentType: "application/json",
      bodyContent: '{"sample":"data"}',
      lastModifiedBy: user._id,
    });
    console.log("Dummy request created", request.title);

    //link request to workspace
    workspace.requests.push(request._id);
    await workspace.save();
    console.log("Request linked to workspace");

    console.log("Database seeding completed");
    process.exit();
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
};

seedData();
