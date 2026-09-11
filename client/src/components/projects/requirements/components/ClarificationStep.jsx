import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

import { useState } from "react";
import StepHeader from "./StepHeader";

const ClarificationStep = ({
  questions = [],
  onContinue,
}) => {
  const [answers, setAnswers] = useState(
    questions.reduce((acc, question) => {
      acc[question.id] = question.answer || "";
      return acc;
    }, {})
  );

  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    setSubmitted(false);
  };

  const answeredCount = questions.filter(
    (question) => answers[question.id]?.trim()
  ).length;

  const allAnswered =
    questions.length > 0 &&
    answeredCount === questions.length;

  const handleSubmit = () => {
    if (!allAnswered) return;

    setSubmitted(true);
  };

  const handleContinue = () => {
    if (!submitted) return;

    onContinue?.();
  };

  return (
    <div>
      <StepHeader
        eyebrow="Clarification"
        title="Resolve the missing information"
        description="Engino found a few areas that need product decisions. Answer the questions below so the AI can create a reliable engineering plan."
        badge={`${answeredCount}/${questions.length} answered`}
      />

      <div className="space-y-5">
        {/* Explanation banner */}
        <section className="flex items-start gap-3 rounded-2xl border border-warning/20 bg-warning/10 p-5">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-warning"
          />

          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Clarification is required
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-secondary">
              These decisions were not clear from the original
              requirement. Engino will use your answers when generating
              the implementation plan.
            </p>
          </div>
        </section>

        {/* Questions */}
        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <HelpCircle size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-text-primary">
                AI Clarification Questions
              </h2>

              <p className="text-xs text-text-secondary">
                Answer each question before continuing.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  value={answers[question.id] || ""}
                  onChange={(value) =>
                    handleAnswerChange(question.id, value)
                  }
                  submitted={submitted}
                />
              ))
            ) : (
              <div className="rounded-xl bg-success/10 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-success"
                  />

                  <p className="text-sm font-medium text-text-primary">
                    No clarification questions are required.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Progress */}
        <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Clarification progress
            </span>

            <span className="text-xs font-medium text-text-secondary">
              {answeredCount} of {questions.length}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width:
                  questions.length > 0
                    ? `${(answeredCount / questions.length) * 100}%`
                    : "100%",
              }}
            />
          </div>
        </section>

        {/* Success state */}
        {submitted && (
          <section className="flex items-start gap-3 rounded-2xl border border-success/20 bg-success/10 p-5">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-success"
            />

            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Clarification submitted
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Your answers are ready. Engino can now use these
                decisions to generate the engineering plan.
              </p>
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <MessageSquare size={15} />

            <span>
              {allAnswered
                ? "All questions have been answered."
                : "Answer all questions to continue."}
            </span>
          </div>

          <div className="flex justify-end">
            {!submitted ? (
              <button
                type="button"
                disabled={!allAnswered}
                onClick={handleSubmit}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  allAnswered
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "cursor-not-allowed bg-surface text-text-secondary"
                }`}
              >
                Submit Clarification
                <CheckCircle2 size={17} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Continue to AI Plan
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionCard = ({
  question,
  index,
  value,
  onChange,
  submitted,
}) => {
  const answered = Boolean(value.trim());

  return (
    <div
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
            htmlFor={`clarification-${question.id}`}
            className="block text-sm font-semibold leading-6 text-text-primary"
          >
            {question.question}
          </label>

          <textarea
            id={`clarification-${question.id}`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Enter your answer..."
            rows={3}
            className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />

          {submitted && !answered && (
            <p className="mt-2 text-xs font-medium text-danger">
              Please answer this question before continuing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClarificationStep;