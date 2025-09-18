import { NextResponse } from "next/server";
import { updates } from "@/lib/actions";

/**
 * @swagger
 * /api/updates/{updateId}:
 *   get:
 *     summary: Get update by ID
 *     description: Retrieve a specific update by its ID
 *     tags:
 *       - Updates
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: updateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Update ID
 *     responses:
 *       200:
 *         description: Update details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Update'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(_req: Request, { params }: { params: Promise<{ updateId: string }> }) {
  const { updateId } = await params;
  const result = await updates.getUpdateById(updateId);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}

/**
 * @swagger
 * /api/updates/{updateId}:
 *   patch:
 *     summary: Update an update
 *     description: Update an existing update
 *     tags:
 *       - Updates
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: updateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Update ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               bodyMd:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Update updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Update'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ updateId: string }> }) {
  try {
    const body = await req.json();
    const { updateId } = await params;
    const result = await updates.updateUpdate({ updateId, ...body });
    if (result.success) return NextResponse.json({ data: result.data });
    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/updates/{updateId}:
 *   delete:
 *     summary: Delete update
 *     description: Delete an update
 *     tags:
 *       - Updates
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: updateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Update ID
 *     responses:
 *       200:
 *         description: Update deleted successfully
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
export async function DELETE(_req: Request, { params }: { params: Promise<{ updateId: string }> }) {
  const { updateId } = await params;
  const result = await updates.deleteUpdate(updateId);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}
