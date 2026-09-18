-- WarmTodo Phase 6 additive migration.
-- Safe migration: do not drop or rebuild existing Tasks, Projects, Subtasks, Routines, or Tags.
-- Existing completed tasks may have no completion_records; that is valid.
--
-- Migration runners should check PRAGMA table_info(completion_records)
-- before running ALTER TABLE statements to keep this idempotent:
--
-- ALTER TABLE completion_records ADD COLUMN updated_at TEXT;
-- ALTER TABLE completion_records ADD COLUMN active INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS completion_records (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  task_id TEXT,
  task_instance_id TEXT,
  completed_at TEXT NOT NULL,
  mood TEXT,
  note TEXT,
  action TEXT NOT NULL DEFAULT 'complete',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (task_instance_id) REFERENCES task_instances(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_completion_active_target
  ON completion_records(target_type, target_id, active, completed_at);
