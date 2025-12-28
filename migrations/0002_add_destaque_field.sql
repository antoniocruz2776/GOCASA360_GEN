-- Migration: Add destaque field to imoveis table
-- Description: Adds a boolean field to mark properties as featured/highlighted on homepage

-- Add destaque column to imoveis table
ALTER TABLE imoveis ADD COLUMN destaque BOOLEAN DEFAULT 0;

-- Create index for quick filtering of featured properties
CREATE INDEX IF NOT EXISTS idx_imoveis_destaque ON imoveis(destaque);

-- Update some existing properties to be featured for testing
UPDATE imoveis SET destaque = 1 WHERE id IN ('imovel-001', 'imovel-002', 'imovel-004');
