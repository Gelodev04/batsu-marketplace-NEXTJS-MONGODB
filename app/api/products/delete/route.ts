import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db/mongodb";
import Product from "@/models/Product";
import { z } from "zod";

const deleteProductsSchema = z.object({
  productIds: z.array(z.string().min(1)).min(1),
});

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = deleteProductsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    // Delete products that belong to the authenticated user
    const result = await Product.deleteMany({
      _id: { $in: parsed.data.productIds },
      sellerEmail: session.user.email,
    });

    return NextResponse.json({
      deletedCount: result.deletedCount,
      message: `Successfully deleted ${result.deletedCount} product(s)`,
    });
  } catch (error) {
    console.error("Delete products error:", error);
    return NextResponse.json(
      { error: "Failed to delete products" },
      { status: 500 }
    );
  }
}
