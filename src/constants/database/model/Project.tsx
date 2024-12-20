import {IProject} from '../../../model';
import db from '../db';

export const createProject = (project: IProject): void => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO Projects (id, name, uri_video, uri_subtitle, date_upload, image_project, language) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        project.id,
        project.name,
        project.uri_video,
        project.uri_subtitle,
        project.date_upload,
        project.image_project,
        JSON.stringify(project.language),
      ],
      () => {
        console.log('Project added successfully');
      },
      error => {
        console.log('Error adding Project: ', error);
      },
    );
  });
};

export const getProject = (callback: (project: IProject[]) => void): void => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM Projects',
      [],
      (tx, results) => {
        const rows = results.rows;
        const projects: IProject[] = [];

        for (let index = 0; index < rows.length; index++) {
          const project = rows.item(index);
          projects.push({
            id: project.id,
            name: project.name,
            uri_video: project.uri_video,
            uri_subtitle: project.uri_subtitle,
            date_upload: project.date_upload,
            image_project: project.image_project,
            language: JSON.parse(project.language),
          });
        }
        callback(projects);
      },
      (tx, error) => {
        console.log('Error fetch project: ', error);
      },
    );
  });
};

export const getProjectById = async (id: number): Promise<IProject | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Projects WHERE id = ?',
        [id],
        (tx, results) => {
          if (results.rows.length > 0) {
            const project = results.rows.item(0);
            resolve({
              id: project.id,
              name: project.name,
              uri_video: project.uri_video,
              uri_subtitle: project.uri_subtitle,
              date_upload: project.date_upload,
              image_project: project.image_project,
              language: JSON.parse(project.language),
            });
          } else {
            resolve(null);
          }
        },
        (tx, error) => {
          console.log('Error fetching project by ID: ', error);
          reject(error);
        },
      );
    });
  });
};

export const updateProject = (project: IProject): void => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE Projects SET name = ?, date_upload = ? WHERE id = ?',
      [project.name, project.date_upload, project.id],
      () => {
        console.log('project update successfully');
      },
      (tx, error) => {
        console.log('Error update project: ', error);
      },
    );
  });
};

export const deleteProject = (id: number): void => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM Projects WHERE id = ?',
      [id],
      () => {
        console.log('project deleted successfully');
      },
      (tx, error) => {
        console.log('Error deleting project: ', error);
      },
    );
  });
};
