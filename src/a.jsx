import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { useCallback } from "react";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from '@mui/material';
// import samplePdf from '../../../../assets/pdf/sample11.pdf'
// pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
// pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const NewPdfViewerFirst = ({ handleDocumentLoad, loader, setLoader, currentPage, setCurrentPage, numPages, setNumPages, fileUrl, gotoPageNumber }) => {
    const samplePdf = "https://api4.ilovepdf.com/v1/download/8fhpxrqjzp9g1gwj1zqtv7x1x0qkxvnA166hfxAwdjxfvfA07sh8yrkjd5wgm4wqlq05vjpc0960nj2g5hAk105t8yAxb3l5xvrq508ygv5h9vhxnk9jxhxbphs0r2h7vyyjbg08j45bzrpdm1k1y1m61gA8r4nlxgvx42t6vldywrgj4g41"
    // const [currentPage, setCurrentPage] = useState(1);
    const [pageDetails, setPageDetails] = useState([]);
    const [currentLoadPage, setCurrentLoadPage] = useState({});
    const [DomActivePage, setDomActivePage] = useState([]);
    const [topofTheParant, setTopofTheParant] = useState(0);
    const [zoom, SetZoom] = useState(1);
    const [heightOfAllPage, setHeightOfAllPage] = useState(0);
    const [heightOfAllPageTemp, setHeightOfAllPageTemp] = useState(0);
    const [pdf, setPdf] = useState(null);


    const PdfViewerFirst = useRef(null);
    const scrollTrackerRefFirst = useRef(null);

    const [ruler, setRuler] = useState({});

    const createpageAndAppendToDiv = async (pageNum, rotation = 0, fitZoomScale = null) => {
        try {
            const page = await pdf.getPage(parseInt(pageNum));
            const curentZoom = fitZoomScale != null ? fitZoomScale : zoom
            const viewport = page.getViewport({
                scale: curentZoom,
                rotation: rotation,
            });
            const canvas = document.createElement("canvas");

            canvas.width = viewport.width;
            canvas.height = viewport.height;


            const context = canvas.getContext("2d");

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            // Wait for the page to render
            await page.render(renderContext).promise;
            const containerElement = document.getElementById(String(pageNum));
            if (containerElement) {
                containerElement.appendChild(canvas);
            }
            return { success: true, pageNumber: pageNum, element: canvas };
        } catch (error) {
            console.log("error", error);
        }
    };
    useEffect(() => {
        const loadDocument = async () => {
            const loadingTask = pdfjs.getDocument(samplePdf);
            const loadedPdf = await loadingTask.promise;
            setPdf(loadedPdf);
            setNumPages(loadedPdf.numPages);
            handleDocumentLoad(loadedPdf.numPages)
        };

        loadDocument();
    }, [samplePdf]);

    //creating canvas elemetnt and return canvas
    const renderPage = (page, pageNum, fitZoomScale, rotation = null) => {
        return new Promise(async (resolve, reject) => {
            try {
                const element = await createpageAndAppendToDiv(pageNum, rotation ? rotation : pageDetails[pageNum]?.rotation, fitZoomScale);
                const canvas = element.element;
                const pageContainer = document.createElement("div");
                pageContainer.style.width = canvas.width * (fitZoomScale != null ? fitZoomScale : zoom);
                pageContainer.style.height = canvas.height * (fitZoomScale != null ? fitZoomScale : zoom);
                pageContainer.style.position = "relative";
                pageContainer.style.display = "flex";
                pageContainer.style.justifyContent = "center";
                pageContainer.id = "firstPdf_" + pageNum;

                canvas.style.display = "block";

                pageContainer.appendChild(canvas);

                const grandParent = document.createElement("div");
                grandParent.style.display = flex;
                grandParent.style.justifyContent = "center";
                grandParent.style.alignItems = "center";
                grandParent.style.backgroundColor = "#140fac52";
                // grandParent.style.marginBottom = '5px'

                grandParent.setAttribute("data-page-number", pageNum);

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

    // dom append canvas
    const appendChildElement = (element, pageNum, wherToAppend) => {
        if (PdfViewerFirst.current && !document.getElementById("firstPdf_" + String(pageNum))) {
            try {
                if (wherToAppend === "START") {
                    PdfViewerFirst.current.insertBefore(element, PdfViewerFirst.current.firstChild);
                } else if (wherToAppend === "END") {
                    if (ruler?.page == pageNum) {
                        const rulerDivFirst = createAbsoluteDiv(ruler.position * (zoom / ruler.zoom));
                        element.firstChild.appendChild(rulerDivFirst);
                        PdfViewerFirst.current.appendChild(element);
                    } else {
                        PdfViewerFirst.current.appendChild(element);
                    }
                }
            } catch (err) {
                console.log("checkpoint error:", err);
            }
        }
    };
    useEffect(() => {
        PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom}px;
    }, [heightOfAllPage]);
    // useEffect for inital load calculate the width and load 30 element 1st
    useEffect(() => {
        const renderAllPages = async () => {
            if (!pdf) return;
            let heightOfAllPage = 0;
            let widthOfLargePage = 0
            const updatedpageDetail = [...pageDetails];

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                let page = null
                try {
                    page = await pdf.getPage(pageNum);
                } catch (error) {
                    console.error("@@@ test Error page 2 ", pageNum, error)
                }
                if (page) {
                    if (widthOfLargePage < page._pageInfo.view[2]) {
                        widthOfLargePage = page._pageInfo.view[2]
                    }
                    let pageDetails = {
                        width: [90, 270].includes(page._pageInfo.rotate) ? page._pageInfo.view[3] : page._pageInfo.view[2],
                        height: [90, 270].includes(page._pageInfo.rotate) ? page._pageInfo.view[2] : page._pageInfo.view[3],
                        rotation: page._pageInfo.rotate
                    };
                    updatedpageDetail[pageNum] = {
                        ...updatedpageDetail[pageNum],
                        ...pageDetails,
                    };
                    setPageDetails(updatedpageDetail);
                    heightOfAllPage = page._pageInfo.view[3] + heightOfAllPage;

                }
            }

            const windowheight = window.innerWidth - 100;

            const fitZoomScale = Number((windowheight / widthOfLargePage).toFixed(2))
            SetZoom(fitZoomScale)

            let validResponses = [];
            for (let pageNum = 1; pageNum <= Math.min(30, numPages); pageNum++) {
                const page = await pdf.getPage(pageNum);
                let response = await renderPage(page, pageNum, fitZoomScale, updatedpageDetail[pageNum].rotation)

                if (response?.success === true) {
                    validResponses.push(response.pageNumber);
                    appendChildElement(response.element, response.pageNumber, "END");
                }
            }
            setDomActivePage(validResponses);
            PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom}px;
            setHeightOfAllPage(heightOfAllPage);
            setHeightOfAllPageTemp(heightOfAllPage);
            setLoader(false);
            setCurrentPage(1)
        };

        renderAllPages();
    }, [pdf, numPages]);

    // use Effec for current page change

    useEffect(() => {
        let delayfunction = setTimeout(() => {
            const isPresent = document.getElementById("firstPdf_" + String(currentPage));
            if (!isPresent) {
                goToPage(currentPage);
            } else {
                checkWheterRemovePage(currentPage);
            }
        }, 500);
        return () => {
            clearTimeout(delayfunction);
        };
    }, [currentPage]);

    // give a page number and  where to append function

    const renderSinglePages = async (nexToLoad, whereToRremove) => {
        if (!pdf) return;
        if (!document.getElementById("firstPdf_" + String(nexToLoad))) {
            const page = await pdf.getPage(nexToLoad);
            const response = await renderPage(page, nexToLoad, page._pageInfo.view[3], page._pageInfo.view[2]);

            if (response?.success === true) {
                if (whereToRremove === "START") {
                    appendChildElement(response.element, response.pageNumber, "END");
                    setDomActivePage((prev) => {
                        const updatedArray = [...prev];
                        updatedArray.shift();
                        updatedArray.push(response.pageNumber);
                        return updatedArray;
                    });
                    const element = PdfViewerFirst.current.firstChild?.getAttribute("data-page-number");

                    if (parseInt(element) == parseInt(DomActivePage[0])) {
                        const prevTopPosition = PdfViewerFirst.current.offsetTop;
                        const topPosition = parseInt(pageDetails[parseInt(element)].height) * zoom + prevTopPosition;
                        PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom - topPosition}px;

                        if (response.pageNumber < 16) {
                            PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom}px;
                            PdfViewerFirst.current.style.top = ${0}px;
                        }
                        // else if(pageNumber > numPages-16){
                        //   PdfViewerFirst.current.style.height = ${heightOfAllPage-topPosition}px;
                        //   PdfViewerFirst.current.style.top = ${topPosition}px;
                        // }
                        else {
                            PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom - topPosition}px;
                            PdfViewerFirst.current.style.top = ${topPosition}px;
                        }
                        PdfViewerFirst.current.removeChild(PdfViewerFirst.current.firstChild);
                    }
                }
                if (whereToRremove === "END") {
                    const element = PdfViewerFirst.current.lastChild?.getAttribute("data-page-number");

                    if (parseInt(element) == parseInt(DomActivePage[29])) {
                        const prevTopPosition = PdfViewerFirst.current.offsetTop;
                        const topPosition = prevTopPosition - parseInt(pageDetails[parseInt(element)].height * zoom);
                        document.getElementById("container1").offsetHeight;
                        PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom + topPosition}px;

                        if (response.pageNumber == 1 || currentPage < 15) {
                            PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom}px;
                            PdfViewerFirst.current.style.top = ${0}px;
                        } else {
                            PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom - topPosition}px;
                            PdfViewerFirst.current.style.top = ${topPosition}px;
                        }
                        PdfViewerFirst.current.removeChild(PdfViewerFirst.current.lastChild);
                        setDomActivePage((prev) => {
                            const updatedArray = [response.pageNumber, ...prev];
                            updatedArray.pop();
                            return updatedArray;
                        });
                        appendChildElement(response.element, response.pageNumber, "START");
                    }
                }
            }
        }
    };

    const checkWheterRemovePage = (currentPage) => {
        const index = DomActivePage.findIndex((element) => element === currentPage);
        if (index === -1) {
            return null;
        }
        let nexToLoad = null;
        let whereToRremove = null;
        if (index > 14 && currentPage < numPages - 15) {
            if (index > parseInt(DomActivePage.length / 2) - 1) {
                // remove from first and -unshift
                // add last element -push
                nexToLoad = currentPage + 15;

                whereToRremove = "START";
            }
        } else if (index < 13 && currentPage > 13 && currentPage < numPages - 15) {
            //pop
            // add to first
            nexToLoad = currentPage - 13;
            whereToRremove = "END";
        }
        if (nexToLoad && nexToLoad > 0 && !document.getElementById("firstPdf_" + String(nexToLoad))) {
            renderSinglePages(nexToLoad, whereToRremove);
        }
    };

    const rotatePage = async (direction) => {
        const currentRotation = pageDetails[currentPage]?.rotation || 0;
        const prevWidth = pageDetails[currentPage]?.width * zoom;
        const prevHeight = pageDetails[currentPage]?.height * zoom;

        const newRotation = (currentRotation + direction * 90) % 360;
        const pageDetailsTemp = pageDetails;
        pageDetailsTemp[currentPage] = {
            width: pageDetailsTemp[currentPage].height,
            height: pageDetailsTemp[currentPage].width,
            rotation: newRotation,
        };
        const tempHeight = pageDetails[currentPage].height;
        const tempWidth = pageDetails[currentPage].width;
        const tempcalculation = tempHeight - tempWidth;
        setHeightOfAllPage(heightOfAllPage + tempcalculation);
        setPageDetails(pageDetailsTemp);
        const canvasParentDiv = document.getElementById("firstPdf_" + String(currentPage));
        canvasParentDiv.querySelector("canvas").remove();

        const element = await createpageAndAppendToDiv(currentPage, newRotation);
        document.getElementById("firstPdf_" + currentPage).appendChild(element.element)
        const container1 = document.getElementById("container1")
        let width = 0
        Array.from(container1.querySelectorAll('canvas'))?.map((item) => {
            if (Number(item.width) > width) {
                width = Number(item.width)
            }
        })
        if (window.innerWidth < width) {
            container1.style.marginLeft = ${(width - window.innerWidth) + 50}px
        } else {
            container1.style.marginLeft = 0px
        }
    };

    const removeAllChildren = () => {
        if (PdfViewerFirst && PdfViewerFirst.current) {
            const container = PdfViewerFirst.current;
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
    };

    const goToPage = async (pageNumber = 125) => {
        const LoadPages = async (pageNumber, pdf) => {
            let fillSetActivePage = [];
            let startPage = 0;
            let endPage = 0;

            if (pageNumber < Math.min(16, numPages)) {
                // Load the first 30 pages
                startPage = 1;
                endPage = Math.min(30, numPages);
            } else if (pageNumber > numPages - 16) {
                // Load the last 30 pages
                startPage = Math.max(1, numPages - 30);
                endPage = numPages;
            } else {
                // Load pages around the current page
                startPage = pageNumber - 14;
                endPage = pageNumber + 15;
            }
            let marginLeftOfDiv = 0
            for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                if (!document.getElementById("firstPdf_" + String(pageNum))) {
                    const page = await pdf.getPage(pageNum);
                    const response = await renderPage(page, pageNum);
                    if (marginLeftOfDiv < pageDetails[pageNum].width * zoom) { marginLeftOfDiv = pageDetails[pageNum].width * zoom }
                    if (response?.success === true) {
                        appendChildElement(response.element, response.pageNumber, "END");
                        fillSetActivePage.push(pageNum);
                    }
                }
            }
            setDomActivePage(fillSetActivePage);
            if ((marginLeftOfDiv - window.innerWidth) > 0) {
                document.getElementById('container1').style.marginLeft = ${50 + (marginLeftOfDiv - window.innerWidth)}px
                // setTimeout(() => {
                //     const windowWidth = window.innerWidth;
                //     const element = document.getElementById('container1');

                //     if (element) {
                //         const elementRect = element.getBoundingClientRect();
                //         const elementWidth = elementRect.width;
                //         const elementOffsetLeft = elementRect.left;

                //         const scrollPosition = elementOffsetLeft + window.scrollX - (windowWidth / 2) + (elementWidth / 2);

                //         document.getElementById('scrollDivFirst').scrollTo({
                //             left: scrollPosition,
                //             behavior: 'smooth'
                //         });
                //     } else {
                //         console.error("Element with id 'container1' not found.");
                //     }
                // }, 50);
            } else {
                document.getElementById('container1').style.marginLeft = 0px
            }
        };

        try {
            let scrollPosss = 0;
            if (pageNumber < 1 || pageNumber > pageDetails.length) {
                return;
            }


            let pageHeight = 0;
            const heightHistory = [];
            const maxHistoryLength = 30;
            let temp = 0;
            const scrollDivFirst = document.getElementById("scrollDivFirst");
            let behavior = "smooth";
            if (performScale) {
                behavior = "auto";
                setPreformScale(false);
            }

            for (let i = 1; i <= pageNumber; i++) {
                const currentPageHeight = parseFloat(pageDetails[i].height * zoom);

                pageHeight += currentPageHeight;

                if (i == pageNumber - 1) {
                    scrollPosss = pageHeight;
                }
                if (heightHistory.length >= maxHistoryLength) {
                    heightHistory.shift();
                }
                heightHistory.push(pageHeight);
            }
            const isPageActive = document.getElementById("firstPdf_" + pageNumber)
            const isCanvasPresent = isPageActive?.querySelector('canvas')
            if (numPages < 31 && isCanvasPresent) {
                scrollDivFirst.scrollTo({
                    top: parseInt(scrollPosss),
                    behavior,
                    // behavior: "smooth",
                });
                return;
            }

            if (pageNumber < 16 || numPages < 31) {
                PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom}px;
                PdfViewerFirst.current.style.top = ${0}px;
            } else if (pageNumber > numPages - 16) {
                for (let i = numPages; i >= numPages - 30; i--) {
                    temp += parseFloat(pageDetails[i].height * zoom);

                }

                PdfViewerFirst.current.style.height = ${temp}px;
                PdfViewerFirst.current.style.top = ${heightOfAllPage * zoom - temp}px;
            } else {
                const newIndex =pageNumber < 30 ? 14 -(30-pageNumber) : 14
                PdfViewerFirst.current.style.height = ${heightOfAllPage * zoom - parseInt(heightHistory[newIndex])}px;
                PdfViewerFirst.current.style.top = ${parseInt(heightHistory[newIndex])}px;
            }
            removeAllChildren();
            // remove all dom element

            const fillSetActivePage = await LoadPages(pageNumber, pdf);

            scrollDivFirst.scrollTo({
                top: parseInt(scrollPosss),
                behavior,
                // behavior: "smooth",
            });

            if (pageNumber > 16) {
                // setTopofTheParant(heightHistory[0]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleScroll = (e) => {
        if (scrollTrackerRefFirst.current) {
            const rect = scrollTrackerRefFirst.current.getBoundingClientRect();
            const containerRect = PdfViewerFirst.current.getBoundingClientRect();
            const offsetTop = Math.abs(containerRect.top - rect.top);
            let cumulativeHeight = 0;
            const containerTop = document.getElementById("scrollDivFirst").offsetTop;
            for (let i = 1; i <= numPages; i++) {
                cumulativeHeight += pageDetails[i].height;
                if (offsetTop < cumulativeHeight - containerTop) {
                    setCurrentPage(i);
                    break;
                }
            }
        }
    };

    const handleScrollTemp = (e) => {
        e.preventDefault();
        if (scrollTrackerRefFirst.current) {
            const scrollPosition = e.target.scrollTop;
            const offsetTop = Math.abs(scrollPosition + 242) - 72;
            let cumulativeHeight = 0;
            for (let i = 1; i <= numPages; i++) {

                cumulativeHeight += ((pageDetails[i].height * zoom));
                if (offsetTop < cumulativeHeight) {
                    setCurrentPage(i);
                    break;
                }
            }
        }
    };

    const resetAllDomWidth = (zommPercentage) => {
        // Access the div and change the width and height of the div according to the zoom
        try {
            // setHeightOfAllPage(heightOfAllPageTemp*zoom)

            if (PdfViewerFirst.current) {
                const elements = PdfViewerFirst.current.childNodes;
                const canvases = PdfViewerFirst.current.querySelectorAll("canvas");

                canvases.forEach((canvas) => {
                    canvas.remove();
                });
            }
        } catch (error) {
            console.log("error::::", error);
        }
    };
    const [prevPage, setPrevPage] = useState(0);
    const [performScale, setPreformScale] = useState(false);
    useEffect(() => {
        resetAllDomWidth(zoom);
        goToPage(prevPage);
    }, [zoom, prevPage]);

    const handleZoomIn = () => {
        const zoomTemp = zoom + 0.1 > 4 ? zoom : zoom + 0.1;
        setPreformScale(true);
        if (zoom + 0.1 < 4) {
            setPrevPage(currentPage);
            SetZoom(zoomTemp);
        }
    };
    const handleZoomOut = () => {
        const zoomTemp = zoom - 0.1 < 0.2 ? zoom : zoom - 0.1;
        if (zoom + 0.1 > 0.2) {
            // setPrevPage(currentPage);
            setPrevPage(currentPage);
            SetZoom(zoomTemp);
            setPreformScale(true);
        }
    };
    function useDebounce(func, delay) {
        const timeoutRef = useRef(null);

        return useCallback(
            (...args) => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    func(...args);
                }, delay);
            },
            [func, delay]
        );
    }

    const debouncedHandleZoomOut = useDebounce(handleZoomOut, 500);
    const debouncedHandleZoomIn = useDebounce(handleZoomIn, 500);

    const [inputValue, setInputValue] = useState("");
    useEffect(() => {
        setInputValue(currentPage);
    }, [currentPage]);
    const handleChange = (event) => {
        const { value } = event.target;
        if (value === '' || /^[0-9]*$/.test(value)) {
            setInputValue(value);
        }


    };
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const newPageNumber = Number(inputValue);
            if (!isNaN(newPageNumber)) {
                const rebasePage = newPageNumber > numPages ? numPages : newPageNumber <= 0 ? 1 : newPageNumber;

                setInputValue(rebasePage)
                if (currentPage != rebasePage) {
                    goToPage(rebasePage);
                }
            }
        }
    };
    function createAbsoluteDiv(bottom = 0) {
        const newDiv = document.createElement("div");

        newDiv.style.position = "absolute";
        newDiv.style.bottom = ${-bottom}px;
        newDiv.style.backgroundColor = "red";
        newDiv.style.width = "100%";
        newDiv.style.height = "5px";
        newDiv.style.zIndex = "1";
        newDiv.id = "rulerDivFirst";

        return newDiv;
    }

    const handleDoubleClick = (event) => {
        const parentElement = document.getElementById("scrollDivFirst");
        const ScrollDivFromDom = document.getElementById("rulerDivFirst");

        if (ScrollDivFromDom) {
            ScrollDivFromDom.remove();
        }
        if (parentElement) {
            const scrollTopValue = parentElement.scrollTop;
            const clickYViewport = event.clientY;
            let cumulativeHeight = 0;
            let clickedPage = 0;
            for (let i = 1; i <= numPages; i++) {
                cumulativeHeight += pageDetails[i].height * zoom;
                if (cumulativeHeight > scrollTopValue + clickYViewport) {
                    clickedPage = i;
                    break;
                }
            }
            const bottom = scrollTopValue + clickYViewport - cumulativeHeight;
            const ruler = createAbsoluteDiv(bottom - 70);
            setRuler({ page: clickedPage, position: bottom - 70, zoom: zoom });
            document.getElementById("firstPdf_" + String(clickedPage)).appendChild(ruler);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.altKey && event.keyCode === 71) {

                if (ruler?.page) {
                    goToPage(ruler?.page);
                } else {
                    console.log("Element not found");
                }
            }
            if (event.altKey && event.keyCode === 81) {

                let element = document.getElementById('rulerDivFirst')
                setRuler(null)
                if (element) {
                    element.remove();

                }
            };
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [ruler]);
    useEffect(() => {
        if (gotoPageNumber && !loader)
            goToPage(parseInt(gotoPageNumber))
    }, [gotoPageNumber])

    return (
        <>
            <div className="px-3" style={{ backgroundColor: "#1ba2a8" }}>
                <div
                    className="d-flex gap-3"
                    style={{
                        // position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        // background: "#000",
                        padding: "7px",
                        textAlign: "center",
                        gap: "2px",
                        maxHeight: "36px",
                    }}>
                    <div className="d-flex gap-1">
                        <Tooltip disableInteractive title={'Rotate Left'} placement='top' arrow>


                            <div className="pdf-icon">
                                <i onClick={() => rotatePage(-1)} className="bi bi-arrow-counterclockwise" style={{ color: "white" }} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Rotate Left"></i>
                            </div>

                        </Tooltip>
                        <Tooltip disableInteractive title={'Rotate Right'} placement='top' arrow>

                            <div className="pdf-icon">
                                <i onClick={() => rotatePage(1)} className="bi bi-arrow-clockwise" style={{ color: "white" }} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Rotate Right"></i>
                            </div>

                        </Tooltip>
                    </div>
                    <div className="d-flex gap-1">
                        <Tooltip disableInteractive title={' First Page'} placement='top' arrow>

                            <div className="pdf-icon">
                                <i onClick={() => goToPage(1)} className="bi bi-caret-up" style={{ color: "white" }} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="First Page"></i>
                            </div >

                        </Tooltip>
                        <Tooltip disableInteractive title={'Previous Page'} placement='top' arrow>

                            <div className="pdf-icon">
                                <i onClick={() => goToPage(currentPage - 1 >= 0 ? currentPage - 1 : 1)} className="bi bi-chevron-up" style={{ color: "white" }} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Previous Page"></i>
                            </div>

                        </Tooltip>
                    </div>

                    <div className="d-flex gap-2 text-light">
                        <input
                            type="number"
                            value={inputValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter a number"
                            className="border-0 rounded no-arrows px-2"
                            style={{
                                width: "70px",
                                outline: "none",
                                color: 'black'
                            }}
                        />
                        / {numPages}
                    </div>

                    <div className="d-flex gap-1">
                        <Tooltip disableInteractive title={'Next Page'} placement='top' arrow>

                            <div className="pdf-icon">
                                <i
                                    className="bi bi-chevron-down  "
                                    onClick={() => goToPage(currentPage + 1 < numPages ? currentPage + 1 : numPages)}
                                    style={{ color: "white", cursor: "pointer" }}
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    data-bs-title="Next Page"></i>
                            </div>

                        </Tooltip>
                        <Tooltip disableInteractive title={'Last Page'} placement='top' arrow>

                            <div className="pdf-icon">

                                <i className="bi bi-caret-down" onClick={() => goToPage(numPages)} style={{ color: "white" }} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Last Page"></i>
                            </div>

                        </Tooltip>
                    </div >
                    <Tooltip disableInteractive title={'Zoom In'} placement='top' arrow>

                        <div className="pdf-icon">
                            <i onClick={() => debouncedHandleZoomIn()} className="bi bi-zoom-in" style={{ color: "white" }} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Zoom In "></i>
                        </div>

                    </Tooltip>
                    <Tooltip disableInteractive title={'Zoom Out'} placement='top' arrow>

                        <div className="pdf-icon">
                            <i
                                onClick={() => {
                                    debouncedHandleZoomOut();
                                }}
                                className="bi bi-zoom-out"
                                style={{ color: "white" }}
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                data-bs-title="Zoom Out"></i>
                        </div>

                    </Tooltip>
                </div>


                <div
                    onScroll={handleScrollTemp}
                    onDoubleClick={handleDoubleClick}
                    id="scrollDivFirst"
                    style={{
                        maxHeight: "calc(100vh - 72px)",
                        backgroundColor: 'aliceblue',
                        display: "flex",
                        justifyContent: "center",
                        overflow: "scroll",
                    }}>
                    <div
                        ref={scrollTrackerRefFirst}
                        style={{
                            position: "absolute",
                            top: 242,
                            height: "1px",
                            width: "100%",
                            zIndex: -1,
                            // backgroundColor: "black",
                        }}></div>
                    {loader && (
                        <div style={{ position: "absolute", top: "50%", left: " 50%", zIndex: "100", transform: "translate(-50%, -50%)" }}>
                            <div className="spinner-border " role="status" style={{ width: "3rem", height: "3rem", color: "#1ba2a8 " }}>
                                <span className="sr-only"></span>
                            </div>
                        </div>
                    )}

                    <div
                        ref={PdfViewerFirst}
                        id="container1"
                        style={{
                            width: "100vw",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            position: "relative",
                            height: "100%",
                            marginLeft: "0px"
                        }}>
                        {numPages ? null : <p>Loading document...</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewPdfViewerFirst;