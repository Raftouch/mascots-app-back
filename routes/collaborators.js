const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require("../controllers/collaborators");

router.get("/", ensureAuthenticated, getAll);

router.post("/", ensureAuthenticated, createOne);

router.get("/:id", ensureAuthenticated, getOne);

router.put("/:id", ensureAuthenticated, updateOne);

router.delete("/:id", ensureAuthenticated, deleteOne);

module.exports = router;
