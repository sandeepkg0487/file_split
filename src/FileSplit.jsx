import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();


const pdfPageNumber = "secondPdf_"
const grandParentDataAtribute = "data-page-number"


const FileSplit = ({iniitalLoadPage = 60}) => {

        const [pdf, setPdf] = useState(null);
        const [numPages, setNumPages] = useState(null);
        const [pageDetails, setPageDetails] = useState([]);
        const [scale, setScale] = useState(0.2);

        const containerRefSecond = useRef(null);



        const createCanvas = async (pageNum, rotation = null) => {


                try {

                        const page = await pdf.getPage(parseInt(pageNum));
                        let newScale = null
                        if (rotation == 90 || rotation == 270) {
                                console.log('444')
                                const originalWidth = pageDetails[pageNum].width * scale;
                                const originalHeight = pageDetails[pageNum].height * scale;
                                newScale = (originalWidth / originalHeight) * zoom;

                        }
                        let viewport = {}
                        if (rotation) {
                                viewport = page.getViewport({
                                        scale: newScale ? newScale : scale,
                                        rotation: rotation,
                                });
                        } else {
                                viewport = page.getViewport({
                                        scale: newScale ? newScale : scale,

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
                        console.log("error", error);
                }
        };

        const renderPage = (pageNum, rotation) => {
                return new Promise(async (resolve, reject) => {
                        try {
                                const { element: canvas } = await createCanvas(pageNum, rotation);
                                const pageContainer = document.createElement("div");
                                // pageContainer.style.position = "relative";
                                // pageContainer.style.display = "flex";
                                // pageContainer.style.justifyContent = "center";
                                pageContainer.id = pdfPageNumber + pageNum;

                                canvas.style.display = "block";

                                pageContainer.appendChild(canvas);

                                const grandParent = document.createElement("div");
                                // grandParent.style.display = `flex`;
                                // grandParent.style.justifyContent = "center";
                                // grandParent.style.alignItems = "center";
                                // grandParent.style.backgroundColor = "#140fac52";
                                // grandParent.style.marginBottom = '5px'


                                grandParent.setAttribute(grandParentDataAtribute, pageNum);

                                grandParent.appendChild(pageContainer);

                                resolve({
                                        success: true,
                                        pageNumber: pageNum,
                                        element: grandParent,
                                });
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
                                console.log("checkpoint error:", err);
                        }
                }
        };

        useEffect(() => {
                const loadDocument = async () => {
const fileUrl = "https://api56.ilovepdf.com/v1/download/533cnbnz8kj98q5bngqg1b5rlAd6wfth5n4zkz8rqd68h2j1xf5d6j55mA9wd22vswhq09qx9Aj38s7zyw6kzgltkzmtlmngvpqrmhxm6kmd3Anpv1qd6wh1cqjb7gb6jzncggw3xnf8ywpqykg86yw8b706swd30vfc0cpfjz45yp4hplmq";
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

                        let widthOfLargePage = 0

                        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                                let page = null
                                try {
                                        page = await pdf.getPage(pageNum);
                                } catch (error) {
                                        console.error('@@@ test Error page 2:', pageNum, error)
                                }
                                if (page) {

                                        console.log(page, "111")
                                        let pageDetails = {
                                                width: page?._pageInfo.view[2],
                                                height: page?._pageInfo.view[3],
                                                rotate: page?._pageInfo.rotate
                                        };
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

                        for (let pageNum = 1; pageNum <= Math.min(iniitalLoadPage, numPages + 1); pageNum++) {

                                let response = await renderPage(pageNum);

                                if (response?.success === true) {
                                        appendChildElement(response.element, response.pageNumber, "END");
                                }
                        }
                        // setLoader(false);
                        // setCurrentPage(1)
                }; console.log(' @@@@@ 444444444444444444444444444444', pdf)

                renderStart();
        }, [pdf, numPages]);

        const [scroll, setScroll] = useState(1);

        const handleWheel = (e) => {
                if (e.ctrlKey) {
                        e.preventDefault()
                        const zoomFactor = 0.1;
                        const newScale = scroll + (e.deltaY > 0 ? -zoomFactor : zoomFactor);



                        const minScale = 0.5;
                        const maxScale = 3;

                        if (newScale >= minScale && newScale <= maxScale) {
                                setScroll(newScale);
                        }
                }
        };
        const handleKeyDown = (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
                        e.preventDefault();
                }
        };
        useEffect(() => {
                window.addEventListener('wheel', handleWheel, { passive: false });

                return () => {
                        window.removeEventListener('wheel', handleWheel);
                };
        }, [scroll])

        useEffect(() => {
                console.log(scroll)
        }, [scroll])



        const getNumberOfColumns = (scroll) => {

                const normalizedScroll = (scroll - 0.5) / (2.9 - 0.5);
                const reversedNormalizedScroll = 1 - normalizedScroll;
                const minColumns = 1;
                const maxColumns = 8;
                const numberOfColumns = Math.round(reversedNormalizedScroll * (maxColumns - minColumns) + minColumns);

                return numberOfColumns;
        };
        const numberOfColumns = getNumberOfColumns(scroll);

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
                        {console.log((scroll / 0.1) * 2, "!!!!")}
                        <div
                                ref={containerRefSecond}
                                id="container2"
                                className="container"
                                style={{
                                        width: '100vw',
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