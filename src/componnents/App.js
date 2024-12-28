import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScrean from "./StartScrean";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FInishedScreen from "./FInishedScreen";
import Timer from "./Timer";
import Footer from "./Footer";


const SECS_PER_QUESTION= 30
const initialState = {
  question: [],
  status: "Loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        question: action.payload,
        status: "Ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "Error",
      };
    case "start":
      return {
        ...state,
        status: "Active",
        secondsRemaining: state.question.length * SECS_PER_QUESTION
      };
    case "newAnswer":
      const currQuestion = state.question.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currQuestion.correctOption
            ? state.points + currQuestion.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        //  ...state,
        //  status : 'Active',
        //   index: 0,
        //   answer: null,
        //   points: 0,
        ...initialState,
        question: state.question,
        status: "Ready",
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status : state.secondsRemaining === 0 ? "finished" : state.status
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    { question, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuest = question.length;
  const maxPoint = question.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "Loading" && <Loader />}
        {status === "Error" && <Error />}
        {status === "Ready" && (
          <StartScrean numQuest={numQuest} dispatch={dispatch} />
        )}
        {status === "Active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuest}
              points={points}
              maxPoint={maxPoint}
              answer={answer}
            />
            <Questions
              question={question[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining= {secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuest={numQuest}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FInishedScreen
            maxPoint={maxPoint}
            points={points}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
