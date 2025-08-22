-- Fundraise Project Table Schema
-- This table stores information about fundraising projects

CREATE TABLE IF NOT EXISTS fundraise_project (
    id BIGSERIAL PRIMARY KEY,
    user_wallet TEXT NOT NULL, -- wallet address
    pitch_deck_link TEXT, -- link address to pitch deck
    funds_list_link TEXT, -- link address to funds list
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'processing', 'finalized')),
    crm_link BOOLEAN DEFAULT FALSE,
    outreach_started BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the user_wallet field for faster lookups
CREATE INDEX IF NOT EXISTS idx_fundraise_project_user_wallet ON fundraise_project(user_wallet);

-- Create an index on the status field for filtering
CREATE INDEX IF NOT EXISTS idx_fundraise_project_status ON fundraise_project(status);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_fundraise_project_updated_at 
    BEFORE UPDATE ON fundraise_project 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to the table and columns for documentation
COMMENT ON TABLE fundraise_project IS 'Stores information about fundraising projects including user wallet addresses, document links, and project status';
COMMENT ON COLUMN fundraise_project.user_wallet IS 'Wallet address of the project owner';
COMMENT ON COLUMN fundraise_project.pitch_deck_link IS 'Link to the pitch deck document';
COMMENT ON COLUMN fundraise_project.funds_list_link IS 'Link to the funds list document';
COMMENT ON COLUMN fundraise_project.status IS 'Current status of the fundraising project: created, processing, or finalized';
COMMENT ON COLUMN fundraise_project.crm_link IS 'Whether a CRM entry has been created for this project';
COMMENT ON COLUMN fundraise_project.outreach_started IS 'Whether outreach activities have begun for this project';
