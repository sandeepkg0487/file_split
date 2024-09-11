import { useState } from 'react'
import FileSplit from './FileSplit'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
const [dummyData, setdummyData] = useState([])
const [block, setBolock] = useState(false)

const handleClick =  (e) => { 
  setdummyData([4,5,6,7,8,9,10,11,12,13])
 }

 const handleClick2=() => { 
  setBolock(!block)

  }
  return (
    <>
      <div className='d-flex p-4  vh-100 w-100' >
        <div style={{ width: "20%", height: "100%" }} className='bg-light  h-100 ' >
          <h5 >total Page</h5  > <h5  id='totalpage'> 100</h5 >
          <h5 >remved Page</h5  > <h5  id='removed'> 0</h5 >
          <h5 >Dom Active page </h5  > <h5  id='dom'> 0</h5 >
          <h5 > start </h5  > <h5  id='start'> 0</h5 >
          <h5 > end </h5  > <h5  id='end'> 0</h5 >
          <h5 > top </h5  > <h5  id='top'> 0</h5 >
        <button onClick={handleClick}>clickme</button>
        <button onClick={handleClick2}>{block.toString()}</button>


        </div>
        <div style={{ width: "80%", }} className='p-2 '>
          <FileSplit dummyData={dummyData} block={block} />
        </div>

      </div>
    </>
  )
}

export default App
