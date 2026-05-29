const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const { ensureAuthenticated } = require("../middleware/auth");

const {
  getAll,
  createOne,
  getNew,
  getOne,
  editOne,
  updateOne,
  deleteOne,
} = require("../controllers/mascots");
const { isAdmin } = require("../middleware/admin");

router.get("/", ensureAuthenticated, getAll);

router.post(
  "/",
  ensureAuthenticated,
  isAdmin,
  upload.single("image"),
  createOne,
);

router.get("/:id", ensureAuthenticated, getOne);

router.put(
  "/:id",
  ensureAuthenticated,
  isAdmin,
  upload.single("image"),
  updateOne,
);

router.delete("/:id", ensureAuthenticated, isAdmin, deleteOne);

module.exports = router;
