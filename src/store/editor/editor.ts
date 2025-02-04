import { StateCreator } from "zustand"
import { RootState } from "../store"
import { SceneData } from "@excalidraw/excalidraw/types/types"

type CodeSlice = {
  /** supposed to be checkmate json representation */
  value: string

  setValue: (value: string) => void
}

type DrawSlice = {
  value: SceneData
  setValue: (value: SceneData) => void
}

export type EditorSlice = {
  code: CodeSlice
  draw: DrawSlice
}

export const createEditorSlice: StateCreator<RootState, [], [], EditorSlice> = (set) => ({
  code: {
    value: '',
    setValue: (value) => set((state) => ({ code: {...state.code, value} }))
  },
  draw: {
    value: {},
    setValue: (value) => set((state) => ({ draw: {...state.draw, value} }))
  }
})
