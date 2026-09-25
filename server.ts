import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("scholar.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS institutions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'university', 'organization'
    location TEXT,
    description TEXT,
    logo TEXT,
    banner TEXT,
    website TEXT,
    transparencyScore INTEGER DEFAULT 85
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- 'professor', 'researcher', 'student'
    institutionId TEXT,
    institution TEXT, -- fallback string
    bio TEXT,
    avatar TEXT,
    impactPoints INTEGER DEFAULT 0,
    FOREIGN KEY(institutionId) REFERENCES institutions(id)
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    institutionId TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    goalAmount REAL NOT NULL,
    currentAmount REAL DEFAULT 0,
    status TEXT DEFAULT 'active', -- 'active', 'completed'
    category TEXT NOT NULL,
    sdg TEXT, -- Sustainable Development Goal
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(institutionId) REFERENCES institutions(id)
  );

  CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    campaignId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    isCompleted BOOLEAN DEFAULT 0,
    orderIndex INTEGER,
    FOREIGN KEY(campaignId) REFERENCES campaigns(id)
  );

  CREATE TABLE IF NOT EXISTS solutions (
    id TEXT PRIMARY KEY,
    campaignId TEXT NOT NULL,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    feasibilityScore INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(campaignId) REFERENCES campaigns(id),
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS publications (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    campaignId TEXT,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    doi TEXT,
    citations INTEGER DEFAULT 0,
    sdg TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(campaignId) REFERENCES campaigns(id)
  );

  CREATE TABLE IF NOT EXISTS discussions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    discussionId TEXT NOT NULL,
    userId TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(discussionId) REFERENCES discussions(id),
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

// Migration: Add institutionId to users if it doesn't exist
try {
  db.exec("ALTER TABLE users ADD COLUMN institutionId TEXT");
} catch (e) {
  // Column likely already exists
}

// Seed initial data if empty
const instCount = db.prepare("SELECT COUNT(*) as count FROM institutions").get() as { count: number };
if (instCount.count === 0) {
  const insertInst = db.prepare("INSERT INTO institutions (id, name, type, location, description, logo, banner, website, transparencyScore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  insertInst.run("i1", "Black Mesa University", "university", "New Mexico, USA", "Leading research in theoretical physics and quantum anomalies.", "https://api.dicebear.com/7.x/initials/svg?seed=BMU", "https://picsum.photos/seed/bmu/1200/400", "https://blackmesa.edu", 92);
  insertInst.run("i2", "Global Science Council", "organization", "Geneva, Switzerland", "International body dedicated to solving global challenges through science.", "https://api.dicebear.com/7.x/initials/svg?seed=GSC", "https://picsum.photos/seed/gsc/1200/400", "https://gsc.org", 98);
}

const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare("INSERT INTO users (id, name, role, institutionId, institution, bio, avatar, impactPoints) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  insertUser.run("u1", "Dr. Elena Vance", "professor", "i1", "Black Mesa University", "Quantum physics researcher and educator.", "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena", 1250);
  insertUser.run("u2", "Gordon Freeman", "researcher", "i2", "Independent", "Theoretical physicist exploring anomalies.", "https://api.dicebear.com/7.x/avataaars/svg?seed=Gordon", 840);
  insertUser.run("u3", "Alyx Vance", "student", "i1", "City 17 Tech", "Engineering student focused on sustainable tech.", "https://api.dicebear.com/7.x/avataaars/svg?seed=Alyx", 450);
}

const campCount = db.prepare("SELECT COUNT(*) as count FROM campaigns").get() as { count: number };
if (campCount.count === 0) {
  const insertCamp = db.prepare("INSERT INTO campaigns (id, userId, institutionId, title, description, goalAmount, currentAmount, category, sdg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  insertCamp.run("c1", "u1", "i1", "Ocean Plastic Filtration", "Developing autonomous drones to filter microplastics from the Pacific Gyre.", 500000, 325000, "Environment", "Life Below Water");
  insertCamp.run("c2", "u2", "i2", "Clean Fusion Energy", "Prototyping a compact cold fusion reactor for sustainable urban power.", 2000000, 1450000, "Energy", "Affordable and Clean Energy");

  const insertMilestone = db.prepare("INSERT INTO milestones (id, campaignId, title, description, isCompleted, orderIndex) VALUES (?, ?, ?, ?, ?, ?)");
  insertMilestone.run("m1", "c1", "Prototype Design", "Finalize the CAD models for the filtration units.", 1, 0);
  insertMilestone.run("m2", "c1", "Material Sourcing", "Acquire biodegradable polymers for the drone chassis.", 1, 1);
  insertMilestone.run("m3", "c1", "Initial Deployment", "Launch 5 test units in the San Francisco Bay.", 0, 2);

  const insertSolution = db.prepare("INSERT INTO solutions (id, campaignId, userId, title, description, votes, feasibilityScore) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertSolution.run("s1", "c1", "u3", "Magnetic Collection", "Using magnetized mesh to attract specific plastic types.", 42, 85);
}
 else {
  // Update existing mock users if they are missing institutionId
  db.prepare("UPDATE users SET institutionId = 'i1' WHERE id = 'u1' AND institutionId IS NULL").run();
  db.prepare("UPDATE users SET institutionId = 'i2' WHERE id = 'u2' AND institutionId IS NULL").run();
  db.prepare("UPDATE users SET institutionId = 'i1' WHERE id = 'u3' AND institutionId IS NULL").run();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/campaigns", (req, res) => {
    const campaigns = db.prepare(`
      SELECT c.*, u.name as authorName, i.name as institutionName,
      (SELECT COUNT(*) FROM solutions WHERE campaignId = c.id) as solutionCount
      FROM campaigns c
      JOIN users u ON c.userId = u.id
      LEFT JOIN institutions i ON c.institutionId = i.id
      ORDER BY c.createdAt DESC
    `).all();
    res.json(campaigns);
  });

  app.get("/api/campaigns/:id", (req, res) => {
    const campaign = db.prepare(`
      SELECT c.*, u.name as authorName, i.name as institutionName
      FROM campaigns c
      JOIN users u ON c.userId = u.id
      LEFT JOIN institutions i ON c.institutionId = i.id
      WHERE c.id = ?
    `).get(req.params.id);
    
    if (campaign) {
      const milestones = db.prepare("SELECT * FROM milestones WHERE campaignId = ? ORDER BY orderIndex").all(req.params.id);
      const solutions = db.prepare(`
        SELECT s.*, u.name as authorName, u.avatar as authorAvatar
        FROM solutions s
        JOIN users u ON s.userId = u.id
        WHERE s.campaignId = ?
        ORDER BY s.votes DESC
      `).all(req.params.id);
      res.json({ ...campaign, milestones, solutions });
    } else {
      res.status(404).json({ error: "Campaign not found" });
    }
  });

  app.post("/api/solutions/:id/vote", (req, res) => {
    db.prepare("UPDATE solutions SET votes = votes + 1 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/impact/stats", (req, res) => {
    const stats = {
      totalFunding: db.prepare("SELECT SUM(currentAmount) as total FROM campaigns").get().total || 0,
      activeCampaigns: db.prepare("SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'").get().count,
      verifiedInstitutions: db.prepare("SELECT COUNT(*) as count FROM institutions").get().count,
      publishedResearch: db.prepare("SELECT COUNT(*) as count FROM publications").get().count
    };
    res.json(stats);
  });

  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users").all();
    res.json(users);
  });

  app.get("/api/users/:id", (req, res) => {
    const user = db.prepare(`
      SELECT u.*, i.name as institutionName 
      FROM users u 
      LEFT JOIN institutions i ON u.institutionId = i.id 
      WHERE u.id = ?
    `).get(req.params.id);
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.get("/api/institutions", (req, res) => {
    const institutions = db.prepare(`
      SELECT i.*, 
      (SELECT COUNT(*) FROM users WHERE institutionId = i.id) as memberCount,
      (SELECT COUNT(*) FROM publications p JOIN users u ON p.userId = u.id WHERE u.institutionId = i.id) as publicationCount
      FROM institutions i
    `).all();
    res.json(institutions);
  });

  app.get("/api/institutions/:id", (req, res) => {
    const institution = db.prepare("SELECT * FROM institutions WHERE id = ?").get(req.params.id);
    if (institution) {
      res.json(institution);
    } else {
      res.status(404).json({ error: "Institution not found" });
    }
  });

  app.get("/api/institutions/:id/members", (req, res) => {
    const members = db.prepare("SELECT * FROM users WHERE institutionId = ?").all(req.params.id);
    res.json(members);
  });

  app.get("/api/publications", (req, res) => {
    const pubs = db.prepare(`
      SELECT p.*, u.name as authorName, u.role as authorRole 
      FROM publications p 
      JOIN users u ON p.userId = u.id 
      ORDER BY p.createdAt DESC
    `).all();
    res.json(pubs);
  });

  app.post("/api/publications", (req, res) => {
    const { id, userId, title, abstract, content, tags } = req.body;
    db.prepare("INSERT INTO publications (id, userId, title, abstract, content, tags) VALUES (?, ?, ?, ?, ?, ?)")
      .run(id, userId, title, abstract, content, tags);
    res.json({ success: true });
  });

  app.get("/api/discussions", (req, res) => {
    const discussions = db.prepare(`
      SELECT d.*, u.name as authorName, 
      (SELECT COUNT(*) FROM comments WHERE discussionId = d.id) as commentCount
      FROM discussions d 
      JOIN users u ON d.userId = u.id 
      ORDER BY d.createdAt DESC
    `).all();
    res.json(discussions);
  });

  app.post("/api/discussions", (req, res) => {
    const { id, userId, title, description, category } = req.body;
    db.prepare("INSERT INTO discussions (id, userId, title, description, category) VALUES (?, ?, ?, ?, ?)")
      .run(id, userId, title, description, category);
    res.json({ success: true });
  });

  app.get("/api/discussions/:id/comments", (req, res) => {
    const comments = db.prepare(`
      SELECT c.*, u.name as authorName, u.avatar as authorAvatar
      FROM comments c 
      JOIN users u ON c.userId = u.id 
      WHERE c.discussionId = ?
      ORDER BY c.createdAt ASC
    `).all(req.params.id);
    res.json(comments);
  });

  app.post("/api/comments", (req, res) => {
    const { id, discussionId, userId, content } = req.body;
    db.prepare("INSERT INTO comments (id, discussionId, userId, content) VALUES (?, ?, ?, ?)")
      .run(id, discussionId, userId, content);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
