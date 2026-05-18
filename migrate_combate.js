require('dotenv').config();
const db = require('./config/db.js');

const migrate = async () => {
  try {
    const query = `
      ALTER TABLE combate 
      ADD COLUMN categoria VARCHAR(50) AFTER idTorneo;
    `;
    await db.query(query);
    console.log("Migration successful: Added 'categoria' to 'combate' table.");
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Migration skipped: 'categoria' already exists in 'combate' table.");
      process.exit(0);
    } else {
      console.error("Migration failed:", error);
      process.exit(1);
    }
  }
};

migrate();
