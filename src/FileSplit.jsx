import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();


const pdfPageNumber = "secondPdf_"
const grandParentDataAtribute = "data-page-number"

const fileUrl = "https://api55.ilovepdf.com/v1/download/yty37767pf4slqjx7s7y7bs0Azz5m5cslzjA35whr5m0lk7g0v4v6hw3x4lAf50A8n3ybq1ntb1zpbjg7y52zl8AhtA5yfz8ktpkp14pr7khm1nhAcvg56kjt636jwpdhyk31hctmtddy3gvqljkAjydt45znvr96r5w4lhgxg65z2m6f5yq";

const FileSplit = ({ iniitalLoadPage = 60 }) => {

        const [pdf, setPdf] = useState(null);
        const [numPages, setNumPages] = useState(null);
        const [pageDetails, setPageDetails] = useState([]);
        const [scale, setScale] = useState(0.09);
        const [largePage, setLargePage] = useState({});


        const containerRefSecond = useRef(null);



        const createCanvas = async (pageNum, rotation = null, scaleFactor) => {


                try {

                        const page = await pdf.getPage(parseInt(pageNum));
                        let newScale = null
                        if (rotation == 90 || rotation == 270) {
                                const originalWidth = pageDetails[pageNum].width * scale;
                                const originalHeight = pageDetails[pageNum].height * scale;
                                newScale = (originalWidth / originalHeight) * zoom;

                        }
                        let viewport = {}
                        if (rotation) {
                                viewport = page.getViewport({
                                        scale: scaleFactor ? scaleFactor : scale,
                                        rotation: rotation,
                                });
                        } else {
                                viewport = page.getViewport({
                                        scale: scaleFactor ? scaleFactor : scale,
                                        // rotation: 0,

                                });
                        }

                        const canvas = document.createElement("canvas");

                        canvas.width = viewport.width;
                        canvas.height = viewport.height;

                        const context = canvas.getContext("2d");
                        const renderContext = {
                                canvasContext: context,
                                viewport: viewport,
                        };

                        await page.render(renderContext).promise;

                        return { success: true, pageNumber: pageNum, element: canvas };
                } catch (error) {

                }
        };

        const renderPage = (pageNum, rotation, STATUS, scaleFactor = null) => {
                return new Promise(async (resolve, reject) => {
                        try {
                                if (STATUS == "ZOOM") {
                                        const { element: canvas, pageNumber } = await createCanvas(pageNum, rotation, null);
                                        const parentofCanvas = document.getElementById(pdfPageNumber + pageNumber)
                                        parentofCanvas.appendChild(canvas);

                                } else if (STATUS == 'INIT') {
                                        const { element: canvas } = await createCanvas(pageNum, rotation, scaleFactor);
                                        const pageContainer = document.createElement("div");
                                        // pageContainer.style.position = "relative";
                                        pageContainer.style.display = "flex";
                                        pageContainer.style.justifyContent = "center";
                                        pageContainer.id = pdfPageNumber + pageNum;

                                        // canvas.style.display = "block";

                                        pageContainer.appendChild(canvas);

                                        const grandParent = document.createElement("div");
                                        grandParent.style.display = `flex`;
                                        grandParent.style.justifyContent = "center";
                                        grandParent.style.alignItems = "center";
                                        // grandParent.style.backgroundColor = "#140fac52";
                                        // grandParent.style.marginBottom = '5px'


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

        const calulateScaleAndSet = (WIDTH, NUM_COLUMN) => {
                const container = document.getElementById('container2');
                let requiredWidth = 0
                let scaleFactor = 0
                if (container) {
                        requiredWidth = (container.offsetWidth - (10 * NUM_COLUMN)) / NUM_COLUMN;
                        scaleFactor = requiredWidth / WIDTH;
                        setScale(scaleFactor)
                        return scaleFactor
                }
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
                                pageNum: null,
                                width: 0
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
                                                        pageNum: pageNum,
                                                        width: pageDetails.width
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
                        const scaleFactor = calulateScaleAndSet(result.width, 8)

                        for (let pageNum = 1; pageNum <= Math.min(iniitalLoadPage, numPages); pageNum++) {

                                let response = await renderPage(pageNum, null, 'INIT', scaleFactor);

                                if (response?.success === true) {
                                        appendChildElement(response.element, response.pageNumber, "END");
                                }
                        }
                        // setLoader(false);
                        // setCurrentPage(1)
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
                                        console.log(largePage.width, numberOfColumns, newScale, "QQQQQQQ")
                                        calulateScaleAndSet(largePage.width, numberOfColumns)

                                } else { // one column 
                                        // console.log('###')
                                        // if (scroll < newScale) //zoom in
                                        //         setScale(scale + 0.1)
                                        // else 
                                        //         setScale(scale - 0.1)


                                }



                        }

                }
        };
        console.log(largePage.width, "wwwwwwwww")
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

                return () => {
                        window.removeEventListener('wheel', handleWheel);
                };
        }, [scroll, largePage])

        useEffect(() => {
                removeCanvasesById('container2');
                var pageNumbers = getPageNumbersById('container2');

                pageNumbers.map(async (pagenumber) => {
                        let response = await renderPage(pagenumber, null, 'ZOOM', null);
                })

        }, [scale])
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
                        </div>
                </div>
        )
}

export default FileSplit