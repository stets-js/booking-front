import React, {useEffect} from 'react';
import Select from 'react-select';
import styles from './Helper.module.scss';

import {useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import getPathDescription from '../../helpers/idea/getPathDescription';
import {getOptions} from '../../helpers/idea/getOptions';

export default function SelectPath({selectedPath, setSelectedPath}) {
  const location = useLocation();
  const userRole = useSelector(state => state.auth.user.role);
  const options = getOptions(userRole);

  useEffect(() => {
    setSelectedPath(getPathDescription(location.pathname, userRole));
  }, [location]);
  
  return (
    <Select
      className={styles.form__select}
      options={options}
      value={options.filter(el => el.label === selectedPath)[0]}
      onChange={e => setSelectedPath(e.label)}></Select>
  );
}
