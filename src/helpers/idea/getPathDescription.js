import {adminPaths, commonPaths, micUserPaths, qcManagerPaths, teacherPaths} from './pathLists';

const getPathDescription = (path, role) => {
  let paths;

  switch (role) {
    case 'administrator':
    case 'superAdmin':
      paths = adminPaths;
      break;
    case 'teacher':
      paths = teacherPaths;
      break;
    case 'QC manager':
      paths = qcManagerPaths;
      break;
    case 'MIC user':
      paths = micUserPaths;
      break;
    default:
      paths = commonPaths;
  }

  console.log(path);
  // Ищем соответствие по пути, используя регулярное выражение
  const modifiedKey = path.replace(/\d+/, ':teacherId');
  console.log(modifiedKey);
  console.log(paths[modifiedKey]);
  if (modifiedKey) {
    return paths[modifiedKey];
  }

  return 'Неизвестный путь';
};

export default getPathDescription;
