import { createScopedImmerStore } from "@/lib/createScopedStore";

export interface UIState {
  selectedId: string | null;

  filters: {
    side: string[];
  };

  toggleSelected: (id: string) => void;
  clearSelected: () => void;
}

export const { Provider: UIProvider, useScopedStore: useUIStore } =
  createScopedImmerStore<UIState>((set) => ({
    selectedId: null,

    filters: {
      side: [],
    },

    toggleSelected: (id) =>
      set((state) => {
        state.selectedId === id ? null : id;
      }),

    clearSelected: () => set((state) => (state.selectedId = null)),
  }));
