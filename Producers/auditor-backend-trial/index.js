// auditor-mock.js
import express from "express";
const app = express();
app.use(express.json());

app.post("/submit", (req, res) => {
  console.log("Received data:", req.body);
  res.json({ message: "Auditor received data" });
});

app.listen(4000, () => console.log("Mock auditor running on port 4000"));
