/*
  Warnings:

  - Changed the column `role` on the `memberships` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
-- ALTER TABLE "memberships" ALTER COLUMN "role" SET DATA TYPE "Role"[];


-- 1. Agregar columna temporal tipo array
ALTER TABLE "memberships" ADD COLUMN "role_new" "Role"[];

-- 2. Migrar los datos existentes al nuevo formato array
UPDATE "memberships" SET "role_new" = ARRAY["role"::TEXT]::"Role"[];

-- 3. Eliminar la columna original
ALTER TABLE "memberships" DROP COLUMN "role";

-- 4. Renombrar la nueva columna
ALTER TABLE "memberships" RENAME COLUMN "role_new" TO "role";