import { FC, useEffect } from 'react'
import { DrawEditor } from '@/src/components/DrawEditor'
import { CodeEditor } from '@/src/components/CodeEditor'

import game from './assets/routing_game-pruned.json'

import styles from './App.module.scss'
import { useStore } from '@/src/store'

export const App: FC = () => {
  const drawValue = useStore(state => state.draw.value)
  
  useEffect(() => {
    console.log(drawValue)
  }, [drawValue])
  
  return <div className={styles['app']}>
    <div className={styles['app__item']}>
      <CodeEditor />
    </div>
    <div className={styles['app__item']}>
      <DrawEditor game={game} />
    </div>
  </div>
}
