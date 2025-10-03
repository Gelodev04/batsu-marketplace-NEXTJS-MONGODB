import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import { z } from "zod";

const createProductSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(5000),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  condition: z.enum(["new", "used"]),
  images: z.array(z.string().url()).max(10).optional().default([]),
  sold: z.boolean().optional().default(false),
  tags: z.array(z.string().min(1)).max(20).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const seller = await User.findOne({ email: session.user.email });
    if (!seller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const product = await Product.create({
      ...parsed.data,
      sellerId: seller._id,
      sellerEmail: seller.email,
      sellerCampus: seller.campus,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const products = await Product.find({ sellerEmail: session.user.email })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ products });
}
