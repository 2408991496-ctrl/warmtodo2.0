const widgetTags = {
  work: { label: "工作", cls: "tag-work", color: "#6d96c8" },
  study: { label: "学习", cls: "tag-study", color: "#a4ad83" },
  life: { label: "生活", cls: "tag-life", color: "#d98769" },
  health: { label: "健康", cls: "tag-health", color: "#7f9b66" },
  other: { label: "其他", cls: "tag-other", color: "#b5ada3" }
};

const widgetChannel = "BroadcastChannel" in window ? new BroadcastChannel("warmtodo-sync") : null;
const widgetStores = ["tasks", "reflections", "projects", "subtasks", "recurring_tasks", "task_instances", "completion_records", "settings"];
let widgetState = {
  db: null,
  tasks: [],
  projects: [],
  subtasks: [],
  recurringTasks: [],
  taskInstances: [],
  settings: {
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
  }
};

function widgetLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function widgetNowIso() {
  return new Date().toISOString();
}

function widgetUid() {
  return crypto.randomUUID();
}

function openWidgetDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("warmtodo_phase_1_3", 3);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of widgetStores) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function widgetTx(storeName, mode = "readonly") {
  return widgetState.db.transaction(storeName, mode).objectStore(storeName);
}

function widgetGetAll(storeName) {
  return new Promise((resolve, reject) => {
    const req = widgetTx(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function widgetPut(storeName, value) {
  return new Promise((resolve, reject) => {
    const req = widgetTx(storeName, "readwrite").put(value);
    req.onsuccess = () => {
      widgetBroadcast(`${storeName}:put`);
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

function widgetBroadcast(reason) {
  widgetChannel?.postMessage({ source: "widget", reason, at: Date.now() });
}

async function widgetLoad() {
  await widgetGenerateRecurringInstances();
  widgetState.tasks = await widgetGetAll("tasks");
  widgetState.projects = await widgetGetAll("projects");
  widgetState.subtasks = await widgetGetAll("subtasks");
  widgetState.recurringTasks = await widgetGetAll("recurring_tasks");
  widgetState.taskInstances = await widgetGetAll("task_instances");
  const saved = (await widgetGetAll("settings")).find(item => item.id === "desktop_widget");
  if (saved) widgetState.settings = { ...widgetState.settings, ...saved.value };
  widgetRender();
}

function widgetParseLocalDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function widgetDaysBetween(startDate, endDate) {
  return Math.floor((widgetParseLocalDate(endDate) - widgetParseLocalDate(startDate)) / 86400000);
}

function widgetNormalizeDays(value) {
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

function widgetShouldGenerate(template, dateKey) {
  if (template.status !== "active") return false;
  if (template.end_date && template.end_date < dateKey) return false;
  if (template.start_date && template.start_date > dateKey) return false;
  const day = widgetParseLocalDate(dateKey).getDay();
  if (template.rule_type === "daily") return true;
  if (template.rule_type === "weekdays") return day >= 1 && day <= 5;
  if (template.rule_type === "weekends") return day === 0 || day === 6;
  if (template.rule_type === "specific") return widgetNormalizeDays(template.specific_days).includes(day);
  if (template.rule_type === "interval") return widgetDaysBetween(template.start_date || dateKey, dateKey) % Math.max(1, Number(template.interval_days || 1)) === 0;
  return false;
}

async function widgetGenerateRecurringInstances() {
  const dateKey = widgetLocalDateKey();
  const templates = await widgetGetAll("recurring_tasks");
  const instances = await widgetGetAll("task_instances");
  const existing = new Set(instances.map(item => `${item.recurring_task_id}:${item.scheduled_date}`));
  for (const template of templates) {
    const key = `${template.id}:${dateKey}`;
    if (!widgetShouldGenerate(template, dateKey) || existing.has(key)) continue;
    await widgetPut("task_instances", {
      id: widgetUid(),
      recurring_task_id: template.id,
      scheduled_date: dateKey,
      title: template.title,
      tag: template.tag,
      project_id: template.project_id || null,
      status: "doing",
      completed_at: null,
      mood: null,
      note: "",
      created_at: widgetNowIso(),
      updated_at: widgetNowIso()
    });
  }
}

function todayWidgetItems() {
  const today = widgetLocalDateKey();
  const tasks = widgetState.tasks.filter(task => task.dueDate === today).map(task => ({ ...task, kind: "task", completedAt: task.completedAt }));
  const instances = widgetState.taskInstances.filter(instance => instance.scheduled_date === today).map(instance => ({ ...instance, kind: "instance", completedAt: instance.completed_at }));
  return [...tasks, ...instances].sort((a, b) => {
    if (a.status === b.status) return (a.createdAt || a.created_at || "").localeCompare(b.createdAt || b.created_at || "");
    return a.status === "done" ? 1 : -1;
  });
}

function widgetSubtasksFor(taskId) {
  return widgetState.subtasks.filter(item => item.task_id === taskId);
}

function widgetProgress(item) {
  if (item.kind === "instance") return item.status === "done" ? 100 : 0;
  const subs = widgetSubtasksFor(item.id);
  if (!subs.length) return item.status === "done" ? 100 : 0;
  return Math.round((subs.filter(sub => sub.status === "done").length / subs.length) * 100);
}

async function widgetToggle(kind, id) {
  const at = widgetNowIso();
  if (kind === "task") {
    const task = widgetState.tasks.find(item => item.id === id);
    task.status = task.status === "done" ? "doing" : "done";
    task.completedAt = task.status === "done" ? at : null;
    task.updatedAt = at;
    await widgetPut("tasks", task);
  } else {
    const instance = widgetState.taskInstances.find(item => item.id === id);
    instance.status = instance.status === "done" ? "doing" : "done";
    instance.completed_at = instance.status === "done" ? at : null;
    instance.updated_at = at;
    await widgetPut("task_instances", instance);
  }
  await widgetLoad();
}

async function widgetQuickAdd(event) {
  event.preventDefault();
  const input = event.currentTarget.title;
  const title = input.value.trim();
  if (!title) return;
  await widgetPut("tasks", {
    id: widgetUid(),
    title,
    tag: "other",
    status: "doing",
    dueDate: widgetLocalDateKey(),
    project_id: null,
    parent_task_id: null,
    recurring_task_id: null,
    createdAt: widgetNowIso(),
    updatedAt: widgetNowIso(),
    completedAt: null,
    mood: null
  });
  input.value = "";
  await widgetLoad();
}

function widgetOpenMain(view = "today") {
  window.open(`./index.html#${view}`, "warmtodo-main");
}

function widgetRenderTask(item) {
  const tag = widgetTags[item.tag] || widgetTags.other;
  const project = item.project_id ? widgetState.projects.find(project => project.id === item.project_id) : null;
  const subs = item.kind === "task" ? widgetSubtasksFor(item.id) : [];
  const done = item.status === "done";
  const progress = widgetProgress(item);
  return `
    <article class="widget-task ${done ? "done" : ""}">
      <button class="widget-check" aria-label="${done ? "Undo complete" : "Complete task"}" onclick="widgetToggle('${item.kind}', '${item.id}')">${done ? "✓" : ""}</button>
      <button class="widget-task-main" onclick="widgetOpenMain('today')" title="Open in WarmTodo">
        <strong>${escapeWidget(item.title)}</strong>
        <span>
          ${item.kind === "instance" ? "↻ " : ""}
          ${project ? `${escapeWidget(project.title)} · ` : ""}
          ${widgetState.settings.showTags ? tag.label : ""}
          ${subs.length && widgetState.settings.showProgress ? ` · ${subs.filter(sub => sub.status === "done").length} / ${subs.length} · ${progress}%` : ""}
        </span>
      </button>
    </article>
  `;
}

function widgetRender() {
  const root = document.querySelector("#widget");
  if (!widgetState.settings.enabled) {
    root.innerHTML = `<main class="widget-shell"><p class="widget-muted">Desktop Widget is disabled.</p></main>`;
    return;
  }
  document.body.dataset.size = widgetState.settings.size;
  const all = todayWidgetItems();
  const visible = widgetState.settings.showCompleted ? all : all.filter(item => item.status !== "done");
  const limited = visible.slice(0, widgetState.settings.maxTasks);
  const done = all.filter(item => item.status === "done").length;
  const total = all.length;
  const rate = total ? Math.round((done / total) * 100) : 0;
  root.innerHTML = `
    <main class="widget-shell">
      <button class="widget-header" onclick="widgetOpenMain('today')">
        <span><strong>Today</strong><small>${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "long" })}</small></span>
        <b>${done} / ${total}</b>
      </button>
      ${widgetState.settings.showProgress ? `<div class="widget-progress"><span style="width:${rate}%"></span></div>` : ""}
      <section class="widget-list">${limited.length ? limited.map(widgetRenderTask).join("") : `<div class="widget-empty">Today is clear.</div>`}</section>
      <form class="widget-add" onsubmit="widgetQuickAdd(event)"><input name="title" placeholder="+ Add task" autocomplete="off" /></form>
    </main>
  `;
}

function escapeWidget(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

let widgetDate = widgetLocalDateKey();
widgetChannel?.addEventListener("message", async event => {
  if (event.data?.source !== "widget") await widgetLoad();
});

setInterval(async () => {
  const current = widgetLocalDateKey();
  if (current !== widgetDate) {
    widgetDate = current;
    widgetBroadcast("midnight");
    await widgetLoad();
  }
}, 60000);

let boundsTimer = null;
function saveWidgetBoundsSoon() {
  if (!widgetState.settings.rememberPosition) return;
  clearTimeout(boundsTimer);
  boundsTimer = setTimeout(async () => {
    const bounds = {
      x: Math.max(0, window.screenX),
      y: Math.max(0, window.screenY),
      width: Math.max(260, window.innerWidth),
      height: Math.max(260, window.innerHeight)
    };
    widgetState.settings = { ...widgetState.settings, bounds };
    await widgetPut("settings", { id: "desktop_widget", value: widgetState.settings, updated_at: widgetNowIso() });
  }, 400);
}

function keepWidgetVisible() {
  if (window.screenX > window.screen.availWidth || window.screenY > window.screen.availHeight) {
    window.moveTo(Math.max(0, window.screen.availWidth - window.innerWidth - 32), 48);
  }
}

window.addEventListener("resize", saveWidgetBoundsSoon);
window.addEventListener("beforeunload", saveWidgetBoundsSoon);
setInterval(() => {
  keepWidgetVisible();
  saveWidgetBoundsSoon();
}, 5000);

Object.assign(window, { widgetToggle, widgetQuickAdd, widgetOpenMain });

openWidgetDb()
  .then(db => {
    widgetState.db = db;
    return widgetLoad();
  })
  .catch(error => {
    document.querySelector("#widget").innerHTML = `<main class="widget-shell"><p class="widget-muted">Widget failed: ${escapeWidget(error.message)}</p></main>`;
  });
