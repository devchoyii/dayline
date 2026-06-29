type DiaryEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isLoggedIn: boolean;
  saveMessage: string | null;
};

export default function DiaryEditor({ value, onChange, onSave, isSaving, isLoggedIn, saveMessage }: DiaryEditorProps) {
  return (
    <section className="relative rounded-[1.75rem] border border-[#f5d3e2] bg-white/95 p-5 shadow-[0_10px_24px_rgba(243,192,216,0.2)] backdrop-blur">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#5a3f4f]">Diary draft</h2>
          <p className="text-xs text-[#9b7287]">You can edit anytime</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !isLoggedIn}
          className="inline-flex items-center justify-center rounded-2xl border border-[#f2bdd6] bg-white px-4 py-2 text-sm font-semibold text-[#8f4767] transition hover:border-[#e7a5c4] hover:bg-[#fff7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efb4cf] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? '저장 중' : '저장'}
        </button>
      </div>
      {!isLoggedIn ? (
        <p className="mb-3 text-sm text-[#8f4767]">로그인 후 일기를 저장할 수 있습니다.</p>
      ) : null}
      {saveMessage ? <p className="mb-3 text-sm text-[#8f4767]">{saveMessage}</p> : null}
      <p className="mb-4 text-sm text-[#8b6178]">오늘 당신의 하루를 적어보세요.</p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={10}
        className="h-56 w-full resize-y rounded-2xl border border-[#f1c6dd] bg-white/95 p-4 text-[#4f3543] outline-none transition focus:border-[#e3a5c3] focus:ring-2 focus:ring-[#f3c9df]"
        placeholder="Example: Today I finally finished the presentation. Even though it was challenging, I stayed motivated and felt relieved after sending it. I learned that steady progress feels better than perfect speed."
      />
    </section>
  );
}
