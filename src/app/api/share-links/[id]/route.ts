import { NextResponse } from "next/server";
import { shareLinks } from "@/lib/actions";

/**
 * @swagger
 * /api/share-links/{id}:
 *   patch:
 *     summary: Update share link
 *     description: Update an existing share link
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
 *         description: Share link ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *                 description: Toggle whether the share link is active
 *               regenerateToken:
 *                 type: boolean
 *                 description: Issue a new share token (also enables the link)
 *     responses:
 *       200:
 *         description: Share link updated successfully
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
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = (await req.json()) as { enabled?: unknown; regenerateToken?: unknown };

    const payload: { enabled?: boolean; regenerateToken?: boolean } = {};
    if (body.enabled !== undefined) {
      if (typeof body.enabled !== "boolean") {
        return NextResponse.json(
          { error: { code: "BAD_REQUEST", message: "`enabled` must be a boolean." } },
          { status: 400 }
        );
      }
      payload.enabled = body.enabled;
    }

    if (body.regenerateToken !== undefined) {
      if (typeof body.regenerateToken !== "boolean") {
        return NextResponse.json(
          { error: { code: "BAD_REQUEST", message: "`regenerateToken` must be a boolean." } },
          { status: 400 }
        );
      }
      payload.regenerateToken = body.regenerateToken;
    }

    const result = await shareLinks.updateShareLink(id, payload);
    if (result.success) return NextResponse.json({ data: result.data });
    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/share-links/{id}:
 *   delete:
 *     summary: Delete share link
 *     description: Revoke/delete a share link
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
 *         description: Share link ID
 *     responses:
 *       200:
 *         description: Share link deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await shareLinks.deleteShareLink(id);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}
