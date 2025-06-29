import { Pin } from "../models/pinModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import { User } from "../models/userModel.js";

export const createPin = TryCatch(async (req, res) => {
  const { title, pin } = req.body;

  const file = req.file;
  //this file is coming from multer middleware
  const fileUrl = getDataUrl(file);
  //this will convert the file to a base64 Data URI format
  //which is perfect for uploading to cloudinary

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);
 //this will upload the file to cloudinary and return the cloud object
  //the cloud object contains the public_id and secure_url of the uploaded file
  if (!cloud)
    return res.status(500).json({
      message: "couldn't upload image",
    });
    
  await Pin.create({
    title,
    pin,
    image: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    owner: req.user._id,
  });

  res.json({
    message: "your pin in created",
  });
});

export const getAllPins = TryCatch(async (req, res) => {
  const pins = await Pin.find().sort({ createdAt: -1 });

  res.json(pins);
});

export const getSinglePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id).populate("owner", "-password");
//populate will replace the owner field with the user document
//params.id is the id of the pin we want to get
//eg http://localhost:5000/api/pins/685a38869ea9f39758fd74ac is for amalgamation
//and shows owner details too
  res.json(pin);
});

export const commentOnPin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
//you will comment on a pin by its id
//eg {{base_url}}/api/pin/comment/685a38869ea9f39758fd74ac is used to comment on amalgamation pin
  if (!pin)
    return res.status(400).json({
      message: "no such pin exists",
    });

  pin.comments.push({
    user: req.user._id,
    name: req.user.name,
    comment: req.body.comment,
  });

  await pin.save();

  res.json({
    message: "your comment is added",
  });
});

export const deleteComment = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
//you will delete a comment on a pin by comment's id
//eg {{base_url}}/api/pin/comment/685a38869ea9f39758fd74ac?commentId=685a3ba047c841badd5a70e3 is used to delete comment on amalgamation pin
  if (!pin)
    return res.status(400).json({
      message: "no such pin exists",
    });

  if (!req.query.commentId)
    return res.status(404).json({
      message: "please give comment id",
    });

  const commentIndex = pin.comments.findIndex(
    (item) => item._id.toString() === req.query.commentId.toString()
  );
//findIndex will return the index of the comment in the comments array
  if (commentIndex === -1) {
    return res.status(404).json({
      message: "comment not found",
    });
  }

  const comment = pin.comments[commentIndex];

  if (comment.user.toString() === req.user._id.toString()) {
    pin.comments.splice(commentIndex, 1);
//splice will remove the comment from the comments array
    //it takes two arguments, the index of the item to remove and the number of items
    //to remove, in this case we are removing one item


    await pin.save();

    return res.json({
      message: "your comment is deleted",
    });
  } else {
    return res.status(403).json({
      message: "you are not owner of this comment",
    });
  }
});

export const deletePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "no such pin exists",
    });

  if (pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "unauthorized",
    });

  await cloudinary.v2.uploader.destroy(pin.image.id);
  //this will delete the image from cloudinary using the public_id of the image
//the public_id is stored in the image field of the pin document
//eg, for amalgamation pin, tlnx3e2znbesycoskjtt is the public_id of the image

//then finally we delete the pin document from the database
//with pin id only
  await pin.deleteOne();

  res.json({
    message: "your pin is deleted",
  });
});

export const updatePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "no such pin exists",
    });

  if (pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "unauthorized",
    });

  pin.title = req.body.title;
  pin.pin = req.body.pin;

  await pin.save();

  res.json({
    message: "your pin is updated",
  });
});

export const savePin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const pinId = req.params.id;
    if (!user.savedPins.includes(pinId)) {
      user.savedPins.push(pinId);
      await user.save();
      return res.status(200).json({ message: "Pin saved successfully" });
    } else {
      return res.status(400).json({ message: "Pin already saved" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

