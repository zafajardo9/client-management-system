import { NextResponse } from "next/server";

import { projects } from "@/lib/actions";

/**
 * @swagger
 * /api/projects/{id}/transfer-ownership:
 *   post:
 *     summary: Transfer project ownership
 *     description: Transfer ownership of a project to another collaborator
 *     tags:
 *       - Projects
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetUserId:
 *                 type: string
 *             required:
 *               - targetUserId
 *     responses:
 *       200:
 *         description: Ownership transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     projectId:
 *                       type: string
 *                     ownerId:
 *                       type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { targetUserId } = await req.json();
    const { id: projectId } = await params;
    const result = await projects.transferOwnership({ projectId, targetUserId });

    if (result.success) {
      return NextResponse.json({ data: result.data });
    }

    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}
