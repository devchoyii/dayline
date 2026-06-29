import { AiFeedback } from '../types/dayline';

type FeedbackSectionProps = {
  feedback: AiFeedback | null;
  error: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  onRequestFeedback: () => void | Promise<void>;
};

const primaryButtonClass =
  'inline-flex items-center justify-center rounded-2xl border border-[#e4a9c4] bg-gradient-to-r from-[#f4aecf] to-[#ec92b9] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef8bb7] disabled:cursor-not-allowed disabled:opacity-70';

export default function FeedbackSection({
  feedback,
  error,
  isLoading,
  isLoggedIn,
  onRequestFeedback,
}: FeedbackSectionProps) {
  return (
    <section className="relative rounded-[1.75rem] border border-[#f5d3e2] bg-white/95 p-5 shadow-[0_10px_24px_rgba(243,192,216,0.2)] backdrop-blur">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#5a3f4f]">AI feedback</h2>
          <p className="text-sm text-[#8c647b]">Get a polished learning report after finishing your draft.</p>
        </div>
        <button
          onClick={onRequestFeedback}
          className={primaryButtonClass}
          type="button"
          disabled={isLoading || !isLoggedIn}
        >
          {isLoading ? 'AI가 일기를 읽고 있어요' : 'AI 피드백 받기'}
        </button>
      </div>

      {!isLoggedIn ? (
        <p className="mb-3 text-sm text-[#8f4767]">로그인 후 AI 피드백을 받을 수 있습니다.</p>
      ) : null}

      {error && (
        <div className="mb-3 rounded-2xl border border-[#f1ccd8] bg-[#fff7fb] px-4 py-3 text-sm text-[#8b526b]">
          {error}
        </div>
      )}

      {feedback && (
        <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-[#f3d1e1] bg-[#fff7fc] p-4">
            <h3 className="mb-2 font-semibold text-[#5a3f4f]">Summary</h3>
            <p className="text-sm leading-relaxed text-[#6e4f5d]">{feedback.summary}</p>
          </div>
          <div className="rounded-2xl border border-[#f3d1e1] bg-[#fff7fc] p-4">
            <h3 className="mb-2 font-semibold text-[#5a3f4f]">Corrections</h3>
            <ul className="space-y-2 text-sm text-[#6e4f5d]">
              {feedback.corrections.length > 0 ? (
                feedback.corrections.map((item, index) => (
                  <li
                    key={`${item.original}-${index}`}
                    className="rounded-xl border border-[#f4d8e6] bg-white px-3 py-3"
                  >
                    <p>
                      <span className="font-semibold text-[#a04f75]">원문:</span> {item.original}
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold text-[#a04f75]">수정:</span> {item.corrected}
                    </p>
                    <p className="mt-1 text-[#7b5d6c]">{item.reason}</p>
                  </li>
                ))
              ) : (
                <li className="rounded-xl border border-[#f4d8e6] bg-white px-3 py-3">
                  수정할 문장이 없습니다.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {feedback && (
        <div className="mt-3 rounded-2xl border border-[#efc3d7] bg-gradient-to-r from-[#fff6fb] to-[#fff1f8] p-4">
          <p className="text-sm leading-relaxed text-[#5f4854]">{feedback.encouragement}</p>
        </div>
      )}
    </section>
  );
}
