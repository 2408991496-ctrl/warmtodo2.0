-- WarmTodo Phase 8 Desktop Widget support.
-- The widget reads the same task, project, subtask, routine, instance, and completion tables.
-- No duplicate widget_tasks table is created.

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_today_status
  ON tasks(dueDate, status, updatedAt);

CREATE INDEX IF NOT EXISTS idx_task_instances_today_status
  ON task_instances(scheduled_date, status, updated_at);
