-- Migration SQL to add KAP (Kognitif, Afektif, Psikomotorik) weighting columns to CPMK table

ALTER TABLE cpmk ADD COLUMN IF NOT EXISTS kedalaman_k integer DEFAULT 0;
ALTER TABLE cpmk ADD COLUMN IF NOT EXISTS kedalaman_a integer DEFAULT 0;
ALTER TABLE cpmk ADD COLUMN IF NOT EXISTS kedalaman_p integer DEFAULT 0;
