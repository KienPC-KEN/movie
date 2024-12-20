import {IProject} from '../../../model';
import {createProject, deleteProject, getProject, getProjectById, updateProject} from '../model/Project';

export const addProject = (project: IProject): void => {
  createProject(project);
};

export const fetchProject = (
  callback: (projects: IProject[]) => void,
): void => {
  getProject(callback);
};

export const fetchProjectByFileId = async (
  id: number,
): Promise<IProject | null> => {
  try {
    return await getProjectById(id);
  } catch (error) {
    console.error('Error fetching project by id: ', error);
    return null;
  }
};

export const modifyProject = (
  project: IProject,
): void => {
  updateProject(project);
};

export const removeProject = (id: number): void => {
  deleteProject(id);
};
