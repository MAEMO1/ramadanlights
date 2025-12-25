-- Make iftar_time column nullable
ALTER TABLE iftar_events ALTER COLUMN iftar_time DROP NOT NULL;
