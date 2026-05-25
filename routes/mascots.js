const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const { ensureAuthenticated } = require("../config/auth");

const {
  getAll,
  createOne,
  getNew,
  getOne,
  editOne,
  updateOne,
  deleteOne,
} = require("../controllers/mascots");

router.get("/", ensureAuthenticated, getAll);

router.post("/", ensureAuthenticated, upload.single("image"), createOne);

router.get("/:id", ensureAuthenticated, getOne);

router.put("/:id", ensureAuthenticated, upload.single("image"), updateOne);

router.delete("/:id", ensureAuthenticated, deleteOne);

module.exports = router;
