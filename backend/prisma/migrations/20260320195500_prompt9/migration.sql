-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('BOUNTY', 'TOURNAMENT', 'CHALLENGE');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "brief" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "deliverables" TEXT[],
ADD COLUMN     "endAt" TIMESTAMP(3),
ADD COLUMN     "openSourceBonus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "participantLimit" INTEGER,
ADD COLUMN     "rules" TEXT[],
ADD COLUMN     "startAt" TIMESTAMP(3),
ADD COLUMN     "techTags" TEXT[],
ADD COLUMN     "timeline" TEXT[],
ADD COLUMN     "type" "TaskType" NOT NULL DEFAULT 'BOUNTY';

ALTER TABLE "Task" ALTER COLUMN "brief" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "type" DROP DEFAULT;
