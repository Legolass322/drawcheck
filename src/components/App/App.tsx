import { convertToExcalidrawElements, Excalidraw, THEME } from '@excalidraw/excalidraw'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import game from './assets/simple.json'
import { checkmateTreeToExcalidrawSkeleton, ROW_HEIGHT } from '@/src/lib/checkmate'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'

export const App: FC = () => {
  const exApi = useRef<ExcalidrawImperativeAPI | null>(null)
  const [data, setData] = useState<{elements: ExcalidrawElement[]} | null>(null)

  useEffect(() => {
    (async () => {
      const {skeleton, nodes} = await checkmateTreeToExcalidrawSkeleton(game.tree)
      const excalidrawElements = convertToExcalidrawElements(skeleton, {regenerateIds: false})
      const fixed = excalidrawElements.map(element => {
        if (element.type === 'text' && nodes[element.id]) {
          return {
            ...element,
            y: (nodes[element.id].y ?? 0) - ROW_HEIGHT
          }
        }
        if (element.type === 'arrow') {
          return {
            ...element,
            // startBinding: {
            //   ...element.startBinding,
            //   gap: 1
            // },
            endBinding: element.endBinding ? {
              ...element.endBinding,
              gap: 1,
              focus: -0.5
            } : null
          }
        }
        return element
      })
      setData({elements: fixed})
    })()
  }, [])

  const handleChange = useCallback((elements: unknown) => {
    console.log(elements)
  }, [])
  
  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        {data 
          ? <Excalidraw excalidrawAPI={api => {exApi.current = api}} initialData={data} theme={THEME.DARK} onChange={handleChange}></Excalidraw>
          : null
        }
      </div>
    </>
  )
}
