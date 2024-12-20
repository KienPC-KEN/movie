import {IFileDownload} from '../../../model';
import {
  createFileDownload,
  deleteFileDownload,
  getFileDownload,
  getFileDownloadByFileId,
  updateFileDownload,
} from '../model/FileDownload';

export const addFileDownload = (
  file_download: IFileDownload,
  file_id: number,
  imdb_id: number

): void => {
  createFileDownload(file_download, file_id,imdb_id);
};

export const fetchFileDownload = (
  callback: (file_downloads: IFileDownload[]) => void,
): void => {
  getFileDownload(callback);
};

export const fetchFileDownloadByFileId = async (
  file_id: number,
): Promise<IFileDownload | null> => {
  try {
    return await getFileDownloadByFileId(file_id);
  } catch (error) {
    console.error('Error fetching file download by id: ', error);
    return null;
  }
};

export const modifyFileDownload = (
  file_download: IFileDownload,
  file_id: number,
): void => {
  updateFileDownload(file_download, file_id);
};

export const removeFileDownload = (file_id: number): void => {
  deleteFileDownload(file_id);
};
