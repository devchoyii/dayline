import { Topic, type Vocabulary } from '../types/dayline';

type TopicRecommendationSectionProps = {
  topics: Topic[];
  onRecommend: () => void;
  targetLanguage: string;
  isLoggedIn: boolean;
};

const primaryButtonClass =
  'inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#f7aac8] to-[#ee87b7] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef8bb7] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100';

export default function TopicRecommendationSection({
  topics,
  onRecommend,
  targetLanguage,
  isLoggedIn,
}: TopicRecommendationSectionProps) {
  const showJapanesePronunciation = targetLanguage === 'japanese';

  return (
    <article className="relative rounded-[1.75rem] border border-[#f5d3e2] bg-white/95 p-5 shadow-[0_10px_24px_rgba(243,192,216,0.2)] backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[#5a3f4f]">Today's topic suggestions</h2>
          <p className="text-sm text-[#8d6479]">매일 추천할 주제를 불러옵니다.</p>
        </div>
        <span className="rounded-full border border-[#f1c0d8] bg-[#fff1f7] px-2.5 py-1 text-xs font-medium text-[#a04f75]">
          {topics.length} ideas
        </span>
      </div>
      <button
        className={`${primaryButtonClass} mb-4`}
        type="button"
        onClick={() => onRecommend()}
        disabled={!isLoggedIn}
      >
        주제 추천 받기
      </button>
      {!isLoggedIn ? (
        <p className="mb-4 text-xs text-[#a06d84]">로그인 후 주제를 추천받을 수 있습니다.</p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="group relative flex min-h-[180px] flex-col rounded-2xl border border-[#f3d4e2] bg-white p-3 text-left transition hover:border-[#f3bcd4] hover:bg-[#fff8fc]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex rounded-full bg-[#fff0f8] px-2 py-1 text-[11px] font-semibold text-[#a56f86]">
                {topic.vibe}
              </span>
            </div>
            <p className="text-sm font-semibold leading-tight text-[#4d3442]">{topic.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-[#7c6070]">{topic.description}</p>
            <div className="mt-3 border-t border-[#f6d6e5] pt-3 text-xs text-[#7c6070]">
              <p className="mb-1 font-semibold text-[#a04f75]">추천 단어</p>
              <p className="leading-relaxed">
                {topic.words.length > 0
                  ? topic.words
                      .map((word: Vocabulary) => {
                        const label =
                          showJapanesePronunciation && word.pron
                            ? `${word.word} [${word.pron}]`
                            : word.word;
                        return `${label} (${word.meaning})`;
                      })
                      .join(', ')
                  : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
