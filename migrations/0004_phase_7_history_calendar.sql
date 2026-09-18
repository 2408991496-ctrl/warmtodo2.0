-- WarmTodo Phase 7 History & Calendar indexes.
-- No history_tasks table is created. Review and Calendar read active completion_records
-- joined to tasks, task_instances, projects, and tags.

CREATE INDEX IF NOT EXISTS idx_completion_active_completed_at
  ON completion_records(active, action, completed_at);

CREATE INDEX IF NOT EXISTS idx_completion_task_id
  ON completion_records(task_id);

CREATE INDEX IF NOT EXISTS idx_completion_task_instance_id
  ON completion_records(task_instance_id);

CREATE INDEX IF NOT EXISTS idx_task_instances_project_tag
  ON task_instances(project_id, tag, scheduled_date);
