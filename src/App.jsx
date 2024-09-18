import { useState } from 'react'
import FileSplit from './FileSplit'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
const canvasId = 'canvasId_'
const pdfPageNumber = "secondPdf_"
const grandParentDataAtribute = "data-page-number_"

function App() {
  const [dummyData, setdummyData] = useState([])
  const [block, setBolock] = useState(false)
  const [editPage, setEditPage] = useState([])

  const [selected, setSelected] = useState([])

  ///////////////////////////////////

  const [pageDetails, setPageDetails] = useState([]);
  const [scale, setScale] = useState(0.1);
  const [newPageDetails, setNewPageDetails] = useState([])
  const [thumbnail, setThumbnail] = useState([])

  //////////////////////////////////////////////
  const handleClick = (e) => {
    setdummyData([])
  }
  const handleClick1 = (e) => {
    setEditPage([1, 2, 3, 4, 5])
  }
  const handleSplit = () => {
    const indices = selected.map((value, index) => value ? index + 1 : -1) // Map true values to their indices, false values to -1
      .filter(index => index !== -1);
    console.log(indices)
    setdummyData(indices)
  }
  //////////////////////////// create canvas //////////////////////////////////

  const createCanvas = (pageNum, rotation = 0, scaleFactor, pageDetails) => {

    let viewport;
    let page = pageDetails.page
    if (!page) {
      return
    }

    viewport = page.getViewport({
      scale: scaleFactor,
      rotation
    });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.id = canvasId + pageNum;

    const context = canvas.getContext("2d");
    const renderContext = {
      canvasContext: context,
      viewport
    };

    return page.render(renderContext).promise.then(() => {
      return { success: true, pageNumber: page._pageIndex + 1, element: canvas,rotation };
    });

  };
  /////////////////////////////////////////////////////////

  /////////////////////////////////        ROTATE     /////////////////////////////////
  const handleRotate = async (rotate) => {

    const DomActiveElement = Array.from(document.getElementById("container2").childNodes)
    const domactiveElemNum = DomActiveElement.map(item => Number(item.id.split('_')[1]) - 1)
    const indices = selected.map((value, index) => value ? index : -1) // Map true values to their indices, false values to -1
      .filter(index => index !== -1);
    const commonElements = indices.filter(value => domactiveElemNum.includes(value))


    const pageDetailsTemp = pageDetails

    const pagePromises = [];
    commonElements.map(item => {
      console.log(newPageDetails[item].rotate);

      const newRotation = ((newPageDetails[item].rotate + rotate * 90) % 360);
      pageDetailsTemp[item].rotate = newRotation
      pagePromises.push(createCanvas(newPageDetails[item]._pageIndex, newRotation, scale, newPageDetails[item]));
    })
    const rotatedCanvas = await Promise.all(pagePromises)

    rotatedCanvas.map(item => {
      const div = document.getElementById(`${pdfPageNumber + item.pageNumber}`)
      const canvas = div.querySelector('canvas')
      if (canvas) {
        div.removeChild(canvas);
      }
      div.appendChild(item.element)
    })

    setNewPageDetails(pageDetailsTemp)
    setPageDetails(pageDetailsTemp)

  }
  ///////////////////////////////////////////////////////////////////////////////////////



  const handleClick2 = () => {
    setBolock(!block)

  }
  return (
    <>
      <div className='d-flex p-4  vh-100 w-100' >
        <div style={{ width: "20%", height: "100%" }} className='bg-light  h-100 ' >
          <h5 >total Page</h5  > <h5 id='totalpage'> 100</h5 >
          <h5 >remved Page</h5  > <h5 id='removed'> 0</h5 >
          <h5 >Dom Active page </h5  > <h5 id='dom'> 0</h5 >
          <h5 > start </h5  > <h5 id='start'> 0</h5 >
          <h5 > end </h5  > <h5 id='end'> 0</h5 >
          <h5 > top </h5  > <h5 id='top'> 0</h5 >
          <button onClick={handleClick}>clickme</button>
          <button onClick={handleClick1}>clickme1</button>
          <button onClick={handleClick2}>{block.toString()}</button>
          <button onClick={handleSplit}> Split </button>
          <button onClick={() => handleRotate(1)}> rotate clock  </button>
          <button onClick={() => handleRotate(-1)}> rotate -1 </button>
{console.log(thumbnail)}
          {thumbnail.map((src, index) => (
            <img
              key={index}
              src={src.image}
              alt={`Thumbnail ${index}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }} // Adjust as needed
            />
          ))}


        </div>
        <div style={{ width: "80%", }} className='p-2 '>
          <FileSplit
            dummyData={dummyData}
            editPage={editPage}
            setdummyData={setdummyData}
            setSelected={setSelected}
            selected={selected}
            pageDetails={pageDetails}
            setPageDetails={setPageDetails}
            scale={scale}
            setScale={setScale}
            newPageDetails={newPageDetails}
            setNewPageDetails={setNewPageDetails}
            createCanvas={createCanvas}
            setThumbnail={setThumbnail}
            thumbnail={thumbnail}
          />
        </div>

      </div>
    </>
  )
}

export default App  