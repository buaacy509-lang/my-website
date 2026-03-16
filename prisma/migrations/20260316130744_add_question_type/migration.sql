/*
  Warnings:

  - You are about to drop the `VerificationCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `isPublic` on the `Question` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "VerificationCode_email_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VerificationCode";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "questionType" TEXT NOT NULL DEFAULT 'PUBLIC',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "answer" TEXT,
    "answeredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Question_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("answer", "answeredAt", "authorId", "content", "createdAt", "id", "status", "title", "updatedAt") SELECT "answer", "answeredAt", "authorId", "content", "createdAt", "id", "status", "title", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
