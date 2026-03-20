const statusMap = {
  OPEN: "报名中",
  COUNTDOWN: "即将开始",
  IN_PROGRESS: "进行中",
  COMPLETED: "已完成",
  JUDGING: "评审中",
};

export function StatusBadge({ status }) {
  const className =
    status === "OPEN"
      ? "status-badge status-badge--open"
      : status === "COUNTDOWN"
        ? "status-badge status-badge--countdown"
        : status === "IN_PROGRESS"
          ? "status-badge status-badge--progress"
          : status === "JUDGING"
            ? "status-badge status-badge--judging"
            : "status-badge status-badge--completed";

  return (
    <span className={className}>
      <span className="status-badge__dot" />
      {statusMap[status] ?? status}
    </span>
  );
}
