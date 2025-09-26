import { NextResponse } from "next/server";
import { shareLinks } from "@/lib/actions";

/**
 * @swagger
 * /api/projects/{id}/share-links:
 *   get:
 *     summary: Get project share link
 *     description: Retrieve the public share link for a specific project
 *     tags:
 *       - Share Links
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of share links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ShareLink'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await shareLinks.getShareLink(id);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}

/**
 * @swagger
 * /api/projects/{id}/share-links:
 *   post:
 *     summary: Create or refresh share link
 *     description: Generate (or refresh) the share link token for a project and enable sharing
 *     tags:
 *       - Share Links
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       201:
 *         description: Share link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ShareLink'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await shareLinks.createShareLink(id);
  if (result.success) return NextResponse.json({ data: result.data }, { status: 201 });
  return NextResponse.json({ error: result.error }, { status: 400 });
}
