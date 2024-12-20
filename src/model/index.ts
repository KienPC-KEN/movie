export interface ILanguage {
  language_code: string;
  language_name: string;
  status: boolean;
}

export interface IFileSubTitleAndUploadDate {
  file_subtile: IFiles;
  upload_date: string;
}

export interface ISubtitle {
  id: number;
  type: string;
  attributes: IAttributesSubtitle;
}

export interface IAttributesSubtitle {
  subtitle_id: number;
  language: string;
  new_download_count: number;
  fps: number;
  upload_date: string;
  release: string;
  uploader:IUploader;
  feature_details: IFeatureDetails;
  related_links: IRelatedLinks[];
  files: IFiles[];
}

export interface IUploader {
  uploader_id: number;
  name: string;
  rank: string;
}
export interface IFeatureDetails{
  feature_id: number;
  feature_type: string;
  year: number;
  title: string;
  movie_name: string;
  imdb_id: number;
}

export interface IRelatedLinks {
  label: string;
  url: string;
  img_url: string;
}

export interface IFiles{
  file_id: number;
  cd_number: number;
  file_name: string;
}

export interface IMovie {
  id: string;
  attributes: IAttributesMovie;
  type: string;
  isFavorite?: boolean;
}


export interface IAttributesMovie {
  imdb_id: number;
  title: string;
  img_url: string;
  year: string;
}


export interface IFileDownload {
  id_file: number;
  uid: number;
  uk: string;
  remaining: number;
  link: string;
  file_name: string;
  is_download?: boolean;
  imdb_id: number
}

export interface parsedSubtitles  {
  id: string;
  startTime: string;
  startSeconds: number;
  endTime: string;
  endSeconds: number;
  text: string;
};

export interface IProject {
  id: number;
  name: string;
  uri_video: string;
  uri_subtitle: string;
  date_upload: string;
  image_project: string;
  language: ILanguage
}