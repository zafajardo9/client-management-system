// OpenAPI 3.0 specification for the Client Management System API
export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Client Management System API',
      version: '1.0.0',
      description: 'API documentation for the Client Management System - A platform for managing projects, updates, and share links',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://your-domain.com',
        description: process.env.NODE_ENV === 'development' ? 'Development server' : 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        ClerkAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Clerk JWT token for authentication',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'BAD_REQUEST',
                },
                message: {
                  type: 'string',
                  example: 'Invalid request parameters',
                },
                details: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
              required: ['code', 'message'],
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clr123abc456',
            },
            name: {
              type: 'string',
              example: 'Website Redesign',
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Complete redesign of the company website',
            },
            isArchived: {
              type: 'boolean',
              example: false,
            },
            ownerId: {
              type: 'string',
              example: 'user_abc123',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
          },
        },
        ProjectCreate: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'New Project',
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Project description',
            },
          },
        },
        Update: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'upd_123abc456',
            },
            projectId: {
              type: 'string',
              example: 'clr123abc456',
            },
            title: {
              type: 'string',
              example: 'Version 1.2.0 Released',
            },
            bodyMd: {
              type: 'string',
              example: '## New Features\n- Added dark mode\n- Improved performance',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
              example: 'PUBLISHED',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['feature', 'release'],
            },
            createdBy: {
              type: 'string',
              example: 'user_abc123',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
          },
        },
        UpdateCreate: {
          type: 'object',
          required: ['title', 'bodyMd'],
          properties: {
            title: {
              type: 'string',
              example: 'New Update Title',
            },
            bodyMd: {
              type: 'string',
              example: 'Update content in markdown format',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
              example: 'PUBLISHED',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['feature'],
            },
          },
        },
        ShareLink: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'shl_123abc456',
            },
            projectId: {
              type: 'string',
              example: 'clr123abc456',
            },
            token: {
              type: 'string',
              example: '12d9c7f8a6b44a5c9c1e8f3d9b2a6c1d',
            },
            enabled: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-20T09:18:42Z',
            },
          },
        },
        Member: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'mem_123abc456',
            },
            projectId: {
              type: 'string',
              example: 'clr123abc456',
            },
            userId: {
              type: 'string',
              example: 'user_abc123',
            },
            role: {
              type: 'string',
              enum: ['OWNER', 'EDITOR', 'VIEWER'],
              example: 'EDITOR',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
          },
        },
        MemberAdd: {
          type: 'object',
          required: ['userId', 'role'],
          properties: {
            userId: {
              type: 'string',
              example: 'user_def456',
            },
            role: {
              type: 'string',
              enum: ['EDITOR', 'VIEWER'],
              example: 'EDITOR',
            },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
            },
            pageSize: {
              type: 'integer',
              example: 20,
            },
            total: {
              type: 'integer',
              example: 45,
            },
          },
        },
      },
    },
    security: [
      {
        ClerkAuth: [],
      },
    ],
    paths: {
      '/api/projects': {
        get: {
          summary: 'Get all projects',
          description: 'Retrieve all projects for the authenticated user',
          tags: ['Projects'],
          security: [{ ClerkAuth: [] }],
          responses: {
            200: {
              description: 'List of projects',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Project' }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new project',
          description: 'Create a new project for the authenticated user',
          tags: ['Projects'],
          security: [{ ClerkAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectCreate' }
              }
            }
          },
          responses: {
            201: {
              description: 'Project created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/Project' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/projects/{id}/transfer-ownership': {
        post: {
          summary: 'Transfer project ownership',
          description: 'Transfer ownership of a project to another collaborator',
          tags: ['Projects'],
          security: [{ ClerkAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    targetUserId: { type: 'string' }
                  },
                  required: ['targetUserId']
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Ownership transferred successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          projectId: { type: 'string' },
                          ownerId: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/projects/{id}': {
        get: {
          summary: 'Get project by ID',
          description: 'Retrieve a specific project by its ID',
          tags: ['Projects'],
          security: [{ ClerkAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID'
            }
          ],
          responses: {
            200: {
              description: 'Project details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/Project' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        patch: {
          summary: 'Update project',
          description: 'Update an existing project',
          tags: ['Projects'],
          security: [{ ClerkAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Project updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/Project' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        delete: {
          summary: 'Archive project',
          description: 'Archive (soft delete) a project',
          tags: ['Projects'],
          security: [{ ClerkAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID'
            }
          ],
          responses: {
            200: {
              description: 'Project archived successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/share/{token}': {
        get: {
          summary: 'Get public updates by share token',
          description: 'Retrieve public updates for a project using a share link token (no authentication required)',
          tags: ['Public Share'],
          parameters: [
            {
              in: 'path',
              name: 'token',
              required: true,
              schema: {
                type: 'string',
              },
              description: 'Share link token',
            },
          ],
          responses: {
            200: {
              description: 'Public updates and share link info',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          link: { $ref: '#/components/schemas/ShareLink' },
                          project: { $ref: '#/components/schemas/Project' },
                          items: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Update' },
                          },
                        },
                      },
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            404: {
              description: 'Share link not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      }
    }
  };
