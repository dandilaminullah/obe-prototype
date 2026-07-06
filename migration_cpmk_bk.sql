-- Migration SQL to add bk_id (Bahan Kajian relation) to CPMK table

ALTER TABLE cpmk ADD COLUMN IF NOT EXISTS bk_id uuid REFERENCES bahan_kajian(id) ON DELETE SET NULL;
