-- Migration script to convert media_articles table to use composite primary key
-- This script should be run manually with caution

-- Step 1: Create a backup of the current table
CREATE TABLE media_articles_backup AS SELECT * FROM media_articles;

-- Step 2: Drop the existing primary key constraint (if it exists)
ALTER TABLE media_articles DROP CONSTRAINT IF EXISTS media_articles_pkey;

-- Step 3: Create a new composite primary key
ALTER TABLE media_articles 
  ADD CONSTRAINT media_articles_pkey 
  PRIMARY KEY (article_id, media_type, media_id);

-- Step 4: Add a unique constraint to prevent duplicate media associations
ALTER TABLE media_articles 
  ADD CONSTRAINT media_articles_unique_association 
  UNIQUE (article_id, media_type, media_id);

-- Step 5: Add database trigger to handle media_id referential integrity
CREATE OR REPLACE FUNCTION check_media_ref() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.media_type = 'image' THEN
        -- Check if the image exists
        IF NOT EXISTS (SELECT 1 FROM images WHERE id = NEW.media_id) THEN
            RAISE EXCEPTION 'Referenced image with ID % does not exist', NEW.media_id;
        END IF;
    ELSIF NEW.media_type = 'video' THEN
        -- Check if the video exists
        IF NOT EXISTS (SELECT 1 FROM videos WHERE id = NEW.media_id) THEN
            RAISE EXCEPTION 'Referenced video with ID % does not exist', NEW.media_id;
        END IF;
    ELSE
        RAISE EXCEPTION 'Invalid media type: %', NEW.media_type;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS media_article_media_check ON media_articles;
CREATE TRIGGER media_article_media_check
BEFORE INSERT OR UPDATE ON media_articles
FOR EACH ROW EXECUTE FUNCTION check_media_ref();

-- Step 6: Add foreign key constraint for article_id (should already exist)
-- This ensures when an article is deleted, all associated media are also deleted
ALTER TABLE media_articles 
  DROP CONSTRAINT IF EXISTS media_articles_article_id_fkey;
  
ALTER TABLE media_articles
  ADD CONSTRAINT media_articles_article_id_fkey 
  FOREIGN KEY (article_id) 
  REFERENCES news(id) 
  ON DELETE CASCADE;