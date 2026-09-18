-- WarmTodo Phase 10 polish indexes and status support.
-- Safe migration notes:
--   ALTER TABLE tasks ADD COLUMN droppedAt TEXT; -- only if missing
--   ALTER TABLE tasks ADD COLUMN postponedAt TEXT; -- reserved, only if missing

CREATE INDEX IF NOT EXISTS idx_tasks_due_status_updated
  ON tasks(dueDate, status, updatedAt);

CREATE INDEX IF NOT EXISTS idx_tasks_title_tag_project
  ON tasks(title, tag, project_id);

CREATE INDEX IF NOT EXISTS idx_projects_title_tag
  ON projects(title, tag);

CREATE INDEX IF NOT EXISTS idx_completion_active_target_updated
  ON completion_records(active, target_type, target_id, updated_at);
