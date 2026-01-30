# Feature Specification: Auto Refresh Preview

**Feature Branch**: `002-auto-refresh-preview`
**Created**: 2026-01-26
**Status**: Draft
**Input**: User description: "components/assistant-ui/preview-panel.tsx 增加一个轮询机制，轮询查询config 接口，当发现数值有变化时，刷新iframe，触发数值重新加载生效"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 自动刷新预览 (Priority: P1)

当用户在“游戏数值设置”面板修改并保存配置后，右侧的预览面板（PreviewPanel）中的游戏画面应自动刷新，以应用最新的数值配置。

**Why this priority**: 提升用户体验，无需手动刷新即可看到数值调整的效果。

**Independent Test**:
1. 打开预览面板，加载游戏。
2. 在数值设置面板修改数值并保存。
3. 观察预览面板，iframe 应在短时间内自动重新加载。

**Acceptance Scenarios**:

1. **Given** 预览面板已打开且正在显示游戏。
2. **When** 服务器端的 `config.json` 文件内容发生变化（通过 API 查询检测）。
3. **Then** 预览面板中的 `iframe` 自动刷新 (`src` 属性重置或 reload)。
4. **Then** 轮询间隔应合理（例如 1-2秒），避免过度请求。

### Edge Cases

- **Config 文件不存在**: 轮询接口可能返回 404，应静默处理或保持当前状态，不应频繁报错阻塞 UI。
- **Preview 未打开**: 只有当 `isOpen` 为 true 且 `previewUrl` 存在时才进行轮询。
- **网络异常**: 轮询请求失败时不应导致应用崩溃。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 组件 `PreviewPanel` 必须在显示状态下轮询 `/api/sandbox/${threadId}/config.json` 接口。
- **FR-002**: 轮询间隔设定为 2 秒（可配置）。
- **FR-003**: 系统必须比较当前 Config 内容与上一次获取的内容（或 Hash）。
- **FR-004**: 当检测到 Config 内容变化时，必须强制刷新 iframe。
- **FR-005**: 必须从 `sessionStorage` 获取 `thread_id` 用于构建轮询 URL。

### Key Entities

- **PollingState**: 记录上一次的 Config 内容/Hash。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Config 变更后，预览页面在 3 秒内完成刷新动作。
- **SC-002**: 在无变更情况下，不进行不必要的刷新。
