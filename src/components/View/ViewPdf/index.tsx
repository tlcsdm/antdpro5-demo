import React, {useState} from 'react'
import {Input, Spin, Tooltip} from 'antd'
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  LeftOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  RightOutlined
} from '@ant-design/icons'
import styles from './index.less'

import {Document, Page, pdfjs} from 'react-pdf'
import {history} from 'umi'
import {PDFDocumentProxy} from "pdfjs-dist/types/src/display/api";
import {openLink} from "@/utils/base";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const ViewPdf = (props: any) => {
  const {path, print} = props;
  const [pageNumber, setPageNumber] = useState(1);
  const [pageNumberInput, setPageNumberInput] = useState(1);
  const [pageNumberFocus, setPageNumberFocus] = useState(false);
  const [numPages, setNumPages] = useState(1);
  const [pageWidth, setPageWidth] = useState(800);
  const [fullscreen, setFullscreen] = useState(false);

  const onDocumentLoadSuccess = async (pdf: PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
    if (print && print === 'true') {
      const data = await pdf.getData();
      const blob = new Blob([data], {type: 'application/pdf'});
      openLink('open_blob', URL.createObjectURL(blob));
      history.goBack();
    }
  };
  const lastPage = () => {
    if (pageNumber == 1) return;
    const page = pageNumber - 1;
    setPageNumber(page);
    setPageNumberInput(page)
  };
  const nextPage = () => {
    if (pageNumber === numPages) return;
    const page = pageNumber + 1;
    setPageNumber(page);
    setPageNumberInput(page)
  };
  const onPageNumberFocus = (e: any) => {
    setPageNumberFocus(true);
  };
  const onPageNumberBlur = (e: any) => {
    setPageNumberFocus(false);
    setPageNumberInput(pageNumber);
  };
  const onPageNumberChange = (e: any) => {
    let value = e.target.value;
    value = value <= 0 ? 1 : value;
    value = value >= numPages ? numPages : value;
    setPageNumberInput(value);
  };
  const toPage = (e: any) => {
    setPageNumber(Number(e.target.value));
  };
  const pageZoomOut = () => {
    if (pageWidth <= 600) return;
    const width = pageWidth * 0.8;
    setPageWidth(width);
  };
  const pageZoomIn = () => {
    const width = pageWidth * 1.2;
    setPageWidth(width);
  };
  const pageFullscreen = () => {
    if (fullscreen) {
      setFullscreen(false);
      setPageWidth(800);
    } else {
      setFullscreen(true);
      setPageWidth(window.screen.width - 40);
    }
  };

  return (
    <div className={styles.view}>
      {/*<ArrowLeftOutlined className={styles.back} onClick={() => history.goBack()}/>*/}
      <div className={styles.pageContainer}>
        <Document file={path} onLoadSuccess={onDocumentLoadSuccess} loading={<Spin size="large"/>}>
          <Page pageNumber={pageNumber} width={pageWidth} loading={<Spin size="large"/>}/>
        </Document>
      </div>
      <div className={styles.pageTool}>
        <Tooltip title={pageNumber == 1 ? '已是第一页' : '上一页'}>
          <LeftOutlined className={styles.outlined} onClick={lastPage}/>
        </Tooltip>
        <Input
          value={pageNumberFocus ? pageNumberInput : pageNumber}
          onFocus={onPageNumberFocus}
          onBlur={onPageNumberBlur}
          onChange={onPageNumberChange}
          onPressEnter={toPage}
          type="number"
        />
        / {numPages}
        <Tooltip title={pageNumber == numPages ? '已是最后一页' : '下一页'}>
          <RightOutlined className={styles.outlined} onClick={nextPage}/>
        </Tooltip>
        <Tooltip title="放大">
          <PlusCircleOutlined className={styles.outlined} onClick={pageZoomIn}/>
        </Tooltip>
        <Tooltip title="缩小">
          <MinusCircleOutlined className={styles.outlined} onClick={pageZoomOut}/>
        </Tooltip>
        <Tooltip title={fullscreen ? '恢复默认' : '适合窗口'}>
          {fullscreen ? (
            <FullscreenExitOutlined className={styles.outlined} onClick={pageFullscreen}/>
          ) : (
            <FullscreenOutlined className={styles.outlined} onClick={pageFullscreen}/>
          )}
        </Tooltip>
      </div>
    </div>
  )
};

export default ViewPdf;
