/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import PDFMerger from "pdf-merger-js/browser";
import { AnalysisLoader } from "../../common/loader";
import './style.css';

const DocumentsViewer = (props) => {
  const { data, pageNumber, draw, documentData, focus } = props;
  const [loading, setLoading] = useState(false);
  const [annotManager, setAnnotManager] = useState(null);
  const [instance, setInstance] = useState(null)
  let viewerDiv = useRef(null);

  const percentageToPos = (dimension, percentage) => {
    let res = dimension * (percentage);
    return res;
  };

  const printAnnotation = (annot, textAnnotation, page) => {
    textAnnotation.setPageNumber(page)
    textAnnotation.setContents(annot.Id);
    textAnnotation.Listable = false;
    textAnnotation.setWidth(200);
    textAnnotation.setHeight(100);
    textAnnotation.setX(annot.X + 5);
    textAnnotation.setY(checkOffset(annot.Y - 15, 50));
    textAnnotation.TextColor.R = 0;
    textAnnotation.TextColor.G = 0;
    textAnnotation.TextColor.B = 20;
    textAnnotation.StrokeThickness = 0;
  };

  const clearText = (annotationManager, textAnnotation) => {
    textAnnotation.setContents("");
    annotationManager.redrawAnnotation(textAnnotation);
  };

  const checkOffset = (pos, boxHeight) => {
    if (pos < 0) return pos + boxHeight + 15;
    else return pos;
  };

  useEffect(() => {
    if (focus)
      makeFocus(focus)
  }, [focus])

  useEffect(() => {
    if (data) {
      WebViewer(
        {
          path: "lib",
          disabledElements: [
            "toolbarGroup-Shapes",
            "toolbarGroup-Edit",
            "toolbarGroup-Insert",
            "toolbarGroup-Forms",
            "toolbarGroup-FillAndSign",
            "highlightToolGroupButton",
            "underlineToolGroupButton",
            "strikeoutToolGroupButton",
            "squigglyToolGroupButton",
            "stickyToolGroupButton",
            "freeTextToolGroupButton",
            "freeHandToolGroupButton",
            "freeHandHighlightToolGroupButton",
          ],
        },
        viewerDiv.current
      )
        .then(async (instance) => {
          instance.UI.loadDocument(await getMergedFile(data?.allFilesData), {
            filename: "myFile.pdf",
          });
          const { documentViewer, annotationManager, Annotations } = instance.Core;
          setAnnotManager(instance.Core);
          setInstance(instance)
          const textAnnotation = new Annotations.FreeTextAnnotation();
          documentViewer.addEventListener("documentLoaded", async () => {
            documentViewer.setCurrentPage(parseInt(pageNumber), true);
            if (!documentData?.extractedInformations) return;
            for (const [_key, value] of Object.entries(documentData?.extractedInformations)) {
              let data = value.bbox;
              if (value?.value?.length > 0 && data?.topleft) {
                const rectangleAnnot = new Annotations.RectangleAnnotation({
                  Id: value.value,
                });
                let pageWidth = documentViewer.getPageWidth(data.page + 1);
                let pageHeight = documentViewer.getPageHeight(data.page + 1);
                rectangleAnnot.PageNumber = data.page + 1;
                const width = pageWidth * (data?.width)
                const height = pageHeight * (data?.height)
                const x = percentageToPos(pageWidth, data?.topleft[0])
                const y = percentageToPos(pageHeight, data?.topleft[1])
                rectangleAnnot.X = x;
                rectangleAnnot.Y = y;
                rectangleAnnot.Width = width
                rectangleAnnot.Height = height
                rectangleAnnot.Color.R = 114;
                rectangleAnnot.Color.G = 239;
                rectangleAnnot.Color.B = 221;
                rectangleAnnot.StrokeThickness = 2;
                rectangleAnnot.Opacity = 0.4;
                rectangleAnnot.FillColor.A = 0.4;
                rectangleAnnot.FillColor.R = 83;
                rectangleAnnot.FillColor.G = 114;
                rectangleAnnot.FillColor.B = 217;
                rectangleAnnot.IsHoverable = true;
                annotationManager.addAnnotation(rectangleAnnot);
                annotationManager.redrawAnnotation(rectangleAnnot);
              }
            }
          });
          documentViewer.on("mouseMove", (event) => {
            var annot = annotationManager.getAnnotationByMouseEvent(event);
            if (annot && annot.Subject === "Rectangle") {
              const page = findAnnotPage(annot.Id)
              printAnnotation(annot, textAnnotation, page);
            } else clearText(annotationManager, textAnnotation);
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
      setLoading(false);
    } else {
      setLoading(true)
    }
  }, [data]);

  useEffect(() => {
    if (draw !== null) {
      handelAnnotation(draw);
    }
  }, [draw]);

  const findAnnotPage = (elem) => {
    for (const [key, value] of Object.entries(documentData?.extractedInformations)) {
      if (value.value === elem)
        return value.bbox.page + 1
    }
    return 1
  }

  const makeFocus = (elem) => {
    if (!instance) return
    for (const [key, value] of Object.entries(documentData?.extractedInformations)) {
      if (key === elem) {
        let annot = instance.Core.annotationManager.getAnnotationById(value.value);
        if (annot) {
          instance.UI.setZoomLevel('100%')
          instance.Core.annotationManager.jumpToAnnotation(annot);
          annot.FillColor.A = 0.01;
          annot.FillColor.R = 95;
          annot.FillColor.G = 239;
          annot.FillColor.B = 253;
          annot.Opacity = 0.7;
          annot.Color.R = 239;
          annot.Color.G = 253;
          annot.Color.B = 95;
          instance.Core.annotationManager.redrawAnnotation(annot);
        }
      } else {
        let annot = instance.Core.annotationManager.getAnnotationById(value.value);
        if (annot) {
          annot.Opacity = 0.4;
          annot.Color.R = 114;
          annot.Color.G = 239;
          annot.Color.B = 221;
          annot.FillColor.A = 0.4;
          annot.FillColor.R = 83;
          annot.FillColor.G = 114;
          annot.FillColor.B = 217;
          instance.Core.annotationManager.redrawAnnotation(annot);
        }
      }
    }
  }

  const handelAnnotation = async (val) => {
    return;
  };

  const dataURLtoFile = async (dataurl, filename) => {
    var arr = dataurl.split(",")
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: "application/pdf" });
  };

  const getMergedFile = async (files) => {
    const merger = new PDFMerger();
    for (const file of files) {
      const extension = file.name?.split(".")[1]
      let prefix = ""
      switch (extension) {
        case "jpeg": prefix = "data:image/jpeg"; break;
        case "png": prefix = "data:image/png"; break;
        case "pdf": prefix = "data:text/plain"
      }
      let fileData = await dataURLtoFile(
        `${prefix};base64,${file?.base64}`,
        file?.name
      );
      await merger.add(fileData);
    }
    const mergedPdf = await merger.saveAsBuffer();
    return mergedPdf;
  };

  return (
    <div className="myViewer">
      <AnalysisLoader loading={loading} style={{ top: "50%", left: "50%", position: 'absolute' }} />
      {data && (
        <div
          className="webviewer"
          ref={viewerDiv}
          style={{ height: "80vh" }}
        ></div>
      )}
    </div>
  );
};

export default DocumentsViewer;
