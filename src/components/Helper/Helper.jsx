import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import classNames from 'classnames';

import styles from './Helper.module.scss';

import {useFooterRef} from '../FooterProvider/FooterProvider';

import Form from './FormComponent';

export default function Helper() {
  const buttonRef = useRef(null);
  const {footerRef, isFooterReady} = useFooterRef();
  const location = useLocation();
  const [bugOrIdea, setBugOrIdea] = useState(null); // 1 is bug, 2 is idea, null is empty
  const updateButtonPosition = () => {
    try {
      const button = buttonRef.current;
      const footer = footerRef.current;
      if (button && footer) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (footerRect.top - 190 - viewportHeight < 1) {
    
          button.style.bottom = `${Math.abs(footerRect.top - 190 - viewportHeight) + 20}px`;
        } else {
          button.style.bottom = '20px';
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateButtonPosition();
    window.scrollBy(0, 1);
  }, [location.pathname]);

  useEffect(() => {
    updateButtonPosition(); // Initial check

    window.addEventListener('scroll', updateButtonPosition);
    window.addEventListener('resize', updateButtonPosition);

    return () => {
      window.removeEventListener('scroll', updateButtonPosition);
      window.removeEventListener('resize', updateButtonPosition);
    };
  }, [footerRef]);

  return (
    <div ref={buttonRef} className={styles.helper}>
      ?
      <div className={classNames(styles.tooltip, bugOrIdea ? styles.tooltip__alwaysVisible : '')}>
        {bugOrIdea &&
          (bugOrIdea === 1 ? (
            <Form
              bugOrIdea={bugOrIdea}
              title="Знайдено баг!"
              describeIt="Опишіть баг"
              description={'На якій сторінці ви його знайшли?'}
              prevStep={() => {
                setBugOrIdea(null);
              }}></Form>
          ) : (
            <Form
              bugOrIdea={bugOrIdea}
              title="Є ідея!"
              describeIt="Опишіть вашу ідею"
              description={'Як ви уявляєте кінцевий результат? (можна залишати посилання)'}
              prevStep={() => {
                setBugOrIdea(null);
              }}
            />
          ))}
        {!bugOrIdea && (
          <>
            <button className={styles.button} onClick={() => setBugOrIdea(1)}>
              Знайдено баг!
            </button>
            <button className={styles.button} onClick={() => setBugOrIdea(2)}>
              Є ідея!
            </button>
          </>
        )}
      </div>
    </div>
  );
}
