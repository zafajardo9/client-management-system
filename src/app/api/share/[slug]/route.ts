import { NextResponse } from "next/server";
import { shareLinks } from "@/lib/actions";

/**
 * @swagger
 * /api/share/{slug}:
 *   get:
 *     summary: Get public updates by share link
 *     description: Retrieve public updates for a project using a share link slug (no authentication required)
 *     tags:
 *       - Public Share
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Share link slug
 *     responses:
 *       200:
 *         description: Public updates and share link info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     link:
 *                       $ref: '#/components/schemas/ShareLink'
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Update'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Share link not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await shareLinks.getPublicUpdatesBySlug(slug);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 404 });
}
