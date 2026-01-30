<!--
Sync Impact Report:
- Version change: [Template] -> 1.0.0
- Modified Principles:
  - Added "I. 语言要求 (Language Requirement)" - Must use Chinese.
  - Added "II. 技术栈一致性 (Tech Stack Consistency)" - Must follow AGENTS.md.
- Templates requiring updates:
  - None (Plan template delegates to constitution).
-->
# Phantom Loom Constitution

## Core Principles

### I. 语言要求 (Language Requirement)
所有文档、代码注释、提交信息（Commit Messages）及日常沟通必须使用中文（简体）。这是一个强制性要求。
(All documentation, code comments, commit messages, and communication must be in Simplified Chinese. This is a mandatory requirement.)

### II. 技术栈一致性 (Tech Stack Consistency)
遵循 `AGENTS.md` 中定义的活跃技术栈。
- **Core**: Node.js (v22), pnpm
- **Frontend**: React 19, TypeScript 5.x, Tailwind CSS v4
- **Backend/API**: Next.js App Router
未经明确修订，不得引入新的编程语言或主要框架。

## Governance

本宪法由项目维护者制定，适用于所有贡献者。

### 修改流程 (Amendment Process)
任何原则的修改需提交 Pull Request 并获得项目负责人批准。

### 版本策略 (Versioning)
遵循语义化版本控制 (Semantic Versioning):
- **Major**: 核心原则变更。
- **Minor**: 新增原则或重大澄清。
- **Patch**: 措辞修正。

**Version**: 1.0.0 | **Ratified**: 2026-01-25 | **Last Amended**: 2026-01-25
