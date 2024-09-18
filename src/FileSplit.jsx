import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
import fileUrl from './assets/sample01.pdf'
import { Alert } from "bootstrap";
import { Modal, Button } from 'react-bootstrap';


// pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();


const pdfPageNumber = "secondPdf_"
const grandParentDataAtribute = "data-page-number_"
// const canvasId = 'canvasId_'

// const fileUrl = "https://api59.ilovepdf.com/v1/download/k0Ag6vj5t3bx484cnybd0kdAb5f7jd30d6bzq05vkn4s093tk6vtm7pv67wflkt7hdttj0wk0A8rrj12rsy1sgw9xp2bfw784b40c27rjtz1dlApj42lr67sn267gry1yf0hAsxkkyjnpt89sqjcdwcsh3jn7wcphckz3c3rpnglbsrtn4A1";

const FileSplit = ({ dummyData: removedElementArr, editPage, block, selected, setSelected, pageDetails, setPageDetails, scale, setScale, newPageDetails, setNewPageDetails, createCanvas, setThumbnail, thumbnail }) => {
        const [pagesPerScreen, setPagesperScreen] = useState(10)
        const [pdf, setPdf] = useState(null);
        const [numPages, setNumPages] = useState(null);
        // const [pageDetails, setPageDetails] = useState([]);
        // const [scale, setScale] = useState(0.1);
        const [largePage, setLargePage] = useState({});
        const [checkBox, setCheckbox] = useState([])
        const [pagesData, setPagesData] = useState([])
        const [requiredWidth, setRequiredWidth] = useState(0)
        const [removedRow, setRemovedRow] = useState(0)
        const [totalPages, setTotalPages] = useState(0)
        const [createImageSelected, setCreateImageSelected] = useState([])

        // const [selected, setSelected] = useState([])
        const [lastChecked, setLastChecked] = useState(null)

        const [loader, setloader] = useState(true)
        // const [newPageDetails, setNewPageDetails] = useState([])

        const containerRefSecond = useRef(null);
        //////////////////   modal   ///////////////////////////

        const [showModal, setShowModal] = useState(false);
        const handleOpen = () => setShowModal(true);
        const handleClose = () => setShowModal(false)
        const [viewCnvas, setViewCnvas] = useState()
        const canvasContainerRef = useRef(null);
        /////////////////////////////////////


        // const createCanvas = (pageNum, rotation = 0, scaleFactor, pageDetails) => {

        //         let viewport;
        //         let page = pageDetails.page
        //         if (!page) {
        //                 return
        //         }

        //         viewport = page.getViewport({
        //                 scale: scaleFactor,
        //                 rotation
        //         });

        //         const canvas = document.createElement("canvas");
        //         canvas.width = viewport.width;
        //         canvas.height = viewport.height;
        //         canvas.id = canvasId + pageNum;

        //         const context = canvas.getContext("2d");
        //         const renderContext = {
        //                 canvasContext: context,
        //                 viewport
        //         };

        //         return page.render(renderContext).promise.then(() => {
        //                 return { success: true, pageNumber: page._pageIndex + 1, element: canvas };
        //         });

        // };

        const renderPage = (STATUS, pagesData, requiredWidth, domActiveNumber) => {


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

                                        const h1 = document.createElement('p')
                                        h1.style.color = 'green'
                                        h1.innerHTML = pageNumber
                                        h1.style.position = 'absolute'
                                        h1.style.top = '-25px'
                                        pageContainer.appendChild(h1)

                                        const checkbox = document.createElement('input');
                                        checkbox.type = 'checkbox';
                                        checkbox.id = 'myCheckbox_' + (Number(pageNumber) - 1);
                                        checkbox.name = 'myCheckbox';
                                        checkbox.style.position = 'absolute';
                                        checkbox.style.left = '0';
                                        checkbox.style.bottom = '0';
                                        checkbox.checked = selected[pageNumber - 1] !== undefined ? selected[pageNumber - 1] : false;

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
                        pageContainer.id = pdfPageNumber + pagesData.pageNumber;

                        const h1 = document.createElement('p')
                        h1.innerHTML = pagesData.pageNumber
                        h1.style.color = 'green'
                        h1.style.position = 'absolute'
                        h1.style.top = '-25px'
                        pageContainer.appendChild(h1)

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = 'myCheckbox_' + Number(pagesData.pageNumber - 1);
                        checkbox.name = 'myCheckbox';
                        checkbox.style.position = 'absolute';
                        checkbox.style.left = '0';
                        checkbox.style.bottom = '0';
                        checkbox.checked = selected[Number(pagesData.pageNumber - 1)] !== undefined ? selected[Number(pagesData.pageNumber - 1)] : false;


                        pageContainer.appendChild(pagesData.element); //canvas
                        pageContainer.appendChild(checkbox)

                        const grandParent = document.createElement("div");
                        grandParent.style.display = `flex`;
                        grandParent.style.justifyContent = "center";
                        grandParent.style.alignItems = "center";

                        grandParent.style.height = `${requiredWidth}px`;
                        grandParent.id = grandParentDataAtribute + pagesData.pageNumber;
                        pageContainer.id = pdfPageNumber + pagesData.pageNumber;

                        grandParent.setAttribute(grandParentDataAtribute, domActiveNumber);
                        grandParent.appendChild(pageContainer);
                        return grandParent

                }




        };
        const createAllCanvases = async (startPage, endPage, scaleFactor, pageDetails) => {
                const pagePromises = [];
                if (pageDetails.length === 0)
                        return
                for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                        pagePromises.push(createCanvas(pageNum, null, scaleFactor, pageDetails[pageNum - 1]));
                }
                return Promise.all(pagePromises);
        };
        const createAllCanvasesFORme = async (array, scaleFactor, newPageDetails) => {
                const pagePromises = [];
                if (newPageDetails.length === 0)
                        return
                if (newPageDetails.length == 0)
                        alert('NEW PAGE dETAILS IS 0')
                array.map(item => {
                        pagePromises.push(createCanvas(newPageDetails[item - 1]._pageIndex, newPageDetails[item - 1].rotate, scaleFactor, newPageDetails[item - 1]));
                })
                return Promise.all(pagePromises);
        };
        const handleCheckboxClick = (event) => {
                setCheckbox()



        };

        function countElementsInRange(array, start, end) {
                const filteredElements = array.filter(num => num >= start && num <= end);
                return filteredElements.length;
        }

        const calulateScaleAndSet = (result, NUM_COLUMN, FROM = 'init', pdf) => {


                const newBigWidthOrHeight = result.width > result.height ? result.width : result.height
                const containerWidth = (((window.innerWidth - 48) / 100) * 80) - 16
                let scaleFactor = 0
                let requiredWidth = Number((containerWidth - (10 * (NUM_COLUMN - 1)) - 24) / NUM_COLUMN);
                setRequiredWidth(requiredWidth)
                scaleFactor = requiredWidth / newBigWidthOrHeight;
                setScale(scaleFactor)

                return { scaleFactor, requiredWidth }
        }

        useEffect(() => {
                const loadDocument = async () => {
                        try {

                                const loadingTask = pdfjs.getDocument(fileUrl);
                                const loadedPdf = await loadingTask.promise;
                                setPdf(loadedPdf);
                                setNumPages(loadedPdf.numPages);
                                setTotalPages(loadedPdf.numPages)
                                document.getElementById('totalpage').innerHTML = loadedPdf.numPages

                        } catch (error) {
                                console.error("error on loading URl:", error)
                        }
                };


                loadDocument();
                var scrollDiv = document.getElementById('scrollDiv');
                if (scrollDiv)
                        scrollDiv.scrollTop = 0;

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

                        let updatedDetails = []

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
                                                rotate: page?._pageInfo.rotate,
                                                isActive: true,
                                                page: page,
                                                _pageIndex: page._pageIndex
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
                                        updatedDetails.push(pageDetails)

                                }

                        }




                        setPageDetails(updatedDetails);
                        setNewPageDetails(updatedDetails)
                        setLargePage(result);

                        const { scaleFactor, requiredWidth } = calulateScaleAndSet(result, 8, "init")
                        // try {

                        //         const startPage = 1;
                        //         const endPage = Math.min(pagesPerScreen * 8, numPages);
                        //         const data = await createAllCanvases(startPage, endPage, scaleFactor, updatedDetails);
                        //         renderPage("INIT", data, requiredWidth)
                        //         setPagesData(data)

                        // } catch (error) {
                        //         console.error('Error rendering pages:', error);
                        // }
                };

                renderStart();
                setloader(false)
        }, [pdf]);

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
                        const element = document.querySelector(`[data-page-number_="${grandParentDataAtribute}"]`);
                        // var container = document.getElementById(grandParentDataAtribute);
                        if (element) {
                                element.remove();
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


        const handleScroll = (e) => {
                const scrollPosition = e.target.scrollTop;


                const newRemovedRow = (Number((scrollPosition / (requiredWidth + 50)).toString().split(".")[0]))
                if (removedRow != newRemovedRow) {
                        setRemovedRow(newRemovedRow);
                }


        };
        useEffect(() => {
                // const removelement = Array.from(document.getElementById('container2').childNodes)
                const removelement = Array.from(document.querySelectorAll('[data-page-number_]')).map(item => (item.dataset.pageNumber_))
                removelement.map(item => {
                        removeDivById(item)

                })

        }, [numberOfColumns])

        useEffect(() => {
                const changetimeout = setTimeout(() => {

                        if (newPageDetails.length === 0) {
                                return true
                        }
                        var container = document.getElementById('container2');
                        // Array.from(container.childNodes).map(item => (Number(item.id.split('_')[1])))
                        const domativeElement = Array.from(container.childNodes).map(item => Number(item.dataset.pageNumber_))

                        let start = 0
                        let end = 0
                        let top = 0

                        if (0 < removedRow - 3) {
                                start = (numberOfColumns * (removedRow - 3)) + 1
                                end = Math.min(((pagesPerScreen * numberOfColumns) + start) - 1, numPages)
                                top = (requiredWidth * ((removedRow - 3))) + ((removedRow - 3) * 50)

                                const numberOfRemovedPage = countElementsInRange(removedElementArr, start, end)
                                end = end + numberOfRemovedPage

                        } else if (3 >= removedRow) {
                                start = 1
                                end = Math.min(((pagesPerScreen * numberOfColumns) + start) - 1, numPages)
                                top = 0



                        } else {
                                alert("error 1233")
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
                        ///////////////////////////////////////////////////

                        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                        //////////////////////////////////////////////////////////////////////////////////////////////////////
                        const any = async () => {

                                let data = await createAllCanvasesFORme(missingNumbers, scale, newPageDetails)

                                duplicates.map(item => removeDivById(item))
                                outOfRangeNumbers.map(item => removeDivById(item))
                                document.getElementById('container2').style.top = `${top}px`
                                if (data.length > 0)
                                        missingNumbers.forEach((number, index) => {
                                                if (number === start) {
                                                        const grandParent = renderPage("ABCD", data[index], requiredWidth, number);
                                                        const parentElement = document.getElementById('container2');
                                                        parentElement.insertBefore(grandParent, parentElement.firstChild);
                                                } else {
                                                        const newElement = renderPage("ABCD", data[index], requiredWidth, number);
                                                        let newNumber = data[index].pageNumber;

                                                        while (newNumber > 0) {
                                                                const adjust = document.getElementById(grandParentDataAtribute + (newNumber - 1));

                                                                if (adjust) {
                                                                        adjust.insertAdjacentElement("afterend", newElement);
                                                                        return; // Exit the function once the element is found and inserted
                                                                }

                                                                newNumber--; // Decrement the number and try again
                                                        }
                                                }
                                        });

                        }
                        any()

                        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                        document.getElementById('removed').innerHTML = removedRow
                        document.getElementById('start').innerHTML = ((removedRow - 3) * numberOfColumns) + 1
                        document.getElementById('end').innerHTML = (removedRow + 3 + 4) * numberOfColumns
                        document.getElementById('dom').innerHTML = document.getElementById('container2')?.firstChild.id.split('_')[1] + ' - ' + document.getElementById('container2').lastChild.id.split('_')[1]
                        document.getElementById('top').innerHTML = document.getElementById("container2").style.top

                        // change()
                }, 200)
                try {


                } catch (error) {
                        console.log(error)
                }



                return () => {
                        clearTimeout(changetimeout)
                }

        }, [removedRow, numberOfColumns, removedElementArr, newPageDetails, numPages])


        /////////////////////////////////   CREATE IMG   /////////////////////////////////

        const createBASE64 = async () => {
                const createImage = [];
                const uniquePageNumbers = thumbnail.map(item => item.pageNo - 1)

                createImageSelected.map(item => {
                        if (!uniquePageNumbers.includes(item) && item)
                                createImage.push(createCanvas(item, pageDetails[item].rotate, 0.2, pageDetails[item]))

                })




                const tempImageArray = await Promise.all(createImage);
                const imageArray = tempImageArray.map(canvas => {
                        return {
                                image: canvas.element.toDataURL('image/png'),
                                pageNo: canvas.pageNumber,
                                rotation: canvas.rotation
                        }
                })
                setThumbnail(prev => {
                        const filteredPrev = prev.filter(item => !createImageSelected.includes(item.pageNo));
                        return [
                                ...filteredPrev,
                                ...imageArray
                        ];
                });

        }
        useEffect(() => {
                if (createImageSelected.length > 0) {
                        createBASE64()
                }

        }, [createImageSelected])
        //////////////////////    Load Single view      ////////////////////////////////
        const handleDoubleClick = async (event,jaba) => {
                if (event.target.tagName === 'CANVAS') {
                        setShowModal(true);

                        
                        let currentCanvas = Number(event.target.id.split('_')[1])
                        const maxWidth =  window.innerWidth/100*80
                        const newScale =   Number((   (maxWidth / jaba[currentCanvas].width )-0.05 ).toFixed(2)) 
                        

                        let canvas = await createCanvas(currentCanvas, jaba[currentCanvas].rotate,newScale, jaba[currentCanvas])
                        const modalDiv =  document.getElementById('modalCanvas')
                let         pageContainer = document.createElement("div");
                pageContainer.innerHTML = 'hihiiii'
                        if (modalDiv) {
                                modalDiv.style.width = `${canvas.element.width}px`
                                        modalDiv.appendChild(canvas.element);
                                      }

                        
                        

                }

        }

        /////////////////////////////////   CHECKBOX    /////////////////////////////////

        useEffect(() => {

                setSelected(Array.from({ length: totalPages }).fill(false))

        }, [totalPages])


        function handleSelectCheckbox(selected) {
                selected.forEach((state, index) => {
                        const checkbox = document.getElementById("myCheckbox_" + index.toString());
                        if (checkbox) {
                                checkbox.checked = state;
                        }
                });
        }
        
        
        useEffect(() => {
                const checkboxContainer = document.getElementById('container2');
            
                const handleDblClick = (e) => handleDoubleClick(e, pageDetails,canvasContainerRef);
            
                checkboxContainer.addEventListener('click', handleCheckbox);
                checkboxContainer.addEventListener('dblclick', handleDblClick);
                
                return () => {
                    checkboxContainer.removeEventListener('click', handleCheckbox);
                    checkboxContainer.removeEventListener('dblclick', handleDblClick);
                };
            }, [pageDetails,canvasContainerRef]);


        let lastcheckedTemp = null
        async function handleCheckbox(event) {

                let createImageSelectedTemp = []
                if (event.target.type === 'checkbox' || event.target.tagName === 'CANVAS') {
                        let currentChecked = null
                        if (event.target.type === 'checkbox') {

                                currentChecked = Number(event.target.id.split('_')[1])
                        }


                        await setLastChecked(prev => {
                                lastcheckedTemp = prev
                                return prev
                        })
                        let checkboxes = []
                        await setSelected(prev => {
                                checkboxes = prev
                                return prev
                        })

                        if ((event.shiftKey || event.ctrlKey) && event.target.tagName === 'CANVAS') {

                                currentChecked = Number(event.target.id.split('_')[1])

                        }
                        if (event.shiftKey && lastcheckedTemp !== null) {
                                // Get the indices of the checkboxes

                                const start = lastcheckedTemp
                                const end = currentChecked
                                lastcheckedTemp = (null)
                                setLastChecked(null)
                                // Select all checkboxes between the last checked and the current one
                                for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                                        if ((i == Math.min(start, end) && start < end) || (i == Math.max(start, end) && start > end)) {
                                                checkboxes[i] = checkboxes[i];
                                        }
                                        else {
                                                checkboxes[i] = !checkboxes[i];
                                        }
                                        if (checkboxes[i])
                                                createImageSelectedTemp.push(i)
                                }
                                // handleSelectCheckbox(checkboxes)
                                setSelected(checkboxes)
                                setCreateImageSelected(prev => [...prev, ...createImageSelectedTemp])
                        handleSelectCheckbox(checkboxes)
                        } else {
                                if (event.shiftKey) {
                                        lastcheckedTemp = currentChecked

                                } else {
                                        lastcheckedTemp = (null)

                                }
                                setLastChecked(lastcheckedTemp)
                                let index = currentChecked
                                checkboxes[index] = !checkboxes[index];
                                if (checkboxes[index])
                                        createImageSelectedTemp.push(currentChecked)
                                setSelected(checkboxes)
                                
                                setCreateImageSelected(prev => [...prev, ...createImageSelectedTemp])
                                handleSelectCheckbox(checkboxes)
                        }

                }
        }




        /////////////////////////////////     split      /////////////////////////////////
        useEffect(() => {

                let newPageDetails = [...pageDetails]

                if (newPageDetails.length > 0) {
                        removedElementArr.map((item) => {
                                newPageDetails[item - 1].isActive = false

                        })
                        setPageDetails(newPageDetails)
                        const updatedArray = newPageDetails.filter((item) => item?.isActive === true);


                        setNewPageDetails(updatedArray)
                        setNumPages(updatedArray.length)


                        Array.from(document.getElementById('container2').childNodes).map(item => item.remove())

                }
        }, [removedElementArr])






        /////////////////////////////////        EDIT    /////////////////////////////////
        useEffect(() => {
                let newPageDetails = [...pageDetails]
                let selectedTemp = selected;
                if (newPageDetails.length > 0) {
                        editPage.map((item) => {
                                newPageDetails[item - 1].isActive = true
                                selectedTemp[item - 1] = true

                        })
                        setPageDetails(newPageDetails)
                        const updatedArray = newPageDetails.filter((item) => item?.isActive === true);

                        setNewPageDetails(updatedArray)
                        setNumPages(updatedArray.length)
                        setSelected(selectedTemp)


                        Array.from(document.getElementById('container2').childNodes).map(item => item.remove())
                }
        }, [editPage])


        /////////////////////////////////        ROTATE     /////////////////////////////////
        // const handleRotate = (rotate) => {

        //         const DomActiveElement = Array.from(document.getElementById("container2").childNodes)
        //         const domactiveElemNum = DomActiveElement.map(item => Number(item.id.split('_')[1]) - 1)
        //         const indices = selected.map((value, index) => value ? index + 1 : -1) // Map true values to their indices, false values to -1
        //                 .filter(index => index !== -1);
        //         const commonElements = indices.filter(value => domactiveElemNum.includes(value))


        //         const pageDetailsTemp = pageDetails

        //         const pagePromises = [];
        //         commonElements.map(item => {
        //                 const newRotation = Math.abs((currentRotation + direction * 90) % 360);
        //                 pageDetailsTemp[item].rotate = newRotation
        //                 pagePromises.push(createCanvas(newPageDetails[item].pageNumber, newRotation, scaleFactor, newPageDetails[item]));
        //         })
        //         const rotatedCanvas = Promise.all(pagePromises)
        //         rotatedCanvas.map(item => {
        //                 const div = document.getElementById(` ${pdfPageNumber + item.pageNumber}`)
        //                 const canvas = div.querySelector('canvas')
        //                 if (canvas) {
        //                         div.removeChild(canvas);
        //                 }
        //                 div.appendChild(item.element)
        //         })

        //         setNewPageDetails(pageDetailsTemp)
        //         setPageDetails(pageDetailsTemp)

        // }


        return (
                <div
                        onScroll={handleScroll}
                        style={{
                                height: "93vh",
                                overflow: "scroll"
                        }}
                        id='scrollDiv'

                >
                        <div


                                style={{

                                        display: "flex",
                                        justifyContent: "center",
                                        overflow: "none",
                                        backgroundColor: 'aliceblue',
                                        height: `${numPages % numberOfColumns ? (Number((numPages / numberOfColumns).toString().split(".")[0]) + 1) * (requiredWidth + 50) : (numPages / numberOfColumns) * (requiredWidth + 50)}px`,
                                        position: "relative",

                                }}>

                                <div
                                        ref={containerRefSecond}
                                        id="container2"
                                        className="container"
                                        style={{
                                                width: '100%',
                                                marginTop: "50px",
                                                // transform: `scale(${scale+1})`,
                                                transformOrigin: 'center',
                                                transition: 'transform 0.1s ease-out',
                                                display: 'grid',
                                                gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
                                                gap: '50px 10px',
                                                height: 'fit-content',
                                                position: "absolute",
                                                top: "0",

                                        }}
                                >
                                        {loader && <p>Loading document...</p>}





                                </div>
                        </div>
                        <Modal 
                        className="fileSplitModal"
                        show={showModal} onHide={handleClose} backdrop="true" keyboard={true}>

                                <Modal.Body>
                                <div ref={canvasContainerRef} id='modalCanvas' style={{ textAlign: 'center' }}></div>                            </Modal.Body>
                                {/* No footer or close button */}
                        </Modal>
                </div>
        )
}

export default FileSplit                