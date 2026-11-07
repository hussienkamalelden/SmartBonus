CREATE TABLE IF NOT EXISTS waitlist (id INTEGER PRIMARY KEY AUTOINCREMENT, role TEXT NOT NULL DEFAULT 'pharmacy' CHECK (role IN ('pharmacy','supplier')), name TEXT, email TEXT, phone TEXT, country TEXT, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')), CHECK (email IS NOT NULL OR phone IS NOT NULL));
CREATE UNIQUE INDEX IF NOT EXISTS ux_waitlist_email ON waitlist(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_waitlist_phone ON waitlist(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_waitlist_created ON waitlist(created_at);
