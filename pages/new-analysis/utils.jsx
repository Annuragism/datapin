import PDFMerger from "pdf-merger-js";
import { runAnalysis } from "../../services/services";
var merger = new PDFMerger()

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function niceBytes(x) {
  let l = 0, n = parseInt(x, 10) || 0;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

export const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginLeft: "30%",
  marginRight: "30%",
  padding: '12%',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

export const focusedStyle = {
  borderColor: '#2196f3'
};

export const acceptStyle = {
  borderColor: '#00e676'
};

export const rejectStyle = {
  borderColor: '#ff1744'
};

export function groupByFolder(files) {
  let folders = []

  for (let i in files) {
    let folderName = files[i].path.split("/")
    if (folderName.length === 1) {
      folders.push({ file: [files[i]], name: folderName[0], count: 1, size: files[i].size })
    } else {
      let find = folders.findIndex((el) => el?.name === folderName[1])
      console.log(find)
      if (find === -1) {
        folders.push({ file: [files[i]], name: folderName[1], count: 1, size: files[i].size })
      } else {
        folders[find].file.push(files[i])
        folders[find].count += 1
        folders[find].size += files[i].size
      }
    }
  }
  return folders
}

export async function mergePDF(list) {
  for (let i in list)
    await merger.add(list[i])
  const blob = await merger.saveAsBuffer("merge.pdf");
  return blob
}

export const runAnalysisApiCall = async (file, anlysisName) => {
  const formData = new FormData();

  formData.append("name", anlysisName);
  file.forEach((elem, index) => {
    for (let i = 0; i < elem.file.length; i++)
      formData.append(`file_${index}_${i}`, elem.file[i])
  })

  // export const runAnalysisApiCall = async (file,anlysisName) => {
  //   console.log(file, anlysisName);
  //  const formData = new FormData();
  //  formData.append("name", anlysisName);
  //  for (let i = 0; i < file.file.length; i++) {
  //    formData.append("documents", file.file[i]);
  //  }

  let analysisData = await runAnalysis(formData);
  return analysisData
}

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getEstimatedTime(bytes) {
  let getSizeInMB = bytes / (1024 * 1024);
  console.log(`Total File Size : ${getSizeInMB} MB`);
  let timeInSec = Math.floor((getSizeInMB * 10)+15); //addtional 15 sec
  let timeInminutes = Math.floor(timeInSec / 60);
  console.log(`Time in Miniuts ${timeInminutes}`);
  console.log(`Time in secons ${timeInSec}`);
  console.log(
    `${timeInminutes.toString().padStart(2, "0")} mins:${(timeInSec % 60)
      .toString()
      .padStart(2, "0")} secs`
  );
 let formatedTime = {
   mins: timeInminutes.toString().padStart(2, "0"),
   sec:
     timeInSec.toString().padStart(2, "0") < 15
       ? "15"
       : (timeInSec % 60).toString().padStart(2, "0"),
 };
  return formatedTime;
}



