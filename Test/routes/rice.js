const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const db = mysql.createConnection({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: "123456789",
  database: process.env.DB_DATABASE,
});


router.get("/group_project", (req, res) => {
  db.query("SELECT * FROM group_project", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


router.get("/km_unit", (req, res) => {
  db.query("SELECT * FROM km_unit", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


router.get("/km_unit/:id", (req, res) => {
  const km_id = req.params.id;
  db.query(
    "SELECT km_name FROM km_unit WHERE km_id = ?",
    km_id,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


router.post("/km_unit", (req, res) => {
  const km_name = req.body.km_name;
  const km_group = req.body.km_group;

  db.query(
    "INSERT INTO km_unit (km_name,km_group) VALUES (?,?)",
    [km_name, km_group],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});


router.put("/km_unit/:id", (req, res) => {
  const km_id = req.params.id;
  const km_name = req.body.km_name;
  db.query(
    "UPDATE km_unit SET km_name = ? WHERE km_id = ?",
    [km_name, km_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

router.delete("/km_unit/:id", (req, res) => {
  const km_id = req.params.id;
  db.query("DELETE FROM km_unit WHERE km_id = ?", km_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
