-- modify_fojas_column.sql
ALTER TABLE "referenciales" ALTER COLUMN "fojas" TYPE text USING fojas::text;
