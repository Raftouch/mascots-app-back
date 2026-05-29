const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const { isAdmin } = require("../middleware/admin");

const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require("../controllers/collaborators");

router.get("/", ensureAuthenticated, getAll);

router.post("/", ensureAuthenticated, isAdmin, createOne);

router.get("/:id", ensureAuthenticated, getOne);

router.put("/:id", ensureAuthenticated, isAdmin, updateOne);

router.delete("/:id", ensureAuthenticated, isAdmin, deleteOne);

module.exports = router;
