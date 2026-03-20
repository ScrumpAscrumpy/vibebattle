import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "../components/ui/EmptyState";
import { FeedbackBanner } from "../components/ui/FeedbackBanner";
import { SectionHeader } from "../components/ui/SectionHeader";
import { TaskCard } from "../components/ui/TaskCard";
import { TaskFilters } from "../components/ui/TaskFilters";
import { getCurrentRole, getEnrollmentStatus, getTasks } from "../services/vibebattleService";

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("latest");
  const [role, setRole] = useState(() => getCurrentRole());

  useEffect(() => {
    const syncRole = () => setRole(getCurrentRole());
    window.addEventListener("vibebattle:user-change", syncRole);
    return () => window.removeEventListener("vibebattle:user-change", syncRole);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      setLoading(true);
      setError("");

      try {
        const nextTasks = await getTasks({
          status,
          type,
          orderBy: sort === "bounty-desc" ? "prize" : "createdAt",
        });
        const tasksWithJoinStatus =
          role === "CODER"
            ? await Promise.all(
                nextTasks.map(async (task) => {
                  try {
                    const joinStatus = await getEnrollmentStatus(task.id);
                    return { ...task, isJoined: joinStatus.enrolled };
                  } catch {
                    return { ...task, isJoined: false };
                  }
                })
              )
            : nextTasks.map((task) => ({ ...task, isJoined: false }));
        if (!cancelled) {
          setTasks(tasksWithJoinStatus);
        }
      } catch {
        if (!cancelled) {
          setError("任务列表加载失败，请稍后重试。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTasks();
    return () => {
      cancelled = true;
    };
  }, [role, sort, status, type]);

  const filteredTasks = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return [...tasks]
      .filter((task) => {
        if (!normalizedKeyword) return true;

        const haystack = [
          task.title,
          task.summary,
          task.description,
          ...(task.techTags ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedKeyword);
      })
      .sort((left, right) => {
        if (sort === "difficulty-desc") return right.difficulty - left.difficulty;
        if (sort === "time-asc") return left.timeLimit - right.timeLimit;
        if (sort === "bounty-desc") return right.bountyAmount - left.bountyAmount;
        return String(right.createdAt ?? "").localeCompare(String(left.createdAt ?? ""));
      });
  }, [keyword, sort, tasks]);

  return (
    <div className="container page-stack">
      <SectionHeader
        eyebrow="Tasks"
        title="任务市场"
        description="支持关键词搜索、筛选、排序。任务数据当前优先来自后端 API。"
      />

      <TaskFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        type={type}
        onTypeChange={setType}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      {error ? <FeedbackBanner type="error">{error}</FeedbackBanner> : null}
      {loading ? <div className="panel loading-panel">任务列表加载中...</div> : null}

      {!loading && !error && tasks.length === 0 ? (
        <EmptyState title="还没有任务" description="当前还没有可展示的任务，请先去 Dashboard 创建。" />
      ) : null}

      {!loading && !error && tasks.length > 0 && filteredTasks.length === 0 ? (
        <EmptyState
          title="没有匹配结果"
          description="当前筛选条件下没有匹配任务，请调整关键词、状态或排序条件。"
        />
      ) : null}

      {!loading && !error && filteredTasks.length > 0 ? (
        <div className="card-grid">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
