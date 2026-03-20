import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FeedbackBanner } from "../components/ui/FeedbackBanner";
import { Field } from "../components/ui/Field";
import { SectionHeader } from "../components/ui/SectionHeader";
import { SelectField } from "../components/ui/SelectField";
import { StatCard } from "../components/ui/StatCard";
import { TextAreaField } from "../components/ui/TextAreaField";
import { createTask, getCurrentRole, getDashboardSummary, getTasks } from "../services/vibebattleService";

const initialForm = {
  title: "",
  brief: "",
  summary: "",
  description: "",
  bountyAmount: "",
  openSourceBonus: "",
  difficulty: "2",
  timeLimit: "",
  status: "OPEN",
  type: "BOUNTY",
  techTags: "",
  deliverables: "",
  rules: "",
  timeline: "",
};

function validateTaskForm(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "请输入标题";
  if (!form.brief.trim()) errors.brief = "请输入简版摘要";
  if (!form.summary.trim()) errors.summary = "请输入简述";
  if (!form.description.trim()) errors.description = "请输入详细描述";
  if (!form.bountyAmount || Number(form.bountyAmount) <= 0) errors.bountyAmount = "奖金必须大于 0";
  if (!form.timeLimit || Number(form.timeLimit) <= 0) errors.timeLimit = "时长必须大于 0";
  return errors;
}

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState(() => getCurrentRole());

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const [summaryResult, tasksResult] = await Promise.all([getDashboardSummary(), getTasks()]);
      setSummary(summaryResult);
      setRecentTasks(tasksResult.slice(0, 6));
    } catch {
      setError("控制台数据加载失败。");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  useEffect(() => {
    const syncRole = () => setRole(getCurrentRole());
    window.addEventListener("vibebattle:user-change", syncRole);
    return () => window.removeEventListener("vibebattle:user-change", syncRole);
  }, []);

  const hasValidationErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTaskForm(form);
    setErrors(nextErrors);
    setFeedback("");
    setError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (role !== "BUYER") {
      setError("只有 buyer 可以创建任务。请先在右上角切换角色。");
      return;
    }

    setSubmitting(true);

    try {
      await createTask(form);
      setFeedback("任务创建成功，已写入后端数据库。");
      setForm(initialForm);
      setErrors({});
      await loadDashboard();
    } catch {
      setError("创建任务失败，请检查后端服务和表单字段。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container page-stack">
      <SectionHeader
        eyebrow="Dashboard"
        title="买家控制台"
        description="创建任务会直接调用后端 API，并刷新控制台列表。"
      />

      {role !== "BUYER" ? (
        <FeedbackBanner type="warning">当前是 coder 角色。Dashboard 仅 buyer 可执行创建任务。</FeedbackBanner>
      ) : null}

      {feedback ? <FeedbackBanner type="success">{feedback}</FeedbackBanner> : null}
      {error ? <FeedbackBanner type="error">{error}</FeedbackBanner> : null}
      {hasValidationErrors ? (
        <FeedbackBanner type="warning">表单存在未通过校验的字段，请修正后提交。</FeedbackBanner>
      ) : null}

      {loading ? <div className="panel loading-panel">控制台加载中...</div> : null}

      {!loading && summary ? (
        <div className="stats-grid">
          <StatCard label="开放任务" value={summary.activeTasks} hint="Open / Countdown" />
          <StatCard label="进行中" value={summary.liveTasks} hint="Mock live 状态" />
          <StatCard label="已完成" value={summary.completedTasks} hint="演示统计" />
          <StatCard label="报名总数" value={summary.totalParticipants} hint="来自本地数据" />
        </div>
      ) : null}

      <section className="detail-grid">
        <form className="panel" onSubmit={handleSubmit}>
          <h3>创建任务</h3>

          <Field label="标题" error={errors.title}>
            <input className="input" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          </Field>

          <Field label="简版摘要" error={errors.brief}>
            <input className="input" value={form.brief} onChange={(event) => updateField("brief", event.target.value)} />
          </Field>

          <Field label="简述" error={errors.summary}>
            <input
              className="input"
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
            />
          </Field>

          <TextAreaField
            label="详细描述"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            error={errors.description}
            placeholder="说明任务背景、交付边界和重点。"
          />

          <div className="filters-grid">
            <Field label="奖金" error={errors.bountyAmount}>
              <input
                className="input"
                type="number"
                min="1"
                value={form.bountyAmount}
                onChange={(event) => updateField("bountyAmount", event.target.value)}
              />
            </Field>

            <Field label="开源奖励">
              <input
                className="input"
                type="number"
                min="0"
                value={form.openSourceBonus}
                onChange={(event) => updateField("openSourceBonus", event.target.value)}
              />
            </Field>

            <SelectField
              label="难度"
              value={form.difficulty}
              onChange={(event) => updateField("difficulty", event.target.value)}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
              ]}
            />

            <Field label="时长（分钟）" error={errors.timeLimit}>
              <input
                className="input"
                type="number"
                min="1"
                value={form.timeLimit}
                onChange={(event) => updateField("timeLimit", event.target.value)}
              />
            </Field>

            <SelectField
              label="状态"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              options={[
                { value: "OPEN", label: "报名中" },
                { value: "COUNTDOWN", label: "即将开始" },
                { value: "IN_PROGRESS", label: "进行中" },
                { value: "COMPLETED", label: "已完成" },
              ]}
            />
          </div>

          <SelectField
            label="类型"
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
            options={[
              { value: "BOUNTY", label: "Bounty" },
              { value: "TOURNAMENT", label: "Tournament" },
              { value: "CHALLENGE", label: "Challenge" },
            ]}
          />

          <Field label="技术标签（逗号分隔）">
            <input className="input" value={form.techTags} onChange={(event) => updateField("techTags", event.target.value)} />
          </Field>

          <TextAreaField
            label="交付物（每行一条）"
            value={form.deliverables}
            onChange={(event) => updateField("deliverables", event.target.value)}
          />

          <TextAreaField
            label="规则（每行一条）"
            value={form.rules}
            onChange={(event) => updateField("rules", event.target.value)}
          />

          <TextAreaField
            label="时间安排（每行一条）"
            value={form.timeline}
            onChange={(event) => updateField("timeline", event.target.value)}
          />

          <div className="stack-actions">
            <button className="button" type="submit" disabled={submitting || role !== "BUYER"}>
              {submitting ? "保存中..." : "创建任务"}
            </button>
          </div>
        </form>

        <section className="panel">
          <h3>最近任务</h3>
          <div className="table-like">
            <div className="table-like__head">
              <span>标题</span>
              <span>状态</span>
              <span>奖金</span>
              <span>操作</span>
            </div>
            {recentTasks.map((task) => (
              <div key={task.id} className="table-like__row">
                <span>{task.title}</span>
                <span>{task.status}</span>
                <span>${task.bountyAmount}</span>
                <Link className="text-link" to={`/tasks/${task.id}`}>
                  查看
                </Link>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
