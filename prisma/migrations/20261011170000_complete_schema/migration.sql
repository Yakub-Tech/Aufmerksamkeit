-- Match the previously db-push-managed schema without dropping existing data.
CREATE TABLE IF NOT EXISTS "CommentLike" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "CommentLike_sessionId_commentId_key" ON "CommentLike"("sessionId", "commentId");
CREATE TABLE IF NOT EXISTS "TestStat" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TestStat_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "TestResult" (
    "id" SERIAL NOT NULL,
    "elapsed" INTEGER NOT NULL,
    "distractions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);
