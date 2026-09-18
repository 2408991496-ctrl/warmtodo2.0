const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 10 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 2v4M16 2v4"/><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h6l2 3h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/><path d="M12 7v5l3 2"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><path d="M7.5 7.5h.01"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 1 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1A1.7 1.7 0 0 0 10 3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m5 12 4 4L19 6"/></svg>',
  smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>'
};

const tagConfig = {
  work: { label: "工作", cls: "tag-work", color: "#6d96c8" },
  study: { label: "学习", cls: "tag-study", color: "#a4ad83" },
  life: { label: "生活", cls: "tag-life", color: "#d98769" },
  health: { label: "健康", cls: "tag-health", color: "#7f9b66" },
  other: { label: "其他", cls: "tag-other", color: "#b5ada3" }
};

function allTags() {
  const custom = Object.fromEntries((state.customTags || []).map(tag => [tag.key, { ...tag, cls: "tag-custom" }]));
  return { ...tagConfig, ...custom };
}

function tagByKey(key) {
  return allTags()[key] || tagConfig.other;
}

function tagPill(tag) {
  return `<span class="tag-pill ${tag.cls || "tag-custom"}" style="${tag.cls === "tag-custom" ? `background:${tag.color}; color:#4f3b2b;` : ""}">${tag.label}</span>`;
}

const moods = [
  { key: "happy", icon: "😀", label: "开心" },
  { key: "satisfied", icon: "😌", label: "满足" },
  { key: "calm", icon: "🙂", label: "平静" },
  { key: "pleasant", icon: "🥰", label: "愉快" },
  { key: "tired", icon: "😫", label: "疲惫" },
  { key: "anxious", icon: "😣", label: "焦虑" },
  { key: "low", icon: "😞", label: "低落" },
  { key: "annoyed", icon: "😤", label: "烦躁" }
];

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function localWeekday(dateKey) {
  return parseLocalDate(dateKey).getDay();
}

function daysBetween(startDate, endDate) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  return Math.floor((end - start) / 86400000);
}

let todayKey = localDateKey();
const storeNames = ["tasks", "reflections", "projects", "subtasks", "recurring_tasks", "task_instances", "completion_records", "settings"];
const syncChannel = "BroadcastChannel" in window ? new BroadcastChannel("warmtodo-sync") : null;
const supabaseTable = "warmtodo_records";
const defaultSupabaseUrl = "https://jbobamlppbqvdexzxgjr.supabase.co";
const supabaseConfigKey = "warmtodo_supabase_config";

function readSupabaseConfig() {
  const fromWindow = window.WARMTODO_SUPABASE || {};
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(supabaseConfigKey) || "{}");
  } catch {
    saved = {};
  }
  return {
    url: defaultSupabaseUrl,
    anonKey: "",
    enabled: false,
    lastSync: "",
    ...fromWindow,
    ...saved
  };
}

let state = {
  db: null,
  view: "calendar",
  selectedProjectId: null,
  selectedRoutineId: null,
  weeklyReviewDate: todayKey,
  globalSearch: "",
  calendarMonth: todayKey.slice(0, 7),
  selectedCalendarDate: todayKey,
  taskDate: todayKey,
  reviewFilters: {
    search: "",
    time: "last30",
    tag: "all",
    project: "all",
    mood: "all",
    start: "",
    end: ""
  },
  widgetSettings: {
    enabled: true,
    size: "medium",
    showCompleted: true,
    showTags: true,
    showProgress: true,
    maxTasks: 6,
    rememberPosition: true,
    launchOnStart: false,
    alwaysOnTop: false,
    bounds: null
  },
  appSettings: {
    defaultTag: "other"
  },
  supabaseSettings: readSupabaseConfig(),
  cloudStatus: "idle",
  customTags: [],
  weeklyNotes: {},
  quickAddTag: "work",
  quickAddProject: "",
  taskEditor: null,
  routineEditor: null,
  floatingMenu: null,
  reflectionViewer: null,
  weeklyMemoryOpen: false,
  warmDialog: null,
  selectedMood: "",
  feelingSheet: null,
  tasks: [],
  projects: [],
  subtasks: [],
  recurringTasks: [],
  taskInstances: [],
  completionRecords: [],
  reflections: []
};

function uid() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("warmtodo_phase_1_3", 3);
    request.onupgradeneeded = event => {
      const db = request.result;
      for (const name of storeNames) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: "id" });
      }
      const tasks = event.target.transaction.objectStore("tasks");
      if (!tasks.indexNames.contains("by_project")) tasks.createIndex("by_project", "project_id", { unique: false });
      if (!tasks.indexNames.contains("by_due")) tasks.createIndex("by_due", "dueDate", { unique: false });
      const subtasks = event.target.transaction.objectStore("subtasks");
      if (!subtasks.indexNames.contains("by_task")) subtasks.createIndex("by_task", "task_id", { unique: false });
      const instances = event.target.transaction.objectStore("task_instances");
      if (!instances.indexNames.contains("by_schedule")) instances.createIndex("by_schedule", ["recurring_task_id", "scheduled_date"], { unique: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(storeName, mode = "readonly") {
  return state.db.transaction(storeName, mode).objectStore(storeName);
}

function localGetAll(storeName) {
  return new Promise((resolve, reject) => {
    const req = tx(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function localPut(storeName, value, shouldBroadcast = true) {
  return new Promise((resolve, reject) => {
    const req = tx(storeName, "readwrite").put(value);
    req.onsuccess = () => {
      if (shouldBroadcast && storeName !== "settings") broadcastSync(`${storeName}:put`);
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

function broadcastSync(reason = "data-change") {
  syncChannel?.postMessage({ source: "main", reason, at: Date.now() });
}

function localRemove(storeName, id, shouldBroadcast = true) {
  return new Promise((resolve, reject) => {
    const req = tx(storeName, "readwrite").delete(id);
    req.onsuccess = () => {
      if (shouldBroadcast) broadcastSync(`${storeName}:remove`);
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

function supabaseReady() {
  return Boolean(state.supabaseSettings?.enabled && state.supabaseSettings?.url && state.supabaseSettings?.anonKey);
}

function supabaseHeaders(extra = {}) {
  const key = state.supabaseSettings.anonKey;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra
  };
}

function supabaseBaseUrl(path) {
  return `${state.supabaseSettings.url.replace(/\/$/, "")}/rest/v1/${path}`;
}

async function supabaseRequest(path, options = {}) {
  const response = await fetch(supabaseBaseUrl(path), {
    ...options,
    headers: supabaseHeaders(options.headers || {})
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase ${response.status}: ${detail || response.statusText}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function cloudGetAll(storeName) {
  const rows = await supabaseRequest(`${supabaseTable}?store_name=eq.${encodeURIComponent(storeName)}&select=id,data,updated_at&order=updated_at.asc`);
  return (rows || []).map(row => row.data).filter(Boolean);
}

async function cloudPut(storeName, value) {
  const payload = {
    store_name: storeName,
    id: value.id,
    data: value,
    updated_at: value.updated_at || value.updatedAt || nowIso()
  };
  await supabaseRequest(`${supabaseTable}?on_conflict=store_name,id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(payload)
  });
}

async function cloudRemove(storeName, id) {
  await supabaseRequest(`${supabaseTable}?store_name=eq.${encodeURIComponent(storeName)}&id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}

async function getAll(storeName) {
  if (!supabaseReady()) return localGetAll(storeName);
  try {
    const cloudItems = await cloudGetAll(storeName);
    for (const item of cloudItems) await localPut(storeName, item, false);
    state.cloudStatus = "connected";
    return cloudItems;
  } catch (error) {
    console.error(error);
    state.cloudStatus = "offline";
    return localGetAll(storeName);
  }
}

async function put(storeName, value) {
  if (supabaseReady()) {
    try {
      await cloudPut(storeName, value);
      state.cloudStatus = "connected";
    } catch (error) {
      console.error(error);
      state.cloudStatus = "offline";
      toast("云端保存失败，已先保存在本地。");
    }
  }
  await localPut(storeName, value);
}

async function remove(storeName, id) {
  if (supabaseReady()) {
    try {
      await cloudRemove(storeName, id);
      state.cloudStatus = "connected";
    } catch (error) {
      console.error(error);
      state.cloudStatus = "offline";
      toast("云端删除失败，本地已继续处理。");
    }
  }
  await localRemove(storeName, id);
}

async function migrateInlineSubtasks() {
  const tasks = await getAll("tasks");
  const existing = await getAll("subtasks");
  const existingKeys = new Set(existing.map(item => item.id));
  for (const task of tasks) {
    if (!Array.isArray(task.subtasks) || !task.subtasks.length) continue;
    for (let index = 0; index < task.subtasks.length; index++) {
      const subtask = task.subtasks[index];
      const id = subtask.id || uid();
      if (existingKeys.has(id)) continue;
      await put("subtasks", {
        id,
        task_id: task.id,
        title: subtask.title,
        status: subtask.done ? "done" : "doing",
        sort_order: index,
        created_at: task.createdAt || nowIso(),
        updated_at: nowIso()
      });
    }
    delete task.subtasks;
    task.project_id = task.project_id || null;
    await put("tasks", task);
  }
}

async function seedIfNeeded() {
  const tasks = await getAll("tasks");
  const projects = await getAll("projects");
  if (!projects.length) {
    const project = projectSeed("WarmTodo 第二阶段", "补齐项目、周期任务与完成记录。", "work");
    await put("projects", project);
    await put("tasks", taskSeed("完成项目报告", "work", false, project.id));
    await put("tasks", taskSeed("回复客户邮件", "work", false, null));
    await put("tasks", taskSeed("学习新技能", "study", false, project.id));
  }
  if (!tasks.length) {
    await put("tasks", taskSeed("30分钟阅读", "study", true, null));
    await put("tasks", taskSeed("健身30分钟", "life", true, null));
  }
  const recurring = await getAll("recurring_tasks");
  if (!recurring.length) {
    await put("recurring_tasks", recurringSeed("晚间生活复盘", "life", "daily"));
    await put("recurring_tasks", recurringSeed("工作日阅读 20 分钟", "study", "weekdays"));
  }
}

function projectSeed(title, description, tag) {
  return {
    id: uid(),
    title,
    description,
    deadline: "",
    start_date: todayKey,
    end_date: "",
    tag,
    status: "active",
    created_at: nowIso(),
    updated_at: nowIso()
  };
}

function taskSeed(title, tag, done, projectId, dueDate = todayKey) {
  const id = uid();
  const completedAt = done ? nowIso() : null;
  return {
    id,
    title,
    tag,
    status: done ? "done" : "doing",
    dueDate,
    project_id: projectId,
    parent_task_id: null,
    recurring_task_id: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    completedAt,
    mood: done ? "satisfied" : null
  };
}

function recurringSeed(title, tag, ruleType) {
  return {
    id: uid(),
    title,
    description: "",
    tag,
    project_id: null,
    rule_type: ruleType,
    specific_days: [],
    interval_days: ruleType === "interval" ? 2 : null,
    start_date: todayKey,
    end_date: "",
    status: "active",
    paused_at: null,
    created_at: nowIso(),
    updated_at: nowIso()
  };
}

function shouldGenerate(template, dateKey) {
  if (template.status !== "active") return false;
  if (template.end_date && template.end_date < dateKey) return false;
  if (template.start_date && template.start_date > dateKey) return false;
  const day = localWeekday(dateKey);
  if (template.rule_type === "daily") return true;
  if (template.rule_type === "weekdays") return day >= 1 && day <= 5;
  if (template.rule_type === "weekends") return day === 0 || day === 6;
  if (template.rule_type === "specific") return normalizeSpecificDays(template.specific_days).includes(day);
  if (template.rule_type === "interval") {
    const interval = Math.max(1, Number(template.interval_days || 1));
    return daysBetween(template.start_date || dateKey, dateKey) % interval === 0;
  }
  return false;
}

function normalizeSpecificDays(value) {
  if (Array.isArray(value)) return value.map(Number);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch {
      return value.split(",").map(item => Number(item.trim())).filter(Number.isFinite);
    }
  }
  return [];
}

async function generateRecurringInstances(dateKey = localDateKey()) {
  todayKey = localDateKey();
  const templates = await getAll("recurring_tasks");
  const instances = await getAll("task_instances");
  const existing = new Set(instances.map(item => `${item.recurring_task_id}:${item.scheduled_date}`));
  for (const template of templates) {
    const normalized = normalizeRoutine(template);
    if (JSON.stringify(normalized) !== JSON.stringify(template)) await put("recurring_tasks", normalized);
    const key = `${normalized.id}:${dateKey}`;
    if (!shouldGenerate(normalized, dateKey) || existing.has(key)) continue;
    await put("task_instances", {
      id: uid(),
      recurring_task_id: normalized.id,
      scheduled_date: dateKey,
      title: normalized.title,
      tag: normalized.tag,
      project_id: normalized.project_id || null,
      status: "doing",
      completed_at: null,
      mood: null,
      note: "",
      created_at: nowIso(),
      updated_at: nowIso()
    });
  }
}

function normalizeRoutine(template) {
  return {
    ...template,
    description: template.description || "",
    rule_type: template.rule_type === "custom" ? "interval" : template.rule_type,
    specific_days: normalizeSpecificDays(template.specific_days),
    interval_days: template.interval_days || template.custom_times_per_week || (template.rule_type === "interval" ? 2 : null),
    start_date: template.start_date || todayKey,
    end_date: template.end_date || "",
    status: template.status || (template.is_active === false ? "paused" : "active"),
    paused_at: template.paused_at || null
  };
}

async function load() {
  state.tasks = (await getAll("tasks")).sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
  state.projects = (await getAll("projects")).sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
  state.subtasks = (await getAll("subtasks")).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  state.recurringTasks = await getAll("recurring_tasks");
  state.taskInstances = await getAll("task_instances");
  state.completionRecords = await getAll("completion_records");
  state.reflections = await getAll("reflections");
  const settings = await getAll("settings");
  const widgetSettings = settings.find(item => item.id === "desktop_widget");
  const customTags = settings.find(item => item.id === "custom_tags");
  if (widgetSettings) state.widgetSettings = { ...state.widgetSettings, ...widgetSettings.value };
  if (customTags) state.customTags = Array.isArray(customTags.value) ? customTags.value : [];
  state.weeklyNotes = Object.fromEntries(settings
    .filter(item => item.id.startsWith("weekly_note_"))
    .map(item => [item.id.replace("weekly_note_", ""), item.value || ""]));
  if (!state.selectedProjectId && state.projects[0]) state.selectedProjectId = state.projects[0].id;
  if (!state.selectedRoutineId || !state.recurringTasks.some(item => item.id === state.selectedRoutineId)) {
    state.selectedRoutineId = state.recurringTasks[0]?.id || null;
  }
  render();
}

async function saveWidgetSetting(key, value) {
  const next = { ...state.widgetSettings, [key]: value };
  if (key === "maxTasks") next.maxTasks = Math.max(1, Math.min(20, Number(value) || 6));
  state.widgetSettings = next;
  await put("settings", { id: "desktop_widget", value: next, updated_at: nowIso() });
  broadcastSync("widget-settings");
  await load();
}

async function saveWeeklyNote(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const range = weekRangeFromDate(state.weeklyReviewDate);
  const note = form.weekly_note.value.trim();
  state.weeklyNotes[range.start] = note;
  await put("settings", { id: `weekly_note_${range.start}`, value: note, updated_at: nowIso() });
  await load();
  toast("写给下周的自己已保存。");
}

function openWidgetWindow() {
  const saved = state.widgetSettings.rememberPosition ? state.widgetSettings.bounds : null;
  const width = saved?.width || (state.widgetSettings.size === "small" ? 300 : state.widgetSettings.size === "large" ? 430 : 360);
  const height = saved?.height || (state.widgetSettings.size === "small" ? 360 : state.widgetSettings.size === "large" ? 620 : 500);
  const left = saved?.x ?? Math.max(20, window.screen.availWidth - width - 32);
  const top = saved?.y ?? 48;
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`;
  window.open("./widget.html", "warmtodo-widget", features);
}

async function exportData() {
  try {
    const payload = {};
    for (const name of storeNames) payload[name] = await localGetAll(name);
    const blob = new Blob([JSON.stringify({ exported_at: nowIso(), version: "phase-10", data: payload }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `warmtodo-export-${todayKey}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast("数据已导出为 JSON。");
  } catch (error) {
    console.error(error);
    toast("导出失败，请稍后再试。");
  }
}

function persistSupabaseConfig(next) {
  state.supabaseSettings = { ...state.supabaseSettings, ...next };
  localStorage.setItem(supabaseConfigKey, JSON.stringify(state.supabaseSettings));
}

async function saveSupabaseSettings(event) {
  event.preventDefault();
  const form = event.currentTarget;
  persistSupabaseConfig({
    url: form.supabase_url.value.trim() || defaultSupabaseUrl,
    anonKey: form.supabase_anon_key.value.trim(),
    enabled: form.supabase_enabled.checked
  });
  toast(state.supabaseSettings.enabled ? "Supabase 云端已启用。" : "Supabase 云端已关闭。");
  render();
}

async function testSupabaseConnection() {
  if (!supabaseReady()) return toast("请先填写 Supabase anon key 并启用云端。");
  try {
    await supabaseRequest(`${supabaseTable}?select=store_name,id&limit=1`);
    state.cloudStatus = "connected";
    persistSupabaseConfig({ lastSync: nowIso() });
    await load();
    toast("Supabase 连接成功。");
  } catch (error) {
    console.error(error);
    state.cloudStatus = "offline";
    render();
    toast("Supabase 连接失败，请检查 SQL 表和 anon key。");
  }
}

async function pushLocalToSupabase() {
  if (!supabaseReady()) return toast("请先填写 Supabase anon key 并启用云端。");
  try {
    for (const name of storeNames) {
      const items = await localGetAll(name);
      for (const item of items) await cloudPut(name, item);
    }
    state.cloudStatus = "connected";
    persistSupabaseConfig({ lastSync: nowIso() });
    await load();
    toast("本地数据已上传到 Supabase。");
  } catch (error) {
    console.error(error);
    state.cloudStatus = "offline";
    render();
    toast("上传失败，请检查 Supabase 配置。");
  }
}

async function pullSupabaseToLocal() {
  if (!supabaseReady()) return toast("请先填写 Supabase anon key 并启用云端。");
  try {
    for (const name of storeNames) {
      const items = await cloudGetAll(name);
      for (const item of items) await localPut(name, item, false);
    }
    state.cloudStatus = "connected";
    persistSupabaseConfig({ lastSync: nowIso() });
    await load();
    toast("Supabase 数据已同步到本地缓存。");
  } catch (error) {
    console.error(error);
    state.cloudStatus = "offline";
    render();
    toast("同步失败，请检查 Supabase 配置。");
  }
}

function dateInRange(dateKey, start, end) {
  const from = start || end || "";
  const to = end || start || "";
  if (!from && !to) return false;
  return (!from || dateKey >= from) && (!to || dateKey <= to);
}

function taskScheduledForDate(task, dateKey) {
  if (task.dueDate === dateKey) return true;
  return subtasksFor(task.id).some(subtask => dateInRange(dateKey, subtask.start_date, subtask.end_date));
}

function itemsForDate(dateKey) {
  const datedTasks = state.tasks.filter(task => task.status !== "dropped" && taskScheduledForDate(task, dateKey));
  const instances = state.taskInstances.filter(item => item.scheduled_date === dateKey && !["skipped", "deleted"].includes(item.status));
  return [...datedTasks.map(taskToItem), ...instances.map(instanceToItem)];
}

function todayItems() {
  return itemsForDate(todayKey);
}

function taskDateItems() {
  return itemsForDate(state.taskDate || todayKey);
}

function yesterdayKey() {
  const date = parseLocalDate(todayKey);
  date.setDate(date.getDate() - 1);
  return localDateKey(date);
}

function nextDateKey(dateKey) {
  const date = parseLocalDate(dateKey || todayKey);
  date.setDate(date.getDate() + 1);
  return localDateKey(date);
}

function unfinishedPreviousTasks() {
  return state.tasks
    .filter(task => task.dueDate && task.dueDate < todayKey && task.status !== "done" && task.status !== "dropped" && task.status !== "missed")
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
}

function globalSearchResults() {
  const query = state.globalSearch.trim().toLowerCase();
  if (!query) return [];
  const taskResults = state.tasks
    .filter(task => [task.title, tagByKey(task.tag)?.label || "", state.projects.find(project => project.id === task.project_id)?.title || ""].join(" ").toLowerCase().includes(query))
    .slice(0, 6)
    .map(task => ({ type: "Task", title: task.title, meta: task.dueDate || "No date" }));
  const projectResults = state.projects
    .filter(project => [project.title, project.description || "", tagByKey(project.tag)?.label || ""].join(" ").toLowerCase().includes(query))
    .slice(0, 4)
    .map(project => ({ type: "Project", title: project.title, meta: `${projectProgress(project.id)}%` }));
  const tagResults = Object.entries(allTags())
    .filter(([, tag]) => tag.label.toLowerCase().includes(query))
    .map(([key, tag]) => ({ type: "Tag", title: tag.label, meta: `${state.tasks.filter(task => task.tag === key).length} tasks` }));
  return [...taskResults, ...projectResults, ...tagResults].slice(0, 10);
}

function taskToItem(task) {
  return { ...task, kind: "task", completed_at: task.completedAt, project_id: task.project_id || null };
}

function instanceToItem(instance) {
  return { ...instance, kind: "instance", dueDate: instance.scheduled_date, completedAt: instance.completed_at };
}

function missedRecordToCalendarItem(record) {
  const source = record.target_type === "instance"
    ? state.taskInstances.find(item => item.id === record.target_id || item.id === record.task_instance_id)
    : state.tasks.find(item => item.id === record.target_id || item.id === record.task_id);
  if (!source) return null;
  return {
    ...source,
    id: record.id,
    source_id: source.id,
    kind: "missed",
    status: "missed",
    dueDate: record.completed_at.slice(0, 10),
    completedAt: null,
    completed_at: record.completed_at,
    tag: source.tag || "other",
    project_id: source.project_id || null,
    record
  };
}

function missedCalendarItemsForDate(dateKey) {
  return state.completionRecords
    .filter(record => record.action === "missed" && record.active !== false && record.completed_at.slice(0, 10) === dateKey)
    .map(missedRecordToCalendarItem)
    .filter(Boolean);
}

function calendarItemsForDate(dateKey) {
  const activeItems = itemsForDate(dateKey);
  const activeKeys = new Set(activeItems.map(item => `${item.kind}:${item.id}`));
  const missedItems = missedCalendarItemsForDate(dateKey)
    .filter(item => !activeKeys.has(`task:${item.source_id}`) && !activeKeys.has(`instance:${item.source_id}`));
  return [...activeItems, ...missedItems];
}

function subtasksFor(taskId) {
  return state.subtasks.filter(item => item.task_id === taskId);
}

function projectDateText(project) {
  if (!project) return "没有日期";
  const start = project.start_date || "";
  const end = project.end_date || project.deadline || "";
  if (start && end) return `${start} → ${end}`;
  if (start) return `Start ${start}`;
  if (end) return `End ${end}`;
  return "没有日期";
}

function subtaskDateText(subtask) {
  const start = subtask.start_date || "";
  const end = subtask.end_date || "";
  if (start && end) return `${start} → ${end}`;
  if (start) return `Start ${start}`;
  if (end) return `End ${end}`;
  return "";
}

function missedRecordTime(dateKey) {
  return `${dateKey}T23:59:00.000`;
}

async function addMissedRecordForTask(task, fromDate, note) {
  const existing = state.completionRecords.find(record =>
    record.target_type === "task" &&
    record.target_id === task.id &&
    record.action === "missed" &&
    record.active !== false &&
    record.completed_at.slice(0, 10) === fromDate
  );
  if (existing) return;
  const at = nowIso();
  await put("completion_records", {
    id: uid(),
    target_type: "task",
    target_id: task.id,
    task_id: task.id,
    task_instance_id: null,
    completed_at: missedRecordTime(fromDate),
    mood: null,
    note,
    action: "missed",
    active: true,
    created_at: at,
    updated_at: at
  });
}

async function carryOverProjectTask(task, targetDate = todayKey, manual = false) {
  if (!task?.project_id || !task.dueDate || task.dueDate >= targetDate || ["done", "dropped"].includes(task.status)) return false;
  const fromDate = task.dueDate;
  await addMissedRecordForTask(task, fromDate, `Carry over to ${targetDate}`);
  task.status = "doing";
  task.dueDate = targetDate;
  task.missedAt = nowIso();
  task.updatedAt = nowIso();
  await put("tasks", task);
  for (const subtask of subtasksFor(task.id).filter(item => item.status !== "done")) {
    if (!subtask.start_date || subtask.start_date < targetDate) subtask.start_date = targetDate;
    subtask.updated_at = nowIso();
    await put("subtasks", subtask);
  }
  if (manual) toast("已保留原日期未完成记录，并把这条 Project 任务移到今天。");
  return true;
}

async function carryOverProjectSubtasks(task, targetDate = todayKey) {
  let changed = false;
  for (const subtask of subtasksFor(task.id).filter(item => item.status !== "done")) {
    const end = subtask.end_date || subtask.start_date;
    if (!end || end >= targetDate) continue;
    await addMissedRecordForTask(task, end, `Subtask "${subtask.title}" carry over to ${targetDate}`);
    subtask.start_date = targetDate;
    subtask.end_date = subtask.end_date ? targetDate : "";
    subtask.updated_at = nowIso();
    await put("subtasks", subtask);
    changed = true;
  }
  return changed;
}

async function carryOverOverdueProjectWork() {
  let changed = false;
  for (const task of state.tasks.filter(item => item.project_id && item.dueDate && item.dueDate < todayKey && item.status !== "done" && item.status !== "dropped")) {
    changed = (await carryOverProjectTask(task, todayKey)) || changed;
  }
  for (const task of state.tasks.filter(item => item.project_id && item.status !== "done" && item.status !== "dropped")) {
    changed = (await carryOverProjectSubtasks(task, todayKey)) || changed;
  }
  if (changed) await load();
}

function completionFor(item) {
  return state.completionRecords
    .filter(record => record.target_type === item.kind && record.target_id === item.id && record.action === "complete" && record.active !== false)
    .sort((a, b) => b.completed_at.localeCompare(a.completed_at))[0];
}

function moodByKey(key) {
  return moods.find(mood => mood.key === key);
}

function activeCompletionRecords(includeMissed = false) {
  return state.completionRecords
    .filter(record => (record.action === "complete" || (includeMissed && record.action === "missed")) && record.active !== false)
    .sort((a, b) => b.completed_at.localeCompare(a.completed_at));
}

function historyItemFromRecord(record) {
  const source = record.target_type === "instance"
    ? state.taskInstances.find(item => item.id === record.target_id || item.id === record.task_instance_id)
    : state.tasks.find(item => item.id === record.target_id || item.id === record.task_id);
  if (!source) return null;
  const project = source.project_id ? state.projects.find(item => item.id === source.project_id) : null;
  const tag = tagByKey(source.tag);
  return {
    id: record.id,
    record,
    source,
    kind: record.target_type,
    title: source.title,
    tagKey: source.tag || "other",
    tag,
    project,
    mood: moodByKey(record.mood),
    action: record.action,
    completedAt: record.completed_at,
    dateKey: record.completed_at.slice(0, 10),
    time: formatTime(record.completed_at),
    note: record.note || ""
  };
}

function allHistoryItems(includeMissed = false) {
  return activeCompletionRecords(includeMissed).map(historyItemFromRecord).filter(Boolean);
}

function dateRangeForFilter(filters) {
  const today = parseLocalDate(todayKey);
  if (filters.time === "last7") {
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    return { start: localDateKey(start), end: todayKey };
  }
  if (filters.time === "last30") {
    const start = new Date(today);
    start.setDate(today.getDate() - 29);
    return { start: localDateKey(start), end: todayKey };
  }
  if (filters.time === "month") {
    return { start: `${todayKey.slice(0, 7)}-01`, end: monthEndKey(todayKey.slice(0, 7)) };
  }
  if (filters.time === "custom") {
    return { start: filters.start || "0000-01-01", end: filters.end || "9999-12-31" };
  }
  return { start: "0000-01-01", end: "9999-12-31" };
}

function filteredHistoryItems() {
  const filters = state.reviewFilters;
  const range = dateRangeForFilter(filters);
  const query = filters.search.trim().toLowerCase();
  return allHistoryItems(true).filter(item => {
    if (item.dateKey < range.start || item.dateKey > range.end) return false;
    if (filters.tag !== "all" && item.tagKey !== filters.tag) return false;
    if (filters.project !== "all" && (item.project?.id || "") !== filters.project) return false;
    if (filters.mood !== "all" && (item.record.mood || "") !== filters.mood) return false;
    if (!query) return true;
    const haystack = [item.title, item.project?.title || "", item.tag.label].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function groupHistoryByDate(items) {
  return items.reduce((groups, item) => {
    if (!groups[item.dateKey]) groups[item.dateKey] = [];
    groups[item.dateKey].push(item);
    return groups;
  }, {});
}

function monthEndKey(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return localDateKey(new Date(year, month, 0));
}

function calendarDays(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const days = [];
  for (let index = 0; index < 42; index++) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    days.push({
      date,
      dateKey: localDateKey(date),
      inMonth: date.getMonth() === month - 1
    });
  }
  return days;
}

function addDaysKey(dateKey, amount) {
  const date = parseLocalDate(dateKey);
  date.setDate(date.getDate() + amount);
  return localDateKey(date);
}

function weekRangeFromDate(dateKey) {
  const date = parseLocalDate(dateKey || todayKey);
  const weekday = date.getDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + mondayOffset);
  const start = localDateKey(date);
  return { start, end: addDaysKey(start, 6) };
}

function weekDateKeys(range) {
  return Array.from({ length: 7 }, (_, index) => addDaysKey(range.start, index));
}

function weekLabel(range) {
  const start = parseLocalDate(range.start);
  const end = parseLocalDate(range.end);
  return `${start.toLocaleDateString("zh-CN", { month: "long", day: "numeric" })} - ${end.toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}`;
}

function warmTodoWeekNumber(range) {
  const candidates = [
    ...state.tasks.flatMap(task => [task.createdAt?.slice(0, 10), task.dueDate]),
    ...state.taskInstances.map(item => item.scheduled_date),
    ...state.recurringTasks.map(item => item.start_date || item.created_at?.slice(0, 10)),
    ...state.completionRecords.map(item => item.completed_at?.slice(0, 10))
  ].filter(Boolean).sort();
  const first = candidates[0] || todayKey;
  const firstWeek = weekRangeFromDate(first);
  return Math.max(1, Math.floor(daysBetween(firstWeek.start, range.start) / 7) + 1);
}

function shiftReviewWeek(delta) {
  state.weeklyReviewDate = addDaysKey(state.weeklyReviewDate || todayKey, delta * 7);
  render();
}

function goReviewThisWeek() {
  state.weeklyReviewDate = todayKey;
  render();
}

function openWeeklyMemory() {
  state.weeklyMemoryOpen = true;
  render();
}

function closeWeeklyMemory() {
  state.weeklyMemoryOpen = false;
  render();
}

function completionItemsInRange(range) {
  return allHistoryItems(false).filter(item => item.dateKey >= range.start && item.dateKey <= range.end);
}

function weeklyReviewData() {
  const range = weekRangeFromDate(state.weeklyReviewDate || todayKey);
  const dates = weekDateKeys(range);
  const items = completionItemsInRange(range);
  const plannedByDay = dates.map(dateKey => ({ dateKey, items: itemsForDate(dateKey), completed: items.filter(item => item.dateKey === dateKey) }));
  const plannedTotal = plannedByDay.reduce((sum, day) => sum + day.items.length, 0);
  const completedTotal = items.length;
  const moodItems = items.filter(item => item.record.mood);
  const moodStats = moods.map(mood => {
    const count = moodItems.filter(item => item.record.mood === mood.key).length;
    return { ...mood, count, percent: moodItems.length ? Math.round((count / moodItems.length) * 100) : 0 };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
  const moodByDay = dates.map(dateKey => {
    const dayItems = items.filter(item => item.dateKey === dateKey && item.record.mood);
    const winner = moods.map(mood => ({
      ...mood,
      count: dayItems.filter(item => item.record.mood === mood.key).length
    })).sort((a, b) => b.count - a.count)[0];
    return { dateKey, mood: winner?.count ? winner : null, count: dayItems.length };
  });
  const projectStats = state.projects.map(project => {
    const completed = items.filter(item => item.project?.id === project.id).length;
    return { project, completed, progress: projectProgress(project.id) };
  }).filter(item => item.completed > 0).sort((a, b) => b.completed - a.completed);
  const routineStats = state.recurringTasks.map(routine => {
    const expectedDates = expectedRoutineDates(routine, range);
    const instances = state.taskInstances.filter(item => item.recurring_task_id === routine.id && item.scheduled_date >= range.start && item.scheduled_date <= range.end);
    const done = instances.filter(item => item.status === "done").length;
    return {
      routine: normalizeRoutine(routine),
      expected: expectedDates.length,
      done,
      rate: expectedDates.length ? Math.round((done / expectedDates.length) * 100) : 0
    };
  }).filter(item => item.expected > 0 || item.done > 0).sort((a, b) => b.done - a.done || b.rate - a.rate);
  const representative = items
    .filter(item => item.record.note || item.record.mood)
    .sort((a, b) => Number(Boolean(b.record.note)) - Number(Boolean(a.record.note)) || b.completedAt.localeCompare(a.completedAt))
    .slice(0, 3);
  const tagStats = Object.entries(allTags()).map(([key, tag]) => ({
    key,
    ...tag,
    count: items.filter(item => item.tagKey === key).length
  })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
  const nextWeekTasks = state.tasks
    .filter(task => task.status !== "done" && task.status !== "dropped" && (task.dueDate || "") > range.end)
    .sort((a, b) => (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31"))
    .slice(0, 4);
  return {
    range,
    dates,
    items,
    plannedByDay,
    plannedTotal,
    completedTotal,
    completionRate: plannedTotal ? Math.round((completedTotal / plannedTotal) * 100) : null,
    moodStats,
    moodByDay,
    topMood: moodStats[0] || null,
    projectStats,
    routineStats,
    representative,
    tagStats,
    topTag: tagStats[0],
    nextWeekTasks,
    note: state.weeklyNotes[range.start] || ""
  };
}

function calendarCounts(monthKey) {
  const start = `${monthKey}-01`;
  const end = monthEndKey(monthKey);
  return allHistoryItems().reduce((counts, item) => {
    if (item.dateKey >= start && item.dateKey <= end) counts[item.dateKey] = (counts[item.dateKey] || 0) + 1;
    return counts;
  }, {});
}

function completionStrength(count) {
  if (count >= 6) return "strong";
  if (count >= 3) return "medium";
  if (count >= 1) return "soft";
  return "";
}

function analyticsRange() {
  return dateRangeForFilter(state.reviewFilters);
}

function itemsInRange(items, range = analyticsRange()) {
  return items.filter(item => item.dateKey >= range.start && item.dateKey <= range.end);
}

function expectedRoutineDates(routine, range = analyticsRange()) {
  const normalized = normalizeRoutine(routine);
  const start = normalized.start_date && normalized.start_date > range.start ? normalized.start_date : range.start;
  const end = normalized.end_date && normalized.end_date < range.end ? normalized.end_date : range.end;
  if (start > end) return [];
  const dates = [];
  const cursor = parseLocalDate(start);
  const last = parseLocalDate(end);
  while (cursor <= last) {
    const dateKey = localDateKey(cursor);
    if (shouldGenerate(normalized, dateKey)) dates.push(dateKey);
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function currentRoutineStreak(routine) {
  const normalized = normalizeRoutine(routine);
  const instances = state.taskInstances.filter(item => item.recurring_task_id === normalized.id);
  const byDate = new Map(instances.map(item => [item.scheduled_date, item]));
  let cursor = parseLocalDate(todayKey);
  let streak = 0;
  for (let guard = 0; guard < 730; guard++) {
    const dateKey = localDateKey(cursor);
    if (normalized.start_date && dateKey < normalized.start_date) break;
    if (normalized.end_date && dateKey > normalized.end_date) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (!shouldGenerate(normalized, dateKey)) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    const instance = byDate.get(dateKey);
    if (!instance || instance.status !== "done") break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function longestRoutineStreak(routine) {
  const normalized = normalizeRoutine(routine);
  const instances = state.taskInstances
    .filter(item => item.recurring_task_id === normalized.id)
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
  if (!instances.length) return 0;
  const byDate = new Map(instances.map(item => [item.scheduled_date, item]));
  const first = instances[0].scheduled_date;
  const last = instances[instances.length - 1].scheduled_date > todayKey ? instances[instances.length - 1].scheduled_date : todayKey;
  let longest = 0;
  let current = 0;
  const cursor = parseLocalDate(first);
  const end = parseLocalDate(last);
  while (cursor <= end) {
    const dateKey = localDateKey(cursor);
    if (shouldGenerate(normalized, dateKey)) {
      const instance = byDate.get(dateKey);
      if (instance && instance.status === "done") {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return longest;
}

function reviewAnalytics() {
  const range = analyticsRange();
  const allItems = allHistoryItems();
  const items = itemsInRange(allItems, range);
  const totalTasksInRange = todayItems().filter(item => item.dueDate >= range.start && item.dueDate <= range.end).length;
  const tagStats = Object.entries(allTags()).map(([key, tag]) => ({
    key,
    ...tag,
    count: items.filter(item => item.tagKey === key).length
  })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
  const moodTotal = items.filter(item => item.record.mood).length;
  const moodStats = moods.map(mood => {
    const count = items.filter(item => item.record.mood === mood.key).length;
    return { ...mood, count, percent: moodTotal ? Math.round((count / moodTotal) * 100) : 0 };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
  const tagMood = tagStats.map(tag => {
    const tagItems = items.filter(item => item.tagKey === tag.key && item.record.mood);
    const winner = moods.map(mood => ({
      ...mood,
      count: tagItems.filter(item => item.record.mood === mood.key).length
    })).sort((a, b) => b.count - a.count)[0];
    return { tag, mood: winner, percent: tagItems.length && winner?.count ? Math.round((winner.count / tagItems.length) * 100) : 0 };
  }).filter(item => item.mood && item.mood.count > 0);
  const projectStatsInRange = state.projects.map(project => {
    const count = items.filter(item => item.project?.id === project.id).length;
    return { project, completed: count, progress: projectProgress(project.id) };
  }).filter(item => item.completed > 0).sort((a, b) => b.completed - a.completed);
  const routineStats = state.recurringTasks.map(routine => {
    const expectedDates = expectedRoutineDates(routine, range);
    const instances = state.taskInstances.filter(item => item.recurring_task_id === routine.id && item.scheduled_date >= range.start && item.scheduled_date <= range.end);
    const done = instances.filter(item => item.status === "done").length;
    return {
      routine: normalizeRoutine(routine),
      expected: expectedDates.length,
      done,
      rate: expectedDates.length ? Math.round((done / expectedDates.length) * 100) : 0,
      currentStreak: currentRoutineStreak(routine),
      longestStreak: longestRoutineStreak(routine)
    };
  }).filter(item => item.expected > 0 || item.done > 0).sort((a, b) => b.rate - a.rate);
  return {
    range,
    items,
    completed: items.length,
    completionRate: totalTasksInRange ? Math.round((items.length / totalTasksInRange) * 100) : null,
    activeProjects: state.projects.filter(project => project.status !== "archived").length,
    routineRate: routineStats.length ? Math.round(routineStats.reduce((sum, item) => sum + item.rate, 0) / routineStats.length) : null,
    tagStats,
    moodStats,
    tagMood,
    projectStatsInRange,
    routineStats,
    summary: {
      topTag: tagStats[0],
      topMood: moodStats[0],
      bestRoutine: routineStats[0],
      topProject: projectStatsInRange[0]
    }
  };
}

function stats() {
  return statsForDate(todayKey);
}

function statsForDate(dateKey) {
  const items = itemsForDate(dateKey);
  const done = items.filter(item => item.status === "done").length;
  const total = items.length;
  return { total, done, doing: total - done, rate: total ? Math.round((done / total) * 100) : 0 };
}

function progressFor(item) {
  if (item.kind === "instance") return item.status === "done" ? 100 : 0;
  const subs = subtasksFor(item.id);
  if (!subs.length) return item.status === "done" ? 100 : 0;
  return Math.round((subs.filter(sub => sub.status === "done").length / subs.length) * 100);
}

function projectProgress(projectId) {
  return projectStats(projectId).rate;
}

function projectStats(projectId) {
  const projectTasks = state.tasks.filter(task => task.project_id === projectId && task.status !== "missed" && task.status !== "dropped");
  if (!projectTasks.length) return { total: 0, done: 0, rate: 0 };
  const total = projectTasks.reduce((sum, task) => sum + Math.max(1, subtasksFor(task.id).length), 0);
  const done = projectTasks.reduce((sum, task) => {
    const subs = subtasksFor(task.id);
    if (!subs.length) return sum + (task.status === "done" ? 1 : 0);
    return sum + subs.filter(sub => sub.status === "done").length;
  }, 0);
  return { total, done, rate: total ? Math.round((done / total) * 100) : 0 };
}

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function recurrenceLabel(value) {
  return ({ daily: "每天", weekdays: "工作日", weekends: "周末", specific: "指定星期", interval: "每 X 天", custom: "自定义", none: "不重复" })[value] || "";
}

function routineRuleText(template) {
  const routine = normalizeRoutine(template);
  if (routine.rule_type === "specific") {
    const labels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return normalizeSpecificDays(routine.specific_days).map(day => labels[day]).join(" / ") || "未选择星期";
  }
  if (routine.rule_type === "interval") return `每 ${routine.interval_days || 1} 天`;
  return recurrenceLabel(routine.rule_type);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function openWarmDialog(config) {
  return new Promise(resolve => {
    state.warmDialog = {
      title: config.title || "",
      message: config.message || "",
      fields: config.fields || [],
      confirmText: config.confirmText || "确认",
      cancelText: config.cancelText || "取消",
      danger: Boolean(config.danger),
      resolver: resolve
    };
    render();
  });
}

function closeWarmDialog(value = null) {
  const resolver = state.warmDialog?.resolver;
  state.warmDialog = null;
  render();
  resolver?.(value);
}

function submitWarmDialog(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = {};
  for (const field of state.warmDialog?.fields || []) {
    if (field.type === "checkboxes") {
      data[field.name] = Array.from(form.querySelectorAll(`input[name="${field.name}"]:checked`)).map(input => input.value);
    } else {
      data[field.name] = form.elements[field.name]?.value || "";
    }
  }
  closeWarmDialog(data);
}

async function warmConfirm(title, message, options = {}) {
  return Boolean(await openWarmDialog({
    title,
    message,
    fields: [],
    confirmText: options.confirmText || "确认",
    cancelText: options.cancelText || "取消",
    danger: options.danger
  }));
}

async function warmPrompt(title, field, options = {}) {
  const result = await openWarmDialog({
    title,
    message: options.message || "",
    fields: [field],
    confirmText: options.confirmText || "保存",
    danger: options.danger
  });
  return result ? result[field.name] : null;
}

async function addTask(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const title = form.title.value.trim();
  if (!title) return toast("先写下一件今天要做的事。");
  const recurrence = form.recurrence.value;
  const projectId = form.project_id.value || null;
  state.quickAddTag = form.tag.value || state.quickAddTag || "work";
  state.quickAddProject = projectId || "";
  if (recurrence === "none") {
    await put("tasks", taskSeed(title, form.tag.value, false, projectId, state.taskDate || todayKey));
  } else {
    const template = recurringSeed(title, form.tag.value, recurrence);
    template.project_id = projectId;
    template.start_date = state.taskDate || todayKey;
    if (recurrence === "specific") template.specific_days = [localWeekday(state.taskDate || todayKey)];
    if (recurrence === "interval") template.interval_days = 2;
    await put("recurring_tasks", template);
    await generateRecurringInstances();
  }
  form.reset();
  form.tag.value = state.quickAddTag;
  form.project_id.value = state.quickAddProject;
  form.recurrence.value = "none";
  await generateRecurringInstances();
  await load();
  toast(recurrence === "none" ? "已加入今天。" : "周期任务已创建，并生成今日实例。");
}

async function addRoutine(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const title = form.routine_title.value.trim();
  if (!title) return toast("Routine 标题不能为空。");
  const routine = recurringSeed(title, form.tag.value, form.rule_type.value);
  routine.start_date = form.start_date.value || state.taskDate || todayKey;
  routine.end_date = form.end_date.value || "";
  routine.interval_days = Number(form.interval_days.value || 2);
  routine.specific_days = Array.from(form.querySelectorAll("input[name='specific_days']:checked")).map(input => Number(input.value));
  await put("recurring_tasks", routine);
  await generateRecurringInstances();
  form.reset();
  form.start_date.value = todayKey;
  await load();
  toast("Routine 已创建。");
}

async function addProject(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const title = form.project_title.value.trim();
  if (!title) return toast("Project 标题不能为空。");
  const project = projectSeed(title, form.description.value.trim(), form.tag.value);
  project.start_date = form.start_date.value || todayKey;
  project.end_date = form.end_date.value || "";
  project.deadline = project.end_date;
  await put("projects", project);
  state.selectedProjectId = project.id;
  form.reset();
  await load();
  toast("Project 已创建。");
}

async function editProject(id) {
  const project = state.projects.find(item => item.id === id);
  if (!project) return;
  const result = await openWarmDialog({
    title: "编辑 Project",
    message: "Project 是长期目标，日期只描述目标周期，不会改变已经完成的历史记录。",
    fields: [
      { type: "text", name: "title", label: "Project 标题", value: project.title },
      { type: "textarea", name: "description", label: "描述", value: project.description || "" },
      { type: "date", name: "start_date", label: "Start Date", value: project.start_date || "" },
      { type: "date", name: "end_date", label: "End Date", value: project.end_date || project.deadline || "" },
      { type: "select", name: "tag", label: "标签", value: project.tag || "other", options: Object.entries(allTags()).map(([key, tag]) => [key, tag.label]) }
    ],
    confirmText: "保存"
  });
  if (!result) return;
  const title = result.title.trim();
  if (!title) return toast("Project 标题不能为空。");
  project.title = title;
  project.description = result.description.trim();
  project.start_date = result.start_date || "";
  project.end_date = result.end_date || "";
  project.deadline = project.end_date;
  project.tag = result.tag || "other";
  project.updated_at = nowIso();
  await put("projects", project);
  await load();
  toast("Project 已更新。");
}

async function deleteProject(id) {
  const tasks = state.tasks.filter(task => task.project_id === id);
  let mode = "keep";
  if (tasks.length) {
    const result = await openWarmDialog({
      title: "删除 Project",
      message: "这个 Project 下还有任务。你可以保留任务并解除关联，或连同任务一起删除。",
      fields: [{ type: "select", name: "mode", label: "处理方式", value: "keep", options: [["keep", "保留任务"], ["delete", "删除 Project 和任务"]] }],
      confirmText: "继续",
      danger: true
    });
    if (!result) return;
    mode = result.mode;
  }
  if (mode === "delete") {
    for (const task of tasks) {
      for (const subtask of subtasksFor(task.id)) await remove("subtasks", subtask.id);
      await remove("tasks", task.id);
    }
  } else {
    for (const task of tasks) {
      task.project_id = null;
      task.updatedAt = nowIso();
      await put("tasks", task);
    }
  }
  for (const template of state.recurringTasks.filter(item => item.project_id === id)) {
    template.project_id = null;
    template.updated_at = nowIso();
    await put("recurring_tasks", template);
  }
  await remove("projects", id);
  state.selectedProjectId = null;
  await load();
  toast(mode === "delete" ? "Project 与相关任务已删除。" : "Project 已删除，相关任务已解除关联。");
}

async function selectProject(id) {
  state.selectedProjectId = id;
  render();
}

async function addProjectTask(event, projectId) {
  event.preventDefault();
  const form = event.currentTarget;
  const title = form.project_task_title.value.trim();
  if (!title) return toast("任务标题不能为空。");
  await put("tasks", taskSeed(title, form.tag.value, false, projectId, state.taskDate || todayKey));
  form.reset();
  await load();
  toast("任务已加入 Project，并同步到 Today。");
}

async function toggleItem(kind, id) {
  const item = kind === "task" ? state.tasks.find(task => task.id === id) : state.taskInstances.find(task => task.id === id);
  if (!item) return;
  if (item.status === "done") {
    await undoComplete(kind, id);
    return;
  }
  const record = await completeItem(kind, id, null, "");
  state.feelingSheet = { kind, id, recordId: record.id };
  await load();
}

async function saveFeeling(event) {
  event.preventDefault();
  if (!state.feelingSheet) return;
  const form = event.currentTarget;
  const mood = form.mood.value || "";
  const note = form.note.value.trim();
  await updateCompletionRecord(state.feelingSheet.recordId, mood || null, note);
  state.selectedMood = mood;
  state.feelingSheet = null;
  await load();
  toast("完成感受已保存。");
}

async function skipFeeling() {
  state.feelingSheet = null;
  await load();
  toast("已完成。");
}

async function completeItem(kind, id, mood, note) {
  const completedAt = nowIso();
  if (kind === "task") {
    const task = state.tasks.find(item => item.id === id);
    task.status = "done";
    task.completedAt = completedAt;
    task.mood = null;
    task.updatedAt = completedAt;
    await put("tasks", task);
  } else {
    const instance = state.taskInstances.find(item => item.id === id);
    instance.status = "done";
    instance.completed_at = completedAt;
    instance.mood = null;
    instance.note = "";
    instance.updated_at = completedAt;
    await put("task_instances", instance);
  }
  await deactivateCompletionRecords(kind, id);
  const record = {
    id: uid(),
    target_type: kind,
    target_id: id,
    task_id: kind === "task" ? id : null,
    task_instance_id: kind === "instance" ? id : null,
    completed_at: completedAt,
    mood,
    note,
    action: "complete",
    active: true,
    created_at: completedAt,
    updated_at: completedAt
  };
  await put("completion_records", record);
  return record;
}

async function updateCompletionRecord(id, mood, note) {
  const record = state.completionRecords.find(item => item.id === id) || (await getAll("completion_records")).find(item => item.id === id);
  if (!record) return;
  record.mood = mood || null;
  record.note = note || "";
  record.updated_at = nowIso();
  await put("completion_records", record);
}

async function deactivateCompletionRecords(kind, id) {
  const records = (await getAll("completion_records")).filter(record => record.target_type === kind && record.target_id === id && record.active !== false);
  for (const record of records) {
    record.active = false;
    record.updated_at = nowIso();
    await put("completion_records", record);
  }
}

async function undoComplete(kind, id) {
  if (!(await warmConfirm("撤销完成", "撤销完成会保留历史记录，并把任务恢复到进行中。继续吗？", { confirmText: "撤销完成" }))) return;
  const at = nowIso();
  if (kind === "task") {
    const task = state.tasks.find(item => item.id === id);
    task.status = "doing";
    task.completedAt = null;
    task.mood = null;
    task.updatedAt = at;
    await put("tasks", task);
  } else {
    const instance = state.taskInstances.find(item => item.id === id);
    instance.status = "doing";
    instance.completed_at = null;
    instance.mood = null;
    instance.note = "";
    instance.updated_at = at;
    await put("task_instances", instance);
  }
  await deactivateCompletionRecords(kind, id);
  await put("completion_records", {
    id: uid(),
    target_type: kind,
    target_id: id,
    task_id: kind === "task" ? id : null,
    task_instance_id: kind === "instance" ? id : null,
    completed_at: at,
    mood: null,
    note: "Undo complete",
    action: "undo",
    active: false,
    created_at: at,
    updated_at: at
  });
  await load();
  toast("已恢复到进行中，历史记录已保留。");
}

async function deleteTask(id) {
  const count = subtasksFor(id).length;
  const message = count ? `这个任务包含 ${count} 个子任务。删除任务和子任务吗？` : "删除这个任务吗？";
  if (!(await warmConfirm("删除任务", message, { confirmText: "删除", danger: true }))) return;
  for (const subtask of subtasksFor(id)) await remove("subtasks", subtask.id);
  await remove("tasks", id);
  await load();
  toast("任务已删除。");
}

async function moveTaskToToday(id) {
  const task = state.tasks.find(item => item.id === id);
  if (!task) return;
  const isProjectTask = Boolean(task.project_id);
  const message = isProjectTask
    ? "会保留原日期的未完成记录，并把同一条 Project 任务移到今天，不会生成重复任务。继续吗？"
    : "会保留原日期的未完成记录，并创建一条新的今日任务。继续吗？";
  if (!(await warmConfirm("移动到今天", message, { confirmText: "移动到今天" }))) return;
  if (isProjectTask && await carryOverProjectTask(task, todayKey, true)) {
    await load();
    return;
  }
  const at = nowIso();
  const nextTask = {
    ...task,
    id: uid(),
    status: "doing",
    dueDate: todayKey,
    completedAt: null,
    droppedAt: null,
    mood: null,
    createdAt: at,
    updatedAt: at
  };
  task.status = "missed";
  task.missedAt = at;
  task.updatedAt = at;
  await put("tasks", task);
  await put("tasks", nextTask);
  for (const subtask of subtasksFor(id)) {
    await put("subtasks", {
      ...subtask,
      id: uid(),
      task_id: nextTask.id,
      status: "doing",
      created_at: at,
      updated_at: at
    });
  }
  await put("completion_records", {
    id: uid(),
    target_type: "task",
    target_id: task.id,
    task_id: task.id,
    task_instance_id: null,
    completed_at: missedRecordTime(task.dueDate),
    mood: null,
    note: `Carry over to ${todayKey}`,
    action: "missed",
    active: true,
    created_at: at,
    updated_at: at
  });
  await load();
  toast("已保留昨天记录，并创建今天的新任务。");
}

async function changeTaskDate(id) {
  const task = state.tasks.find(item => item.id === id);
  if (!task) return;
  const date = await warmPrompt("设置日期", { type: "date", name: "date", label: "日期", value: task.dueDate || todayKey }, { confirmText: "更新日期" });
  if (!date) return;
  task.dueDate = date;
  task.updatedAt = nowIso();
  await put("tasks", task);
  await load();
  toast("日期已更新。");
}

async function dropTask(id) {
  const task = state.tasks.find(item => item.id === id);
  if (!task || !(await warmConfirm("Drop 任务", "它会从待办中移除，但不会删除历史记录。", { confirmText: "Drop", danger: true }))) return;
  task.status = "dropped";
  task.droppedAt = nowIso();
  task.updatedAt = nowIso();
  await put("tasks", task);
  await load();
  toast("任务已 Drop。");
}

async function moveTaskToProject(id) {
  const task = state.tasks.find(item => item.id === id);
  if (!task) return;
  const result = await openWarmDialog({
    title: "移动 Project",
    message: "选择这个任务所属的 Project。",
    fields: [{ type: "select", name: "project_id", label: "Project", value: task.project_id || "", options: [["", "无项目"], ...state.projects.map(project => [project.id, project.title])] }],
    confirmText: "更新"
  });
  if (!result) return;
  task.project_id = result.project_id || null;
  task.updatedAt = nowIso();
  await put("tasks", task);
  await load();
  toast("Project 关联已更新。");
}

async function copyTask(id) {
  const task = state.tasks.find(item => item.id === id);
  if (!task) return;
  const clone = {
    ...task,
    id: uid(),
    title: `${task.title} 副本`,
    status: "doing",
    completedAt: null,
    droppedAt: null,
    mood: null,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  await put("tasks", clone);
  await load();
  toast("任务已复制。");
}

async function editTask(id) {
  const task = state.tasks.find(item => item.id === id);
  if (!task) return;
  state.taskEditor = { id };
  render();
}

function closeTaskEditor() {
  state.taskEditor = null;
  render();
}

async function saveTaskEdit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const task = state.tasks.find(item => item.id === form.task_id.value);
  if (!task) return;
  const title = form.title.value.trim();
  if (!title) return toast("任务标题不能为空。");
  const previousRoutineId = task.recurring_task_id || null;
  const repeat = form.recurrence.value;
  const at = nowIso();
  task.title = title;
  task.tag = form.tag.value;
  task.project_id = form.project_id.value || null;
  task.dueDate = form.dueDate.value || state.taskDate || todayKey;
  task.updatedAt = at;
  await put("tasks", task);

  if (repeat === "none" && previousRoutineId) {
    const template = state.recurringTasks.find(item => item.id === previousRoutineId);
    if (template) {
      template.status = "ended";
      template.end_date = task.dueDate;
      template.updated_at = at;
      await put("recurring_tasks", template);
    }
    task.recurring_task_id = null;
    await put("tasks", task);
  } else if (repeat !== "none") {
    const template = previousRoutineId ? state.recurringTasks.find(item => item.id === previousRoutineId) : recurringSeed(title, task.tag, repeat);
    if (template) {
      template.title = title;
      template.tag = task.tag;
      template.project_id = task.project_id;
      template.rule_type = repeat;
      template.status = "active";
      template.start_date = previousRoutineId ? template.start_date || nextDateKey(task.dueDate) : nextDateKey(task.dueDate);
      template.updated_at = at;
      await put("recurring_tasks", template);
      task.recurring_task_id = template.id;
      await put("tasks", task);
      await generateRecurringInstances();
    }
  }

  state.taskEditor = null;
  state.taskDate = task.dueDate;
  await load();
  toast("任务已更新。");
}

async function addSubtask(id) {
  const task = state.tasks.find(item => item.id === id);
  const result = await openWarmDialog({
    title: "添加子任务",
    message: "子任务可以单独设置日期；设置后会同步到 Calendar 和 Today。",
    fields: [
      { type: "text", name: "title", label: "子任务名称", placeholder: "写下一个更小的步骤..." },
      { type: "date", name: "start_date", label: "Start Date", value: task?.dueDate || state.taskDate || todayKey },
      { type: "date", name: "end_date", label: "End Date", value: "" }
    ],
    confirmText: "添加"
  });
  if (!result || !result.title.trim()) return;
  const current = subtasksFor(id);
  await put("subtasks", {
    id: uid(),
    task_id: id,
    title: result.title.trim(),
    status: "doing",
    start_date: result.start_date || "",
    end_date: result.end_date || "",
    sort_order: current.length,
    created_at: nowIso(),
    updated_at: nowIso()
  });
  if (task?.project_id && result.start_date && (!task.dueDate || task.dueDate > result.start_date)) {
    task.dueDate = result.start_date;
    task.updatedAt = nowIso();
    await put("tasks", task);
  }
  await refreshTaskStatusFromSubtasks(id);
  await load();
}

async function editSubtask(id) {
  const subtask = state.subtasks.find(item => item.id === id);
  if (!subtask) return;
  const task = state.tasks.find(item => item.id === subtask.task_id);
  const result = await openWarmDialog({
    title: "修改子任务",
    message: "日期修改后会同步影响 Calendar 和 Today 的可见日期。",
    fields: [
      { type: "text", name: "title", label: "子任务名称", value: subtask.title },
      { type: "date", name: "start_date", label: "Start Date", value: subtask.start_date || "" },
      { type: "date", name: "end_date", label: "End Date", value: subtask.end_date || "" }
    ],
    confirmText: "保存"
  });
  if (!result || !result.title.trim()) return;
  subtask.title = result.title.trim();
  subtask.start_date = result.start_date || "";
  subtask.end_date = result.end_date || "";
  subtask.updated_at = nowIso();
  await put("subtasks", subtask);
  if (task?.project_id && subtask.start_date && (!task.dueDate || task.dueDate > subtask.start_date)) {
    task.dueDate = subtask.start_date;
    task.updatedAt = nowIso();
    await put("tasks", task);
  }
  await load();
}

async function deleteSubtask(id) {
  const subtask = state.subtasks.find(item => item.id === id);
  if (!subtask) return;
  if (!(await warmConfirm("删除子任务", "这条子任务会被删除，任务本身会保留。", { confirmText: "删除", danger: true }))) return;
  await remove("subtasks", id);
  await refreshTaskStatusFromSubtasks(subtask.task_id);
  await load();
}

async function moveSubtask(id, direction) {
  const subtask = state.subtasks.find(item => item.id === id);
  const siblings = subtasksFor(subtask.task_id);
  const index = siblings.findIndex(item => item.id === id);
  const next = siblings[index + direction];
  if (!next) return;
  const old = subtask.sort_order;
  subtask.sort_order = next.sort_order;
  next.sort_order = old;
  await put("subtasks", subtask);
  await put("subtasks", next);
  await load();
}

async function toggleSubtask(id) {
  const subtask = state.subtasks.find(item => item.id === id);
  subtask.status = subtask.status === "done" ? "doing" : "done";
  subtask.updated_at = nowIso();
  await put("subtasks", subtask);
  await refreshTaskStatusFromSubtasks(subtask.task_id);
  await load();
}

async function refreshTaskStatusFromSubtasks(taskId) {
  const task = state.tasks.find(item => item.id === taskId) || (await getAll("tasks")).find(item => item.id === taskId);
  if (!task) return;
  const subs = (await getAll("subtasks")).filter(item => item.task_id === taskId);
  if (subs.length && subs.every(item => item.status === "done") && task.status !== "done") {
    await completeItem("task", taskId, null, "");
  } else if (subs.some(item => item.status !== "done") && task.status === "done") {
    task.status = "doing";
    task.completedAt = null;
    task.mood = null;
    task.updatedAt = nowIso();
    await put("tasks", task);
  }
}

async function toggleRecurring(id) {
  const template = state.recurringTasks.find(item => item.id === id);
  template.status = template.status === "active" ? "paused" : "active";
  template.paused_at = template.status === "paused" ? nowIso() : null;
  template.updated_at = nowIso();
  await put("recurring_tasks", template);
  await generateRecurringInstances();
  await load();
}

async function endRecurring(id) {
  const template = state.recurringTasks.find(item => item.id === id);
  template.status = "ended";
  template.end_date = todayKey;
  template.updated_at = nowIso();
  await put("recurring_tasks", template);
  await load();
}

async function editRoutine(id) {
  const template = state.recurringTasks.find(item => item.id === id);
  if (!template) return;
  state.routineEditor = { id };
  render();
}

function closeRoutineEditor() {
  state.routineEditor = null;
  render();
}

async function saveRoutineEdit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const source = state.recurringTasks.find(item => item.id === form.routine_id.value);
  if (!source) return;
  const template = normalizeRoutine(source);
  const title = form.title.value.trim();
  if (!title) return toast("例行名称不能为空。");
  const rule = form.rule_type.value;
  const at = nowIso();
  template.title = title;
  template.tag = form.tag.value;
  template.rule_type = rule;
  template.interval_days = rule === "interval" ? Math.max(1, Number(form.interval_days.value || 2)) : null;
  template.specific_days = rule === "specific"
    ? Array.from(form.querySelectorAll("input[name='specific_days']:checked")).map(input => Number(input.value))
    : [];
  template.start_date = form.start_date.value || template.start_date || todayKey;
  template.end_date = form.end_date.value || "";
  template.reminder_time = form.reminder_time.value || "";
  template.updated_at = at;
  await put("recurring_tasks", template);

  for (const instance of state.taskInstances.filter(item => item.recurring_task_id === template.id && item.scheduled_date > todayKey && item.status !== "done")) {
    if (shouldGenerate(template, instance.scheduled_date)) {
      instance.title = template.title;
      instance.tag = template.tag;
      instance.project_id = template.project_id || null;
      if (instance.status === "deleted") instance.status = "doing";
    } else {
      instance.status = "deleted";
      instance.deleted_at = at;
    }
    instance.updated_at = at;
    await put("task_instances", instance);
  }

  state.selectedRoutineId = template.id;
  state.routineEditor = null;
  await generateRecurringInstances();
  await load();
  toast("例行已更新，后续任务会按新规则生成。");
}

async function deleteRoutine(id) {
  const result = await openWarmDialog({
    title: "删除 Routine",
    message: "你可以只删除循环规则并保留已生成的历史，也可以连同历史实例一起删除。",
    fields: [{
      type: "select",
      name: "mode",
      label: "处理方式",
      value: "keep",
      options: [["keep", "保留历史实例"], ["delete", "删除 Routine 和历史"]]
    }],
    confirmText: "删除",
    danger: true
  });
  if (!result) return;
  const mode = result.mode;
  if (mode === "delete") {
    for (const instance of state.taskInstances.filter(item => item.recurring_task_id === id)) {
      await remove("task_instances", instance.id);
    }
  }
  await remove("recurring_tasks", id);
  await load();
  toast(mode === "delete" ? "Routine 和历史实例已删除。" : "Routine 已删除，历史实例已保留。");
}

async function skipRecurringInstance(id) {
  const instance = state.taskInstances.find(item => item.id === id);
  if (!instance || !(await warmConfirm("跳过今天", "只跳过今天这一次，明天仍会按循环规则继续生成。", { confirmText: "跳过今天" }))) return;
  instance.status = "skipped";
  instance.skipped_at = nowIso();
  instance.updated_at = nowIso();
  await put("task_instances", instance);
  await load();
  toast("今天这次已跳过。");
}

async function deleteRecurringInstance(id) {
  const instance = state.taskInstances.find(item => item.id === id);
  if (!instance || !(await warmConfirm("删除本次任务实例", "只删除今天这一条任务实例，不影响后续循环。", { confirmText: "删除本次", danger: true }))) return;
  instance.status = "deleted";
  instance.deleted_at = nowIso();
  instance.updated_at = nowIso();
  await put("task_instances", instance);
  await load();
  toast("本次任务实例已删除。");
}

async function editRecurringFromInstance(id) {
  const instance = state.taskInstances.find(item => item.id === id);
  if (!instance) return;
  await editRoutine(instance.recurring_task_id);
}

async function deleteRecurringSeriesFromInstance(id) {
  const instance = state.taskInstances.find(item => item.id === id);
  if (!instance) return;
  if (!(await warmConfirm("删除整个循环任务", "之后不会再生成新的任务，已完成的历史记录会保留。", { confirmText: "删除循环任务", danger: true }))) return;
  for (const item of state.taskInstances.filter(entry => entry.recurring_task_id === instance.recurring_task_id && entry.status !== "done")) {
    item.status = "deleted";
    item.deleted_at = nowIso();
    item.updated_at = nowIso();
    await put("task_instances", item);
  }
  await remove("recurring_tasks", instance.recurring_task_id);
  await load();
  toast("循环任务已删除，历史完成记录已保留。");
}

async function saveCustomTags(tags) {
  state.customTags = tags;
  await put("settings", { id: "custom_tags", value: tags, updated_at: nowIso() });
  broadcastSync("custom-tags");
}

async function createQuickTag() {
  const result = await openWarmDialog({
    title: "新建标签",
    message: "创建后会自动选中，用于当前快速添加任务。",
    fields: [
      { type: "text", name: "label", label: "标签名称", placeholder: "例如：阅读" },
      { type: "color", name: "color", label: "标签颜色", value: "#9caf88" }
    ],
    confirmText: "创建"
  });
  if (!result || !result.label.trim()) return;
  const color = result.color || "#9caf88";
  const safeColor = /^#[0-9a-f]{6}$/i.test(color.trim()) ? color.trim() : "#9caf88";
  const key = `custom_${Date.now().toString(36)}`;
  await saveCustomTags([...state.customTags, { key, label: result.label.trim(), color: safeColor }]);
  state.quickAddTag = key;
  await load();
  toast("标签已创建并选中。");
}

async function createQuickProject() {
  const result = await openWarmDialog({
    title: "新建 Project",
    message: "创建后会自动绑定到快速添加任务。",
    fields: [
      { type: "text", name: "title", label: "项目名称", placeholder: "例如：毕业论文" },
      { type: "textarea", name: "description", label: "项目描述", placeholder: "可留空" }
    ],
    confirmText: "创建"
  });
  if (!result || !result.title.trim()) return;
  const description = result.description || "";
  const project = projectSeed(result.title.trim(), description.trim(), state.quickAddTag || "other");
  await put("projects", project);
  state.selectedProjectId = project.id;
  state.quickAddProject = project.id;
  await load();
  toast("项目已创建并绑定到快速添加。");
}

async function saveReflection() {
  const note = document.querySelector("#reflection").value.trim();
  await put("reflections", { id: todayKey, date: todayKey, mood: state.selectedMood, note, updatedAt: nowIso() });
  await load();
  toast("今日心情已记录。");
}

function setMood(mood) {
  state.selectedMood = mood;
  render();
}

async function editDailyStatus(dateKey) {
  const existing = state.reflections.find(item => item.id === dateKey);
  const result = await openWarmDialog({
    title: "今天状态",
    message: "这是当天整体状态，和单个任务完成后的 Mood 分开记录。",
    fields: [{
      type: "select",
      name: "mood",
      label: "状态",
      value: existing?.mood || "",
      options: [["", "清除状态"], ...moods.map(mood => [mood.key, `${mood.icon} ${mood.label}`])]
    }],
    confirmText: "保存"
  });
  if (!result) return;
  const mood = moods.find(item => item.key === result.mood);
  await put("reflections", {
    id: dateKey,
    date: dateKey,
    mood: mood?.key || "",
    note: existing?.note || "",
    updatedAt: nowIso()
  });
  await load();
  toast(mood ? "今日状态已更新。" : "今日状态已清除。");
}

function setView(view) {
  state.view = view;
  render();
}

function selectRoutine(id) {
  state.selectedRoutineId = id;
  render();
}

function openDayTasks(dateKey) {
  state.selectedCalendarDate = dateKey;
  state.taskDate = dateKey;
  state.view = "today";
  render();
}

function shiftSelectedDate(delta) {
  const base = parseLocalDate(state.selectedCalendarDate || todayKey);
  base.setDate(base.getDate() + delta);
  state.selectedCalendarDate = localDateKey(base);
  state.calendarMonth = state.selectedCalendarDate.slice(0, 7);
  render();
}

function setGlobalSearch(value) {
  state.globalSearch = value;
  render();
}

function setReviewFilter(key, value) {
  state.reviewFilters[key] = value;
  render();
}

function openTaskMenu(event, kind, id, subtaskId = "") {
  event.stopPropagation();
  const rect = event.currentTarget.getBoundingClientRect();
  state.floatingMenu = {
    kind,
    id,
    subtaskId,
    top: Math.max(12, rect.bottom + 8),
    left: Math.max(12, Math.min(window.innerWidth - 188, rect.right - 168)),
    direction: "down"
  };
  render();
  requestAnimationFrame(positionFloatingMenu);
}

function closeFloatingMenu() {
  state.floatingMenu = null;
  render();
}

function menuAction(action) {
  state.floatingMenu = null;
  action();
}

function floatingMenuKey(menu = state.floatingMenu) {
  if (!menu) return "";
  return `${menu.kind}:${menu.id}:${menu.subtaskId || ""}`;
}

function positionFloatingMenu() {
  const menu = state.floatingMenu;
  const node = document.querySelector(".floating-menu");
  if (!menu || !node) return;
  const key = floatingMenuKey(menu);
  const trigger = Array.from(document.querySelectorAll("[data-menu-key]")).find(element => element.dataset.menuKey === key);
  if (!trigger) {
    closeFloatingMenu();
    return;
  }
  const triggerRect = trigger.getBoundingClientRect();
  const menuRect = node.getBoundingClientRect();
  const gap = 8;
  const margin = 12;
  const menuWidth = menuRect.width || 168;
  const menuHeight = menuRect.height || 120;
  const spaceBelow = window.innerHeight - triggerRect.bottom - margin;
  const spaceAbove = triggerRect.top - margin;
  const openDown = spaceBelow >= menuHeight + gap || spaceBelow >= spaceAbove;
  let top = openDown ? triggerRect.bottom + gap : triggerRect.top - menuHeight - gap;
  let left = triggerRect.right - menuWidth;
  if (left < margin) left = triggerRect.left;
  top = Math.max(margin, Math.min(top, window.innerHeight - menuHeight - margin));
  left = Math.max(margin, Math.min(left, window.innerWidth - menuWidth - margin));
  node.style.top = `${top}px`;
  node.style.left = `${left}px`;
  node.classList.toggle("up", !openDown);
  node.classList.toggle("down", openDown);
}

function openReflectionViewer(kind, id) {
  const item = kind === "task" ? taskToItem(state.tasks.find(task => task.id === id)) : instanceToItem(state.taskInstances.find(task => task.id === id));
  const record = item ? completionFor(item) : null;
  if (!record || (!record.mood && !record.note)) {
    toast("这条任务还没有完成感想。");
    return;
  }
  state.reflectionViewer = { kind, id, recordId: record.id };
  render();
}

function closeReflectionViewer() {
  state.reflectionViewer = null;
  render();
}

function shiftCalendarMonth(delta) {
  const [year, month] = state.calendarMonth.split("-").map(Number);
  const next = new Date(year, month - 1 + delta, 1);
  state.calendarMonth = localDateKey(next).slice(0, 7);
  render();
}

function goCalendarToday() {
  state.calendarMonth = todayKey.slice(0, 7);
  state.selectedCalendarDate = todayKey;
  render();
}

function selectCalendarDate(dateKey) {
  state.selectedCalendarDate = dateKey;
  render();
}

function closeCompletion() {
  state.feelingSheet = null;
  render();
}

function openFeelingEditor(kind, id) {
  const item = kind === "task" ? taskToItem(state.tasks.find(task => task.id === id)) : instanceToItem(state.taskInstances.find(task => task.id === id));
  const record = item ? completionFor(item) : null;
  if (!record) {
    toast("这个已完成任务还没有可编辑的完成记录。");
    return;
  }
  state.reflectionViewer = null;
  state.feelingSheet = { kind, id, recordId: record.id, editing: true };
  render();
}

async function clearFeeling() {
  if (!state.feelingSheet) return;
  await updateCompletionRecord(state.feelingSheet.recordId, null, "");
  state.feelingSheet = null;
  await load();
  toast("Mood 和 Note 已清除，任务仍保持完成。");
}

function renderTask(item) {
  const tag = tagByKey(item.tag);
  const done = item.status === "done";
  const progress = progressFor(item);
  const project = item.project_id ? state.projects.find(p => p.id === item.project_id) : null;
  const record = completionFor(item);
  const recordMood = record?.mood ? moodByKey(record.mood) : null;
  const hasReflection = Boolean(record?.mood || record?.note);
  const subs = item.kind === "task" ? subtasksFor(item.id) : [];
  return `
    <article class="task-row ${done ? "done" : ""}">
      <div class="task-main-line">
        <button class="task-check" aria-label="${done ? "撤销完成" : "完成任务"}" title="${done ? "撤销完成" : "完成任务"}" onclick="toggleItem('${item.kind}', '${item.id}')">${done ? icons.check : ""}</button>
        <div class="task-copy">
          <div class="task-title">${escapeHtml(item.title)}</div>
          <div class="task-meta">
            <span>${progress}%</span>
            ${item.kind === "instance" ? `<span class="repeat-chip" title="周期任务">↻ ${routineRuleText(state.recurringTasks.find(t => t.id === item.recurring_task_id) || { rule_type: "daily" })}</span>` : ""}
            ${project ? `<span>${escapeHtml(project.title)}</span>` : ""}
            ${done ? `<span>完成于 ${formatTime(item.completedAt || item.completed_at)}</span>` : ""}
            ${hasReflection ? `<button class="reflection-link" onclick="openReflectionViewer('${item.kind}', '${item.id}')">${recordMood ? `${recordMood.icon} ${recordMood.label}` : "完成感想"} · 查看感想</button>` : ""}
          </div>
        </div>
        <div class="task-right">
          ${tagPill(tag)}
          <div class="row-actions">
            ${done ? `<button class="mini-button hover-edit" title="查看或编辑感受" onclick="openFeelingEditor('${item.kind}', '${item.id}')">♡</button>` : ""}
            ${item.kind === "task" ? `
              <button class="mini-button primary-mini" title="添加子任务" aria-label="添加子任务" onclick="addSubtask('${item.id}')">+</button>
              <button class="mini-button hover-edit" title="编辑任务" aria-label="编辑任务" onclick="editTask('${item.id}')">✎</button>
              <button class="mini-button task-menu-trigger" data-menu-key="task:${item.id}:" aria-label="更多操作" onclick="openTaskMenu(event, 'task', '${item.id}')">⋯</button>
            ` : `
              <button class="mini-button task-menu-trigger" data-menu-key="instance:${item.id}:" aria-label="更多操作" onclick="openTaskMenu(event, 'instance', '${item.id}')">⋯</button>
            `}
          </div>
        </div>
      </div>
      ${subs.length ? `
        <div class="subtasks">
          ${subs.map(subtask => `
            <div class="subtask-row ${subtask.status === "done" ? "done" : ""}">
              <button class="subtask-check" title="切换子任务" aria-label="切换子任务" onclick="toggleSubtask('${subtask.id}')"></button>
              <span>${escapeHtml(subtask.title)}${subtaskDateText(subtask) ? `<small>${subtaskDateText(subtask)}</small>` : ""}</span>
              <button class="mini-button subtask-menu" data-menu-key="subtask:${item.id}:${subtask.id}" aria-label="子任务更多操作" onclick="openTaskMenu(event, 'subtask', '${item.id}', '${subtask.id}')">⋯</button>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </article>
  `;
}

function renderSidebar() {
  return `
    <aside class="sidebar">
      <div class="traffic"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
      <div class="brand"><h1>WarmTodo</h1><p>Things I Have Done</p></div>
      <nav class="nav">
        <button class="${state.view === "calendar" ? "active" : ""}" onclick="setView('calendar')">${icons.calendar}<span>日历</span></button>
        <button class="${state.view === "today" ? "active" : ""}" onclick="setView('today')">${icons.home}<span>今天</span></button>
        <button class="${state.view === "projects" ? "active" : ""}" onclick="setView('projects')">${icons.folder}<span>项目</span></button>
        <button class="${state.view === "routines" ? "active" : ""}" onclick="setView('routines')">${icons.list}<span>例行</span></button>
        <button class="${state.view === "review" ? "active" : ""}" onclick="setView('review')">${icons.history}<span>回顾</span></button>
      </nav>
      <div class="bottom-nav">
        <button class="${state.view === "settings" ? "active" : ""}" onclick="setView('settings')">${icons.settings}<span>设置</span></button>
        <div class="sidebar-profile">
          <div class="avatar">A</div>
          <span><strong>早安，Aurora</strong><small>愿你度过高效而温暖的一天</small></span>
        </div>
      </div>
    </aside>
  `;
}

function renderUnfinishedPanel() {
  const tasks = unfinishedPreviousTasks();
  if (!tasks.length) return "";
  return `
    <section class="unfinished-panel card">
      <div class="section-header">
        <h3 class="section-title">${tasks.length} unfinished tasks from previous days</h3>
      </div>
      <div class="unfinished-list">
        ${tasks.slice(0, 5).map(task => `
          <div class="unfinished-row">
            <span><strong>${escapeHtml(task.title)}</strong><small>${task.dueDate}</small></span>
            <button class="secondary-button" onclick="moveTaskToToday('${task.id}')">Move to Today</button>
            <button class="secondary-button" onclick="changeTaskDate('${task.id}')">Change Date</button>
            <button class="secondary-button" onclick="dropTask('${task.id}')">Drop</button>
            <button class="secondary-button" onclick="deleteTask('${task.id}')">Delete</button>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderToday() {
  const displayDate = state.taskDate || todayKey;
  const s = statsForDate(displayDate);
  const items = taskDateItems();
  const doing = items.filter(item => item.status !== "done");
  const done = items.filter(item => item.status === "done");
  const reflection = state.reflections.find(item => item.id === displayDate);
  const dailyMood = moodByKey(reflection?.mood) || moodByKey("satisfied");
  const projects = state.projects.filter(project => project.status !== "archived");
  const projectChoices = projects.slice(0, 3);
  const tags = Object.entries(allTags());
  const activeProjects = state.projects.filter(project => project.status !== "archived" && state.tasks.some(task => task.project_id === project.id && task.status !== "done" && task.status !== "dropped")).length;
  return `
    <main class="main today-main">
      <div class="topbar today-hero">
        <div>
          <p class="eyebrow">${parseLocalDate(displayDate).toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}</p>
          <h2 class="page-title">${displayDate === todayKey ? "今天" : parseLocalDate(displayDate).toLocaleDateString("en-US", { month: "long", day: "numeric" }) + " Tasks"}</h2>
          <div class="growth">享受过程，收获成长 <span class="sprout">🌱</span></div>
        </div>
        <button class="daily-status" onclick="editDailyStatus('${displayDate}')" aria-label="修改今天状态"><span>${dailyMood?.icon || "🙂"}</span><strong>今天状态：</strong><b>${dailyMood?.label || "满足"}</b><i>✎</i></button>
      </div>
      <section class="quick-add-card">
        <form class="quick-add-form" onsubmit="addTask(event)">
          <div class="quick-add-heading">☀ 快速添加任务</div>
          <div class="quick-add-line">
            <input class="field quick-title" name="title" placeholder="写下今天要做的事..." autocomplete="off" />
            <button class="primary-button quick-submit">${icons.plus}<span>添加任务</span></button>
          </div>
          <div class="quick-chip-grid">
            <div class="quick-chip-group">
              <h3>${icons.tag}标签</h3>
              <div class="chip-options constrained">${tags.map(([key, tag], index) => `<label class="choice-chip"><input type="radio" name="tag" value="${key}" ${(state.quickAddTag || "work") === key || (!state.quickAddTag && index === 0) ? "checked" : ""} /><span><i style="background:${tag.color}"></i>${tag.label}</span></label>`).join("")}<button class="choice-chip ghost create-chip" type="button" onclick="createQuickTag()"><span>+ 新建</span></button></div>
            </div>
            <div class="quick-chip-group">
              <h3>${icons.folder}项目</h3>
              <div class="chip-options constrained">
                <label class="choice-chip"><input type="radio" name="project_id" value="" ${!state.quickAddProject ? "checked" : ""} /><span><i style="background:${tagConfig.health.color}"></i>无项目</span></label>
                ${projectChoices.map(project => `<label class="choice-chip"><input type="radio" name="project_id" value="${project.id}" ${state.quickAddProject === project.id ? "checked" : ""} /><span>${escapeHtml(project.title)}</span></label>`).join("")}
                ${projects.length > 3 ? `<button class="choice-chip ghost" type="button" onclick="setView('projects')"><span>更多项目⌄</span></button>` : ""}
                <button class="choice-chip ghost create-chip" type="button" onclick="createQuickProject()"><span>+ 新建</span></button>
              </div>
            </div>
            <div class="quick-chip-group">
              <h3>↻ 重复</h3>
              <div class="chip-options">
                ${[["none", "不重复"], ["daily", "每天"], ["weekdays", "工作日"], ["weekends", "周末"]].map(([value, label], index) => `<label class="choice-chip"><input type="radio" name="recurrence" value="${value}" ${index === 0 ? "checked" : ""} /><span><i style="background:${index === 0 ? tagConfig.health.color : tagConfig.other.color}"></i>${label}</span></label>`).join("")}
              </div>
            </div>
          </div>
          <div class="quick-add-footer">
            <button type="button" class="soft-action" onclick="toast('请先创建任务，再在任务卡片中添加子任务。')">＋ 添加子任务</button>
            <button type="button" class="soft-action" onclick="setView('routines')">更多设置⌄</button>
          </div>
        </form>
      </section>
      <section class="metrics">
        <div class="metric-card today-metric"><div class="metric-icon green">${icons.list}</div><div><div class="metric-value">${s.total}</div><div class="metric-label">任务总数</div></div></div>
        <div class="metric-card today-metric"><div class="metric-icon gold">${icons.check}</div><div><div class="metric-value">${s.done}</div><div class="metric-label">已完成</div></div></div>
        <div class="metric-card today-metric"><div class="metric-icon blue">${icons.calendar}</div><div><div class="metric-value">${s.rate}%</div><div class="metric-label">完成率</div></div></div>
        <div class="metric-card today-metric"><div class="metric-icon purple">${icons.folder}</div><div><div class="metric-value">${activeProjects}</div><div class="metric-label">项目进行中</div></div></div>
      </section>
      ${renderUnfinishedPanel()}
      <section class="section" data-section="doing"><div class="section-header"><h3 class="section-title">进行中 <span class="section-count">(${doing.length})</span></h3></div><div class="task-list">${doing.length ? doing.map(renderTask).join("") : `<div class="empty">今天暂时没有待办。留白也算一种认真安排。</div>`}</div></section>
      <section class="section" data-section="done"><div class="section-header"><h3 class="section-title">已完成 <span class="section-count">(${done.length})</span></h3></div><div class="task-list">${done.length ? done.map(renderTask).join("") : `<div class="empty">完成的任务会留在这里，成为今天的生活痕迹。</div>`}</div></section>
    </main>
  `;
}

function monthRange(monthKey = todayKey.slice(0, 7)) {
  return { start: `${monthKey}-01`, end: monthEndKey(monthKey) };
}

function routineMonthStats(routine, monthKey = todayKey.slice(0, 7)) {
  const normalized = normalizeRoutine(routine);
  const range = monthRange(monthKey);
  const expected = expectedRoutineDates(normalized, range);
  const instances = state.taskInstances.filter(item => item.recurring_task_id === normalized.id && item.scheduled_date >= range.start && item.scheduled_date <= range.end);
  const done = instances.filter(item => item.status === "done").length;
  return {
    expected,
    instances,
    done,
    total: expected.length,
    rate: expected.length ? Math.round((done / expected.length) * 100) : 0,
    streak: currentRoutineStreak(normalized),
    longest: longestRoutineStreak(normalized)
  };
}

function routineIcon(routine) {
  const title = routine.title || "";
  if (/运动|健身|跑|walk|run/i.test(title)) return "🏃";
  if (/水|喝/i.test(title)) return "💧";
  if (/设计|画|绘|paint/i.test(title)) return "🎨";
  if (/读|阅读|书|read/i.test(title)) return "🌤";
  return "☀";
}

function routineMonthCalendar(routine, monthKey = todayKey.slice(0, 7)) {
  const range = monthRange(monthKey);
  const expected = new Set(expectedRoutineDates(routine, range));
  const instances = new Map(state.taskInstances.filter(item => item.recurring_task_id === routine.id && item.scheduled_date >= range.start && item.scheduled_date <= range.end).map(item => [item.scheduled_date, item]));
  const [year, month] = monthKey.split("-").map(Number);
  const totalDays = parseLocalDate(range.end).getDate();
  const cells = [];
  const leading = (parseLocalDate(range.start).getDay() + 6) % 7;
  for (let index = 0; index < leading; index++) {
    cells.push({ key: `${monthKey}-blank-${index}`, day: "", status: "blank" });
  }
  for (let day = 1; day <= totalDays; day++) {
    const key = localDateKey(new Date(year, month - 1, day));
    const instance = instances.get(key);
    const isExpected = expected.has(key);
    const status = instance?.status === "done" ? "done" : isExpected && instance ? "partial" : isExpected ? "missed" : "idle";
    cells.push({ key, day, status });
  }
  return cells;
}

function renderRoutines() {
  const routines = state.recurringTasks.map(normalizeRoutine).sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
  const selected = routines.find(routine => routine.id === state.selectedRoutineId) || routines[0];
  const selectedTag = selected ? tagByKey(selected.tag) : tagConfig.other;
  const selectedStats = selected ? routineMonthStats(selected) : null;
  const monthDays = selected ? routineMonthCalendar(selected) : [];
  return `
    <main class="main routines-main">
      <div class="topbar routine-hero">
        <div>
          <p class="eyebrow">Routines</p>
          <h2 class="page-title">例行</h2>
          <div class="growth">把重要的好习惯，变成自然流畅的生活。</div>
        </div>
      </div>
      <section class="routine-create-card">
        <h2>新建例行</h2>
        <form class="routine-form-new" onsubmit="addRoutine(event)">
          <input class="field routine-title-input" name="routine_title" placeholder="例行名称，例如：晨间阅读" autocomplete="off" />
          <div class="routine-rule-tabs" aria-label="重复频率">
            ${[["daily", "每天"], ["weekdays", "工作日"], ["weekends", "周末"], ["interval", "自定义周期"]].map(([value, label], index) => `<label><input type="radio" name="rule_type" value="${value}" ${index === 0 ? "checked" : ""} /><span>${label}</span></label>`).join("")}
          </div>
          <input class="field routine-interval" name="interval_days" type="number" min="1" value="2" aria-label="每 X 天一次" title="自定义周期：每 X 天一次" />
          <select class="select routine-tag-select" name="tag" aria-label="选择标签">${Object.entries(allTags()).map(([key, tag]) => `<option value="${key}">${tag.label}</option>`).join("")}</select>
          <input type="hidden" name="start_date" value="${todayKey}" />
          <input type="hidden" name="end_date" value="" />
          <button class="primary-button">新建</button>
        </form>
      </section>
      <div class="routine-dashboard">
        <section class="routine-list-panel">
          <div class="section-header"><h3 class="section-title">我的例行</h3></div>
          <div class="routine-list-cards">
            ${routines.map(routine => {
              const tag = tagByKey(routine.tag);
              const stats = routineMonthStats(routine);
              return `
                <article class="routine-list-card ${selected?.id === routine.id ? "active" : ""}">
                  <button class="routine-card-select" onclick="selectRoutine('${routine.id}')">
                    <span class="routine-emoji">${routineIcon(routine)}</span>
                    <span class="routine-list-copy">
                      <strong>${escapeHtml(routine.title)}</strong>
                      <small>${routineRuleText(routine)} · ${routine.status === "active" ? "进行中" : "已暂停"}${routine.reminder_time ? " · " + routine.reminder_time : ""}</small>
                      <em><b>${stats.rate}%</b><i><u style="width:${stats.rate}%"></u></i></em>
                    </span>
                    ${tagPill(tag)}
                    <span class="routine-streak">连续 ${stats.streak} 天</span>
                  </button>
                  <button class="mini-button routine-card-menu task-menu-trigger" data-menu-key="routine:${routine.id}:" aria-label="例行更多操作" onclick="openTaskMenu(event, 'routine', '${routine.id}')">⋯</button>
                </article>
              `;
            }).join("") || `<div class="empty">还没有例行。先创建一个温柔的小习惯。</div>`}
          </div>
          <button class="secondary-button routine-add-shortcut" onclick="document.querySelector('.routine-title-input')?.focus()">＋ 新建例行</button>
        </section>
        <section class="routine-detail-panel">
          ${selected ? `
            <div class="routine-detail-header">
              <span class="routine-detail-icon">${routineIcon(selected)}</span>
              <div>
                <h3>${escapeHtml(selected.title)} ${tagPill(selectedTag)}</h3>
                <p>${routineRuleText(selected)} · ${selected.status === "active" ? "进行中" : "已暂停"}${selected.reminder_time ? " · " + selected.reminder_time : ""}</p>
              </div>
              <button class="mini-button task-menu-trigger" data-menu-key="routine:${selected.id}:" aria-label="例行更多操作" onclick="openTaskMenu(event, 'routine', '${selected.id}')">⋯</button>
            </div>
            <div class="routine-progress-block">
              <div><strong>${selectedStats.rate}%</strong><span>完成率</span></div>
              <div><strong>${selectedStats.done} / ${selectedStats.total}</strong><span>天</span></div>
              <div><strong>${selectedStats.streak}</strong><span>连续完成</span></div>
              <div><strong>${selectedStats.longest}</strong><span>最长连续</span></div>
            </div>
            <div class="routine-progress-line"><span style="width:${selectedStats.rate}%"></span></div>
            <section class="routine-month-card">
              <h3>本月日历视图</h3>
              <div class="routine-weekdays">${["一", "二", "三", "四", "五", "六", "日"].map(day => `<span>${day}</span>`).join("")}</div>
              <div class="routine-month-grid">
                ${monthDays.map(day => `<span class="routine-day ${day.status}" title="${day.key}">${day.status === "done" ? "✓" : ""}</span>`).join("")}
              </div>
              <div class="routine-legend"><span><i class="done"></i>已完成</span><span><i class="partial"></i>部分完成</span><span><i></i>未完成</span></div>
            </section>
          ` : `<div class="empty">选择或新建一个例行。</div>`}
        </section>
      </div>
    </main>
  `;
}
function renderHistoryRow(item) {
  const missed = item.action === "missed";
  return `
    <div class="history-row ${missed ? "missed" : ""}">
      <span class="history-time">${item.time}</span>
      <span class="history-check">${missed ? "○" : "✓"}</span>
      <span class="history-title">${escapeHtml(item.title)}</span>
      ${tagPill(item.tag)}
      ${item.project ? `<span class="history-project">${escapeHtml(item.project.title)}</span>` : ""}
      ${missed ? `<span class="history-project">Missed</span>` : ""}
      ${item.note ? `<span class="history-note">Reflection</span>` : ""}
      ${item.mood ? `<span class="history-mood" title="${item.mood.label}">${item.mood.icon}</span>` : ""}
    </div>
  `;
}

function renderCalendarTaskPreview(item) {
  const tag = tagByKey(item.tag);
  const done = item.status === "done";
  const missed = item.kind === "missed" || item.status === "missed";
  return `
    <div class="calendar-task ${done ? "done" : ""} ${missed ? "missed" : ""}">
      <span class="calendar-task-mark" style="background:${done || missed ? "rgba(127, 155, 102, 0.12)" : tag.color}">${done ? "✓" : missed ? "○" : ""}</span>
      <span>${item.kind === "instance" ? "↻ " : ""}${escapeHtml(item.title)}</span>
    </div>
  `;
}

function renderDayDetailTask(item) {
  const tag = tagByKey(item.tag);
  const done = item.status === "done";
  const missed = item.kind === "missed" || item.status === "missed";
  const record = completionFor(item);
  if (missed) {
    return `
      <article class="day-task missed">
        <span class="task-check readonly" aria-hidden="true">○</span>
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${tag.label} · 当天未完成，已保留历史记录</small>
        </div>
      </article>
    `;
  }
  return `
    <article class="day-task ${done ? "done" : ""}">
      <button class="task-check" aria-label="${done ? "撤销完成" : "完成任务"}" onclick="toggleItem('${item.kind}', '${item.id}')">${done ? icons.check : ""}</button>
      <div>
        <strong>${item.kind === "instance" ? "↻ " : ""}${escapeHtml(item.title)}</strong>
        <small>${tag.label}${done ? " · 完成于 " + formatTime(item.completedAt || item.completed_at) : ""}${record?.mood ? " · " + (moodByKey(record.mood)?.icon || "") : ""}</small>
      </div>
    </article>
  `;
}

function renderAnalyticsDashboard(analytics) {
  const maxTag = Math.max(1, ...analytics.tagStats.map(item => item.count));
  return `
    <section class="analytics-panel">
      <div class="analytics-metrics">
        <div class="metric-card"><div class="metric-value">${analytics.completed}</div><div class="metric-label">Completed Tasks</div></div>
        <div class="metric-card"><div class="metric-value">${analytics.completionRate ?? "—"}${analytics.completionRate === null ? "" : "%"}</div><div class="metric-label">Completion Rate</div></div>
        <div class="metric-card"><div class="metric-value">${analytics.activeProjects}</div><div class="metric-label">Active Projects</div></div>
        <div class="metric-card"><div class="metric-value">${analytics.routineRate ?? "—"}${analytics.routineRate === null ? "" : "%"}</div><div class="metric-label">Routine Rate</div></div>
      </div>
      <div class="analytics-grid">
        <article class="card analytics-card">
          <h2>标签完成数量</h2>
          <div class="bar-list">
            ${analytics.tagStats.length ? analytics.tagStats.map(tag => `
              <button class="bar-row" onclick="setReviewFilter('tag', '${tag.key}')">
                <span>${tag.label}</span>
                <i><b style="width:${Math.max(8, (tag.count / maxTag) * 100)}%; background:${tag.color}"></b></i>
                <strong>${tag.count}</strong>
              </button>
            `).join("") : `<div class="empty">当前范围还没有标签完成记录。</div>`}
          </div>
        </article>
        <article class="card analytics-card">
          <h2>Mood Analytics</h2>
          <div class="mood-analytics">
            ${analytics.moodStats.length ? analytics.moodStats.map(mood => `
              <div class="mood-stat"><span>${mood.icon} ${mood.label}</span><b>${mood.percent}%</b><small>${mood.count}</small></div>
            `).join("") : `<div class="empty">当前范围还没有记录 Mood。</div>`}
          </div>
        </article>
        <article class="card analytics-card">
          <h2>Tag × Mood</h2>
          <div class="tag-mood-list">
            ${analytics.tagMood.length ? analytics.tagMood.map(item => `
              <div class="tag-mood-row"><span>${item.tag.label}</span><strong>${item.mood.icon} ${item.mood.label}</strong><small>${item.percent}%</small></div>
            `).join("") : `<div class="empty">需要更多带 Mood 的完成记录。</div>`}
          </div>
        </article>
        <article class="card analytics-card">
          <h2>Project Progress Review</h2>
          <div class="tag-mood-list">
            ${analytics.projectStatsInRange.length ? analytics.projectStatsInRange.slice(0, 5).map(item => `
              <div class="tag-mood-row"><span>${escapeHtml(item.project.title)}</span><strong>完成 ${item.completed} 项</strong><small>${item.progress}%</small></div>
            `).join("") : `<div class="empty">当前范围没有 Project Task 完成记录。</div>`}
          </div>
        </article>
        <article class="card analytics-card wide">
          <h2>Routine Analytics</h2>
          <div class="routine-analytics">
            ${analytics.routineStats.length ? analytics.routineStats.slice(0, 6).map(item => `
              <div class="routine-analytics-row">
                <span><strong>${escapeHtml(item.routine.title)}</strong><small>${routineRuleText(item.routine)}</small></span>
                <b>${item.done} / ${item.expected}</b>
                <i><em style="width:${item.rate}%"></em></i>
                <small>${item.rate}% · Current ${item.currentStreak} · Longest ${item.longestStreak}</small>
              </div>
            `).join("") : `<div class="empty">当前范围没有 Routine 数据。</div>`}
          </div>
        </article>
        <article class="card analytics-card wide">
          <h2>Summary</h2>
          <div class="summary-lines">
            <p>你完成了 <strong>${analytics.completed}</strong> 件事情。</p>
            <p>最多的是：<strong>${analytics.summary.topTag ? analytics.summary.topTag.label + " · " + analytics.summary.topTag.count : "暂无"}</strong></p>
            <p>最常记录的感受：<strong>${analytics.summary.topMood ? analytics.summary.topMood.icon + " " + analytics.summary.topMood.label : "暂无"}</strong></p>
            <p>坚持最好：<strong>${analytics.summary.bestRoutine ? escapeHtml(analytics.summary.bestRoutine.routine.title) + " · " + analytics.summary.bestRoutine.done + "/" + analytics.summary.bestRoutine.expected : "暂无"}</strong></p>
            <p>推进最多：<strong>${analytics.summary.topProject ? escapeHtml(analytics.summary.topProject.project.title) + " · 完成" + analytics.summary.topProject.completed + "项任务" : "暂无"}</strong></p>
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderWeeklyRemember(data) {
  if (!data.completedTotal) return "这周还没有完成记录。";
  const parts = [`这周你完成了 ${data.completedTotal} 件事情`];
  if (data.topTag) parts.push(`最多的是 ${data.topTag.label}`);
  if (data.topMood) parts.push(`最常出现的心情是 ${data.topMood.icon} ${data.topMood.label}`);
  const noted = data.representative.find(item => item.record.note);
  if (noted) parts.push(`有一件值得留下：${noted.title}`);
  return `${parts.join("，")}。`;
}

function moodDonutGradient(stats) {
  if (!stats.length) return "conic-gradient(#ede3d5 0 100%)";
  const colors = ["#d98769", "#c8b58b", "#a4ad83", "#7f9b66", "#b5ada3", "#d9a66b", "#9eb8d8", "#cf9a88"];
  let start = 0;
  const total = stats.reduce((sum, item) => sum + item.count, 0);
  return `conic-gradient(${stats.map((item, index) => {
    const end = start + (item.count / total) * 100;
    const segment = `${colors[index % colors.length]} ${start}% ${end}%`;
    start = end;
    return segment;
  }).join(", ")})`;
}

function iconForHistoryItem(item, index) {
  if (item.record.mood) return moodByKey(item.record.mood)?.icon || "✓";
  return ["▣", "□", "✓"][index % 3];
}

function renderWeeklyReview() {
  const data = weeklyReviewData();
  const routineDone = data.routineStats.reduce((sum, item) => sum + item.done, 0);
  const routineExpected = data.routineStats.reduce((sum, item) => sum + item.expected, 0);
  const maxMood = Math.max(1, ...data.moodByDay.map(day => day.count));
  const weekNo = warmTodoWeekNumber(data.range);
  return `
    <main class="main review-main">
      <div class="topbar compact">
        <div>
          <h2 class="page-title">周总结</h2>
          <div class="growth">记录生活的进步，让每一周都有迹可循。</div>
        </div>
        <div class="week-switcher">
          <button class="secondary-button" onclick="shiftReviewWeek(-1)" aria-label="上一周">‹</button>
          <strong>${weekLabel(data.range)}</strong>
          <button class="secondary-button tiny-week" onclick="goReviewThisWeek()">本周</button>
          <button class="secondary-button" onclick="shiftReviewWeek(1)" aria-label="下一周">›</button>
        </div>
      </div>
      <section class="weekly-banner card">
        <div>
          <span class="weekly-range">Hi, Aurora</span>
          <h3>这是你在 WarmTodo 的第 ${weekNo} 周</h3>
          <p>这一周，你完成了很多事情，也在慢慢成为更好的自己。</p>
        </div>
        <div class="weekly-landscape" aria-hidden="true"><span></span><i></i><b></b><em></em></div>
      </section>
      <section class="weekly-dashboard">
        <article class="card weekly-overview">
          <h2>本周概览</h2>
          <div class="weekly-summary-metrics">
            <div><strong>${data.completedTotal}<span> / ${data.plannedTotal || 0}</span></strong><small>完成任务</small></div>
            <div><strong>${data.completionRate ?? "—"}${data.completionRate === null ? "" : "%"}</strong><small>完成率</small></div>
            <div><strong>${data.projectStats.length}</strong><small>推进 Project</small></div>
            <div><strong>${routineDone}<span> / ${routineExpected}</span></strong><small>例行坚持</small></div>
          </div>
        </article>
        <article class="card weekly-mood-panel">
          <h2>${data.topMood ? data.topMood.icon : "🙂"} 本周心情</h2>
          <div class="weekly-mood-content">
            <div class="weekly-donut" style="background:${moodDonutGradient(data.moodStats)}"></div>
            <div class="mood-analytics">
              ${data.moodStats.length ? data.moodStats.map(mood => `<div class="mood-stat"><span>${mood.icon} ${mood.label}</span><b>${mood.percent}%</b><small>${mood.count}</small></div>`).join("") : `<div class="empty">本周还没有记录任务心情。</div>`}
            </div>
          </div>
          <div class="weekly-status-note"><b>${data.topMood ? data.topMood.icon : "🙂"}</b><span>整体状态：<strong>${data.topMood?.label || "暂无"}</strong><small>${data.topMood ? "来自本周任务完成时记录最多的心情。" : "完成任务后记录心情，这里会逐渐丰富。"}</small></span></div>
        </article>
        <article class="card weekly-daily-card">
          <h2>每日完成情况</h2>
          <div class="weekly-rings">
            ${data.plannedByDay.map(day => {
              const date = parseLocalDate(day.dateKey);
              const total = day.items.length;
              const done = day.completed.length;
              const rate = total ? Math.round((done / total) * 100) : 0;
              return `<div class="weekly-ring-day"><span>${date.getMonth() + 1}/${date.getDate()}<small>${date.toLocaleDateString("zh-CN", { weekday: "short" })}</small></span><i style="background:conic-gradient(var(--green) 0 ${rate}%, #eadfce ${rate}% 100%)"><b>${done}</b></i><em>${done}/${total}</em></div>`;
            }).join("")}
          </div>
        </article>
        <article class="card weekly-story-card">
          <h2>我的这一周</h2>
          <p>${renderWeeklyRemember(data)}</p>
          <div class="weekly-tags">
            ${(data.tagStats.length ? data.tagStats : [{ label: "暂无", color: "#b5ada3", count: 0 }]).slice(0, 5).map(tag => `<span style="background:${tag.color}22">${tag.label}</span>`).join("")}
          </div>
        </article>
        <article class="card weekly-emotion-card">
          <h2>情绪轨迹</h2>
          <div class="emotion-track">
            ${data.moodByDay.map(day => {
              const date = parseLocalDate(day.dateKey);
              const level = 72 - Math.round((day.count / maxMood) * 34);
              return `<span class="${day.mood ? "active" : ""}" style="--level:${level}%"><b>${day.mood?.icon || "·"}</b><i></i><small>${date.toLocaleDateString("zh-CN", { weekday: "short" })}</small></span>`;
            }).join("")}
          </div>
        </article>
        <article class="card weekly-memory-card">
          <div class="section-header"><h2>本周值得记住</h2><button class="text-button" onclick="openWeeklyMemory()">查看全部 →</button></div>
          <div class="memory-list">
            ${data.representative.length ? data.representative.map((item, index) => {
              const mood = item.record.mood ? moodByKey(item.record.mood) : null;
              return `<div class="memory-item"><span>${iconForHistoryItem(item, index)}</span><div><strong>${escapeHtml(item.title)}</strong><small>${item.record.note ? escapeHtml(item.record.note) : "完成于 " + item.time}</small></div><em>${mood ? mood.icon + " " + mood.label : item.dateKey.slice(5)}</em></div>`;
            }).join("") : `<div class="empty">完成任务后写下感受，这里会留下更清楚的生活痕迹。</div>`}
          </div>
        </article>
        <article class="card weekly-next-card">
          <h2>下周，想继续什么？</h2>
          <div class="next-week-list">
            ${data.nextWeekTasks.length ? data.nextWeekTasks.map(task => `<label><input type="checkbox" disabled /><span>${escapeHtml(task.title)}</span></label>`).join("") : `<div class="empty">还没有安排到下周的任务。</div>`}
          </div>
          <form class="weekly-note-form" onsubmit="saveWeeklyNote(event)">
            <label class="note-label">写给下周的自己</label>
            <textarea class="textarea" name="weekly_note" placeholder="留一句话给下周的自己...">${escapeHtml(data.note)}</textarea>
            <div class="modal-actions"><button class="primary-button">保存</button></div>
          </form>
        </article>
      </section>
    </main>
  `;
}

function renderReview() {
  return renderWeeklyReview();
}

function renderWeeklyMemoryModal() {
  if (!state.weeklyMemoryOpen) return "";
  const data = weeklyReviewData();
  const memories = data.items
    .filter(item => item.record.note || item.record.mood)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const fallback = data.items.slice().sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const items = memories.length ? memories : fallback;
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="weekly-memory-title" onclick="closeWeeklyMemory()">
      <article class="completion-modal weekly-memory-modal" onclick="event.stopPropagation()">
        <div class="section-header">
          <div>
            <h3 id="weekly-memory-title" class="section-title">本周值得记住</h3>
            <p class="project-desc">${weekLabel(data.range)} · ${items.length} 条记录</p>
          </div>
          <button type="button" class="mini-button" onclick="closeWeeklyMemory()">×</button>
        </div>
        <div class="memory-list weekly-memory-full">
          ${items.length ? items.map((item, index) => {
            const mood = item.record.mood ? moodByKey(item.record.mood) : null;
            return `<div class="memory-item"><span>${iconForHistoryItem(item, index)}</span><div><strong>${escapeHtml(item.title)}</strong><small>${item.record.note ? escapeHtml(item.record.note) : "完成于 " + item.time}</small></div><em>${mood ? mood.icon + " " + mood.label : item.dateKey.slice(5)}</em></div>`;
          }).join("") : `<div class="empty">本周还没有可回顾的完成记录。</div>`}
        </div>
        <div class="modal-actions"><button class="primary-button" onclick="closeWeeklyMemory()">完成</button></div>
      </article>
    </div>
  `;
}

function renderCalendar() {
  const days = calendarDays(state.calendarMonth);
  const monthLabel = parseLocalDate(`${state.calendarMonth}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return `
    <main class="main calendar-main">
      <div class="topbar compact">
        <div class="calendar-title-block">
          <div class="calendar-title-line">${icons.calendar}<h2 class="page-title">${monthLabel}</h2></div>
          <div class="growth">这是你的日历总览，每一天的任务安排都在这里，一目了然。</div>
        </div>
        <div class="calendar-actions">
          <button class="secondary-button" onclick="shiftCalendarMonth(-1)">上个月</button>
          <button class="secondary-button" onclick="goCalendarToday()">今天</button>
          <button class="secondary-button" onclick="shiftCalendarMonth(1)">下个月</button>
        </div>
      </div>
      <div class="calendar-layout">
        <section class="calendar-grid card">
          ${["周日", "周一", "周二", "周三", "周四", "周五", "周六"].map(day => `<div class="calendar-weekday">${day}</div>`).join("")}
          ${days.map(day => {
            const items = calendarItemsForDate(day.dateKey);
            const done = items.filter(item => item.status === "done").length;
            const preview = items.slice(0, 3);
            const more = Math.max(0, items.length - preview.length);
            return `<button class="calendar-day ${day.inMonth ? "" : "muted"} ${state.selectedCalendarDate === day.dateKey ? "active" : ""} ${completionStrength(done)}" onclick="openDayTasks('${day.dateKey}')" aria-label="${day.dateKey} ${items.length} tasks"><span class="calendar-date-row"><span class="calendar-date-number">${day.date.getDate()}</span><span class="calendar-task-count">${items.length} tasks</span></span><div class="calendar-task-list">${preview.map(renderCalendarTaskPreview).join("")}${more ? `<em>+${more} more</em>` : ""}</div></button>`;
          }).join("")}
        </section>
      </div>
    </main>
  `;
}

function dayTagGradient(tagCounts, total) {
  if (!total) return "conic-gradient(#ede3d5 0 100%)";
  let start = 0;
  const parts = tagCounts.filter(tag => tag.count > 0).map(tag => {
    const end = start + (tag.count / total) * 100;
    const segment = `${tag.color} ${start}% ${end}%`;
    start = end;
    return segment;
  });
  return `conic-gradient(${parts.join(", ")})`;
}

function renderCalendarAside() {
  const dateKey = state.selectedCalendarDate || todayKey;
  const items = calendarItemsForDate(dateKey);
  const done = items.filter(item => item.status === "done");
  const moodItems = done.map(completionFor).filter(record => record?.mood).map(record => moodByKey(record.mood)).filter(Boolean);
  const date = parseLocalDate(dateKey);
  const tagCounts = Object.entries(allTags()).map(([key, tag]) => ({ key, ...tag, count: items.filter(item => item.tag === key).length }));
  const totalTags = tagCounts.reduce((sum, tag) => sum + tag.count, 0);
  const rate = items.length ? Math.round((done.length / items.length) * 100) : 0;
  return `
    <aside class="aside calendar-aside">
      <section class="card day-detail">
        <div class="day-panel-header">
          <h2>${date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}</h2>
          <span><button class="mini-button" onclick="shiftSelectedDate(-1)" aria-label="前一天">‹</button><button class="mini-button" onclick="shiftSelectedDate(1)" aria-label="后一天">›</button></span>
        </div>
        <p class="project-desc">今日任务 <b>${items.length}</b></p>
        <div class="day-task-list">${items.length ? items.map(renderDayDetailTask).join("") : `<div class="empty">这一天还没有任务。</div>`}</div>
        <p class="day-note">今天的努力，是明天美好的伏笔。</p>
        <div class="calendar-cta">
          <strong>去今天页面添加任务</strong>
          <small>在“今天”页面集中管理任务，专注执行。</small>
          <button class="primary-button day-open" onclick="openDayTasks('${dateKey}')">前往今天添加任务 <span>→</span></button>
        </div>
      </section>
      <section class="card calendar-stats-card">
        <h2>Quick Stats</h2>
        <div class="metric-value">${done.length} / ${items.length}</div>
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${rate}"><span style="width:${rate}%"></span></div>
      </section>
      <section class="card calendar-tags-card">
        <h2>标签分布</h2>
        <div class="calendar-tag-panel">
          <div class="donut" style="background:${dayTagGradient(tagCounts, totalTags)}" aria-label="标签分布"></div>
          <div class="tag-summary">${tagCounts.map(tag => `<div class="tag-summary-row"><span class="tag-swatch" style="background:${tag.color}"></span><span>${tag.label}</span><strong>${tag.count}</strong></div>`).join("")}</div>
        </div>
      </section>
      <section class="card calendar-mood-card">
        <h2>今日心情</h2>
        <div class="calendar-mood-row">${moods.map(mood => `<span class="${moodItems.some(item => item.key === mood.key) ? "active" : ""}" title="${mood.label}"><b>${mood.icon}</b><small>${mood.label}</small></span>`).join("")}</div>
      </section>
    </aside>
  `;
}

function renderSettings() {
  const settings = state.widgetSettings;
  const cloud = state.supabaseSettings;
  const cloudStatus = supabaseReady()
    ? state.cloudStatus === "connected" ? "Connected" : state.cloudStatus === "offline" ? "Offline / Local fallback" : "Configured"
    : "Local only";
  return `
    <main class="main">
      <div class="topbar compact">
        <div>
          <p class="eyebrow">Settings</p>
          <h2 class="page-title">设置</h2>
          <div class="growth">让桌面小组件保持轻、近、安静。</div>
        </div>
        <button class="primary-button" onclick="openWidgetWindow()">打开 Widget</button>
      </div>
      <section class="settings-stack">
        <div class="settings-panel card"><h2>General</h2><div class="settings-grid"><div class="setting-row"><span>Local-first storage</span><strong>Enabled</strong></div><div class="setting-row"><span>Completed Tasks Never Disappear</span><strong>Enabled</strong></div></div></div>
        <div class="settings-panel card"><h2>Tasks</h2><div class="settings-grid"><div class="setting-row"><span>Default Tag</span><strong>${tagByKey(state.appSettings.defaultTag)?.label || "其他"}</strong></div><div class="setting-row"><span>Unfinished Previous Tasks</span><strong>Manual Review</strong></div></div></div>
        <div class="settings-panel card">
          <h2>Cloud Storage</h2>
          <form class="settings-grid" onsubmit="saveSupabaseSettings(event)">
            <label class="setting-row"><span>Enable Supabase</span><input type="checkbox" name="supabase_enabled" ${cloud.enabled ? "checked" : ""} /></label>
            <label class="setting-row"><span>Project URL</span><input class="field" name="supabase_url" value="${escapeHtml(cloud.url || defaultSupabaseUrl)}" placeholder="https://project.supabase.co" /></label>
            <label class="setting-row"><span>Anon Key</span><input class="field" name="supabase_anon_key" type="password" value="${escapeHtml(cloud.anonKey || "")}" placeholder="Supabase anon public key" /></label>
            <div class="setting-row"><span>Status</span><strong>${cloudStatus}</strong></div>
            <div class="setting-row"><span>Last Sync</span><strong>${cloud.lastSync ? formatTime(cloud.lastSync) : "Never"}</strong></div>
            <div class="setting-actions">
              <button class="secondary-button" type="submit">保存云端设置</button>
              <button class="secondary-button" type="button" onclick="testSupabaseConnection()">测试连接</button>
              <button class="secondary-button" type="button" onclick="pushLocalToSupabase()">上传本地数据</button>
              <button class="secondary-button" type="button" onclick="pullSupabaseToLocal()">拉取云端数据</button>
            </div>
          </form>
        </div>
        <div class="settings-panel card">
          <h2>Desktop Widget</h2>
          <div class="settings-grid">
            ${renderToggle("Enable Widget", "enabled", settings.enabled)}
            <label class="setting-row"><span>Widget Size</span><select class="select" onchange="saveWidgetSetting('size', this.value)"><option value="small" ${settings.size === "small" ? "selected" : ""}>Small</option><option value="medium" ${settings.size === "medium" ? "selected" : ""}>Medium</option><option value="large" ${settings.size === "large" ? "selected" : ""}>Large</option></select></label>
            ${renderToggle("Show Completed", "showCompleted", settings.showCompleted)}
            ${renderToggle("Show Tags", "showTags", settings.showTags)}
            ${renderToggle("Show Progress", "showProgress", settings.showProgress)}
            <label class="setting-row"><span>Max Tasks</span><input class="field" type="number" min="1" max="20" value="${settings.maxTasks}" onchange="saveWidgetSetting('maxTasks', this.value)" /></label>
            ${renderToggle("Remember Position", "rememberPosition", settings.rememberPosition)}
            ${renderToggle("Launch Widget on App Start", "launchOnStart", settings.launchOnStart)}
            ${renderToggle("Always on Top", "alwaysOnTop", settings.alwaysOnTop)}
          </div>
        </div>
        <div class="settings-panel card"><h2>Appearance</h2><div class="settings-grid"><div class="setting-row"><span>Theme</span><strong>Warm Minimal</strong></div><div class="setting-row"><span>Motion</span><strong>150–250ms</strong></div></div></div>
        <div class="settings-panel card"><h2>Data</h2><div class="settings-grid"><div class="setting-row"><span>Export Data</span><button class="secondary-button" onclick="exportData()">Export JSON</button></div><div class="setting-row"><span>Storage</span><strong>${supabaseReady() ? "Supabase + Local cache" : "IndexedDB Local"}</strong></div><div class="setting-row"><span>Import / Restore</span><strong>Not enabled</strong></div></div></div>
      </section>
    </main>
  `;
}

function renderToggle(label, key, checked) {
  return `<label class="setting-row"><span>${label}</span><input type="checkbox" ${checked ? "checked" : ""} onchange="saveWidgetSetting('${key}', this.checked)" /></label>`;
}

function renderProjects() {
  const selected = state.projects.find(project => project.id === state.selectedProjectId) || state.projects[0];
  const tasks = selected ? state.tasks.filter(task => task.project_id === selected.id && task.status !== "missed" && task.status !== "dropped").map(taskToItem) : [];
  return `
    <main class="main">
      <div class="topbar compact">
        <div><p class="eyebrow">Projects</p><h2 class="page-title">项目</h2><div class="growth">长期事情也可以被温柔地推进。</div></div>
      </div>
      <section class="project-create-card">
        <form class="project-form project-form-horizontal" onsubmit="addProject(event)">
          <input class="field" name="project_title" placeholder="Project 标题" autocomplete="off" />
          <input class="field" name="description" placeholder="描述" autocomplete="off" />
          <input class="field" name="start_date" type="date" title="Start Date" />
          <input class="field" name="end_date" type="date" title="End Date" />
          <select class="select" name="tag">${Object.entries(allTags()).map(([key, tag]) => `<option value="${key}">${tag.label}</option>`).join("")}</select>
          <button class="primary-button">新建</button>
        </form>
      </section>
      <div class="project-layout">
        <section class="project-list">
          ${state.projects.map(project => {
            const stats = projectStats(project.id);
            const tag = tagByKey(project.tag);
            return `
            <button class="project-item ${selected && selected.id === project.id ? "active" : ""}" onclick="selectProject('${project.id}')">
              <span>
                <strong>${escapeHtml(project.title)}</strong>
                <small><i class="tag-dot" style="background:${tag.color}"></i>${tag.label} · ${projectDateText(project)}</small>
                <small>${stats.done} / ${stats.total}</small>
              </span>
              <b>${stats.rate}%</b>
            </button>
          `}).join("") || `<div class="empty">还没有 Project。</div>`}
        </section>
        <section class="project-detail">
          ${selected ? `
            <div class="section-header">
              <div>
                <h3 class="section-title">${escapeHtml(selected.title)}</h3>
                <p class="project-desc">${escapeHtml(selected.description || "没有描述。")} · ${projectDateText(selected)}</p>
              </div>
              <span class="project-header-actions"><button class="secondary-button" onclick="editProject('${selected.id}')">编辑 Project</button><button class="secondary-button" onclick="deleteProject('${selected.id}')">删除 Project</button></span>
            </div>
            <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${projectProgress(selected.id)}"><span style="width:${projectProgress(selected.id)}%"></span></div>
            <div class="task-list project-tasks">${tasks.length ? tasks.map(renderTask).join("") : `<div class="empty">这个 Project 还没有任务。可以回到 Today 新增并关联它。</div>`}</div>
            <form class="inline-add" onsubmit="addProjectTask(event, '${selected.id}')">
              <input class="field" name="project_task_title" placeholder="给这个 Project 添加任务" autocomplete="off" />
              <select class="select" name="tag">${Object.entries(allTags()).map(([key, tag]) => `<option value="${key}" ${key === selected.tag ? "selected" : ""}>${tag.label}</option>`).join("")}</select>
              <button class="primary-button">${icons.plus}</button>
            </form>
          ` : `<div class="empty">新建一个 Project 后，它的进度会基于任务和子任务自动计算。</div>`}
        </section>
      </div>
    </main>
  `;
}

function renderAside() {
  const items = todayItems();
  const done = items.filter(item => item.status === "done");
  const tagCounts = Object.entries(allTags()).map(([key, tag]) => ({ key, ...tag, count: items.filter(item => item.tag === key).length }));
  const moodCounts = moods.map(mood => ({ ...mood, count: state.completionRecords.filter(record => record.action === "complete" && record.active !== false && record.mood === mood.key && record.completed_at.slice(0, 10) === todayKey).length }));
  const reflection = state.reflections.find(item => item.id === todayKey);
  return `
    <aside class="aside">
      <section class="card"><h2>标签</h2><div class="tag-summary">${tagCounts.map(tag => `<div class="tag-summary-row"><span class="tag-swatch" style="background:${tag.color}"></span><span>${tag.label}</span><strong>${tag.count}</strong></div>`).join("")}</div></section>
      <section class="card"><h2>今日心情分布</h2><div class="mood-panel"><div class="donut" aria-label="心情分布"></div><div class="mood-list">${moodCounts.map(mood => `<div class="mood-line"><span>${mood.icon} ${mood.label}</span><strong>${mood.count}</strong></div>`).join("")}</div></div></section>
      <section class="card reflection-card"><h2>完成后的感受</h2><div class="mood-picker">${moods.map(mood => `<button class="${state.selectedMood === mood.key ? "active" : ""}" title="${mood.label}" onclick="setMood('${mood.key}')">${mood.icon}</button>`).join("")}</div><textarea id="reflection" class="textarea" placeholder="想把什么留给今天？">${reflection ? escapeHtml(reflection.note || "") : ""}</textarea><button class="primary-button" onclick="saveReflection()">保存回顾</button></section>
      <section class="card"><h2>周期任务</h2><div class="recurring-list">${state.recurringTasks.map(item => `<div class="recurring-row"><span><strong>${escapeHtml(item.title)}</strong><small>${routineRuleText(item)} · ${normalizeRoutine(item).status}</small></span><span><button onclick="toggleRecurring('${item.id}')">${normalizeRoutine(item).status === "active" ? "暂停" : "恢复"}</button><button onclick="setView('routines')">管理</button></span></div>`).join("")}</div></section>
      <section class="card"><h2>完成记录</h2><div class="mood-list">${done.slice(-5).reverse().map(item => `<div class="mood-line"><span>${escapeHtml(item.title)}</span><strong>${formatTime(item.completedAt || item.completed_at)}</strong></div>`).join("") || `<div class="empty">今天还没有完成记录。</div>`}</div></section>
    </aside>
  `;
}

function renderRoutineEditor() {
  if (!state.routineEditor) return "";
  const source = state.recurringTasks.find(item => item.id === state.routineEditor.id);
  if (!source) return "";
  const routine = normalizeRoutine(source);
  const weekdays = [["1", "一"], ["2", "二"], ["3", "三"], ["4", "四"], ["5", "五"], ["6", "六"], ["0", "日"]];
  const selectedDays = new Set(normalizeSpecificDays(routine.specific_days).map(String));
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="routine-edit-title" onclick="closeRoutineEditor()">
      <form class="completion-modal routine-edit-modal" onsubmit="saveRoutineEdit(event)" onclick="event.stopPropagation()">
        <input type="hidden" name="routine_id" value="${routine.id}" />
        <div class="section-header">
          <h3 id="routine-edit-title" class="section-title">编辑例行</h3>
          <button type="button" class="mini-button" onclick="closeRoutineEditor()">×</button>
        </div>
        <label class="note-label">例行名称</label>
        <input class="field" name="title" value="${escapeHtml(routine.title)}" autocomplete="off" />
        <div class="task-edit-grid routine-edit-grid">
          <label><span>重复周期</span><select class="select" name="rule_type">
            ${[["daily", "每天"], ["weekdays", "工作日"], ["weekends", "周末"], ["specific", "指定星期"], ["interval", "每 X 天"]].map(([value, label]) => `<option value="${value}" ${routine.rule_type === value ? "selected" : ""}>${label}</option>`).join("")}
          </select></label>
          <label><span>标签</span><select class="select" name="tag">${Object.entries(allTags()).map(([key, tag]) => `<option value="${key}" ${routine.tag === key ? "selected" : ""}>${tag.label}</option>`).join("")}</select></label>
          <label><span>每 X 天</span><input class="field" type="number" min="1" name="interval_days" value="${routine.interval_days || 2}" /></label>
          <label><span>提醒时间</span><input class="field" type="time" name="reminder_time" value="${routine.reminder_time || ""}" /></label>
          <label><span>Start Date</span><input class="field" type="date" name="start_date" value="${routine.start_date || todayKey}" /></label>
          <label><span>End Date</span><input class="field" type="date" name="end_date" value="${routine.end_date || ""}" /></label>
        </div>
        <div class="specific-day-editor">
          <span>指定星期</span>
          <div>${weekdays.map(([value, label]) => `<label><input type="checkbox" name="specific_days" value="${value}" ${selectedDays.has(value) ? "checked" : ""} /><b>${label}</b></label>`).join("")}</div>
        </div>
        <p class="project-desc">保存后只影响今天之后的未完成实例和后续生成；已完成历史不会被修改或删除。</p>
        <div class="modal-actions">
          <button class="secondary-button" type="button" onclick="closeRoutineEditor()">取消</button>
          <button class="primary-button">保存例行</button>
        </div>
      </form>
    </div>
  `;
}

function taskRepeatValue(task) {
  if (!task?.recurring_task_id) return "none";
  const template = state.recurringTasks.find(item => item.id === task.recurring_task_id);
  return template ? normalizeRoutine(template).rule_type : "none";
}

function renderTaskEditor() {
  if (!state.taskEditor) return "";
  const task = state.tasks.find(item => item.id === state.taskEditor.id);
  if (!task) return "";
  const repeat = taskRepeatValue(task);
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="task-edit-title" onclick="closeTaskEditor()">
      <form class="completion-modal task-edit-modal" onsubmit="saveTaskEdit(event)" onclick="event.stopPropagation()">
        <input type="hidden" name="task_id" value="${task.id}" />
        <div class="section-header">
          <h3 id="task-edit-title" class="section-title">Edit Task</h3>
          <button type="button" class="mini-button" onclick="closeTaskEditor()">×</button>
        </div>
        <label class="note-label">任务名称</label>
        <input class="field" name="title" value="${escapeHtml(task.title)}" autocomplete="off" />
        <div class="task-edit-grid">
          <label><span>标签</span><select class="select" name="tag">${Object.entries(allTags()).map(([key, tag]) => `<option value="${key}" ${task.tag === key ? "selected" : ""}>${tag.label}</option>`).join("")}</select></label>
          <label><span>项目</span><select class="select" name="project_id"><option value="">无项目</option>${state.projects.map(project => `<option value="${project.id}" ${task.project_id === project.id ? "selected" : ""}>${escapeHtml(project.title)}</option>`).join("")}</select></label>
          <label><span>日期</span><input class="field" type="date" name="dueDate" value="${task.dueDate || state.taskDate || todayKey}" /></label>
          <label><span>重复</span><select class="select" name="recurrence">
            ${[["none", "不重复"], ["daily", "每天"], ["weekdays", "工作日"], ["weekends", "周末"], ["interval", "每 2 天"]].map(([value, label]) => `<option value="${value}" ${repeat === value ? "selected" : ""}>${label}</option>`).join("")}
          </select></label>
        </div>
        <p class="project-desc">修改会保留原任务，只更新它的标签、项目、日期与未来重复规则。</p>
        <div class="modal-actions">
          <button class="secondary-button" type="button" onclick="closeTaskEditor()">取消</button>
          <button class="primary-button">保存修改</button>
        </div>
      </form>
    </div>
  `;
}

function renderFloatingMenu() {
  const menu = state.floatingMenu;
  if (!menu) return "";
  const style = `top:${menu.top}px;left:${menu.left}px;`;
  const key = escapeHtml(floatingMenuKey(menu));
  if (menu.kind === "subtask") {
    return `
      <div class="floating-menu ${menu.direction}" data-anchor-key="${key}" style="${style}" role="menu" onclick="event.stopPropagation()">
        <button onclick="menuAction(() => editSubtask('${menu.subtaskId}'))">编辑子任务</button>
        <button class="danger" onclick="menuAction(() => deleteSubtask('${menu.subtaskId}'))">删除子任务</button>
      </div>
    `;
  }
  if (menu.kind === "instance") {
    const instance = state.taskInstances.find(item => item.id === menu.id);
    const done = instance?.status === "done";
    return `
      <div class="floating-menu ${menu.direction}" data-anchor-key="${key}" style="${style}" role="menu" onclick="event.stopPropagation()">
        ${done ? `<button onclick="menuAction(() => openFeelingEditor('instance', '${menu.id}'))">编辑完成记录</button>` : ""}
        <button onclick="menuAction(() => skipRecurringInstance('${menu.id}'))">跳过今天</button>
        <button onclick="menuAction(() => deleteRecurringInstance('${menu.id}'))">删除本次任务实例</button>
        <button onclick="menuAction(() => editRecurringFromInstance('${menu.id}'))">修改循环设置</button>
        <button class="danger" onclick="menuAction(() => deleteRecurringSeriesFromInstance('${menu.id}'))">删除整个循环任务</button>
      </div>
    `;
  }
  if (menu.kind === "routine") {
    const routine = state.recurringTasks.find(item => item.id === menu.id);
    const active = normalizeRoutine(routine || {}).status === "active";
    return `
      <div class="floating-menu ${menu.direction}" data-anchor-key="${key}" style="${style}" role="menu" onclick="event.stopPropagation()">
        <button onclick="menuAction(() => editRoutine('${menu.id}'))">编辑例行</button>
        <button onclick="menuAction(() => toggleRecurring('${menu.id}'))">${active ? "暂停例行" : "恢复例行"}</button>
        <button class="danger" onclick="menuAction(() => deleteRoutine('${menu.id}'))">删除例行</button>
      </div>
    `;
  }
  return `
    <div class="floating-menu ${menu.direction}" data-anchor-key="${key}" style="${style}" role="menu" onclick="event.stopPropagation()">
      <button onclick="menuAction(() => editTask('${menu.id}'))">编辑任务</button>
      <button onclick="menuAction(() => addSubtask('${menu.id}'))">添加子任务</button>
      <button onclick="menuAction(() => changeTaskDate('${menu.id}'))">设置日期/提醒</button>
      <button onclick="menuAction(() => moveTaskToProject('${menu.id}'))">移动项目</button>
      <button class="danger" onclick="menuAction(() => deleteTask('${menu.id}'))">删除任务</button>
    </div>
  `;
}

function renderReflectionViewer() {
  if (!state.reflectionViewer) return "";
  const item = state.reflectionViewer.kind === "task"
    ? taskToItem(state.tasks.find(task => task.id === state.reflectionViewer.id))
    : instanceToItem(state.taskInstances.find(task => task.id === state.reflectionViewer.id));
  const record = state.completionRecords.find(entry => entry.id === state.reflectionViewer.recordId);
  if (!item || !record) return "";
  const mood = record.mood ? moodByKey(record.mood) : null;
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reflection-title" onclick="closeReflectionViewer()">
      <article class="completion-modal reflection-modal" onclick="event.stopPropagation()">
        <div class="section-header">
          <h3 id="reflection-title" class="section-title">完成感想</h3>
          <button type="button" class="mini-button" onclick="closeReflectionViewer()">×</button>
        </div>
        <p class="project-desc">${escapeHtml(item.title)}</p>
        <div class="reflection-detail">
          <div><span>完成时间</span><strong>${formatTime(record.completed_at)}</strong></div>
          ${mood ? `<div><span>Mood</span><strong>${mood.icon} ${mood.label}</strong></div>` : ""}
          ${record.note ? `<p>${escapeHtml(record.note)}</p>` : `<p class="muted-note">没有填写文字感想。</p>`}
        </div>
        <div class="modal-actions">
          <button class="secondary-button" onclick="openFeelingEditor('${state.reflectionViewer.kind}', '${state.reflectionViewer.id}')">编辑</button>
          <button class="primary-button" onclick="closeReflectionViewer()">完成</button>
        </div>
      </article>
    </div>
  `;
}

function renderFeelingSheet() {
  if (!state.feelingSheet) return "";
  const item = state.feelingSheet.kind === "task"
    ? taskToItem(state.tasks.find(task => task.id === state.feelingSheet.id))
    : instanceToItem(state.taskInstances.find(task => task.id === state.feelingSheet.id));
  const record = state.completionRecords.find(item => item.id === state.feelingSheet.recordId);
  const selectedMood = record?.mood || "";
  const title = state.feelingSheet.editing ? "完成记录" : "完成啦";
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="completion-title">
      <form class="completion-modal feeling-sheet" onsubmit="saveFeeling(event)" onclick="event.stopPropagation()">
        <div class="section-header"><h3 id="completion-title" class="section-title">${title}</h3><button type="button" class="mini-button" onclick="closeCompletion()">×</button></div>
        <p class="project-desc">${escapeHtml(item.title)}</p>
        <p class="feeling-prompt">现在感觉怎么样？</p>
        <div class="modal-moods">${moods.map(mood => `<label><input type="radio" name="mood" value="${mood.key}" ${selectedMood === mood.key ? "checked" : ""} /><span>${mood.icon} ${mood.label}</span></label>`).join("")}</div>
        <label class="note-label">想记点什么吗？</label>
        <textarea class="textarea" name="note" placeholder="完成这件事以后有什么感觉？">${escapeHtml(record?.note || "")}</textarea>
        <div class="modal-actions">
          ${state.feelingSheet.editing ? `<button class="secondary-button" type="button" onclick="clearFeeling()">清除</button>` : ""}
          <button class="secondary-button" type="button" onclick="skipFeeling()">Skip</button>
          <button class="primary-button">保存</button>
        </div>
      </form>
    </div>
  `;
}

function renderDialogField(field) {
  const label = field.label ? `<span>${escapeHtml(field.label)}</span>` : "";
  const value = field.value ?? "";
  const placeholder = field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : "";
  if (field.type === "textarea") {
    return `
      <label class="warm-dialog-field">
        ${label}
        <textarea class="textarea" name="${escapeHtml(field.name)}"${placeholder}>${escapeHtml(value)}</textarea>
      </label>
    `;
  }
  if (field.type === "select") {
    return `
      <label class="warm-dialog-field">
        ${label}
        <select class="select" name="${escapeHtml(field.name)}">
          ${(field.options || []).map(([optionValue, optionLabel]) => `<option value="${escapeHtml(optionValue)}" ${String(value) === String(optionValue) ? "selected" : ""}>${escapeHtml(optionLabel)}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (field.type === "checkboxes") {
    const selected = new Set((field.value || []).map(String));
    return `
      <div class="warm-dialog-field">
        ${label}
        <div class="warm-checkbox-grid">
          ${(field.options || []).map(([optionValue, optionLabel]) => `
            <label>
              <input type="checkbox" name="${escapeHtml(field.name)}" value="${escapeHtml(optionValue)}" ${selected.has(String(optionValue)) ? "checked" : ""} />
              <span>${escapeHtml(optionLabel)}</span>
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }
  const type = field.type || "text";
  return `
    <label class="warm-dialog-field">
      ${label}
      <input class="field" type="${escapeHtml(type)}" name="${escapeHtml(field.name)}" value="${escapeHtml(value)}"${placeholder} autocomplete="off" />
    </label>
  `;
}

function renderWarmDialog() {
  const dialog = state.warmDialog;
  if (!dialog) return "";
  return `
    <div class="modal-backdrop warm-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="warm-dialog-title" onclick="closeWarmDialog()">
      <form class="completion-modal warm-dialog" onsubmit="submitWarmDialog(event)" onclick="event.stopPropagation()">
        <div class="section-header">
          <h3 id="warm-dialog-title" class="section-title">${escapeHtml(dialog.title)}</h3>
          <button type="button" class="mini-button" onclick="closeWarmDialog()">×</button>
        </div>
        ${dialog.message ? `<p class="project-desc">${escapeHtml(dialog.message)}</p>` : ""}
        ${dialog.fields.length ? `<div class="warm-dialog-fields">${dialog.fields.map(renderDialogField).join("")}</div>` : ""}
        <div class="modal-actions">
          <button class="secondary-button" type="button" onclick="closeWarmDialog()">${escapeHtml(dialog.cancelText)}</button>
          <button class="primary-button ${dialog.danger ? "danger-button" : ""}">${escapeHtml(dialog.confirmText)}</button>
        </div>
      </form>
    </div>
  `;
}

function render() {
  const main = state.view === "projects"
    ? renderProjects()
    : state.view === "routines"
      ? renderRoutines()
      : state.view === "calendar"
        ? renderCalendar()
        : state.view === "review"
          ? renderReview()
          : state.view === "settings"
            ? renderSettings()
            : renderToday();
  const aside = state.view === "calendar" ? renderCalendarAside() : renderAside();
  const singleMain = state.view === "today" || state.view === "routines" || state.view === "projects" || state.view === "review" || state.view === "settings";
  const viewClass = `view-${state.view}`;
  document.body.dataset.view = state.view;
  document.querySelector("#app").innerHTML = `
    <div class="app-shell"><div class="window ${viewClass} ${singleMain ? "single-main" : ""}">${renderSidebar()}${main}${singleMain ? "" : aside}</div></div>
    <div id="toast" class="toast"></div>
    ${renderFloatingMenu()}
    ${renderWarmDialog()}
    ${renderRoutineEditor()}
    ${renderReflectionViewer()}
    ${renderWeeklyMemoryModal()}
    ${renderTaskEditor()}
    ${renderFeelingSheet()}
  `;
}

let toastTimer = null;
function toast(message) {
  const node = document.querySelector("#toast");
  if (!node) return;
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 1800);
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && state.warmDialog) closeWarmDialog();
  if (event.key === "Escape" && state.feelingSheet) closeCompletion();
  if (event.key === "Escape" && state.taskEditor) closeTaskEditor();
  if (event.key === "Escape" && state.routineEditor) closeRoutineEditor();
  if (event.key === "Escape" && state.reflectionViewer) closeReflectionViewer();
  if (event.key === "Escape" && state.weeklyMemoryOpen) closeWeeklyMemory();
  if (event.key === "Escape" && state.floatingMenu) closeFloatingMenu();
});

document.addEventListener("click", event => {
  if (!state.floatingMenu) return;
  if (event.target.closest(".floating-menu") || event.target.closest(".task-menu-trigger") || event.target.closest(".subtask-menu")) return;
  closeFloatingMenu();
});

window.addEventListener("resize", () => {
  if (state.floatingMenu) requestAnimationFrame(positionFloatingMenu);
});

window.addEventListener("scroll", () => {
  if (state.floatingMenu) requestAnimationFrame(positionFloatingMenu);
}, true);

syncChannel?.addEventListener("message", async event => {
  if (event.data?.source === "widget") {
    await generateRecurringInstances();
    await load();
  }
});

async function boot() {
  todayKey = localDateKey();
  state.db = await openDb();
  await migrateInlineSubtasks();
  await seedIfNeeded();
  await generateRecurringInstances();
  await load();
  await carryOverOverdueProjectWork();
  setInterval(async () => {
    const current = localDateKey();
    if (current === todayKey) return;
    todayKey = current;
    await generateRecurringInstances(current);
    await load();
    await carryOverOverdueProjectWork();
  }, 60000);
}

Object.assign(window, {
  closeWarmDialog, submitWarmDialog,
  addTask, addProject, editProject, selectProject, deleteProject, toggleItem, saveFeeling, closeCompletion,
  deleteTask, editTask, saveTaskEdit, closeTaskEditor, addSubtask, editSubtask, deleteSubtask, moveSubtask, toggleSubtask,
  toggleRecurring, endRecurring, editRoutine, saveRoutineEdit, closeRoutineEditor, saveReflection, setMood, setView, selectRoutine, addProjectTask, skipFeeling,
  openFeelingEditor, openReflectionViewer, closeReflectionViewer, clearFeeling, setReviewFilter, shiftCalendarMonth, goCalendarToday, selectCalendarDate,
  openDayTasks, shiftSelectedDate, editDailyStatus, shiftReviewWeek, goReviewThisWeek, saveWeeklyNote, openWeeklyMemory, closeWeeklyMemory,
  saveWidgetSetting, openWidgetWindow, setGlobalSearch, moveTaskToToday, changeTaskDate, dropTask,
  moveTaskToProject, copyTask, createQuickTag, createQuickProject, openTaskMenu, closeFloatingMenu, menuAction,
  skipRecurringInstance, deleteRecurringInstance, editRecurringFromInstance, deleteRecurringSeriesFromInstance,
  exportData, saveSupabaseSettings, testSupabaseConnection, pushLocalToSupabase, pullSupabaseToLocal
});

boot().catch(error => {
  document.querySelector("#app").innerHTML = `<div class="app-shell"><div class="empty">数据库启动失败：${escapeHtml(error.message)}</div></div>`;
});


