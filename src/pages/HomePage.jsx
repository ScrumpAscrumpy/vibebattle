import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { FeedbackBanner } from "../components/ui/FeedbackBanner";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";
import { TaskCard } from "../components/ui/TaskCard";
import { getFeaturedTasks, getLeaderboard, getShowcases } from "../services/vibebattleService";

export function HomePage() {
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [showcaseItems, setShowcaseItems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHome() {
      setLoading(true);
      setError("");

      try {
        const [tasksResult, showcaseResult, leaderboardResult] = await Promise.all([
          getFeaturedTasks(),
          getShowcases(),
          getLeaderboard(),
        ]);

        if (!cancelled) {
          setFeaturedTasks(tasksResult);
          setShowcaseItems(showcaseResult);
          setLeaderboard(leaderboardResult);
        }
      } catch {
        if (!cancelled) {
          setError("首页数据加载失败，请稍后重试。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHome();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container page-stack">
      <section className="hero">
        <div className="hero__content">
          <span className="eyebrow">Vibe Coding Arena</span>
          <h1>把静态页面升级为可交互的前端原型。</h1>
          <p>
            当前版本已经支持任务搜索、报名、创建任务和作品提交。任务相关数据优先来自后端 API，排行榜和工作流展示仍使用前端静态数据。
          </p>
          <div className="hero__actions">
            <Link className="button" to="/tasks">
              浏览任务市场
            </Link>
            <Link className="button button--ghost" to="/dashboard">
              打开控制台
            </Link>
          </div>
        </div>

        <div className="hero__stats">
          <StatCard label="任务交互" value="可用" hint="搜索、报名、创建、提交" />
          <StatCard label="数据来源" value="真实 API 优先" hint="任务相关已接入后端" />
          <StatCard label="API 状态" value="已接入" hint="表单和详情页已走后端接口" />
        </div>
      </section>

      {error ? <FeedbackBanner type="error">{error}</FeedbackBanner> : null}
      {loading ? <div className="panel loading-panel">首页加载中...</div> : null}

      {!loading && !error ? (
        <>
          <section>
            <SectionHeader
              eyebrow="Featured"
              title="推荐任务"
              description="首页展示最适合当前 MVP 演示的任务。"
              action={
                <Link className="button button--ghost" to="/tasks">
                  查看全部
                </Link>
              }
            />
            {featuredTasks.length > 0 ? (
              <div className="card-grid">
                {featuredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <EmptyState title="暂无推荐任务" description="可以先去 Dashboard 创建一个任务。" />
            )}
          </section>

          <section className="two-column">
            <div className="panel">
              <SectionHeader eyebrow="Showcases" title="工作流展示" />
              <div className="list-stack">
                {showcaseItems.map((item) => (
                  <article key={item.id} className="list-item">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.tools}</p>
                    </div>
                    <div className="list-item__meta">
                      <span>{item.author}</span>
                      <span>{item.duration}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel">
              <SectionHeader eyebrow="Leaderboard" title="排行榜" />
              <div className="list-stack">
                {leaderboard.map((item) => (
                  <article key={item.rank} className="list-item">
                    <div>
                      <h3>
                        #{item.rank} {item.name}
                      </h3>
                      <p>
                        ELO {item.elo} · {item.wins}/{item.total} 胜
                      </p>
                    </div>
                    <div className="list-item__meta">
                      <span>{item.avgTime}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
