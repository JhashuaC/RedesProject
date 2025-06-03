const express = require("express");
const router = express.Router();

const validKeys = ["BN1234", "BCR6969"];

router.get("/", (req, res) => {
  res.json(validKeys.map(k => ({ api_key: k })));
});

module.exports = router;