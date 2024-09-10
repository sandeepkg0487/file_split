import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
import fileUrl from './assets/sample12.pdf'

// pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();


const pdfPageNumber = "secondPdf_"
const grandParentDataAtribute = "data-page-number_"
const canvasId = 'canvasId_'

// const fileUrl = "https://api59.ilovepdf.com/v1/download/k0Ag6vj5t3bx484cnybd0kdAb5f7jd30d6bzq05vkn4s093tk6vtm7pv67wflkt7hdttj0wk0A8rrj12rsy1sgw9xp2bfw784b40c27rjtz1dlApj42lr67sn267gry1yf0hAsxkkyjnpt89sqjcdwcsh3jn7wcphckz3c3rpnglbsrtn4A1";

const FileSplit = () => {
        const [pagesPerScreen, setPagesperScreen] = useState(10)
        const [pdf, setPdf] = useState(null);
        const [numPages, setNumPages] = useState(null);
        const [pageDetails, setPageDetails] = useState([]);
        const [scale, setScale] = useState(0.1);
        const [largePage, setLargePage] = useState({});
        const [checkBox, setCheckbox] = useState([])
        const [pagesData, setPagesData] = useState([])
        const [requiredWidth, setRequiredWidth] = useState(0)
        const [removedRow, setRemovedRow] = useState(0)
        const [removedRowprev, setremovedRowprev] = useState(0)

        const [selected, setselected] = useState([])
        const [lastChecked, setLastChecked] = useState(null)


        const containerRefSecond = useRef(null);



        const createCanvas = (pageNum, rotation = 0, scaleFactor, pdfsample = pdf) => {
                console.log(pageNum, "****")
                return pdfsample.getPage(parseInt(pageNum)).then(page => {
                        let viewport;

                        if (rotation === 90 || rotation === 270) {
                                const originalWidth = pageDetails[pageNum].width * scale;
                                const originalHeight = pageDetails[pageNum].height * scale;
                                const newScale = (originalWidth / originalHeight) * zoom;
                                viewport = page.getViewport({
                                        scale: scaleFactor,
                                        rotation
                                });
                        } else {
                                viewport = page.getViewport({
                                        scale: scaleFactor,
                                        // rotation
                                });
                        }

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
                                return { success: true, pageNumber: pageNum, element: canvas };
                        });
                }).catch(error => {
                        console.error('Error getting page:', pageNum, error);
                        return { success: false, pageNumber: pageNum, error };
                });
        };

        const renderPage = (STATUS, pagesData, requiredWidth, i) => {


                console.log(STATUS, pagesData, requiredWidth, i)
                if (STATUS == "ZOOM") {
                        pagesData.map(({ pageNumber, element: canvas }) => {
                                const parentofCanvas = document.getElementById(grandParentDataAtribute + pageNumber)
                                parentofCanvas?.appendChild(canvas);
                                document.getElementById(grandParentDataAtribute + pageNumber).style.height = `${requiredWidth}px`
                        })

                } else if (STATUS == 'INIT') {
                        if (pagesData.length > 0)
                                pagesData.map(({ pageNumber, element: canvas }) => {

                                        const pageContainer = document.createElement("div");
                                        pageContainer.style.position = "relative";
                                        pageContainer.style.display = "flex";
                                        pageContainer.style.justifyContent = "center";
                                        pageContainer.id = pdfPageNumber + pageNumber;

                                        const h1 = document.createElement('h1')
                                        h1.innerHTML = pageNumber
                                        h1.style.position = 'absolute'
                                        pageContainer.appendChild(h1)

                                        const checkbox = document.createElement('input');
                                        checkbox.type = 'checkbox';
                                        checkbox.id = 'myCheckbox_' + (Number(pageNumber) - 1);
                                        checkbox.name = 'myCheckbox';
                                        checkbox.style.position = 'absolute';
                                        checkbox.style.left = '0';
                                        checkbox.style.bottom = '0';


                                        pageContainer.appendChild(canvas);
                                        pageContainer.appendChild(checkbox)

                                        const grandParent = document.createElement("div");
                                        grandParent.style.display = `flex`;
                                        grandParent.style.justifyContent = "center";
                                        grandParent.style.alignItems = "center";

                                        grandParent.style.height = `${requiredWidth}px`;
                                        grandParent.id = grandParentDataAtribute + pageNumber;
                                        pageContainer.id = pdfPageNumber + pageNumber;

                                        grandParent.setAttribute(grandParentDataAtribute, pageNumber);
                                        grandParent.appendChild(pageContainer);
                                        document.getElementById('container2').appendChild(grandParent)
                                })


                }
                else if (STATUS === "ABCD") {
                        const pageContainer = document.createElement("div");
                        pageContainer.style.position = "relative";
                        pageContainer.style.display = "flex";
                        pageContainer.style.justifyContent = "center";
                        pageContainer.id = pdfPageNumber + pagesData[i].pageNumber;

                        const h1 = document.createElement('h1')
                        h1.innerHTML = pagesData[i].pageNumber
                        h1.style.position = 'absolute'
                        pageContainer.appendChild(h1)

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = 'myCheckbox_' + Number(pagesData[i].pageNumber - 1);
                        checkbox.name = 'myCheckbox';
                        checkbox.style.position = 'absolute';
                        checkbox.style.left = '0';
                        checkbox.style.bottom = '0';


                        pageContainer.appendChild(pagesData[i].element); //canvas
                        pageContainer.appendChild(checkbox)

                        const grandParent = document.createElement("div");
                        grandParent.style.display = `flex`;
                        grandParent.style.justifyContent = "center";
                        grandParent.style.alignItems = "center";

                        grandParent.style.height = `${requiredWidth}px`;
                        grandParent.id = grandParentDataAtribute + pagesData[i].pageNumber;
                        pageContainer.id = pdfPageNumber + pagesData[i].pageNumber;

                        grandParent.setAttribute(grandParentDataAtribute, pagesData[i].pageNumber);
                        grandParent.appendChild(pageContainer);
                        return grandParent

                }




        };
        const createAllCanvases = async (startPage, endPage, scaleFactor) => {
                const pagePromises = [];
                for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                        pagePromises.push(createCanvas(pageNum, null, scaleFactor));
                }
                return Promise.all(pagePromises);
        };
        const createAllCanvasesFORme = async (array, scaleFactor) => {
                const pagePromises = [];
                array.map(item => {
                        pagePromises.push(createCanvas(item, null, scaleFactor));
                })
                return Promise.all(pagePromises);
        };
        const handleCheckboxClick = (event) => {
                setCheckbox()



        };

        const calulateScaleAndSet = async (result, NUM_COLUMN, FROM = 'init', pdf) => {

                const newBigWidthOrHeight = result.width > result.height ? result.width : result.height
                const containerWidth = (((window.innerWidth - 48) / 100) * 80) - 16
                let scaleFactor = 0

                let requiredWidth = Number((containerWidth - (10 * (NUM_COLUMN - 1)) - 24) / NUM_COLUMN);
                setRequiredWidth(requiredWidth)
                scaleFactor = requiredWidth / newBigWidthOrHeight;
                setScale(scaleFactor)
                if (FROM == 'HandleWheel') {
                        // remove all pages from dom and replace the page 

                        removeCanvasesById('container2').then(async (page) => {

                                let data = await createAllCanvases(1, pagesPerScreen * NUM_COLUMN, scaleFactor)
                                setPagesData(data)
                                renderPage("ZOOM", data, requiredWidth)
                        })



                }

                return { scaleFactor, requiredWidth }
        }

        useEffect(() => {
                const loadDocument = async () => {
                        try {

                                const loadingTask = pdfjs.getDocument(fileUrl);
                                const loadedPdf = await loadingTask.promise;
                                setPdf(loadedPdf);
                                setNumPages(loadedPdf.numPages);

                        } catch (error) {
                                console.error("error on loading URl:", error)
                        }
                };


                loadDocument();
        }, []);


        useEffect(() => {


                const renderStart = async () => {
                        if (!pdf) {
                                console.warn("pdf is not there 2", pdf)
                                return;
                        }

                        let result = {
                                pageNum_width: null,
                                pageNum_Height: null,
                                height: 0,
                                width: 0,
                        };


                        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                                let page = null
                                try {
                                        page = await pdf.getPage(pageNum);
                                } catch (error) {
                                        console.error('@@@ test Error page 2:', pageNum, error)
                                }
                                if (page) {


                                        let pageDetails = {
                                                width: page?._pageInfo.view[2],
                                                height: page?._pageInfo.view[3],
                                                rotate: page?._pageInfo.rotate
                                        };


                                        if (pageDetails.width > result.width) {
                                                result = {
                                                        ...result,
                                                        pageNum_width: pageNum,
                                                        width: pageDetails.width
                                                };
                                        }
                                        if (pageDetails.height > result.height) {
                                                result = {
                                                        ...result,
                                                        pageNum_Height: pageNum,
                                                        height: pageDetails.height
                                                };
                                        }


                                        setPageDetails((prev) => {
                                                const updatedRotations = [...prev];
                                                updatedRotations[pageNum] = {
                                                        ...updatedRotations[pageNum],
                                                        ...pageDetails,
                                                };
                                                return updatedRotations;
                                        });
                                }
                        }
                        console.log(result)
                        setLargePage(result);

                        const { scaleFactor, requiredWidth } = await calulateScaleAndSet(result, 8, "init")
                        try {

                                const startPage = 1;
                                const endPage = Math.min(pagesPerScreen * 8, numPages);

                                const data = await createAllCanvases(startPage, endPage, scaleFactor);
                                renderPage("INIT", data, requiredWidth)
                                setPagesData(data)

                        } catch (error) {
                                console.error('Error rendering pages:', error);
                        }
                };

                renderStart();
        }, [pdf, numPages]);

        const [scroll, setScroll] = useState(1);

        const handleWheel = (e) => {


                if (e.ctrlKey) {
                        e.preventDefault()
                        const zoomFactor = 0.1;
                        let newScale = scroll + (e.deltaY > 0 ? -zoomFactor : zoomFactor);



                        const minScale = 1;
                        const maxScale = 1.8;
                        if (newScale > maxScale) {
                                newScale = maxScale
                                setScroll(maxScale)
                                return
                        }

                        if (newScale >= minScale && newScale <= maxScale) { // newScale = 1.1 start 1.2 1.3 ...
                                setScroll(newScale);
                                const numberOfColumns = getNumberOfColumns(newScale);
                                setNumberOfColumns(numberOfColumns)
                                if (newScale < 1.9 && newScale > 0.9) {
                                        calulateScaleAndSet(largePage, numberOfColumns, "HandleWheel", pdf)

                                } else {
                                }
                        }

                }
        };

        function removeCanvasesById(containerId) {
                return new Promise((res, rej) => {
                        var container = document.getElementById(containerId);
                        if (container) {
                                var canvases = container.getElementsByTagName('canvas');
                                Array.from(canvases).forEach(function (canvas) {
                                        canvas.remove();
                                        res("success")
                                });
                        } else {
                                console.warn('Container with ID "' + containerId + '" not found.');
                        }
                })
        }


        function removeDivById(grandParentDataAtribute) {
                return new Promise((res, rej) => {
                        var container = document.getElementById(grandParentDataAtribute);
                        if (container) {
                                container.remove();
                        } else {
                                console.warn('Container with ID "' + grandParentDataAtribute + '" not found.');
                        }
                })

        }

        useEffect(() => {
                window.addEventListener('wheel', handleWheel, { passive: false });

                containerRefSecond.current.addEventListener('click', handleCheckboxClick);
                return () => {
                        window.removeEventListener('wheel', handleWheel);
                        if (containerRefSecond.current)
                                containerRefSecond.current.addEventListener('click', handleCheckboxClick);
                };
        }, [scroll, pdf, largePage])

        const [numberOfColumns, setNumberOfColumns] = useState(8)
        useEffect(() => {
                setNumberOfColumns(getNumberOfColumns(1))
        }, [])

        function getNumberOfColumns(value) {

                if (value <= 1.1) {
                        return 8;
                }
                else if (value <= 1.2) {
                        return 7;
                } else if (value <= 1.3) {
                        return 6;
                } else if (value <= 1.4) {
                        return 5;
                } else if (value <= 1.5) {
                        return 4;
                } else if (value <= 1.6) {
                        return 3;
                } else if (value <= 1.7) {
                        return 2;
                } else {
                        return 1;
                }
        }

        const timeoutRef = useRef(null);
        const [count, setCount] = useState(0)

        const handleScroll = (e) => {
                e.preventDefault();

                const scrollPosition = e.target.scrollTop;
                console.log(scrollPosition, "scrollPosition ");

                setremovedRowprev((prev) => {
                        const newRemovedRow = Number((scrollPosition / requiredWidth).toString().split(".")[0]);
                        setRemovedRow(newRemovedRow);
                        return removedRow;
                });

                if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                }
                setCount((prevCount) => prevCount + 1);

                timeoutRef.current = setTimeout(() => {
                        if (count > 3) {
                                console.log('Count exceeded 3');
                        }
                        setCount(0);

                }, 300);
        };


        useEffect(() => {
                const changetimeout = setTimeout(() => {
                        console.log("change called for ", removedRow)
                        var container = document.getElementById('container2');
                        const domativeElement = Array.from(container.childNodes).map(item => (Number(item.id.split('_')[1])))

                        console.log(domativeElement, "@@@", removedRow)
                        let start = 0
                        let end = 0
                        let top = 0

                        if (0 < removedRow - 3) {

                                start = (numberOfColumns * (removedRow - 3)) + 1
                                end = Math.min(((pagesPerScreen * numberOfColumns) + start) - 1, numPages)
                                top = requiredWidth * (removedRow - 3)

                        } else if (3 >= removedRow) {
                                start = 1
                                end = ((pagesPerScreen * numberOfColumns) + start) - 1
                                top = 0



                        } else {
                                alert("error")
                        }

                        ///////////////////////////////////////////////
                        const domActiveSet = new Set(domativeElement);

                        // Create a set of all numbers in the range [start, end]
                        const fullRangeSet = new Set();
                        for (let i = start; i <= end; i++) {
                                fullRangeSet.add(i);
                        }

                        // Find missing numbers in the range
                        const missingNumbers = [...fullRangeSet].filter(num => !domActiveSet.has(num));

                        // Find numbers in domativeElement that are not in the range
                        const outOfRangeNumbers = [...domActiveSet].filter(num => num < start || num > end);

                        // Find duplicates in the domativeElement
                        const countMap = domativeElement.reduce((acc, num) => {
                                acc[num] = (acc[num] || 0) + 1;
                                return acc;
                        }, {});

                        const duplicates = Object.keys(countMap)
                                .filter(key => countMap[key] > 1)
                                .map(Number);

                        const result = {
                                missingNumbers: missingNumbers.sort((a, b) => a - b),
                                outOfRangeNumbers: outOfRangeNumbers.sort((a, b) => a - b),
                                duplicates: duplicates.sort((a, b) => a - b)
                        }
                        console.log(result)
                        ///////////////////////////////////////////////////

                        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                        duplicates.map(item => removeDivById(grandParentDataAtribute + item))
                        outOfRangeNumbers.map(item => removeDivById(grandParentDataAtribute + item))
                        document.getElementById('container2').style.top = `${top}px`


                        const any = async () => {

                                let data = await createAllCanvasesFORme(missingNumbers, scale)
                                missingNumbers.forEach((number, index) => {
                                        if (number === start) {
                                                const grandParent = renderPage("ABCD", data, requiredWidth, index)
                                                const parentElement = document.getElementById('container2')
                                                parentElement.insertBefore(grandParent, parentElement.firstChild)
                                                parentElement.insertAfter

                                        } else {
                                                const newElement = renderPage("ABCD", data, requiredWidth, index)
                                                const adjust = document.getElementById(grandParentDataAtribute + (number - 1))
                                                if (adjust) {

                                                        adjust.insertAdjacentElement("afterend", newElement)
                                                } else {
                                                        alert("node not found")
                                                }

                                        }
                                })


                        }
                        any()

                        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


                        // change()
                }, 200)
                return () => {
                        clearTimeout(changetimeout)
                }

        }, [removedRow])



        ////////////////////////////////////////////////////////

        useEffect(() => {
                setselected(Array.from({ length: numPages }).fill(false))
                console.log("aaa", Array.from({ length: numPages }).fill(false))

        }, [numPages])
        function handleSelectCheckbox(selected) {
                console.log("selected$$$$", selected)
                selected.forEach((state, index) => {
                        const checkbox = document.getElementById("myCheckbox_" + index.toString());
                        if (checkbox) {
                                checkbox.checked = state;
                        }
                });
        }
        useEffect(() => {
                const checkboxContainer = document.getElementById('container2')
                checkboxContainer.addEventListener('click', handleCheckbox)

                return () => {
                        checkboxContainer.removeEventListener('wheel', handleWheel)
                }
        }, [])
        let lastcheckedTemp = null

        async function handleCheckbox  (event) {



                if (event.target.type === 'checkbox') {
                        const currentChecked = event.target.id;
                        console.log(lastcheckedTemp, "@@@")
                         await setLastChecked(prev => {
                                console.log('$$$ ', prev)
                                lastcheckedTemp = prev
                                return prev
                        })
                        let checkboxes = []
                        await setselected(prev => {
                                checkboxes = prev
                                console.log('$$$ $$$ ', prev)
                                return prev
                        })
                        if (event.shiftKey && lastcheckedTemp !== null) {
                                // Get the indices of the checkboxes


                                const start = lastcheckedTemp
                                const end = Number(currentChecked.split('_')[1]);
                                lastcheckedTemp = (null)
                                setLastChecked(null)
                                console.log(start, end, "@@@")
                                // Select all checkboxes between the last checked and the current one
                                debugger
                                for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                                        if ((i == Math.min(start, end) && start<end  ) || (i == Math.max(start, end) && start>end  )) {
                                                checkboxes[i] = checkboxes[i];
                                        }
                                        else  {
                                                checkboxes[i] = !checkboxes[i];
                                        }
                                }
                                handleSelectCheckbox(checkboxes)
                                setselected(checkboxes)
                        } else {
                                if (event.shiftKey) {
                                        lastcheckedTemp = (Number(currentChecked.split('_')[1]))

                                } else {
                                        lastcheckedTemp = (null)

                                }
                                setLastChecked(lastcheckedTemp)
                                let index = Number(currentChecked.split('_')[1]);
                                console.log("$$$ $$$ $$$", checkboxes)
                                checkboxes[index] = event.target.checked;
                                setselected(checkboxes)
                        }


                }
        }
        ////////////////////////////////////////////////////////



        return (
                <div
                        onScroll={handleScroll}
                        style={{
                                height: "93vh",
                                overflow: "scroll"
                        }}

                >
                        <div
                                id="scrollDivSecond"

                                style={{
                                        height: "calc(100vh - 72px)",
                                        display: "flex",
                                        justifyContent: "center",
                                        overflow: "none",
                                        backgroundColor: 'aliceblue',
                                        height: `${(numPages % numberOfColumns ? Number((numPages / numberOfColumns).toString().split(".")[0]) + 1 : (numPages / numberOfColumns)) * requiredWidth}px`,
                                        position: "relative",

                                }}>

                                <div
                                        ref={containerRefSecond}
                                        id="container2"
                                        className="container"
                                        style={{
                                                width: '100%',
                                                // transform: `scale(${scale+1})`,
                                                transformOrigin: 'center',
                                                transition: 'transform 0.1s ease-out',
                                                display: 'grid',
                                                gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
                                                gap: '10px',
                                                height: 'fit-content',
                                                position: "absolute",

                                        }}
                                >
                                        {numPages ? null : <p>Loading document...</p>}





                                </div>
                        </div>
                </div>
        )
}

export default FileSplit                