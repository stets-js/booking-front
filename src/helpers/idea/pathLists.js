const adminPaths = {
  '/admin/superAdmin': 'Сторінка супер адміністратора',
  '/admin/users': 'Сторінка користувачів',
  '/admin/courses': 'Сторінка курсів',
  '/admin/appointments': 'Сторінка призначень',
  '/admin/available': 'Сторінка доступних менторів',
  '/admin/subgroups': 'Сторінка підгруп',
  '/admin/replacements': 'Сторінка замін',
  '/admin/lessons': 'Сторінка уроків',
  '/admin/spreadsheet': 'Сторінка таблиць',
  '/admin/teacher': 'Сторінка вчителя',
  '/admin/teacher/calendar/:teacherId': 'Календар вчителя',
  '/admin/teacher/mySubgroups/:teacherId': 'Мої підгрупи',
  '/admin/teacher/addMySubgroup/:teacherId': 'Додати мою підгрупу',
  '/admin/teacher/editMySubgroup/:teacherId': 'Редагувати мою підгрупу',
  '/admin/teacher/info/:teacherId': 'Інформація вчителя',
  '/admin/teacher/myLesson/:teacherId': 'Мої уроки',
  '/admin/teacher/statistics/:teacherId': 'Статистика вчителя',
  '/admin/teacher/report/:teacherId': 'Звіт вчителя'
};

const teacherPaths = {
  '/teacher': 'Сторінка вчителя',
  '/teacher/addMySubgroup': 'Додати мою підгрупу',
  '/teacher/mySubgroups': 'Мої підгрупи',
  '/teacher/info': 'Інформація',
  '/teacher/statistics': 'Статистика',
  '/teacher/editMySubgroup': 'Редагувати мою підгрупу',
  '/teacher/report': 'Звіт'
};

const qcManagerPaths = {
  '/QCManager': 'Сторінка QC менеджера'
};

const micUserPaths = {
  '/MIC': 'Головна сторінка MIC',
  '/appointments': 'Сторінка призначень',
  '/mentors': 'Сторінка менторів',
  '/MIC/teacher': 'Сторінка вчителя',
  '/MIC/teacher/mySubgroups/:teacherId': 'Мої підгрупи'
};

const commonPaths = {
  '/resetPassword': 'Скидання пароля',
  '/': 'Головна сторінка'
};

export {commonPaths, micUserPaths, qcManagerPaths, teacherPaths, adminPaths};
