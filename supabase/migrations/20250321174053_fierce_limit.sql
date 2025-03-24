/*
  # Create Business Cards Table

  1. New Tables
    - `business_cards`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `title` (text, required)
      - `company` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `website` (text, optional)
      - `address` (text, optional)
      - `created_at` (timestamptz, default: now())
      - `image_url` (text, optional)

  2. Security
    - Enable RLS on `business_cards` table
    - Add policies for authenticated users to:
      - Read their own cards
      - Insert new cards
*/

CREATE TABLE IF NOT EXISTS business_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  website text,
  address text,
  created_at timestamptz DEFAULT now(),
  image_url text
);

ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cards"
  ON business_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert cards"
  ON business_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);