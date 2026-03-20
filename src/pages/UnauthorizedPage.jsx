import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="container page-stack">
      <section className="empty-state">
        <h1>无权限访问</h1>
        <p>当前角色没有访问此页面的权限，请切换角色或返回任务市场。</p>
        <Link className="button" to="/tasks">
          返回任务市场
        </Link>
      </section>
    </div>
  );
}
