import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSurveyCompleted } from '../../../redux/auth-reducers';
import { completeSurvey } from "../../../helpers/appointment/appointment";
import "./SurveyModal.scss";

const SurveyModal = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.role);
  const userId = useSelector((state) => state.auth.user.id);
  const userName = useSelector((state) => state.auth.user.name);

  const questions = {
    2: [
      { question: "Наскільки легко вам виставляти графік у додатку?", scale: true },
      { question: "Наскільки зручно вам відслідковувати записи клієнтів?", scale: true },
      { question: "Наскільки зручно вам вести звіти після консультацій?", scale: true },
      { question: "Що б ви хотіли змінити у функціоналі ведення звітів?", scale: false },
      { question: "Які ще функції або зміни зробили б вашу роботу зручнішою та ефективнішою?", scale: false }
    ],
    3: [
      { question: "Як ви оцінюєте ефективність додатку у вашій роботі?", scale: true },
      { question: "Чи є у вас пропозиції щодо оптимізації процесів у додатку?", scale: false },
      { question: "Чи задовольняє вас звітність, яку генерує додаток?", scale: false },
      { question: "Які функції або зміни, на вашу думку, покращили б роботу вашої команди?", scale: false },
      { question: "Ваші зауваження та пропозиції щодо подальшого розвитку додатку.", scale: false }
    ],
    4: [
      { question: "Наскільки ви задоволені функціональністю додатку?", scale: true },
      { question: "Чи виникають у вас труднощі з використанням додатку? Якщо так, то які саме?", scale: false },
      { question: "Які функції ви хотіли б додати або змінити в додатку?", scale: false },
      { question: "Як би ви оцінили зручність інтерфейсу додатку?", scale: true },
      { question: "Ваші пропозиції та побажання щодо покращення додатку.", scale: false }
    ],
    5: [
      { question: "Чи задовольняє вас робота з додатком?", scale: true },
      { question: "Чи виникають у вас труднощі при роботі з додатком? Якщо так, то які?", scale: false },
      { question: "Які функції ви хотіли б додати або змінити в додатку?", scale: false },
      { question: "Як би ви оцінили зручність інтерфейсу додатку?", scale: true },
      { question: "Ваші пропозиції та побажання щодо покращення додатку.", scale: false }
    ]
  };

  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    for (let i = 1; i <= 5; i++) {
      if (!answers[`question${i}`]) {
        newErrors[`question${i}`] = 'This field is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const response = {
      respondent_role: userRole,
      respondent_id: userId,
      respondent_name: userName,
      ...answers
    };

    try {
      await completeSurvey(response);
      dispatch(setSurveyCompleted(true));
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers({
      ...answers,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: value ? '' : 'This field is required',
    });
  };

  const handleSkip = () => {
    dispatch(setSurveyCompleted(true));
  };

  return (
    <div className="modal">
      <h1 className='survey__header'>Привіт, {userName}!</h1>
      <p className='survey__text'>Для продовження роботи з Booking, просимо відповісти на наступні питання: </p>
      <form onSubmit={handleSubmit}>
        {questions[userRole] && questions[userRole].map((question, index) => (
          <div className='question__wrapper' key={index}>
            <label>{question.question}</label>
            {question.scale ? (
              <div className='radio__wrapper'>
                {[1, 2, 3, 4, 5].map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name={`question${index + 1}`}
                      value={option}
                      checked={answers[`question${index + 1}`] === String(option)}
                      onChange={handleChange}
                      required
                    />
                    {option}
                  </label>
                ))}
                {errors[`question${index + 1}`] && <p className="error">{errors[`question${index + 1}`]}</p>}
              </div>
            ) : (
              <>
                <textarea
                  className='survey__comment'
                  name={`question${index + 1}`}
                  value={answers[`question${index + 1}`]}
                  onChange={handleChange}
                  rows={3}
                  cols={50}
                  required
                />
                {errors[`question${index + 1}`] && <p className="error">{errors[`question${index + 1}`]}</p>}
              </>
            )}
          </div>
        ))}
        <button className='survey__btn' type="submit">Submit</button>
        {userRole === 2 && (
          <button className='survey__btn' type="button" onClick={handleSkip}>Skip</button>
        )}
        <p className='survey__text'>Дякуємо за Вашу роботу і те що робите Booking краще!</p>
      </form>
    </div>
  );
};

export default SurveyModal;
