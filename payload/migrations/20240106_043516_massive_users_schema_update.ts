import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_users_education" AS ENUM('', 'tidak-belum-sekolah', 'tidak-tamat-sd-sederajat', 'tamat-sd-sederajat', 'smp-sederajat', 'sma', 'smk', 'diploma_1_3', 'diploma_4_s1', 'strata_2', 'strata_3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_users_gender" AS ENUM('', 'laki-laki', 'perempuan', 'memilih_untuk_tidak_menyebutkan');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "users" ADD COLUMN "education" "enum_users_education";
ALTER TABLE "users" ADD COLUMN "gender" "enum_users_gender";
ALTER TABLE "users" ADD COLUMN "birthdate" timestamp(3) with time zone;
ALTER TABLE "users" ADD COLUMN "birthplace" varchar;
ALTER TABLE "users" ADD COLUMN "bio" varchar;`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "users" DROP COLUMN IF EXISTS "education";
ALTER TABLE "users" DROP COLUMN IF EXISTS "gender";
ALTER TABLE "users" DROP COLUMN IF EXISTS "birthdate";
ALTER TABLE "users" DROP COLUMN IF EXISTS "birthplace";
ALTER TABLE "users" DROP COLUMN IF EXISTS "bio";`);

};
