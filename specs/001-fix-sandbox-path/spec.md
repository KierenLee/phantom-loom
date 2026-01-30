# Feature Specification: Fix Sandbox File Path Generation

**Feature Branch**: `001-fix-sandbox-path`  
**Created**: 2026-01-23  
**Status**: Draft  
**Input**: User description: "lib/tools/local-sandbox.ts 或 app/api/chat/route.ts 的逻辑中有问题，导致生成文件的路径变成了 workspace/7hwt9q/workspace/art.md ，预期内是 workspace/7hwt9q/art.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate File in Sandbox (Priority: P1)

Users (or the AI system acting on their behalf) need to generate files within a specific sandbox environment so that the files are accessible and correctly located for execution or viewing.

**Why this priority**: P1 - This is a bug fix. The current behavior creates files in nested `workspace` directories, which breaks file resolution and user expectations.

**Independent Test**: Can be fully tested by triggering a file generation request and verifying the file's existence on the filesystem.

**Acceptance Scenarios**:

1. **Given** a sandbox session with ID `7hwt9q`, **When** the system generates a file named `art.md`, **Then** the file exists at `workspace/7hwt9q/art.md`.
2. **Given** a sandbox session with ID `7hwt9q`, **When** the system generates a file named `art.md`, **Then** the file DOES NOT exist at `workspace/7hwt9q/workspace/art.md`.

---

### User Story 2 - Generate File in Subdirectory (Priority: P2)

Users need to generate files within subdirectories of the sandbox.

**Why this priority**: P2 - Ensures the fix handles nested paths correctly and doesn't just strip all path info.

**Independent Test**: Generate a file in a subdirectory and verify path.

**Acceptance Scenarios**:

1. **Given** a sandbox session `7hwt9q`, **When** the system generates a file `docs/guide.md`, **Then** the file exists at `workspace/7hwt9q/docs/guide.md`.
2. **Given** a sandbox session `7hwt9q`, **When** the system generates a file `docs/guide.md`, **Then** the path does NOT contain double `workspace` (e.g. `workspace/7hwt9q/workspace/docs/guide.md`).

## Edge Cases

- What happens when the filename itself contains `workspace`? (e.g., `workspace_notes.md`) -> Should be preserved.
- What happens if the input path is absolute vs relative? -> System should handle both or sanitize to relative.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST construct the destination file path by combining the sandbox root and the target filename.
- **FR-002**: System MUST detect and remove redundant `workspace/` path segments if they are erroneously appended during path construction.
- **FR-003**: System MUST NOT modify parts of the path that legitimately contain the string "workspace" (e.g. filenames like `my_workspace.txt`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of newly generated sandbox files are found at `workspace/{sandbox_id}/{filename}`.
- **SC-002**: 0% of newly generated sandbox files are found at `workspace/{sandbox_id}/workspace/{filename}`.
