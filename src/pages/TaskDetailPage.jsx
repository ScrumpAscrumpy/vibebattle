import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { FeedbackBanner } from "../components/ui/FeedbackBanner";
import { Pill } from "../components/ui/Pill";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { enrollInTask, getCurrentRole, getEnrollmentStatus, getTaskById } from "../services/vibebattleService";

function getActionConfig(taskStatus, enrolled) {
  if (enrolled) {
    return { label: "已报名", disabled: true };
  }

  if (taskStatus === "OPEN") {
    return { label: "立即报名", disabled: false };
  }

  if (taskStatus === "COUNTDOWN") {
    return { label: "预约参赛", disabled: false };
  }

  if (taskStatus === "IN_PROGRESS") {
    return { label: "赛事进行中", disabled: true };
  }

  return { label: "当前不可报名", disabled: true };
}

export function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [role, setRole] = useState(() => getCurrentRole());

  useEffect(() => {
    const syncRole = () => setRole(getCurrentRole());
    window.addEventListener("vibebattle:user-change", syncRole);
    return () => window.removeEventListener("vibebattle:user-change", syncRole);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      setLoading(true);
      setError("");

      try {
        const taskResult = await getTaskById(id);
        const enrollmentResult =
          role === "CODER"
            ? await getEnrollmentStatus(id)
            : { enrolled: false, enrolledAt: null, taskId: id, userId: null };

        if (!cancelled) {
          setTask(taskResult);
          setEnrollment(enrollmentResult);
        }
      } catch {
        if (!cancelled) {
          setError("任务详情加载失败，请刷新页面重试。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPage();
    return () => {
      cancelled = true;
    };
  }, [id, role]);

  const actionConfig = useMemo(
    () => getActionConfig(task?.status, Boolean(enrollment?.enrolled)),
    [enrollment?.enrolled, task?.status]
  );

  async function handleEnroll() {
    if (!task || actionConfig.disabled) {
      return;
    }

    if (role !== "CODER") {
      setError("只有 coder 可以报名任务。请先在右上角切换角色。");
      return;
    }

    setSubmitting(true);
    setFeedback("");
    setError("");

    try {
      const result = await enrollInTask(task.id);
      setEnrollment(result);
      const refreshedTask = await getTaskById(task.id);
      setTask(refreshedTask);
      setFeedback("报名成功，任务数据已通过 API 刷新。");
    } catch {
      setError("报名失败，请稍后重试。若已报名，后端会返回重复报名错误。");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container page-stack">
        <div className="panel loading-panel">任务详情加载中...</div>
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
        <EmptyState title="任务不存在" description="当前 ID 没有对应的 Mock 数据记录。" />
      </div>
    );
  }

  return (
    <div className="container page-stack">
      <SectionHeader
        eyebrow="Task Detail"
        title={task.title}
        description={task.summary}
        action={<StatusBadge status={task.status} />}
      />

      {feedback ? <FeedbackBanner type="success">{feedback}</FeedbackBanner> : null}
      {error ? <FeedbackBanner type="error">{error}</FeedbackBanner> : null}

      <section className="detail-grid">
        <article className="panel detail-main">
          <h3>任务说明</h3>
          <p>{task.description}</p>

          <h3>交付内容</h3>
          <ul className="clean-list">
            {task.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>实现重点</h3>
          <div className="pill-row">
            {task.briefList.map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>

          <h3>规则说明</h3>
          <ul className="clean-list">
            {task.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>

        <aside className="panel detail-side">
          <h3>竞赛信息</h3>
          <dl className="detail-list">
            <div>
              <dt>奖金</dt>
              <dd>${task.bountyAmount}</dd>
            </div>
            <div>
              <dt>开源奖励</dt>
              <dd>${task.openSourceBonus ?? 0}</dd>
            </div>
            <div>
              <dt>限制时长</dt>
              <dd>{task.durationHours} h</dd>
            </div>
            <div>
              <dt>难度</dt>
              <dd>{task.difficulty}/4</dd>
            </div>
            <div>
              <dt>类型</dt>
              <dd>{task.type}</dd>
            </div>
            <div>
              <dt>发起方</dt>
              <dd>{task.creator.displayName}</dd>
            </div>
            <div>
              <dt>报名上限</dt>
              <dd>{task.maxParticipants}</dd>
            </div>
          </dl>

          <div>
            <h3>时间安排</h3>
            <div className="list-stack">
              {task.timeline.map((item) => (
                <article key={item.label} className="list-item">
                  <span>{item.label}</span>
                  <span className="list-item__meta">{item.value}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="pill-row">
            {task.techTags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>

          <div className="stack-actions">
            <button className="button" onClick={handleEnroll} disabled={actionConfig.disabled || submitting}>
              {submitting ? "提交中..." : actionConfig.label}
            </button>
            {role === "CODER" ? (
              <Link className="button button--ghost" to={`/arena/${task.id}`}>
                前往 Arena
              </Link>
            ) : (
              <button className="button button--ghost" type="button" disabled>
                coder 可进入 Arena
              </button>
            )}
            <Link className="button button--ghost" to="/tasks">
              返回任务市场
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
