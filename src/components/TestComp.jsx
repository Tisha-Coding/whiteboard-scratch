import React from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'


const TestComp = () => {
  return (
    // This line simply means that the tldraw requires the whole viewpoint
   <div style={{ position: 'fixed', inset: 0}}>
      <Tldraw persistenceKey={"test"} /> 
   </div>
)
}

export default TestComp;
