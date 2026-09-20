DROP TABLE IF EXISTS rules;
DROP TABLE IF EXISTS mission_events;

CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    description TEXT,

    definition JSONB NOT NULL,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rules_enabled
    ON rules (enabled);

CREATE INDEX idx_rules_definition
    ON rules USING GIN (definition);

CREATE TABLE mission_events (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);    