import React from "react";
import QuizList from "../course/quiz/QuizList";
import { useLocation, useParams } from "react-router-dom";
import QuizOverview from "../course/quiz/QuizOverview";

const Questions = () => {
  const { testId } = useParams();
  const { state } = useLocation();
  return (
    <div>
      <QuizOverview data={state} isFromTestSeries={true} />
      <QuizList quizId={testId} />
    </div>
  );
};

export default Questions;
