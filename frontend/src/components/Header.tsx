import { ChangeEvent } from 'react';

type HeaderProps = {
  targetLanguage: string;
  onChangeLanguage: (language: string) => void;
  isLoggedIn: boolean;
  userName: string | null;
  onLogout: () => void;
};

const languageOptions = [
  { value: 'english', label: '영어' },
  { value: 'japanese', label: '일본어' },
  { value: 'spanish', label: '스페인어' },
];

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';
const googleLoginUrl = `${apiBaseUrl}/oauth2/authorization/google`;

export default function Header({ targetLanguage, onChangeLanguage, isLoggedIn, userName, onLogout }: HeaderProps) {
  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChangeLanguage(event.target.value);
  };

  return (
    <header className="relative rounded-[1.75rem] border border-[#f5d3e2] bg-white/95 p-5 shadow-[0_10px_24px_rgba(243,192,216,0.2)] backdrop-blur overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#ffe5f2]"></div>
      <div className="pointer-events-none absolute -left-12 top-10 h-20 w-20 rounded-full bg-[#ffd4ea]"></div>
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center rounded-full bg-[#ffe7f2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#b74d7a]">
            Dayline
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#5a3f4f] md:text-4xl">Dayline</h1>
          <p className="mt-2 text-sm text-[#7a5a6b]">Write your day in a new language.</p>
        </div>
        <div className="relative z-10 flex flex-col items-end gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#8f4767]">
                안녕하세요 {userName ?? '사용자'} 님!
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="relative z-10 rounded-full bg-[#c75a88] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(199,90,136,0.28)] transition hover:bg-[#b34d79] focus:outline-none focus:ring-2 focus:ring-[#f2a7cc] focus:ring-offset-2"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <a
              href={googleLoginUrl}
              className="relative z-10 rounded-full bg-[#c75a88] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(199,90,136,0.28)] transition hover:bg-[#b34d79] focus:outline-none focus:ring-2 focus:ring-[#f2a7cc] focus:ring-offset-2"
            >
              로그인
            </a>
          )}
          <div className="mt-1 hidden sm:block">
            <p className="rounded-full border border-[#f4bfd6] bg-white/85 px-3 py-2 text-sm font-medium text-[#8f4767]">
              gentle study session
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-5 rounded-2xl border border-[#f5cade] bg-[#fff7fd] p-3 text-sm text-[#7c5b6d]">
        작성할 언어를 선택하고, 주제를 받아온 뒤 바로 일기를 써보세요.
      </div>
      <div className="relative z-10 mt-4">
        <label className="mb-1 block text-sm font-medium text-[#8f4767]" htmlFor="target-language">
          공부할 언어
        </label>
        <select
          id="target-language"
          value={targetLanguage}
          onChange={handleLanguageChange}
          className="w-full rounded-xl border border-[#f0bfd9] bg-white px-3 py-2 text-sm text-[#5b3e4e] shadow-inner focus:border-[#e98fb8] focus:outline-none focus:ring-2 focus:ring-[#f2a7cc]"
        >
          {languageOptions.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
