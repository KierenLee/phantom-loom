# Feature Specification: 游戏数值修改 (Game Value Tuning)

**Feature Branch**: `004-game-value-tuning`
**Created**: 2026-01-25
**Status**: Draft
**Input**: User description: "将 app/api/json_render 下的prompt改为中文。prompt/json-render.ts 下的prompt改为中文，实现一个用于游戏数值修改的prompt，其中数字相关的改动仅使用slider，不要用TextField。更新 lib/catalog.ts 中的组件目录逻辑，将描述改为中文，将actions 改为“游戏数值修改”过程中所需的actions，并在 app/debug/json_render/page.tsx 中的handlers 实现对应的逻辑"

## User Scenarios & Testing

### User Story 1 - 中文环境下的数值调整 (Priority: P1)

作为游戏策划，我希望通过中文指令生成数值调整界面，并且所有数字调整都通过滑块（Slider）完成，以便直观地调整游戏参数。

**Why this priority**: 核心需求，满足本地化和交互规范。

**Independent Test**:
1. 输入中文 Prompt（如“调整基础攻击力”）。
2. 生成的界面中，数字字段显示为 Slider 组件。
3. 生成的界面中，没有用于数字的 TextField 组件。
4. 系统提示词和组件描述均为中文。

**Acceptance Scenarios**:
1. **Given** 包含数字字段的 JSON 数据, **When** 输入“生成修改界面”, **Then** 返回包含 Slider 的 UI JSON，且不包含 TextField 用于数字。

### User Story 2 - 数值修改操作 (Priority: P1)

作为游戏策划，我希望界面包含适用于数值修改的操作按钮（如“保存”、“重置”），以便应用更改。

**Why this priority**: 闭环数值修改流程。

**Independent Test**:
1. 检查生成的界面底部或顶部是否有“保存”、“重置”等 Action。
2. 点击这些 Action 能触发预定义的 Handler（在 Debug 页打日志或提示）。

**Acceptance Scenarios**:
1. **Given** 生成的界面, **When** 点击“保存”, **Then** Debug 页面捕获并处理该事件。

## Requirements

### Functional Requirements

- **FR-001**: `app/api/json_render` 和 `prompt/json-render.ts` 中的 Prompt 必须完全中文化。
- **FR-002**: Prompt 必须包含强制规则：数字类型的字段修改必须使用 Slider 组件，禁止使用 TextField。
- **FR-003**: `lib/catalog.ts` 中的组件描述（description）必须更新为中文。
- **FR-004**: `lib/catalog.ts` 中的 `actions` 定义必须更新为游戏数值修改场景专用（如 Save, Reset）。
- **FR-005**: `app/debug/json_render/page.tsx` 必须实现上述 Actions 的前端处理逻辑。

### Key Entities

- **Catalog**: 组件库定义，包含 schema 和 metadata。
- **Prompt**: 指导 LLM 生成 UI 的系统指令。

## Success Criteria

### Measurable Outcomes

- **SC-001**: 生成的 UI 中，100% 的数字修改字段使用 Slider。
- **SC-002**: 所有组件描述均为中文。
- **SC-003**: 调试页面能正确响应“保存”操作。
