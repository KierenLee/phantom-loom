# 修改 Prompt 以支持游戏生成 Agent

我将更新 `app/api/generate/route.ts` 中的 System Prompt 和数据上下文处理逻辑，使其转型为“游戏生成 Agent”，并支持新的表单组件。

## 1. 更新 System Prompt

* **角色定义**: 将角色从 "dashboard widget generator" 修改为 "Game Generation Agent"。

* **组件列表**: 在 `COMPONENT DETAILS` 中补充新增加的表单组件 (`Form`, `TextField`, `TextArea`, `Checkbox`, `RadioGroup`, `Switch`, `Select`, `DatePicker`) 及其属性定义。

* **校验规则**: 添加关于 `checks` (校验规则) 的说明。

* **示例更新**: 将示例从“Revenue Dashboard”更改为“Character Creation” (角色创建) 表单，展示如何使用 `Form`, `TextField`, `Select` 以及数据绑定。

## 2. 增强上下文处理

* 在 `POST` 函数中，除了现有的 `context.data`，增加对 `context.schema` 的支持。如果请求中包含 Schema，将其作为 "GAME CONFIGURATION SCHEMA" 添加到 Prompt 中，以便 Agent 理解数据结构并生成对应的表单。

## 3. 验证

* 检查生成的 Prompt 是否包含所有新组件的正确定义。

* 确保 `context` 数据能被正确拼接到 Prompt 中。

