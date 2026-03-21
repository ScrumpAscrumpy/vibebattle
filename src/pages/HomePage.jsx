import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { FeedbackBanner } from "../components/ui/FeedbackBanner";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";
import { TaskCard } from "../components/ui/TaskCard";
import { getHomeFeed } from "../services/vibebattleService";

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
        const homeFeed = await getHomeFeed();

        if (!cancelled) {
          setFeaturedTasks(homeFeed.featuredTasks);
          setShowcaseItems(homeFeed.showcases);
          setLeaderboard(homeFeed.leaderboard);
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
            <span className="eyebrow">⚡ The Arena for Vibe Coders</span>
          </div>
          <h1>
            用 AI 工具竞速解决
            <br />
            真实需求，<span className="hero__headline-accent">赢取奖金</span>
          </h1>
          <p>
            发布你的需求或参加限时竞赛，用 Vibe Coding 最短时间交付可运行产品。开源你的工作流，获取额外奖励。
          </p>
          <div className="hero__actions">
            <Link className="button" to="/tasks">
              🍜 浏览赛事
            </Link>
            <Link className="button button--ghost" to="/dashboard">
              📋 发布任务
            </Link>
          </div>
        </div>

      </section>

      {!loading && !error ? (
        <div className="stats-grid hero-stats-grid">
          <StatCard label="🏆 已举办赛事" value="1,247" hint="" />
          <StatCard label="💰 总奖金池" value="$487K" hint="" />
          <StatCard label="⚡ 活跃 Coder" value="3,892" hint="" />
          <StatCard label="⏱ 平均完赛时间" value="38min" hint="" />
        </div>
      ) : null}

      {error ? <FeedbackBanner type="error">{error}</FeedbackBanner> : null}
      {loading ? <div className="panel loading-panel">首页加载中...</div> : null}

      {!loading && !error ? (
        <>
          <section>
            <SectionHeader
              eyebrow="Featured"
              title="🔥 热门赛事"
              action={
                <Link className="button button--ghost" to="/tasks">
                  查看全部 →
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

          <section className="home-section">
            <SectionHeader eyebrow="How It Works" title="如何运作" />
            <div className="feature-flow">
              {[
                { icon: "📋", title: "发布任务", description: "描述需求与奖金" },
                { icon: "🙋", title: "报名参赛", description: "选择感兴趣的赛事" },
                { icon: "⏱", title: "同步开赛", description: "倒计时开始，同时出发" },
                { icon: "🚀", title: "提交评审", description: "完成后一键提交" },
                { icon: "🌟", title: "开源展示", description: "公开工作流赢额外奖励" },
              ].map((item) => (
                <article key={item.title} className="feature-flow__item">
                  <span className="feature-flow__icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
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
            <SectionHeader eyebrow="Value" title="三方共赢" />
            <div className="value-grid">
              <article className="value-card">
                <h3>🏢 买家</h3>
                <p>竞赛价格获得多方案</p>
                <p>最短时间看到可运行产品</p>
                <p>全过程透明可回溯</p>
              </article>
              <article className="value-card">
                <h3>⚡ 参赛者</h3>
                <p>展示 AI 工具链实力</p>
                <p>赢取奖金建立品牌</p>
                <p>开源工作流获额外收入</p>
              </article>
              <article className="value-card">
                <h3>🎯 主办方</h3>
                <p>品牌曝光与用户增长</p>
                <p>获取工具链使用数据</p>
                <p>建立开发者社区</p>
              </article>
            </div>

            <article className="home-cta">
              <h3>准备好了吗？</h3>
              <p>无论你是有需求的买家，还是身怀绝技的 Vibe Coder，这里都有你的舞台。</p>
              <div className="stack-actions">
                <Link className="button" to="/tasks">
                  我是开发者，去参赛
                </Link>
                <Link className="button button--ghost home-cta__accent" to="/dashboard">
                  我有需求，去发布
                </Link>
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
