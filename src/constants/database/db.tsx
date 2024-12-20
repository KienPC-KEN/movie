import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'moviesubtitle.db',
    location: 'default',
  },
  () => {
    console.log('Database opened');
  },
  error => {
    console.log('Error opening database: ', error);
  },
);

export const createTablesLanguage = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Languages (
          language_code TEXT PRIMARY KEY NOT NULL,
          language_name TEXT NOT NULL,
          status INTEGER NOT NULL
        );`,
      [],
      () => {
        console.log('Table created language successfully');
      },
      error => {
        console.log('Error creating language table: ', error);
      },
    );
  });
};

export const createTableMovie = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Movies (
        id TEXT PRIMARY KEY NOT NULL,
        attributes TEXT NOT NULL,
        type TEXT NOT NULL,
        isFavorite INTEGER NOT NULL
      );`,
      [],
      () => {
        console.log('Table created Movies successfully');
      },
      error => {
        console.log('Error creating table Movies: ', error);
      },
    );
  });
};

export const createTableFileDownload = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Files (
        id_file INTEGER PRIMARY KEY NOT NULL,
        uk TEXT NOT NULL,
        remaining INTEGER NOT NULL,
        link TEXT NOT NULL,
        file_name TEXT NOT NULL,
        uid INTEGER NOT NULL,
        is_download INTEGER NOT NULL,
        imdb_id INTEGER NOT NULL
      );`,
      [],
      () => {
        console.log('Table created file download successfully');
      },
      error => {
        console.log('Error creating table file download: ', error);
      },
    );
  });
};

export const createTableProject = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Projects (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        uri_video TEXT NOT NULL,
        uri_subtitle TEXT NOT NULL,
        date_upload TEXT NOT NULL,
        image_project TEXT NOT NULL,
        language TEXT NOT NULL
      );`,
      [],
      () => {
        console.log('Table created project successfully');
      },
      error => {
        console.log('Error creating table project: ', error);
      },
    );
  });
};

export default db;
