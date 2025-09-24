import { NextResponse } from "next/server";
import { members } from "@/lib/actions";

/**
 * @swagger
 * /api/projects/{id}/members/{userId}:
 *   delete:
 *     summary: Remove project member
 *     description: Remove a member from a project
 *     tags:
 *       - Members
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to remove
 *     responses:
 *       200:
 *         description: Member removed successfully
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
 *                     userId:
 *                       type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  const { id, userId } = await params;
  const result = await members.removeMember({ projectId: id, userId });
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}

/**
 * @swagger
 * /api/projects/{id}/members/{userId}:
 *   patch:
 *     summary: Update project member role
 *     description: Change the role of an existing project collaborator
 *     tags:
 *       - Members
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [EDITOR, VIEWER]
 *             required:
 *               - role
 *     responses:
 *       200:
 *         description: Member role updated successfully
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
 *                     userId:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [EDITOR, VIEWER]
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  try {
    const { role } = await req.json();
    const { id: projectId, userId } = await params;
    const result = await members.updateMember({ projectId, userId, role });
    if (result.success) return NextResponse.json({ data: result.data });
    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}
