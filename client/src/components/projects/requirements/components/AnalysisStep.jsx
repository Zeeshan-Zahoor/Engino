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

import { useRef, useState, useEffect } from "react";
import StepHeader from "./StepHeader";
import { isWorkspaceAdmin } from "../../../../utils/isWorkspaceAdmin";

const AnalysisStep = ({
  analysis,
  onClarify,
  onComplete,
  onRetry,
  loading,
  error
}) => {

  const questions = analysis?.questions || [];
  const isAdmin = isWorkspaceAdmin();
  const [analysisRound, setAnalysisRound] = useState(1);

  const [lastAnswer, setLastAnswer] = useState("");

  const [status, setStatus] = useState(
    analysis?.status === "clear"
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
  const clarificationInFlight = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(
      analysis?.status === "clear"
        ? "clear"
        : "needs_clarification"
    );
  }, [analysis?.status]);

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };


  const answeredCount = questions.filter(
    (_, index) => answers[index]?.trim()
  ).length;


  const allQuestionsAnswered =
    questions.length > 0 &&
    answeredCount === questions.length;


  const handleSubmitClarification = async () => {
    if (!allQuestionsAnswered || isAnalyzing) {
      return;
    }

    const answer = questions.map((question, index) => 
      `Question: ${question}\n Answer: ${answers[index]}`).join("\n\n")
    
      setLastAnswer(answer);
      await handleRetryClarification(answer);
  }

    const handleContinueToPlan = () => {
        if (status !== "clear") {
            return;
        }

        onComplete?.();
    };

  const handleRetryClarification = async (answer = lastAnswer) => {
      if (!answer || isAnalyzing || clarificationInFlight.current) {
        return;
      }

      clarificationInFlight.current = true;
      setIsAnalyzing(true);

      try {
        const response = await onClarify(answer);

        const nextAnalysis = response.analysis;

        setStatus(nextAnalysis.status);
        setAnswers({});
        setAnalysisRound((prev) => prev + 1);
      } catch {
        // store already handles error
      } finally {
        clarificationInFlight.current = false;
        setIsAnalyzing(false);
      }
    };


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

  if (loading) {
  return (
    <div>
      <StepHeader
        eyebrow="AI Analysis"
        title="Engino is analyzing your requirement"
        description="Engino is carefully reviewing the requirement to identify ambiguity and determine whether more information is needed."
        badge="Analyzing"
      />

      <div className="rounded-2xl border border-border bg-background p-10 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">

          {/* AI Icon */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/10" />

            <Sparkles
              size={32}
              className="relative animate-pulse"
            />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-text-primary">
            Analyzing your requirement...
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
            Engino is checking the requirement for ambiguity,
            missing information, and clarity.
          </p>

          {/* Loader */}
          <div className="mt-7 flex items-center gap-2">
            <Loader2
              size={16}
              className="animate-spin text-primary"
            />

            <span className="text-xs font-medium text-text-secondary">
              AI analysis in progress
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div>
      <StepHeader
        eyebrow="AI Analysis"
        title="We couldn't analyze the requirement"
        description="Engino ran into a problem while analyzing your requirement."
        badge="Analysis Failed"
      />

      <div className="rounded-2xl border border-danger/20 bg-background p-10 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">

          {/* Error Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertCircle size={34} />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-text-primary">
            AI analysis couldn't be completed
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
            Something went wrong while Engino was analyzing this
            requirement. Please try again.
          </p>

          {/* Error Message */}
          <div className="mt-6 w-full max-w-md rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-left">
            <p className="text-xs font-medium text-danger">
              {error}
            </p>
          </div>

          {/* Retry */}
          <button
            type="button"
            onClick={lastAnswer
                    ? () => handleRetryClarification()
                    : onRetry}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </div>
      </div>
    </div>
  );
}

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
                  {analysis?.confidence}%
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 size={21} />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${analysis?.confidence ?? 0}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-text-secondary">
              Analysis completed after {analysisRound} clarification{" "}
              {analysisRound === 1 ? "round" : "rounds"}.
            </p>
          </section>

          {/* Analysis history */}
          {/* {analysisHistory.length > 0 && (
            <AnalysisHistory
              history={analysisHistory}
            />
          )} */}

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
              {answeredCount}/{questions.length}
            </span>
          </div>

          <div className="space-y-4">
            {questions.map(
              (question, index) => {
                const value =
                  answers[index] || "";

                const answered = Boolean(
                  value.trim()
                );

                return (
                  <div
                    key={index}
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
                          htmlFor={`question-${index}`}
                          className="block text-sm font-semibold leading-6 text-text-primary"
                        >
                          {question}
                        </label>

                        <textarea
                          id={`question-${index}`}
                          value={value}
                          onChange={(event) =>
                            handleAnswerChange(
                              index,
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
            {answeredCount === questions.length
              ? "All questions answered."
              : "Answer all questions before submitting."}
          </div>

          {isAdmin && (
            <button
              type="button"
              disabled={!allQuestionsAnswered || isAnalyzing}
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
          )}
        </div>
      </div>
    </div>
  );
};


export default AnalysisStep;
