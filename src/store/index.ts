import { create } from "zustand"
import { RootState } from "./store"
import { createTestSlice } from "./test"
import { createEditorSlice } from "./editor"

export const useStore = create<RootState>((...rest) => ({
    ...createTestSlice(...rest),
    ...createEditorSlice(...rest),
}))
