import React from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import {useSyncDemo} from '@tldraw/sync'
import { useParams } from 'react-router'

const RealTimeComp = () => {
  let {roomId} = useParams()
    const store = useSyncDemo({roomId: roomId})
  return (
    <div style={{ position: 'fixed', inset: 0}}>
          <Tldraw store={store} /> 
       </div>
  )
}

export default RealTimeComp
