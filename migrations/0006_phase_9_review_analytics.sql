-- WarmTodo Phase 9 Review & Analytics indexes.
-- Analytics use existing task, project, routine, instance, and completion data.
-- No aggregate snapshot table is created in this phase.

CREATE INDEX IF NOT EXISTS idx_completion_active_date_mood
  ON completion_records(active, action, completed_at, mood);

CREATE INDEX IF NOT EXISTS idx_tasks_tag_project_due
  ON tasks(tag, project_id, dueDate);

CREATE INDEX IF NOT EXISTS idx_instances_routine_date_status
  ON task_instances(recurring_task_id, scheduled_date, status);

CREATE INDEX IF NOT EXISTS idx_recurring_rule_window
  ON recurring_tasks(status, start_date, end_date, rule_type);
