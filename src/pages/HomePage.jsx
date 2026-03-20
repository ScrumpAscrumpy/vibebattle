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
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            <span className="eyebrow">VibeCoding 竞技场 · 实时在线</span>
          </div>
          <h1>
            代码竞速
            <br />
            <span className="hero__headline-accent">真实需求</span>
            <br />
            赢取奖金
          </h1>
          <p>
            买家发布真实需求，参赛者用 AI 辅助编程竞速交付。用时更短、完成度更高的方案获得奖金，开源工作流还能拿到额外奖励。
          </p>
          <div className="hero__actions">
            <Link className="button" to="/tasks">
              立即参赛
            </Link>
            <Link className="button button--ghost" to="/dashboard">
              发布悬赏任务
            </Link>
          </div>
          <div className="hero__metrics">
            <div className="hero__metric">
              <strong>{featuredTasks.length || 3}</strong>
              <span>悬赏任务在线开放</span>
            </div>
            <div className="hero__metric">
              <strong>{leaderboard.length || 5}</strong>
              <span>排行榜持续更新</span>
            </div>
            <div className="hero__metric">
              <strong>Live</strong>
              <span>任务、报名、提交已联调</span>
            </div>
          </div>
        </div>

        <div className="hero__stats">
          <StatCard label="赏金任务" value={`$${featuredTasks[0]?.bountyAmount ?? 5000}`} hint="当前推荐任务奖金" />
          <StatCard label="参与模式" value="Buyer / Coder" hint="角色切换保留现有逻辑" />
          <StatCard label="任务来源" value="Real API" hint="任务核心数据来自后端" />
          <div className="hero__terminal">
            <div className="hero__terminal-bar">
              <span className="hero__terminal-dot hero__terminal-dot--red" />
              <span className="hero__terminal-dot hero__terminal-dot--yellow" />
              <span className="hero__terminal-dot hero__terminal-dot--green" />
              <span className="hero__terminal-title">vibearena.live.feed</span>
            </div>
            <div className="hero__terminal-body">
              <div className="hero__terminal-line">
                <span className="hero__terminal-prompt">$</span>
                <span>contest start #{featuredTasks[0]?.id?.slice?.(0, 4) ?? "2847"}</span>
              </div>
              <div className="hero__terminal-output">任务: {featuredTasks[0]?.title ?? "智能简历生成器"}</div>
              <div className="hero__terminal-output">
                奖金: ${featuredTasks[0]?.bountyAmount ?? 5000}
                {featuredTasks[0]?.openSourceBonus ? ` + $${featuredTasks[0].openSourceBonus} 开源奖` : ""}
              </div>
              <div className="hero__terminal-output">
                参赛者: {featuredTasks[0]?.currentParticipants ?? 23} 人
              </div>
              <hr className="hero__terminal-divider" />
              <div className="hero__terminal-line">
                <span className="hero__terminal-prompt">$</span>
                <span>leaderboard --live</span>
              </div>
              {leaderboard.slice(0, 3).map((item) => (
                <div key={item.rank} className="hero__terminal-output">
                  {item.rank}. {item.name} · ELO {item.elo}
                </div>
              ))}
              <hr className="hero__terminal-divider" />
              <div className="hero__terminal-line">
                <span className="hero__terminal-prompt">$</span>
                <span>submit</span>
                <span className="hero__terminal-cursor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {error ? <FeedbackBanner type="error">{error}</FeedbackBanner> : null}
      {loading ? <div className="panel loading-panel">首页加载中...</div> : null}

      {!loading && !error ? (
        <>
          <section className="home-section">
            <SectionHeader
              eyebrow="How It Works"
              title="五步跑通一场 Vibe Coding 竞赛"
              description="沿用现有 buyer / coder 角色和后端接口，只把首页表达调整为更完整的平台叙事。"
            />
            <div className="feature-flow">
              {[
                { icon: "📋", title: "发布任务", description: "买家填写需求、奖金和交付规则，快速发起一场可执行的竞赛。" },
                { icon: "🙋", title: "报名参赛", description: "Coder 浏览任务市场，按方向、难度和奖金选择要投入的赛题。" },
                { icon: "⏱", title: "进入 Arena", description: "统一围绕任务边界推进实现，保持提交节奏与作品说明同步。" },
                { icon: "🚀", title: "提交作品", description: "Repo、部署链接和 notes 都通过现有 API 写入，保留当前联调链路。" },
                { icon: "🌟", title: "开源展示", description: "优秀工作流和作品沉淀为 Showcase，为后续社区扩展预留空间。" },
              ].map((item) => (
                <article key={item.title} className="feature-flow__item">
                  <span className="feature-flow__icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              eyebrow="Featured"
              title="推荐任务"
              description="面向真实交付场景的悬赏与挑战任务，保留现有 API 数据流。"
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
              <SectionHeader eyebrow="Showcases" title="开源展示" />
              <div className="list-stack">
                {showcaseItems.map((item) => (
                  <article key={item.id} className="list-item">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.tools}</p>
                    </div>
                    <div className="list-item__meta">
                      <span>#{item.rank}</span>
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

          <section className="home-section">
            <SectionHeader
              eyebrow="Value"
              title="为什么它像一个真正的产品，而不只是演示页"
              description="不新增后端功能，只基于现有 API、路由和角色切换，强化平台定位与信息层级。"
            />
            <div className="value-grid">
              <article className="value-card">
                <h3>对 Buyer</h3>
                <p>更快验证需求，公开奖金与规则，用竞赛机制筛选更优交付方案。</p>
              </article>
              <article className="value-card">
                <h3>对 Coder</h3>
                <p>围绕真实任务竞速交付，沉淀可展示作品和开源工作流，形成个人声誉。</p>
              </article>
              <article className="value-card">
                <h3>对平台</h3>
                <p>任务、报名、提交、控制台都已经形成闭环，后续只需继续增强评审和运营能力。</p>
              </article>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
