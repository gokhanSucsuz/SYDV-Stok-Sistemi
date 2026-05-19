import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Backup from "@/lib/models/Backup";
import Personnel from "@/lib/models/Personnel";
import Item from "@/lib/models/Item";
import Transaction from "@/lib/models/Transaction";
import MasterItem from "@/lib/models/MasterItem";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "alldata") {
      const personnel = (await Personnel.find()).map(x => x.toJSON({ getters: true }));
      const inventory = (await Item.find()).map(x => x.toJSON({ getters: true }));
      const transactions = (await Transaction.find()).map(x => x.toJSON({ getters: true }));
      const masterItems = (await MasterItem.find()).map(x => x.toJSON({ getters: true }));
      const backups = (await Backup.find()).map(x => x.toJSON({ getters: true }));

      return NextResponse.json({
        personnel,
        inventory,
        transactions,
        masterItems,
        backups,
      });
    }

    const backupsMap = await Backup.find().sort({ createdAt: -1 });

    const formatted = backupsMap.map((b: any) => {
      const obj = b.toJSON({ getters: true });
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

    const newBackup = await Backup.create(data);
    return NextResponse.json({ id: newBackup._id.toString() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
