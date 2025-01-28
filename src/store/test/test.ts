import { StateCreator } from "zustand"
import { RootState } from "../store"

export type TestSlice = {
    test: string
    setTest: (value: string) => void
}

export const createTestSlice: StateCreator<RootState, [], [], TestSlice> = (set) => ({
    test: "test",
    setTest: (value) => set({ test: value }),
})
