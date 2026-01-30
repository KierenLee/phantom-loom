# 扩展 JSON Render 组件库支持表单功能

为了支持表单渲染、校验和提交，我将按照以下步骤扩展现有的组件库：

## 1. 扩展组件注册表 (`lib/catalog.ts`)
更新组件定义，标准化属性名称，并添加缺失的表单组件。

### 通用变更
- **标准化数据绑定**: 将所有表单组件的数据绑定属性统一为 `valuePath` (修复 `Select`/`DatePicker` 中 `bindPath` 的不一致)。
- **添加校验配置**: 为所有输入组件添加 `validation` 属性支持：
  - `checks`: 校验规则数组 (如 `[{ fn: "required", message: "Required" }]`)。
  - `validateOn`: 校验时机 (`change` | `blur` | `submit`)。

### 新增/更新组件定义
1.  **Form**: 新增容器组件，支持 `onSubmit` (Action名称) 和布局配置。
2.  **TextField**: 添加到 Catalog (当前缺失)，支持 `type` (text/password/email/number)。
3.  **TextArea**: 新增多行文本输入，支持 `rows`。
4.  **Checkbox**: 新增复选框，支持 `label`。
5.  **RadioGroup**: 新增单选框组，支持 `options`。
6.  **Switch**: 新增开关组件。
7.  **Select / DatePicker**: 更新以支持校验属性。

## 2. 实现/更新 UI 组件 (`components/json-render/ui/`)
按照 `TextField` 的实现模式，使用 `useData` 和 `useFieldValidation` 实现以下组件：

### 新增组件
- **`form.tsx`**: 表单容器，处理提交逻辑。
- **`text-area.tsx`**: 多行文本输入。
- **`checkbox.tsx`**: 复选框。
- **`radio-group.tsx`**: 单选组。
- **`switch.tsx`**: 开关。

### 更新现有组件
- **`select.tsx`**:
  - 属性重命名: `bindPath` -> `valuePath`。
  - 集成 `useFieldValidation` 显示错误信息。
- **`date-picker.tsx`**:
  - 属性重命名: `bindPath` -> `valuePath`。
  - 集成 `useFieldValidation`。

## 3. 导出新组件
更新 `components/json-render/ui/index.ts` 导出所有新增组件。

## 验证计划
- 确认所有组件均可通过 `valuePath` 正确读写全局数据。
- 确认校验规则 (`required` 等) 能正确触发并在 UI 上显示错误。
- 确认 `Form` 提交时能触发配置的 Action。
