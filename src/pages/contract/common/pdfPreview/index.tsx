/*
    history.push({
      pathname: '/pdfPreview',
      query: {
        path: '/api/contract-system/loadContractFilePdf?I_ID=28892246657077248&V_PERCODE=' + Cookies.get('V_PERCODE'),
        print: 'true'
      }
    })
*/
import React from 'react'
import {history} from 'umi'
import ViewPdf from "@/components/View/ViewPdf";

const PdfPreview: React.FC<{}> = (Props: any) => {
  const {location} = history;
  const {path}: any = location.query;
  const {print}: any = location.query;

  return (
    <ViewPdf
      path={path}
      print={print}
    />
  )
};

export default PdfPreview
