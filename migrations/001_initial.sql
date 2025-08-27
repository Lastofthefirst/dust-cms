CREATE TABLE sites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    cover_image_path TEXT,
    config TEXT NOT NULL, -- JSON
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE content_schemas (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    fields TEXT NOT NULL, -- JSON
    max_instances INTEGER, -- NULL = unlimited, 0 = disabled, n = limit
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    UNIQUE(site_id, slug)
);

CREATE TABLE content_instances (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    schema_id TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    FOREIGN KEY (schema_id) REFERENCES content_schemas(id) ON DELETE CASCADE
);

CREATE TABLE uploads (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    optimized_variants TEXT NOT NULL, -- JSON
    created_at TEXT NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

CREATE INDEX idx_sites_slug ON sites(slug);
CREATE INDEX idx_content_schemas_site_id ON content_schemas(site_id);
CREATE INDEX idx_content_instances_site_id ON content_instances(site_id);
CREATE INDEX idx_content_instances_schema_id ON content_instances(schema_id);
CREATE INDEX idx_uploads_site_id ON uploads(site_id);