import {adminPaths, commonPaths, micUserPaths, qcManagerPaths, teacherPaths} from './pathLists';

export const getOptions = role => {
  const neededPaths = ['superAdmin', 'admin'].includes(role)
    ? adminPaths
    : role === 'teacher'
    ? teacherPaths
    : role === 'QC manager'
    ? qcManagerPaths
    : micUserPaths;
  return [
    ...Object.entries(neededPaths).map(([key, value]) => {
      return {
        label: value,
        value: key
      };
    }),
    ...Object.entries(commonPaths).map(([key, value]) => {
      return {
        label: value,
        value: key
      };
    })
  ];
};
