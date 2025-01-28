import { create } from "zustand";
import { RootState } from "./store";
import { createTestSlice } from "./test";

export const useStore = create<RootState>((...rest) => ({
    ...createTestSlice(...rest),
}))
