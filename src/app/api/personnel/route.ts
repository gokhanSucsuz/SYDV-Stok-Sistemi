import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Personnel from "@/lib/models/Personnel";

export async function GET() {
  try {
    await connectToDatabase();
    const personnelList = await Personnel.find();

    const formatted = personnelList.map((pDoc: any) => {
      const p = pDoc.toJSON({ getters: true });
      const isGokhan = p.name === "Gökhan SUÇSUZ";
      return {
        ...p,
        id: p._id.toString(),
        _id: undefined,
        role: isGokhan ? "super_admin" : (p.role || "personnel"),
        status: isGokhan ? "approved" : (p.status || "pending"),
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const newPersonnel = await Personnel.create(data);
    return NextResponse.json(
      { id: newPersonnel._id.toString() },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST personnel error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const data = await request.json();
    
    // Prevent overriding super_admin fields logic
    const existingObj = await Personnel.findById(id);
    if (!existingObj) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const existing = existingObj.toJSON({ getters: true });

    if (existing.role === "super_admin" || existing.name === "Gökhan SUÇSUZ") {
      if (data.status === "rejected" || data.status === "pending") {
         return NextResponse.json({ error: "Süper admin hesabı pasif yapılamaz." }, { status: 403 });
      }
      if (data.role === "personnel") {
         return NextResponse.json({ error: "Süper admin yetkisi alınamaz." }, { status: 403 });
      }
    }

    // Assign mapped keys to existing
    Object.keys(data).forEach((key) => {
      existingObj.set(key, data[key]);
    });
    await existingObj.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existingObj = await Personnel.findById(id);
    if (!existingObj) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const existing = existingObj.toJSON({ getters: true });

    if (existing.role === "super_admin" || existing.name === "Gökhan SUÇSUZ") {
       return NextResponse.json({ error: "Süper admin yetkili hesap silinemez." }, { status: 403 });
    }

    await Personnel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
