function StartScrean({ numQuest, dispatch }) {
  return (
    <div>
      <h2>Welcome to the React Quiz!</h2>
      <h3>{numQuest} questions to test your react mastery</h3>
      <button
        onClick={() => dispatch({ type: "start" })}
        className="btn btn-ui"
      >
        Lets Start
      </button>
    </div>
  );
}

export default StartScrean;
