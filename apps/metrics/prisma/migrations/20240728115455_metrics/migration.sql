-- CreateTable
CREATE TABLE "Metric" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);
