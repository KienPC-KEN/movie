import axios from 'axios';
import {
  API_KEY,
  BASE_URL,
  PATH_DOWNLOAD_FILE,
  PATH_LANGUAGE,
  PATH_SEARCH,
  PATH_SUBTITLE,
  USER_AGENT,
} from './type';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'User-Agent': USER_AGENT,
    'Api-Key': API_KEY,
    Accept: '*/*',
  },
});

export const fetchDataSearchApi = async (query: string) => {
  try {
    return await instance
      .get(`${BASE_URL}${PATH_SEARCH}${query}`)
      .then(res => res.data.data)
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

export const fetchDataLanguageApi = async () => {
  try {
    return await instance
      .get(`${BASE_URL}${PATH_LANGUAGE}`)
      .then(res => res.data.data)
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

export const fetchSearchSubtitleApi = async (imdb_id: number) => {
  try {
    return await instance
      .get(`${BASE_URL}${PATH_SUBTITLE}${imdb_id}`)
      .then(res => res.data.data)
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

export const downloadFileApi = async (file_id: number) => {
  try {
    return await instance
      .post(`${BASE_URL}${PATH_DOWNLOAD_FILE}`, {file_id})
      .then(res => res.data)
      .catch(error => console.log(error));
  } catch (error) {
    console.error(error);
  }
};
