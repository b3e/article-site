const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { sql } = require("@vercel/postgres");

dotenv.config({ path: path.join(process.cwd(), ".env") });

function splitStatements(raw) {
  return raw
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function migrate() {
  const schemaPath = path.join(process.cwd(), "db", "schema.sql");
  const raw = fs.readFileSync(schemaPath, "utf-8");
  const statements = splitStatements(raw);

  for (const statement of statements) {
    await sql.query(statement);
  }
}

migrate()
  .then(() => {
    console.log("Migration complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
