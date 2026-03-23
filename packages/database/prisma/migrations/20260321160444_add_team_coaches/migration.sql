-- CreateEnum
CREATE TYPE "TeamCoachRole" AS ENUM ('HEAD', 'ASSISTANT');

-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_coachId_fkey";
ALTER TABLE "teams" DROP COLUMN "coachId";

-- CreateTable
CREATE TABLE "team_coaches" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "TeamCoachRole" NOT NULL DEFAULT 'ASSISTANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_coaches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_coaches_teamId_userId_key" ON "team_coaches"("teamId", "userId");

-- AddForeignKey
ALTER TABLE "team_coaches" ADD CONSTRAINT "team_coaches_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_coaches" ADD CONSTRAINT "team_coaches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
