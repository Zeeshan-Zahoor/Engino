import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Info,
  Loader2,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

import StepHeader from "./StepHeader";


const AnalysisStep = ({
  analysis,
  questions = [],
  onComplete,
}) => {


  const [analysisRound, setAnalysisRound] = useState(1);

  const [status, setStatus] = useState(
    analysis?.status === "Clear"
      ? "clear"
      : "needs_clarification"
  );

  const [answers, setAnswers] = useState(
    questions.reduce((acc, question) => {
      acc[question.id] = question.answer || "";
      return acc;
    }, {})
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [clarificationQuestions, setClarificationQuestions] =
    useState(questions);

  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const [analysisHistory, setAnalysisHistory] = useState([]);


  /*
   * --------------------------------------------------
   * QUESTION ANSWERS
   * --------------------------------------------------
   */

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };


  const answeredCount = clarificationQuestions.filter(
    (question) => answers[question.id]?.trim()
  ).length;


  const allQuestionsAnswered =
    clarificationQuestions.length > 0 &&
    answeredCount === clarificationQuestions.length;


  const handleSubmitClarification = () => {
    if (!allQuestionsAnswered || isAnalyzing) {
      return;
    }

    const currentAnswers = clarificationQuestions.map(
      (question) => ({
        question: question.question,
        answer: answers[question.id],
      })
    );

    setSubmittedAnswers((prev) => [
      ...prev,
      {
        round: analysisRound,
        answers: currentAnswers,
      },
    ]);

    setIsAnalyzing(true);

    setTimeout(() => {
      const nextRound = analysisRound + 1;

      /*
       * Round 3 becomes clear.
       */
      if (nextRound >= 3) {
        setStatus("clear");

        setAnalysisHistory((prev) => [
          ...prev,
          {
            round: nextRound,
            status: "clear",
          },
        ]);

        setIsAnalyzing(false);
        return;
      }

      /*
       * Still unclear.
       *
       * Generate another static question.
       */
      const nextQuestion = {
        id: `round-${nextRound}-question-1`,
        question:
          nextRound === 2
            ? "How long should an authenticated user remain signed in before their session expires?"
            : "Should users receive any notification when their session expires?",
        answer: "",
        status: "pending",
      };

      setAnalysisRound(nextRound);

      setClarificationQuestions([nextQuestion]);

      setAnswers({
        [nextQuestion.id]: "",
      });

      setAnalysisHistory((prev) => [
        ...prev,
        {
          round: nextRound,
          status: "needs_clarification",
        },
      ]);

      setIsAnalyzing(false);
    }, 1400);
  };


  /*
   * --------------------------------------------------
   * CLEAR → AI PLAN
   * --------------------------------------------------
   */

    const handleContinueToPlan = () => {
        if (status !== "clear") {
            return;
        }

        onComplete?.();
    };


  /*
   * --------------------------------------------------
   * ANALYZING STATE
   * --------------------------------------------------
   */

  if (isAnalyzing) {
    return (
      <div>
        <StepHeader
          eyebrow="AI Analysis"
          title="Engino is analyzing your clarification"
          description="Engino is reviewing your answers and checking whether the requirement is now sufficiently clear."
          badge={`Analysis Round ${analysisRound + 1}`}
        />

        <div className="rounded-2xl border border-border bg-background p-10 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Loader2
                size={26}
                className="animate-spin"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text-primary">
              Reviewing your answers...
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Engino is checking whether the clarification resolves
              the ambiguity or whether another question is necessary.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-text-secondary">
              <Sparkles size={14} className="text-primary" />
              AI analysis in progress
            </div>
          </div>
        </div>
      </div>
    );
  }


  /*
   * --------------------------------------------------
   * CLEAR STATE
   * --------------------------------------------------
   */

  if (status === "clear") {
    return (
      <div>
        <StepHeader
          eyebrow="AI Analysis"
          title="The requirement is clear"
          description="Engino has enough information to create a reliable engineering plan."
          badge="Clear"
        />

        <div className="space-y-5">
          {/* Success */}
          <section className="rounded-2xl border border-success/20 bg-success/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success text-white">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-success">
                  Analysis complete
                </p>

                <h2 className="mt-1 text-lg font-semibold text-text-primary">
                  Requirement is ready for planning
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Engino has determined that the available information
                  is sufficient to generate an engineering plan without
                  making additional product assumptions.
                </p>
              </div>
            </div>
          </section>

          {/* Clarity */}
          <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-secondary">
                  Final clarity
                </p>

                <p className="mt-1 text-2xl font-bold text-text-primary">
                  96%
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 size={21} />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: "96%" }}
              />
            </div>

            <p className="mt-3 text-xs text-text-secondary">
              Analysis completed after {analysisRound} clarification{" "}
              {analysisRound === 1 ? "round" : "rounds"}.
            </p>
          </section>

          {/* Analysis history */}
          {analysisHistory.length > 0 && (
            <AnalysisHistory
              history={analysisHistory}
            />
          )}

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-border pt-5">
            <button
              type="button"
              onClick={handleContinueToPlan}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Continue to AI Plan
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    );
  }


  /*
   * --------------------------------------------------
   * NEEDS CLARIFICATION STATE
   * --------------------------------------------------
   */

  return (
    <div>
      <StepHeader
        eyebrow="AI Analysis"
        title="More information is needed"
        description="Engino found some ambiguity in the requirement. Answer the questions below so it can analyze the requirement again."
        badge={`Round ${analysisRound}`}
      />

      <div className="space-y-5">
        {/* Analysis result */}
        <section className="rounded-2xl border border-warning/20 bg-warning/10 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <AlertCircle size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-warning">
                Needs clarification
              </p>

              <h2 className="mt-1 text-lg font-semibold text-text-primary">
                Engino needs more information
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                The requirement cannot safely move to planning yet.
                Answer the questions below and Engino will analyze it
                again.
              </p>
            </div>
          </div>
        </section>

        {/* AI understanding */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
              <FileSearch size={18} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-text-primary">
                AI Analysis
              </h2>

              <p className="text-xs text-text-secondary">
                What Engino identified
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-surface p-4">
            <p className="text-sm leading-6 text-text-primary">
              {analysis?.summary ||
                "Engino found information that needs to be clarified before implementation planning."}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
            <RefreshCw size={14} />
            Analysis will run again after your answers.
          </div>
        </section>

        {/* Questions */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
                <MessageSquare size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-text-primary">
                  Clarification Questions
                </h2>

                <p className="text-xs text-text-secondary">
                  Answer all questions to continue.
                </p>
              </div>
            </div>

            <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary">
              {answeredCount}/{clarificationQuestions.length}
            </span>
          </div>

          <div className="space-y-4">
            {clarificationQuestions.map(
              (question, index) => {
                const value =
                  answers[question.id] || "";

                const answered = Boolean(
                  value.trim()
                );

                return (
                  <div
                    key={question.id}
                    className={`rounded-xl border p-5 transition ${
                      answered
                        ? "border-success/30 bg-success/10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          answered
                            ? "bg-success text-white"
                            : "bg-background text-text-secondary"
                        }`}
                      >
                        {answered ? (
                          <CheckCircle2 size={15} />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <label
                          htmlFor={`question-${question.id}`}
                          className="block text-sm font-semibold leading-6 text-text-primary"
                        >
                          {question.question}
                        </label>

                        <textarea
                          id={`question-${question.id}`}
                          value={value}
                          onChange={(event) =>
                            handleAnswerChange(
                              question.id,
                              event.target.value
                            )
                          }
                          rows={3}
                          placeholder="Enter your answer..."
                          className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* Principle */}
        <section className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary-light p-4">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-primary"
          />

          <p className="text-sm leading-6 text-text-primary">
            Engino will continue asking questions whenever important
            information is still missing. Planning only becomes
            available when the requirement is sufficiently clear.
          </p>
        </section>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-text-secondary">
            {answeredCount === clarificationQuestions.length
              ? "All questions answered."
              : "Answer all questions before submitting."}
          </div>

          <button
            type="button"
            disabled={!allQuestionsAnswered}
            onClick={handleSubmitClarification}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              allQuestionsAnswered
                ? "bg-primary text-white hover:bg-primary-dark"
                : "cursor-not-allowed bg-surface text-text-secondary"
            }`}
          >
            Submit & Re-analyze
            <RefreshCw size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};


/*
 * --------------------------------------------------
 * ANALYSIS HISTORY
 * --------------------------------------------------
 */

const AnalysisHistory = ({
  history,
}) => {
  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-text-primary">
          Analysis History
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Previous AI analysis rounds for this requirement.
        </p>
      </div>

      <div className="space-y-3">
        {history.map((item) => {
          const isClear =
            item.status === "clear";

          return (
            <div
              key={item.round}
              className="flex items-center gap-3 rounded-xl bg-surface p-4"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isClear
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {isClear ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Analysis Round {item.round}
                </p>

                <p className="mt-0.5 text-xs text-text-secondary">
                  {isClear
                    ? "Requirement is clear"
                    : "Additional clarification required"}
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  isClear
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {isClear
                  ? "Clear"
                  : "Needs Clarification"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};


export default AnalysisStep;