const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");


// GET all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST new contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Name and phone are required" });
    }

    const exists = await Contact.findOne({
      $or: [{ phone }, { email }],
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Contact already exists" });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE contact (bonus)
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
