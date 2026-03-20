import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { Pill } from "./Pill";

export function TaskCard({ task }) {
  const tags = task.techTags.slice(0, 3);

  return (
    <article className="task-card">
      <div className="task-card__top">
        <div className="task-card__status-group">
          <StatusBadge status={task.status} />
          {task.isJoined ? <span className="joined-badge">已报名</span> : null}
        </div>
        <div className="task-card__amounts">
          <strong className="task-card__bounty">${task.bountyAmount}</strong>
          {task.openSourceBonus > 0 ? <span className="task-card__bonus">+${task.openSourceBonus}</span> : null}
        </div>
      </div>

      <div className="task-card__body">
        <h3>{task.title}</h3>
        <p className="task-card__brief">{task.brief || task.summary}</p>
      </div>

      <div className="task-card__meta">
        <span className="meta-chip">难度 {task.difficulty}/4</span>
        <span className="meta-chip">{task.type}</span>
        <span className="meta-chip">{task.timeLimit} min</span>
        <span className="meta-chip">
          {task.currentParticipants}/{task.maxParticipants} 人
        </span>
      </div>

      <div className="pill-row">
        {tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
        {task.techTags.length > tags.length ? <span className="meta-chip">+{task.techTags.length - tags.length}</span> : null}
      </div>

      <div className="task-card__footer">
        <div className="task-card__creator">
          <strong>{task.creator.displayName}</strong>
          <span>{task.currentParticipants}/{task.maxParticipants} 已报名</span>
        </div>
        <div className="task-card__actions">
          <Link className="button button--ghost" to={`/tasks/${task.id}`}>
            查看详情
          </Link>
          <Link className="button" to={`/arena/${task.id}`}>
            进入 Arena
          </Link>
        </div>
      </div>
    </article>
  );
}
