import { convertToExcalidrawElements, Excalidraw, THEME } from '@excalidraw/excalidraw'
import { FC, useCallback, useEffect, useState } from 'react'
import { checkmateTreeToExcalidrawSkeleton, fixExcalidrawElements } from '@/src/lib/checkmate'
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'

import styles from './DrawEditor.module.scss'
import { useStore } from '@/src/store'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'

type DrawEditorProps = {
  game: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tree: any
  }
}

export const DrawEditor: FC<DrawEditorProps> = ({ game }) => {
  const value = useStore(state => state.draw.value)
  const setValue = useStore(state => state.draw.setValue)
    
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  const handleChange = useCallback((elements: readonly ExcalidrawElement[]) => {
    if (value.elements !== elements) {
      setValue({elements})
    }
  }, [setValue, value])
  
  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }

    ; (async () => {
      const { skeleton, nodes } = await checkmateTreeToExcalidrawSkeleton(game.tree)
      const excalidrawElements = convertToExcalidrawElements(skeleton, { regenerateIds: false })
      const fixed = fixExcalidrawElements(excalidrawElements, nodes)
      excalidrawAPI.updateScene({ elements: fixed })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI])

  return (
    <div className={styles['draw-editor']}>
      <Excalidraw onChange={handleChange} excalidrawAPI={api => setExcalidrawAPI(api)} theme={THEME.DARK}></Excalidraw>
    </div>
  )
}
