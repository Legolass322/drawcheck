import { EditorSlice } from "./editor"
import { TestSlice } from "./test"

export type RootState = 
    & TestSlice
    & EditorSlice
