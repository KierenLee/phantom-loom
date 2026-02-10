import { create } from "zustand";

export interface SandboxData {
  url: string;
  sessionId: string;
  configUrl: string;
}

interface PreviewState {
  previewUrl: string | null;
  title: string | null;
  isOpen: boolean;
  sandboxData?: SandboxData;

  setPreview: (url: string, title: string) => void;
  closePreview: () => void;
  togglePreview: () => void;
  setSandboxData: (data: SandboxData) => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  previewUrl: null,
  title: null,
  isOpen: false,
  setPreview: (url, title) => set({ previewUrl: url, title, isOpen: true }),
  closePreview: () => set({ isOpen: false }),
  togglePreview: () => set((state) => ({ isOpen: !state.isOpen })),
  setSandboxData: (data) => set({ sandboxData: data }),
}));

export interface GameNumericalSettingArgs {
  title: string;
  initialData: string; // JSON string
  dataSchema: string; // JSON string
  sandboxData?: SandboxData;
}

interface GameSettingsState {
  // Data received from the LLM Tool
  settingArgs: GameNumericalSettingArgs | null;

  // Visibility state
  isOpen: boolean;

  // Actions
  setSettings: (args: GameNumericalSettingArgs) => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
}

export const useGameSettingsStore = create<GameSettingsState>((set) => ({
  settingArgs: null,
  isOpen: false,
  setSettings: (args) => set({ settingArgs: args, isOpen: true }), // Auto open when settings are set
  openSettings: () => set({ isOpen: true }),
  closeSettings: () => set({ isOpen: false }),
  toggleSettings: () => set((state) => ({ isOpen: !state.isOpen })),
}));
