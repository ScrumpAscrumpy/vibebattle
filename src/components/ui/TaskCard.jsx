import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { Pill } from "./Pill";

export function TaskCard({ task }) {
  const tags = task.techTags.slice(0, 3);
  const level = Math.max(1, Math.min(4, Number(task.difficulty) || 1));
  const stars = `${"★".repeat(level)}${"☆".repeat(4 - level)}`;

  return (
    <article className="task-card">
      <div className="task-card__accent" />
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

      <div className="task-card__rating-row">
        <span className="task-card__stars">{stars}</span>
        <span className="task-card__time">◷ {task.timeLimit}min</span>
      </div>

      <div className="pill-row">
        {tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
        {task.techTags.length > tags.length ? <span className="meta-chip">+{task.techTags.length - tags.length}</span> : null}
      </div>

      <div className="task-card__footer">
        <div className="task-card__creator">
          <div className="task-card__avatar">{task.creator.displayName.slice(0, 2).toUpperCase()}</div>
          <div>
            <strong>{task.creator.displayName}</strong>
            <span>{task.currentParticipants}/{task.maxParticipants} 已报名</span>
          </div>
        </div>
        <div className="task-card__actions">
          <Link className="text-link" to={`/tasks/${task.id}`}>
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
