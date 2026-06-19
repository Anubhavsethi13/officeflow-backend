import "dotenv/config";
import { app } from "./app";
import { prisma } from "./config/database";

const port = Number(process.env.PORT || 4000);

async function start() {
  await prisma.$connect();
  app.listen(port, () => {
    console.log(`OfficeFlow API running on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
