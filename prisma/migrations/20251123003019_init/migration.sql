-- CreateTable
CREATE TABLE "User" (
    "telegramId" BIGINT NOT NULL,
    "isAuthenticated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("telegramId")
);
