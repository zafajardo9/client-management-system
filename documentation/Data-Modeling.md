# Data Modeling

Using Prisma with PostgreSQL. Below is a proposed schema focusing on projects, memberships, updates, and share links.

```prisma
// prisma/schema.prisma (proposed)
model User {
  id           String   @id @default(cuid())
  clerkUserId  String   @unique
  email        String   @unique
  name         String?
  imageUrl     String?
  projects     Project[]        @relation("OwnerProjects")
  memberships  ProjectMember[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Project {
  id           String   @id @default(cuid())
  ownerId      String
  owner        User     @relation("OwnerProjects", fields: [ownerId], references: [id])
  name         String
  description  String?
  isArchived   Boolean  @default(false)
  members      ProjectMember[]
  updates      Update[]
  shareLinks   ShareLink[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([ownerId, createdAt])
  @@index([isArchived])
}

model ProjectMember {
  id        String  @id @default(cuid())
  projectId String
  userId    String
  role      ProjectRole
  project   Project @relation(fields: [projectId], references: [id])
  user      User    @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@unique([projectId, userId])
  @@index([userId])
}

enum ProjectRole {
  OWNER
  EDITOR
  VIEWER
}

model Update {
  id         String   @id @default(cuid())
  projectId  String
  project    Project  @relation(fields: [projectId], references: [id])
  title      String
  bodyMd     String   // markdown content
  status     UpdateStatus @default(PUBLISHED)
  tags       String[]
  createdBy  String // userId of author
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([projectId, createdAt])
  @@index([status])
}

enum UpdateStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model ShareLink {
  id           String  @id @default(cuid())
  projectId    String
  project      Project @relation(fields: [projectId], references: [id])
  slug         String  @unique // used in /share/[slug]
  passwordHash String? // optional protection
  visibility   ShareVisibility @default(ALL)
  tagFilter    String[] // optional subset of tags
  enabled      Boolean @default(true)
  createdAt    DateTime @default(now())
  revokedAt    DateTime?

  @@index([projectId])
}

enum ShareVisibility {
  ALL
  PUBLISHED_ONLY
}
```

## Notes
- Keep `User` minimal and rely on Clerk as the source of truth for profile data.
- Use compound indexes for common filters and sorting.
- Prefer short lived queries and select only required fields.
