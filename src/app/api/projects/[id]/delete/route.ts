import { NextResponse } from "next/server";

import { deleteProject } from "@/lib/actions/projects";

/**
 * @swagger
 * /api/projects/{id}/delete:
 *   post:
 *     summary: Permanently delete project
 *     description: Delete a project and all related data. Only the project owner can perform this action.
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
 *     responses:
 *       200:
 *         description: Project deleted successfully
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
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await deleteProject(id);
  if (result.success) {
    return NextResponse.json({ data: result.data });
  }
  return NextResponse.json({ error: result.error }, { status: 400 });
}
