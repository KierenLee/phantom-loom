# Feature Specification: Game Config Save

**Feature Branch**: `001-save-game-config`
**Created**: 2026-01-26
**Status**: Draft
**Input**: User description: "实现components/assistant-ui/game-numerical-setting/index.tsx 点击保存按钮可直接修改 ./workspace/${threadId}/config.json 的功能，其中 threadId = sessionStorage.getItem("thread_id");如果拿不到就不执行后续流程，并报错。需求文档和技术方案文档使用中文"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 保存游戏数值配置 (Priority: P1)

用户可以通过点击保存按钮，将当前的游戏数值设置保存到服务器端对应的配置文件中。

**Why this priority**: 核心功能，允许用户持久化修改。

**Independent Test**: 可以通过在界面修改数值并保存，然后检查服务器对应文件内容是否变更来验证。

**Acceptance Scenarios**:

1. **Given** 浏览器 sessionStorage 中存在有效的 `thread_id`，且用户修改了数值配置。
2. **When** 用户点击“保存”按钮。
3. **Then** 界面显示保存成功状态。
4. **Then** 服务器路径 `./workspace/${threadId}/config.json` 的文件内容被更新为当前配置。

---

### User Story 2 - 异常处理：缺少 Thread ID (Priority: P2)

当会话信息丢失（缺少 thread_id）时，系统应阻止保存并通知用户，避免数据写入错误位置。

**Why this priority**: 防止数据错误和未定义的行为。

**Independent Test**: 清除 sessionStorage 中的 thread_id 后尝试保存，观察系统反应。

**Acceptance Scenarios**:

1. **Given** 浏览器 sessionStorage 中不存在 `thread_id`。
2. **When** 用户点击“保存”按钮。
3. **Then** 系统不执行文件保存操作。
4. **Then** 界面显示错误提示，告知用户无法获取会话ID。

### Edge Cases

- **thread_id 为空字符串**: 应视为缺失处理。
- **文件写入失败**: 如果服务器端文件系统权限不足或路径不存在，应返回错误并提示用户保存失败。
- **网络错误**: 如果请求无法发送到服务器，应提示网络错误。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须在用户点击保存时从浏览器 sessionStorage 获取 `thread_id`。
- **FR-002**: 系统必须校验 `thread_id` 是否存在且非空。
- **FR-003**: 如果 `thread_id` 缺失或无效，系统必须终止保存流程并向用户报错。
- **FR-004**: 如果 `thread_id` 有效，系统必须将当前的数值配置数据写入到服务器端文件 `./workspace/${threadId}/config.json`。
- **FR-005**: 保存操作应覆盖原有的配置文件内容。

### Key Entities *(include if feature involves data)*

- **Config.json**: 存储游戏数值配置的 JSON 文件，位于 workspace 目录下对应的 thread 文件夹中。
- **Thread ID**: 会话标识符，用于定位配置文件的存储路径。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 用户点击保存后，若 thread_id 存在，服务器文件应在 2 秒内完成更新。
- **SC-002**: 若 thread_id 缺失，错误提示应在点击后立即（< 200ms）出现。
- **SC-003**: 保存后的文件内容必须严格匹配前端提交的配置数据（JSON格式）。
