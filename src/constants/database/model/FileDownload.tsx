import {IFileDownload} from '../../../model';
import db from '../db';

export const createFileDownload = (
  file_download: IFileDownload,
  file_id: number,
  imdb_id: number,
): void => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO Files (uid, uk, remaining, link, file_name, id_file, is_download, imdb_id) VALUES (?, ?, ?, ?,?,?,?, ?)',
      [
        file_download.uid,
        file_download.uk,
        file_download.remaining,
        file_download.link,
        file_download.file_name,
        file_id,
        file_download.is_download ? 1 : 0,
        imdb_id,
      ],
      () => {
        console.log('file download added successfully');
      },
      error => {
        console.log('Error adding file download: ', error);
      },
    );
  });
};

export const getFileDownload = (
  callback: (file_downloads: IFileDownload[]) => void,
): void => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM Files',
      [],
      (tx, results) => {
        const rows = results.rows;
        const fileDownloads: IFileDownload[] = [];

        for (let index = 0; index < rows.length; index++) {
          const fileDownload = rows.item(index);
          fileDownloads.push({
            uid: fileDownload.uid,
            uk: fileDownload.uk,
            file_name: fileDownload.file_name,
            id_file: fileDownload.id_file,
            imdb_id: fileDownload.imdb_id,
            link: fileDownload.link,
            remaining: fileDownload.remaining,
            is_download: fileDownload.is_download === 1,
          });
        }
        callback(fileDownloads);
      },
      (tx, error) => {
        console.log('Error fetch file download: ', error);
      },
    );
  });
};

export const getFileDownloadByFileId = async (
  file_id: number,
): Promise<IFileDownload | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Files WHERE id_file = ?',
        [file_id],
        (tx, results) => {
          if (results.rows.length > 0) {
            const fileDownload = results.rows.item(0);
            resolve({
              uid: fileDownload.uid,
              uk: fileDownload.uk,
              file_name: fileDownload.file_name,
              id_file: fileDownload.id_file,
              imdb_id: fileDownload.imdb_id,
              link: fileDownload.link,
              remaining: fileDownload.remaining,
              is_download: fileDownload.is_download === 1,
            });
          } else {
            resolve(null);
          }
        },
        (tx, error) => {
          console.log('Error fetching file download by ID: ', error);
          reject(error);
        },
      );
    });
  });
};

export const updateFileDownload = (
  file_download: IFileDownload,
  file_id: number,
): void => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE Files SET link = ?, is_download = ? WHERE id_file = ?',
      [file_download.is_download, file_download.is_download ? 1 : 0, file_id],
      () => {
        console.log('File download update successfully');
      },
      (tx, error) => {
        console.log('Error update file download: ', error);
      },
    );
  });
};

export const deleteFileDownload = (id_file: number): void => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM Files WHERE id_file = ?',
      [id_file],
      () => {
        console.log('File download deleted successfully');
      },
      (tx, error) => {
        console.log('Error deleting file download: ', error);
      },
    );
  });
};
