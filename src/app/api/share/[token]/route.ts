import { NextResponse } from "next/server";
import { shareLinks } from "@/lib/actions";

/**
 * @swagger
 * /api/share/{token}:
 *   get:
 *     summary: Get public updates by share token
 *     description: Retrieve public updates for a project using a share link token (no authentication required)
 *     tags:
 *       - Public Share
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Share link token
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
 *                     project:
 *                       $ref: '#/components/schemas/Project'
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
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await shareLinks.getPublicUpdatesByToken(token);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 404 });
}
