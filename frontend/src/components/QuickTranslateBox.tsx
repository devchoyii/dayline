import { FormEvent, useState } from 'react';
import { TranslationApiResult } from '../types/dayline';

type QuickTranslateBoxProps = {
  onLookup: (query: string) => Promise<TranslationApiResult>;
  targetLanguage: string;
  isLoggedIn: boolean;
};

const inputClass =
  'w-full rounded-2xl border border-[#f1bfda] bg-white/90 px-4 py-3.5 text-[#4f3544] outline-none transition focus:border-[#e8a4cb] focus:ring-2 focus:ring-[#f2bcd2]';

const primaryButtonClass =
  'inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#f7aac8] to-[#ee87b7] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef8bb7] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100';

export default function QuickTranslateBox({ onLookup, targetLanguage, isLoggedIn }: QuickTranslateBoxProps) {
  const [lookupWord, setLookupWord] = useState('');
  const [lookupResult, setLookupResult] = useState<TranslationApiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!isLoggedIn) return;

    const query = lookupWord.trim();
    if (!query) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await onLookup(query);
      setLookupResult(result);
    } catch (submitError) {
      console.error('translation request failed', submitError);
      setLookupResult(null);
      setError('Could not load the translation result. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative rounded-[1.75rem] border border-[#f5d3e2] bg-white/95 p-5 shadow-[0_10px_24px_rgba(243,192,216,0.2)] backdrop-blur">
      <h2 className="mb-3 text-lg font-semibold text-[#5a3f4f]">Quick help</h2>
      <form onSubmit={handleSubmit} className="grid gap-2 md:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="lookup-input">
          Quick word or phrase
        </label>
        <input
          id="lookup-input"
          value={lookupWord}
          onChange={(event) => setLookupWord(event.target.value)}
          className={inputClass}
          placeholder='Type a word or a sentence, e.g., "accomplish"'
        />
        <button
          type="submit"
          disabled={isLoading || !isLoggedIn}
          className={`${primaryButtonClass} md:py-3`}
        >
          {isLoading ? 'Loading...' : '번역하기'}
        </button>
      </form>

      {!isLoggedIn ? (
        <p className="mt-3 text-sm text-[#8f4767]">로그인 후 번역 기능을 사용할 수 있습니다.</p>
      ) : null}

      {error && <p className="mt-3 text-sm text-[#b14f79]">{error}</p>}

      {lookupResult && (
        <div className="mt-4 rounded-2xl border border-[#f0bed4] bg-gradient-to-r from-[#fff7fc] to-[#fff2f9] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#5a3f4f]">Lookup result</p>
            <span className="text-xs font-medium text-[#a24f75]">Match confidence: high</span>
          </div>
          <p className="text-sm text-[#4f3543]">
            <span className="font-semibold text-[#6f4860]">Text:</span> {lookupResult.text}
          </p>
          <p className="mt-1 text-sm text-[#64424f]">
            <span className="font-semibold text-[#6f4860]">번역:</span> {lookupResult.translation}
          </p>
          {targetLanguage === 'japanese' && (
            <p className="mt-1 text-sm text-[#64424f]">
              ({lookupResult.pron?.trim() || '-'})
            </p>
          )}
        </div>
      )}
    </section>
  );
}
