import { useState } from 'react'
import FileSplit from './FileSplit'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <>
      <div className='d-flex p-4  vh-100 w-100'>
        <div style={{ width: "20%", height: "100%" }} className='bg-light border h-100 '>jababab</div>
        <div style={{ width: "80%", }} className='p-2 border border-info'>
          <FileSplit />
        </div>

      </div>
    </>
  )
}

export default App
