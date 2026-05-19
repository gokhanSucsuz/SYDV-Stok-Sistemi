import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Item from "@/lib/models/Item";
import { encryptDeterm } from "@/lib/encryption";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const unit = searchParams.get("unit");
    const id = searchParams.get("id");

    if (id) {
      const item = await Item.findById(id);
      if (!item)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      const obj = item.toJSON({ getters: true });
      return NextResponse.json({
        ...obj,
        id: (obj as any)._id.toString(),
        _id: undefined,
      });
    }

    let query = {};
    if (unit) {
      query = { unit: encryptDeterm(unit) || unit };
    }

    const items = await Item.find(query);
    const formatted = items.map((item: any) => {
      const obj = item.toJSON({ getters: true });
      return {
        ...obj,
        id: obj._id.toString(),
        _id: undefined,
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
    const newItem = await Item.create(data);
    return NextResponse.json(
      { id: newItem._id.toString(), ...newItem.toJSON({ getters: true }) },
      { status: 201 },
    );
  } catch (error: any) {
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
    const item = await Item.findById(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    Object.keys(data).forEach(key => item.set(key, data[key]));
    await item.save();

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

    await Item.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
