-- WarmTodo Phase 4-6 additive migration.
-- Safe for existing local SQLite data: no table drops, no destructive rebuilds.
-- Before running the ALTER statements below, the migration runner should check PRAGMA table_info(tasks)
-- and only add missing columns. This keeps the migration idempotent across SQLite versions.
--
-- ALTER TABLE tasks ADD COLUMN project_id TEXT REFERENCES projects(id) ON DELETE SET NULL;
-- ALTER TABLE tasks ADD COLUMN parent_task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL;
-- ALTER TABLE tasks ADD COLUMN recurring_task_id TEXT REFERENCES recurring_tasks(id) ON DELETE SET NULL;
-- ALTER TABLE recurring_tasks ADD COLUMN interval_days INTEGER;
-- ALTER TABLE recurring_tasks ADD COLUMN paused_at TEXT;

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  deadline TEXT,
  tag TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subtasks (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'doing',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recurring_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tag TEXT,
  project_id TEXT,
  rule_type TEXT NOT NULL,
  specific_days TEXT,
  custom_times_per_week INTEGER,
  interval_days INTEGER,
  start_date TEXT NOT NULL,
  end_date TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  paused_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS task_instances (
  id TEXT PRIMARY KEY,
  recurring_task_id TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  title TEXT NOT NULL,
  tag TEXT,
  project_id TEXT,
  status TEXT NOT NULL DEFAULT 'doing',
  completed_at TEXT,
  mood TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (recurring_task_id) REFERENCES recurring_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  UNIQUE (recurring_task_id, scheduled_date)
);

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
  created_at TEXT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (task_instance_id) REFERENCES task_instances(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(dueDate);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_sort ON subtasks(task_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_instances_scheduled_date ON task_instances(scheduled_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_instances_unique_routine_day ON task_instances(recurring_task_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_completion_target ON completion_records(target_type, target_id, completed_at);
