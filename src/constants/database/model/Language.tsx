import {ILanguage} from '../../../model';
import db from '../db';

// Thêm một ngôn ngữ
export const addLanguage = (language: ILanguage): void => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO Languages (language_code, language_name, status) VALUES (?, ?, ?)',
      [
        language.language_code,
        language.language_name,
        language.status ? true : false,
      ],
      () => {
        console.log(`Language ${language.language_name} added successfully`);
      },
      (tx, error) => {
        console.log(`Error adding language ${language.language_name}: `, error);
      },
    );
  });
};

export const getLanguages = (
  callback: (languages: ILanguage[]) => void,
): void => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM Languages',
      [],
      (tx, results) => {
        const rows = results.rows;
        const languages: ILanguage[] = [];

        for (let i = 0; i < rows.length; i++) {
          const language = rows.item(i);
          languages.push({
            language_code: language.language_code,
            language_name: language.language_name,
            status: language.status === 1,
          });
        }

        callback(languages);
      },
      (tx, error) => {
        console.log('Error fetching languages: ', error);
      },
    );
  });
};

export const updateLanguage = (language: ILanguage): void => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE Languages SET status = ? WHERE language_code = ?',
      [ language.status ? 1 : 0, language.language_code],
      () => {
        console.log(`Language ${language.language_name} updated successfully`);
      },
      (tx, error) => {
        console.log(
          `Error updating language ${language.language_name}: `,
          error,
        );
      },
    );
  });
};
