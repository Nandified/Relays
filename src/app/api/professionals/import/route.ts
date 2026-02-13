import { NextRequest, NextResponse } from "next/server";
import { importCSV } from "@/lib/idfpr-data";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: "No category provided" }, { status: 400 });
    }

    // Read file content
    const csvContent = await file.text();

    // Generate a filename from category
    const sanitized = category.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    const filename = `${sanitized}_import_${Date.now()}.csv`;

    // Import and get count
    const count = importCSV(filename, csvContent);

    return NextResponse.json({
      success: true,
      filename,
      importedCount: count,
      message: `Successfully imported ${count} records`,
    });
  } catch (error) {
    console.error("[api/professionals/import] Error:", error);
    return NextResponse.json(
      { error: "Failed to import CSV" },
      { status: 500 }
    );
  }
}
