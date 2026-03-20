const statusMap = {
  OPEN: "报名中",
  COUNTDOWN: "即将开始",
  IN_PROGRESS: "进行中",
  COMPLETED: "已完成",
  CHALLENGE: "挑战赛",
  JUDGING: "评审中",
};

export function StatusBadge({ status }) {
  return <span className="status-badge">{statusMap[status] ?? status}</span>;
}
