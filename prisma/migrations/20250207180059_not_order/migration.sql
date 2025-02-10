/*
  Warnings:

  - You are about to drop the column `order1` on the `Cardapio` table. All the data in the column will be lost.
  - You are about to drop the column `order2` on the `Cardapio` table. All the data in the column will be lost.
  - You are about to drop the column `order3` on the `Cardapio` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cardapio" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "morning" TEXT NOT NULL,
    "lunch" TEXT NOT NULL,
    "afternoon" TEXT NOT NULL
);
INSERT INTO "new_Cardapio" ("Id", "afternoon", "lunch", "morning") SELECT "Id", "afternoon", "lunch", "morning" FROM "Cardapio";
DROP TABLE "Cardapio";
ALTER TABLE "new_Cardapio" RENAME TO "Cardapio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
