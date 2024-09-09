import { useState } from 'react'
import FileSplit from './FileSplit'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <>
      <div className='d-flex p-4  vh-100 w-100' >
        <div style={{ width: "20%", height: "100%" }} className='bg-light  h-100 ' >
          <h1 id='speed'>100</h1>
        </div>
        <div style={{ width: "80%", }} className='p-2 '>
          <FileSplit />
        </div>

      </div>
    </>
  )
}

export default App
