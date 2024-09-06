import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();


const pdfPageNumber = "secondPdf_"
const grandParentDataAtribute = "data-page-number"
const canvasId = 'canvasId_'

const fileUrl = "https://api59.ilovepdf.com/v1/download/k0Ag6vj5t3bx484cnybd0kdAb5f7jd30d6bzq05vkn4s093tk6vtm7pv67wflkt7hdttj0wk0A8rrj12rsy1sgw9xp2bfw784b40c27rjtz1dlApj42lr67sn267gry1yf0hAsxkkyjnpt89sqjcdwcsh3jn7wcphckz3c3rpnglbsrtn4A1";

const FileSplit = () => {
        const [pagesPerScreen, setPagesperScreen] = useState(20)
        const [pdf, setPdf] = useState(null);
        const [numPages, setNumPages] = useState(null);
        const [pageDetails, setPageDetails] = useState([]);
        const [scale, setScale] = useState(0.1);
        const [largePage, setLargePage] = useState({});
        const [checkBox, setCheckbox] = useState([])
        const [pagesData, setPagesData] = useState([])
        const [requiredWidth, setRequiredWidth] = useState(0)


        const containerRefSecond = useRef(null);



        const createCanvas = (pageNum, rotation = 0, scaleFactor, pdfsample = pdf) => {
                return pdfsample.getPage(parseInt(pageNum)).then(page => {
                        let viewport;

                        if (rotation === 90 || rotation === 270) {
                                const originalWidth = pageDetails[pageNum].width * scale;
                                const originalHeight = pageDetails[pageNum].height * scale;
                                const newScale = (originalWidth / originalHeight) * zoom;
                                viewport = page.getViewport({
                                        scale: scaleFactor || newScale,
                                        rotation
                                });
                        } else {
                                viewport = page.getViewport({
                                        scale: scaleFactor || scale,
                                        rotation
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
                        console.error('Error getting page:', error);
                        return { success: false, pageNumber: pageNum, error };
                });
        };

        const renderPage = (pageNum, rotation, STATUS, scaleFactor = null, requiredWidth, newScale, pdf) => {
                return new Promise(async (resolve, reject) => {
                        try {
                                console.log("path @@@ :", requiredWidth)
                                if (STATUS == "ZOOM") {
                                        const { element: canvas, pageNumber } = await createCanvas(pageNum, rotation, newScale, pdf);
                                        const parentofCanvas = document.getElementById(grandParentDataAtribute + pageNumber)
                                        parentofCanvas?.appendChild(canvas);
                                        document.getElementById(grandParentDataAtribute + pageNum).style.height = `${requiredWidth}px`
                                        console.log("enddddd")


                                } else if (STATUS == 'INIT') {
                                        console.log('INIT')
                                        const { element: canvas } = await createCanvas(pageNum, rotation, scaleFactor);
                                        const pageContainer = document.createElement("div");
                                        pageContainer.style.position = "relative";
                                        pageContainer.style.display = "flex";
                                        pageContainer.style.justifyContent = "center";
                                        pageContainer.id = pdfPageNumber + pageNum;


                                        // canvas.style.display = "block";



                                        const checkbox = document.createElement('input');
                                        checkbox.type = 'checkbox';
                                        checkbox.id = 'myCheckbox_' + pageNum;
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
                                        grandParent.id = grandParentDataAtribute + pageNum;
                                        // grandParent.style.backgroundColor = "#140fac52";
                                        // grandParent.style.marginBottom = '5px'
                                        pageContainer.id = pdfPageNumber + pageNum;



                                        grandParent.setAttribute(grandParentDataAtribute, pageNum);

                                        grandParent.appendChild(pageContainer);

                                        resolve({
                                                success: true,
                                                pageNumber: pageNum,
                                                element: grandParent,
                                        });
                                }

                        } catch (error) {
                                reject(error);
                        }
                });
        };
        const createAllCanvases = async (startPage, endPage, scaleFactor) => {
                const pagePromises = [];
                for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                        pagePromises.push(createCanvas(pageNum, null, scaleFactor));
                }
                return Promise.all(pagePromises);
        };
        const appendChildElement = (element, pageNum, wherToAppend) => {
                if (containerRefSecond.current && !document.getElementById("secondPdf_" + String(pageNum))) {
                        try {
                                if (wherToAppend === "START") {
                                        containerRefSecond.current.insertBefore(element, containerRefSecond.current.firstChild);
                                } else if (wherToAppend === "END") {

                                        containerRefSecond.current.appendChild(element);
                                }
                        } catch (err) {

                        }
                }
        };
        const handleRotate = (PAGE_NUM, POSITION) => {



        }
        const handleCheckboxClick = (event) => {
                console.log('Checkbox clicked, checked status:', event.target.checked, event.target.id);
                setCheckbox()



        };

        const calulateScaleAndSet = (result, NUM_COLUMN, FROM = 'init', pdf) => {
                const newBigWidthOrHeight = result.width > result.height ? result.width : result.height
                const containerWidth = (((window.innerWidth - 48) / 100) * 80) - 16
                let scaleFactor = 0

                let requiredWidth = Number((containerWidth - (10 * (NUM_COLUMN - 1)) - 24) / NUM_COLUMN);
                setRequiredWidth(requiredWidth)
                scaleFactor = requiredWidth / newBigWidthOrHeight;
                setScale(scaleFactor)
                if (FROM == 'HandleWheel') {
                        // remove all pages from dom and replace the page 
                        console.log("handle weel working", "©©©©©©©©©©©©©©©©©©©©©©©©");
                        removeCanvasesById('container2');
                        var pageNumbers = getPageNumbersById('container2');
                        pageNumbers.map(async (pagenumber) => {
                                console.log(pagenumber)
                                let response = await renderPage(pagenumber, null, 'ZOOM', null, requiredWidth, scaleFactor, pdf);
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
                        setLargePage(result);

                        const { scaleFactor, requiredWidth } = calulateScaleAndSet(result, 8, "init")
                        console.log('scaleFactor', scaleFactor)
                        try {

                                const startPage = 1;
                                const endPage = Math.min(pagesPerScreen, numPages);

                                const data = await createAllCanvases(startPage, endPage, scaleFactor);
                                setPagesData(data)
                                console.log(data, "@@@@$$$$$");
                        } catch (error) {
                                console.error('Error rendering pages:', error);
                        }
                };

                renderStart();
        }, [pdf, numPages]);

        const [scroll, setScroll] = useState(1);

        const handleWheel = (e) => {
                console.log('pdf $$$', pdf, largePage)

                if (e.ctrlKey) {
                        e.preventDefault()
                        const zoomFactor = 0.1;
                        let newScale = scroll + (e.deltaY > 0 ? -zoomFactor : zoomFactor);



                        const minScale = 1;
                        const maxScale = 1.8;
                        console.log(scroll, newScale, "scroll")
                        if (newScale > maxScale) {
                                newScale = maxScale
                                setScroll(maxScale)
                                return
                        }

                        if (newScale >= minScale && newScale <= maxScale) { // newScale = 1.1 start 1.2 1.3 ...
                                setScroll(newScale);
                                const numberOfColumns = getNumberOfColumns(newScale);
                                setNumberOfColumns(numberOfColumns)
                                if (newScale < 1.8 && newScale > 0.9) {
                                        console.log("checkpoint 1 ", newScale)
                                        calulateScaleAndSet(largePage, numberOfColumns, "HandleWheel", pdf)

                                } else {
                                }
                        }

                }
        };

        function removeCanvasesById(containerId) {
                var container = document.getElementById(containerId);
                if (container) {
                        var canvases = container.getElementsByTagName('canvas');
                        Array.from(canvases).forEach(function (canvas) {
                                canvas.remove();
                        });
                } else {
                        console.warn('Container with ID "' + containerId + '" not found.');
                }
        }
        function getPageNumbersById(containerId) {
                var container = document.getElementById(containerId);
                var pageNumbers = [];
                if (container) {
                        var elements = container.querySelectorAll(`[data-page-number]`);
                        elements.forEach(function (element) {
                                var num = parseInt(element.getAttribute('data-page-number'), 10);
                                if (!isNaN(num)) {
                                        pageNumbers.push(num);
                                }
                        });
                } else {
                        console.warn('Container with ID "' + containerId + '" not found.');
                }

                return pageNumbers;
        }

        useEffect(() => {
                window.addEventListener('wheel', handleWheel, { passive: false });

                containerRefSecond.current.addEventListener('click', handleCheckboxClick);
                console.log("handlescroll   ")
                return () => {
                        window.removeEventListener('wheel', handleWheel);
                        containerRefSecond.current.addEventListener('click', handleCheckboxClick);
                };
        }, [scroll, pdf, largePage])


        //                 removeCanvasesById('container2');
        //                 var pageNumbers = getPageNumbersById('container2');
        // // 
        //                 pageNumbers.map(async (pagenumber) => {
        //                         const { scaleFactor, requiredWidth } = calulateScaleAndSet(largePage, 8)
        //                         let response = await renderPage(pagenumber, null, 'ZOOM', null, requiredWidth);
        //                 })


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


        return (
                <div
                        id="scrollDivSecond"
                        style={{
                                height: "calc(100vh - 72px)",
                                display: "flex",
                                justifyContent: "center",
                                overflow: "scroll",
                                backgroundColor: 'aliceblue'
                        }}>
                        <div
                                // ref={scrollTrackerRefSecond}
                                style={{
                                        position: "absolute",
                                        top: 242,
                                        height: "1px",
                                        width: "100%",
                                        zIndex: -1,
                                        // backgroundColor: "black",
                                }}></div>
                        {/* {loader && (
                                <div style={{ position: "absolute", top: "50%", left: " 50%", zIndex: "100", transform: "translate(-50%, -50%)" }}>
                                        <div className="spinner-border " role="status" style={{ width: "3rem", height: "3rem", color: "#1ba2a8 " }}>
                                                <span className="sr-only"></span>
                                        </div>
                                </div>
                        )} */}
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
                                }}
                        >
                                {numPages ? null : <p>Loading document...</p>}
                                {pagesData.map(({ pageNumber, element }) => (
                                        <div
                                                key={`${pdfPageNumber}${pageNumber}`}
                                                style={{
                                                        position: 'relative',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                }}
                                                id={`${pdfPageNumber}${pageNumber}`}
                                                ref={node => node && node.appendChild(element)}
                                        >
                                                                                                <input
                                                        type="checkbox"
                                                        id={`myCheckbox_${pageNumber}`}
                                                        name="myCheckbox"
                                                        style={{
                                                                position: 'absolute',
                                                                left: '0',
                                                                bottom: '0',
                                                        }}
                                                />
                                                <div
                                                        style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                height: `${requiredWidth}px`,
                                                        }}
                                                        id={`${grandParentDataAtribute}${pageNumber}`}
                                                >
                                                        {/* Additional content can be added here */}
                                                </div>
                                        </div>
                                ))}




                        </div>
                </div>
        )
}

export default FileSplit