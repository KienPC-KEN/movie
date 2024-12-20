import {ILanguage, IProject} from '../model';
import RNFS from 'react-native-fs';

export const formattedDate = (upload_date: any) => {
  const date = new Date(upload_date);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const sortLanguages = (languages: ILanguage[]): ILanguage[] => {
  return [...languages].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status ? -1 : 1;
  });
};

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const timeToMilliseconds = (timeStr: string) => {
  const [hours, minutes, seconds] = timeStr.split(':');
  const [sec, millisec] = seconds.split(',');
  return +hours * 3600 * 1000 + +minutes * 60 * 1000 + +sec * 1000 + +millisec;
};

export const generateUniqueId = () => {
  return Math.floor(Math.random() * 1000000) + Date.now();
};

export const sortByDate = (data: IProject[]) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.date_upload).getTime();
    const dateB = new Date(b.date_upload).getTime();
    return dateB - dateA;
  });
};
export const convertSRTtoVTT = (srtContent: string): string => {
  let vttContent = "WEBVTT\n\n";
  
  const lines = srtContent.split('\n');
  lines.forEach(line => {
    if (line.match(/^\d+$/)) {
      return;
    }
    if (line.includes('-->')) {
      line = line.replace(/,/g, '.');
    }
    vttContent += line + '\n';
  });

  return vttContent.trim();
};

export const downloadAndSaveFile = async (fileUrl: string) => {
  try {
    const fileName = decodeURIComponent(
      fileUrl.substring(fileUrl.lastIndexOf('/') + 1),
    );

    const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.downloadFile({
      fromUrl: fileUrl,
      toFile: localFilePath,
    }).promise;

    console.log('Download Success', `File saved to: ${localFilePath}`);
  } catch (error) {
    console.log('Download Error', `Failed to download file: ${error}`);
  }
};