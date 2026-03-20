import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { FeedbackBanner } from "../components/ui/FeedbackBanner";
import { Field } from "../components/ui/Field";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";
import { TextAreaField } from "../components/ui/TextAreaField";
import { getCurrentRole, getLatestSubmission, getTaskById, saveSubmission } from "../services/vibebattleService";

const initialSubmission = {
  repoUrl: "",
  deployUrl: "",
  notes: "",
};

function validateSubmission(form) {
  const errors = {};
  if (!form.notes.trim()) errors.notes = "请输入说明";
  if (!form.repoUrl.trim() && !form.deployUrl.trim()) {
    errors.repoUrl = "repoUrl 和 deployUrl 至少填写一个";
    errors.deployUrl = "repoUrl 和 deployUrl 至少填写一个";
  }
  return errors;
}

export function ArenaPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(initialSubmission);
  const [latestSubmission, setLatestSubmission] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState(() => getCurrentRole());

  useEffect(() => {
    const syncRole = () => setRole(getCurrentRole());
    window.addEventListener("vibebattle:user-change", syncRole);
    return () => window.removeEventListener("vibebattle:user-change", syncRole);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadArena() {
      setLoading(true);
      setError("");

      try {
        const [taskResult, submissionResult] = await Promise.all([
          getTaskById(id),
          getLatestSubmission(id),
        ]);

        if (!cancelled) {
          setTask(taskResult);
          setLatestSubmission(submissionResult);
        }
      } catch {
        if (!cancelled) {
          setError("Arena 数据加载失败，请稍后重试。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadArena();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateField(field, value) {
    setSubmission((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateSubmission(submission);
    setErrors(nextErrors);
    setFeedback("");
    setError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (role !== "CODER") {
      setError("只有 coder 可以提交作品。请先在右上角切换角色。");
      return;
    }

    setSaving(true);

    try {
      const result = await saveSubmission(id, submission);
      setLatestSubmission(result);
      setSubmission(initialSubmission);
      const latest = await getLatestSubmission(id);
      setLatestSubmission(latest);
      setFeedback("作品提交成功，页面已通过 API 刷新最近一次提交。");
    } catch {
      setError("提交失败，请稍后重试。");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container page-stack">
        <div className="panel loading-panel">Arena 加载中...</div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="container page-stack">
        <FeedbackBanner type="error">{error}</FeedbackBanner>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container page-stack">
        <EmptyState title="Arena 不存在" description="当前任务 ID 无法进入竞赛场。" />
      </div>
    );
  }

  return (
    <div className="container page-stack">
      <SectionHeader
        eyebrow="Arena"
        title={`${task.title} Arena`}
        description="提交作品信息会通过后端 API 写入数据库。"
      />

      {feedback ? <FeedbackBanner type="success">{feedback}</FeedbackBanner> : null}
      {error ? <FeedbackBanner type="error">{error}</FeedbackBanner> : null}
      {role !== "CODER" ? (
        <FeedbackBanner type="warning">当前是 buyer 角色。只有 coder 可以进入竞赛提交流程。</FeedbackBanner>
      ) : null}

      <div className="stats-grid">
        <StatCard label="状态" value={task.status} hint="Mock 竞赛状态" />
        <StatCard
          label="报名人数"
          value={`${task.currentParticipants}/${task.maxParticipants}`}
          hint="基于后端任务统计"
        />
        <StatCard label="时间限制" value={`${task.durationHours} h`} hint="后端任务字段" />
        <StatCard label="最近提交" value={latestSubmission ? "已提交" : "暂无"} hint="从后端接口读取" />
      </div>

      <section className="detail-grid">
        <article className="panel">
          <h3>当前赛题</h3>
          <p>{task.description}</p>

          <h3>建议流程</h3>
          <ol className="clean-list clean-list--numbered">
            <li>阅读任务说明与交付边界</li>
            <li>在本地完成页面和关键交互</li>
            <li>整理工作流截图与实现说明</li>
            <li>准备后续接 API 的数据结构</li>
          </ol>

          {latestSubmission ? (
            <div className="submission-card">
              <h3>最近一次提交</h3>
              <dl className="detail-list">
                <div>
                  <dt>repoUrl</dt>
                  <dd>{latestSubmission.repoUrl}</dd>
                </div>
                <div>
                  <dt>deployUrl</dt>
                  <dd>{latestSubmission.deployUrl}</dd>
                </div>
                <div>
                  <dt>notes</dt>
                  <dd>{latestSubmission.notes}</dd>
                </div>
                <div>
                  <dt>提交时间</dt>
                  <dd>{new Date(latestSubmission.submittedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </article>

        <aside className="panel">
          <h3>提交作品</h3>
          <form className="form-stack" onSubmit={handleSubmit}>
            <Field label="repoUrl" error={errors.repoUrl}>
              <input
                className="input"
                value={submission.repoUrl}
                onChange={(event) => updateField("repoUrl", event.target.value)}
                placeholder="https://github.com/example/repo"
              />
            </Field>

            <Field label="deployUrl" error={errors.deployUrl}>
              <input
                className="input"
                value={submission.deployUrl}
                onChange={(event) => updateField("deployUrl", event.target.value)}
                placeholder="https://demo.example.com"
              />
            </Field>

            <TextAreaField
              label="notes"
              value={submission.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              error={errors.notes}
              placeholder="说明本次提交实现了哪些页面、交互和限制。"
            />

            <div className="stack-actions">
              <button className="button" type="submit" disabled={saving || role !== "CODER"}>
                {saving ? "提交中..." : "提交作品"}
              </button>
            </div>
          </form>

          <div className="stack-actions">
            <Link className="button button--ghost" to={`/tasks/${task.id}`}>
              查看任务详情
            </Link>
            <Link className="button button--ghost" to="/dashboard">
              打开 Dashboard
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
