const Collaborator = require("../models/collaborator");
const Mascot = require("../models/mascot");
const fs = require("fs");
const path = require("path");
const uploadPath = path.join("public", Mascot.imageBasePath);

const getAll = async (req, res) => {
  let query = Mascot.find();
  if (req.query.name != null && req.query.name !== "") {
    query = query.regex("name", new RegExp(req.query.name, "i"));
  }
  if (req.query.bornBefore != null && req.query.bornBefore !== "") {
    query = query.lte("birthDate", req.query.bornBefore);
  }
  if (req.query.bornAfter != null && req.query.bornAfter !== "") {
    query = query.gte("birthDate", req.query.bornAfter);
  }
  try {
    const mascots = await query.exec();
    res.json({
      mascots: mascots,
      searchOptions: req.query,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching mascots" });
  }
};

const createOne = async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const mascot = new Mascot({
    name: req.body.name,
    collaborator: req.body.collaborator,
    breed: req.body.breed,
    gender: req.body.gender,
    birthDate: new Date(req.body.birthDate),
    imageName: fileName,
    description: req.body.description,
  });
  try {
    const newMascot = await mascot.save();
    res.status(201).json(newMascot);
  } catch (error) {
    if (mascot.imageName != null) {
      removeImage(mascot.imageName);
    }
    res.status(400).json({ error: "Error creating mascot" });
  }
};

const getOne = async (req, res) => {
  try {
    const mascot = await Mascot.findById(req.params.id)
      .populate("collaborator")
      .exec();
    res.json({
      mascot: mascot,
    });
  } catch (error) {
    res.status(404).json({ error: "Mascot not found" });
  }
};

const updateOne = async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;

  let mascot;
  try {
    mascot = await Mascot.findById(req.params.id);
    mascot.name = req.body.name;
    mascot.collaborator = req.body.collaborator;
    mascot.breed = req.body.breed;
    mascot.gender = req.body.gender;
    mascot.birthDate = new Date(req.body.birthDate);
    mascot.imageName = fileName;
    mascot.description = req.body.description;

    await mascot.save();
    res.json(mascot);
  } catch (error) {
    if (mascot.imageName != null) {
      removeImage(mascot.imageName);
    }

    res.status(400).json({ error: "Error updating mascot" });
  }
};

const deleteOne = async (req, res) => {
  try {
    const mascot = await Mascot.findById(req.params.id);
    await mascot.deleteOne();

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Error deleting mascot" });
  }
};

function removeImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (error) => {
    if (error) console.log(error);
  });
}

module.exports = {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
};
