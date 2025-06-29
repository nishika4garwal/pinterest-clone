import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  //request body se data le lo

  let user = await User.findOne({ email });
  //findOne is used to find a single document in the database that matches the given criteria.
  //In this case, it checks if there is a user with the provided email.

  if (user)
    return res.status(400).json({
      message: "account with this email already exists",
    });
  //if user is not found, hash password and create a new user
  const hashPassword = await bcrypt.hash(password, 10);
  
  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  generateToken(user._id, res);

  res.status(201).json({
    user,
    message: "you have registered successfully",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "no such account exists",
    });

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword)
    return res.status(400).json({
      message: "wrong password",
    });

  generateToken(user._id, res);

  res.json({
    user,
    message: "you have logged in successfully",
  });
});

//thunderbolt - http://localhost:5000/api/user/me
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("followers", "name _id")
    .populate("following", "name _id")
    .populate({
      path: "savedPins",
      populate: {
        path: "owner",         
        select: "name _id",  
      },
    });
  res.json(user);
});




//params neeche is the id of the user whose profile we want to see
//for eg nishikaagarwal0402 has id 685991fd74098d0b675efcde
//in thunderbolt - http://localhost:5000/api/user/685991fd74098d0b675efcde
export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "name _id")
    .populate("following", "name _id");

  res.json(user);
});


export const followAndUnfollowUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id); //user whose profile we want to follow or unfollow
  const loggedInUser = await User.findById(req.user._id); //logged in user who is trying to follow or unfollow the user

  if (!user)
    return res.status(400).json({
      message: "no such user exists",
    });

  if (user._id.toString() === loggedInUser._id.toString())
    return res.status(400).json({
      message: "you can't follow yourself",
    });

  if (user.followers.includes(loggedInUser._id)) {
    const indexFollowing = loggedInUser.following.indexOf(user._id); //index of the user, logged in user already follows from the following of the logged in user
    const indexFollowers = user.followers.indexOf(loggedInUser._id); //index of the logged in user in the followers of the user

    loggedInUser.following.splice(indexFollowing, 1); //remove the user from the following of the logged in user
    user.followers.splice(indexFollowers, 1);//remove the logged in user from the followers of the user

    await loggedInUser.save();
    await user.save();

    res.json({
      message: `you have unfollowed ${user.name}`,
    });
  } else {
    loggedInUser.following.push(user._id); //add the user to the following of the logged in user
    user.followers.push(loggedInUser._id);//add the logged in user to the followers of the user

    await loggedInUser.save();//save the logged in user after adding the user to the following
    await user.save();//save the user after adding the logged in user to the followers

    res.json({
      message: "you have started following"+` ${user.name}`,
    });
  }
});

export const removeFollower = TryCatch(async (req, res) => {
  const targetUser = await User.findById(req.params.id); // the user you want to remove from your followers
  const currentUser = await User.findById(req.user._id); // you

  if (!targetUser)
    return res.status(404).json({ message: "User not found" });

  // Remove target user from your followers
  const indexInMyFollowers = currentUser.followers.indexOf(targetUser._id);
  if (indexInMyFollowers !== -1) {
    currentUser.followers.splice(indexInMyFollowers, 1);
  }

  // Remove yourself from their following
  const indexInTheirFollowing = targetUser.following.indexOf(currentUser._id);
  if (indexInTheirFollowing !== -1) {
    targetUser.following.splice(indexInTheirFollowing, 1);
  }

  await currentUser.save();
  await targetUser.save();

  res.json({
    message: `Removed ${targetUser.name} from your followers`,
  });
});


export const logOutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });

  res.json({
    message: "you have logged out successfully",
  });
});

// POST /api/pin/save/:pinId
export const savePin = async (req, res) => {
  const userId = req.user._id;
  const pinId = req.params.pinId;

  const user = await User.findById(userId);

  if (!user.savedPins.includes(pinId)) {
    user.savedPins.push(pinId);
    await user.save();
    res.status(200).json({ message: "pin saved" });
  } else {
    res.status(400).json({ message: "pin already saved" });
  }
};

