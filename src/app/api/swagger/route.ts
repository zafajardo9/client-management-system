import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/swagger';

/**
 * @swagger
 * /api/swagger:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI specification for the API
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const spec = {
    ...swaggerSpec,
    servers: [
      {
        url: origin,
        description: 'Current server',
      },
    ],
  };
  return NextResponse.json(spec);
}
