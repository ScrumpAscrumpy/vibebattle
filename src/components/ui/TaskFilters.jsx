import { SelectField } from "./SelectField";

export function TaskFilters({
  keyword,
  onKeywordChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}) {
  return (
    <section className="panel filters-panel">
      <div className="panel__header">
        <div>
          <h3>筛选与排序</h3>
          <p className="panel__caption">保留现有真实 API 数据流，只在前端做轻量搜索和排序整理。</p>
        </div>
      </div>
      <div className="filters-grid">
        <label className="form-field">
          <span className="form-field__label">关键词搜索</span>
          <input
            className="input"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="搜索标题、简介、标签"
          />
        </label>

        <SelectField
          label="类型"
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          options={[
            { value: "ALL", label: "全部类型" },
            { value: "BOUNTY", label: "Bounty" },
            { value: "TOURNAMENT", label: "Tournament" },
            { value: "CHALLENGE", label: "Challenge" },
          ]}
        />

        <SelectField
          label="状态"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          options={[
            { value: "ALL", label: "全部状态" },
            { value: "OPEN", label: "报名中" },
            { value: "COUNTDOWN", label: "即将开始" },
            { value: "IN_PROGRESS", label: "进行中" },
            { value: "COMPLETED", label: "已完成" },
          ]}
        />

        <SelectField
          label="排序"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          options={[
            { value: "latest", label: "最新创建" },
            { value: "bounty-desc", label: "奖金从高到低" },
            { value: "difficulty-desc", label: "难度从高到低" },
            { value: "time-asc", label: "时长从短到长" },
          ]}
        />
      </div>
    </section>
  );
}
