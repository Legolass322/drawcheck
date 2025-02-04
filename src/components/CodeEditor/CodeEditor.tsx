import { FC } from "react"

import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-json"
import "ace-builds/src-noconflict/theme-github_dark"

import styles from './CodeEditor.module.scss'
import { useStore } from "@/src/store"

export const CodeEditor: FC = () => {
  const value = useStore(state => state.code.value)
  const setValue = useStore(state => state.code.setValue)
  
  return <div className={styles['code-editor']}>
    <AceEditor
      value={value}
      onChange={setValue}
      height="100%"
      width="100%"
      mode="json"
      theme="github_dark"
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true
      }}
    />
  </div>
}
