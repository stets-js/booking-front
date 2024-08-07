import React, { useState } from 'react';
import { success, error } from '@pnotify/core';
import styles from './Helper.module.scss';
import leftArrow from './left-arrow.svg';
import UploadLink from './UploadLink';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import getPathDescription from '../../helpers/idea/getPathDescription';
import SelectPath from './SelectPath';
import { createBugOrIdea } from '../../helpers/idea/bugOrIdea';

export default function Form({ bugOrIdea = 1, title, describeIt, description, prevStep }) {
  const location = useLocation();
  const userRole = useSelector(state => state.auth.user.role);
  const userId = useSelector(state => state.auth.user.id);
  const userName = useSelector(state => state.auth.user.name);
  const [selectedPath, setSelectedPath] = useState(getPathDescription(location.pathname, userRole));

  // Initial data state
  const [data, setData] = useState({
    type: bugOrIdea === 1 ? 'bug' : 'idea',
    title: '',
    description: '',
    userId: userId,
    links: [],
    selectedPath,
    userName: userName,
    location: location.pathname
  });

  // Handle form submission
  const submit = async (e) => {
    e.preventDefault();
    
    if (
      (data.type === 'bug' && data.title) ||
      (data.type === 'idea' && data.title && data.description)
    ) {
      try {
        await createBugOrIdea(data);
        success('Успішно надіслано');
        prevStep();
      } catch (error) {
        error('Щось пішло не так');
      }
    } else {
      error('Будь ласка, заповніть всі необхідні поля');
    }
  };

  return (
    <form onSubmit={submit}>
      <div className={styles.form}>
        <div className={styles.form__title__wrapper}>
          <button
            type="button"
            className={styles.form__back}
            onClick={() => prevStep()}
          >
            <img src={leftArrow} alt={'<-'} width={32} height={32} />
          </button>
          <span className={styles.form__title}> {title}</span>
        </div>

        <div className={styles.form__input__wrapper}>
          <label htmlFor="Name" className={styles.form__label}>
            Ваше Ім'я
          </label>
          <input
            id="Name"
            value={data.userName}
            onChange={e => setData(prev => ({ ...prev, userName: e.target.value }))}
            className={styles.form__textarea}
          />
        </div>

        <div className={styles.form__input__wrapper}>
          <label htmlFor="describeIT" className={styles.form__label}>
            {describeIt}
          </label>
          <textarea
            id="describeIT"
            value={data.title}
            onChange={e => setData(prev => ({ ...prev, title: e.target.value }))}
            required
            className={styles.form__textarea}
          />
        </div>

        {bugOrIdea !== 1 ? (
          <div className={styles.form__input__wrapper}>
            <label htmlFor="description" className={styles.form__label}>
              {description}
            </label>
            <textarea
              id="description"
              value={data.description}
              onChange={e => setData(prev => ({ ...prev, description: e.target.value }))}
              required
              className={styles.form__textarea}
            />
          </div>
        ) : (
          // <SelectPath selectedPath={selectedPath} setSelectedPath={setSelectedPath} />
          null
        )}

        <UploadLink data={data} setData={setData} />
        
        <button
          type="submit"
          className={styles.button}
        >
          Відправити
        </button>
      </div>
    </form>
  );
}
