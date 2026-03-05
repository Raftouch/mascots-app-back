const Collaborator = require("../models/collaborator");
const Mascot = require("../models/mascot");

const getAll = async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const collaborators = await Collaborator.find(searchOptions)
      .sort({ name: "asc" })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Collaborator.count();

    res.json({
      collaborators: collaborators,
      searchOptions: req.query,
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching collaborators" });
  }
};

const createOne = async (req, res) => {
  const collaborator = new Collaborator({ name: req.body.name });
  try {
    const newCollaborator = await collaborator.save();
    res.status(201).json(newCollaborator);
  } catch (error) {
    res.status(400).json({ error: "Error creating Collaborator" });
  }
};

const getOne = async (req, res) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id);
    const mascots = await Mascot.find({ collaborator: collaborator.id })
      .limit(5)
      .exec();
    res.json({
      collaborator: collaborator,
      mascotsByCollaborator: mascots,
    });
  } catch (error) {
    res.status(404).json({ error: "Collaborator not found" });
  }
};

const updateOne = async (req, res) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id);
    collaborator.name = req.body.name;
    await collaborator.save();
    res.json(collaborator);
  } catch (error) {
    res.status(400).json({ error: "Error updating collaborator" });
  }
};

const deleteOne = async (req, res) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id);
    const mascots = await Mascot.find({ collaborator: collaborator.id });
    if (mascots.length > 0) {
      return res
        .status(400)
        .json({ error: "This collaborator has mascots still" });
    }
    await collaborator.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Error deleting collaborator" });
  }
};

module.exports = {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
};
