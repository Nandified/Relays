import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { getProfessionalStats } from "@/lib/professional-data";

export async function GET(request: NextRequest) {
  const stats = getProfessionalStats();

  // Optional debug payload (for diagnosing serverless file access on Vercel)
  const debug = request.nextUrl.searchParams.get("debug") === "1";
  if (!debug) return NextResponse.json(stats);

  const cwd = process.cwd();
  const dataDir = path.join(cwd, "data", "idfpr");
  const brokerCsv = path.join(dataDir, "real_estate_broker.csv");
  const inspectorCsv = path.join(dataDir, "home_inspector.csv");
  const enrichmentJson = path.join(dataDir, "idfpr_outscraper_enrichment.json");

  const dbg = {
    cwd,
    dataDir,
    dataDirExists: fs.existsSync(dataDir),
    brokerCsvExists: fs.existsSync(brokerCsv),
    inspectorCsvExists: fs.existsSync(inspectorCsv),
    enrichmentJsonExists: fs.existsSync(enrichmentJson),
  };

  return NextResponse.json({ ...stats, debug: dbg });
}
