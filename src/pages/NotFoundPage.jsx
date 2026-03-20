import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container page-stack">
      <section className="empty-state">
        <h1>页面不存在</h1>
        <p>当前路径没有对应页面，请从首页或任务市场继续浏览。</p>
        <Link className="button" to="/">
          返回首页
        </Link>
      </section>
    </div>
  );
}
