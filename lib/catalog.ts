import { createCatalog } from "@json-render/core";
import { z } from "zod";

const validationProps = {
  checks: z
    .array(
      z.object({
        fn: z.string(),
        message: z.string(),
      }),
    )
    .nullable(),
  validateOn: z.enum(["change", "blur", "submit"]).nullable(),
};

/** 游戏数值可视化组件目录 */
export const gameNumericalCatalog = createCatalog({
  name: "gameNumericalDesign",
  components: {
    // Layout Components
    Card: {
      props: z.object({
        title: z.string().nullable(),
        description: z.string().nullable(),
        padding: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      hasChildren: true,
      description: "带可选标题的卡片容器",
    },

    Grid: {
      props: z.object({
        columns: z.number().min(1).max(4).nullable(),
        gap: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      hasChildren: true,
      description: "可配置列数的网格布局",
    },

    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).nullable(),
        gap: z.enum(["sm", "md", "lg"]).nullable(),
        align: z.enum(["start", "center", "end", "stretch"]).nullable(),
      }),
      hasChildren: true,
      description: "用于水平或垂直布局的弹性堆叠",
    },

    // Form Components
    Form: {
      props: z.object({
        onSubmit: z.string().nullable(),
        layout: z.enum(["vertical", "horizontal"]).nullable(),
      }),
      hasChildren: true,
      description: "处理提交的表单容器",
    },

    TextField: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        placeholder: z.string().nullable(),
        type: z.enum(["text", "password", "email"]).nullable(),
        ...validationProps,
      }),
      description: "单行文本输入",
    },

    TextArea: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        placeholder: z.string().nullable(),
        rows: z.number().nullable(),
        ...validationProps,
      }),
      description: "多行文本输入",
    },

    Checkbox: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        ...validationProps,
      }),
      description: "复选框输入",
    },

    RadioGroup: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        options: z.array(
          z.object({
            value: z.string(),
            label: z.string(),
          }),
        ),
        ...validationProps,
      }),
      description: "单选按钮组",
    },

    Switch: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        ...validationProps,
      }),
      description: "切换开关输入",
    },

    Slider: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        min: z.number().nullable(),
        max: z.number().nullable(),
        step: z.number().nullable(),
        ...validationProps,
      }),
      description: "范围滑块输入",
    },

    Select: {
      props: z.object({
        label: z.string().nullable(),
        valuePath: z.string(), // Changed from bindPath to valuePath
        options: z.array(
          z.object({
            value: z.string(),
            label: z.string(),
          }),
        ),
        placeholder: z.string().nullable(),
        ...validationProps,
      }),
      description: "下拉选择输入",
    },

    DatePicker: {
      props: z.object({
        label: z.string().nullable(),
        valuePath: z.string(), // Changed from bindPath to valuePath
        placeholder: z.string().nullable(),
        ...validationProps,
      }),
      description: "日期选择器输入",
    },

    // Interactive Components
    Button: {
      props: z.object({
        label: z.string(),
        variant: z.enum(["primary", "secondary", "danger", "ghost"]).nullable(),
        size: z.enum(["sm", "md", "lg"]).nullable(),
        action: z.string(),
        disabled: z.boolean().nullable(),
      }),
      description: "带有动作的可点击按钮",
    },

    // Data Display Components
    Metric: {
      props: z.object({
        label: z.string(),
        valuePath: z.string(),
        format: z.enum(["number", "currency", "percent"]).nullable(),
        trend: z.enum(["up", "down", "neutral"]).nullable(),
        trendValue: z.string().nullable(),
      }),
      description: "显示带有可选趋势指示器的单个指标",
    },

    Chart: {
      props: z.object({
        type: z.enum(["bar", "line", "pie", "area"]),
        dataPath: z.string(),
        title: z.string().nullable(),
        height: z.number().nullable(),
      }),
      description: "从数组数据显示图表",
    },

    Table: {
      props: z.object({
        dataPath: z.string(),
        columns: z.array(
          z.object({
            key: z.string(),
            label: z.string(),
            format: z.enum(["text", "currency", "date", "badge"]).nullable(),
          }),
        ),
      }),
      description: "显示表格数据",
    },

    List: {
      props: z.object({
        dataPath: z.string(),
        emptyMessage: z.string().nullable(),
      }),
      hasChildren: true,
      description: "从数组数据渲染列表",
    },

    // Typography
    Heading: {
      props: z.object({
        text: z.string(),
        level: z.enum(["h1", "h2", "h3", "h4"]).nullable(),
      }),
      description: "章节标题",
    },

    Text: {
      props: z.object({
        content: z.string(),
        variant: z.enum(["body", "caption", "label"]).nullable(),
        color: z
          .enum(["default", "muted", "success", "warning", "danger"])
          .nullable(),
      }),
      description: "文本段落",
    },

    // Status Components
    Badge: {
      props: z.object({
        text: z.string(),
        variant: z
          .enum(["default", "success", "warning", "danger", "info"])
          .nullable(),
      }),
      description: "小状态徽章",
    },

    Alert: {
      props: z.object({
        type: z.enum(["info", "success", "warning", "error"]),
        title: z.string(),
        message: z.string().nullable(),
        dismissible: z.boolean().nullable(),
      }),
      description: "警告/通知横幅",
    },

    // Special Components
    Divider: {
      props: z.object({
        label: z.string().nullable(),
      }),
      description: "视觉分隔符",
    },

    Empty: {
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
        action: z.string().nullable(),
        actionLabel: z.string().nullable(),
      }),
      description: "空状态占位符",
    },
  },
  actions: {
    save: { description: "保存当前修改的数值" },
    reset: { description: "重置所有数值到初始状态" },
  },
  validation: "strict",
});

export const componentList = gameNumericalCatalog.componentNames as string[];
