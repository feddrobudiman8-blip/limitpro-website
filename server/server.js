const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

/* ==========================
   DATABASE
========================== */

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("✅ Database berhasil terhubung.");
  }
});

/* ==========================
   BUAT TABEL
========================== */

db.run(`
CREATE TABLE IF NOT EXISTS visitors (

id INTEGER PRIMARY KEY AUTOINCREMENT,

visitor_id TEXT,

ip TEXT,

visit_date TEXT,

visit_time TEXT

)
`);

/* ==========================
   PUBLIC
========================== */

app.get("/", (req, res) => {
  console.log("🔥 Route / dipanggil");

  const visitorId = uuidv4();

  console.log("✅ Menyimpan visitor:", visitorId);

  const ip = req.ip;

  const now = new Date();

  const date = now.toLocaleDateString("id-ID");

  const time = now.toLocaleTimeString("id-ID");

  db.run(
    `INSERT INTO visitors
        (visitor_id, ip, visit_date, visit_time)
        VALUES (?, ?, ?, ?)`,
    [visitorId, ip, date, time],
    function (err) {
      if (err) {
        console.error("❌ INSERT ERROR:", err.message);
      } else {
        console.log("✅ Data berhasil disimpan. ID:", this.lastID);
      }
    },
  );

  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

/* ==========================
   API STATS
========================== */

app.get("/api/stats", (req, res) => {
  const today = new Date().toLocaleDateString("id-ID");

  db.get(
    "SELECT COUNT(*) AS totalVisits FROM visitors",
    [],
    (err, totalResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get(
        "SELECT COUNT(*) AS todayVisits FROM visitors WHERE visit_date = ?",
        [today],
        (err, todayResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          db.get(
            "SELECT COUNT(DISTINCT visitor_id) AS uniqueVisitors FROM visitors",
            [],
            (err, uniqueResult) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              res.json({
                totalVisits: totalResult.totalVisits,
                todayVisits: todayResult.todayVisits,
                uniqueVisitors: uniqueResult.uniqueVisitors,
                onlineVisitors: 1,
              });
            },
          );
        },
      );
    },
  );
});

/* ==========================
   API VISITORS
========================== */

app.get("/api/visitors", (req, res) => {
  db.all("SELECT * FROM visitors ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(rows);
  });
});

/* ==========================
   SERVER
========================== */

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
