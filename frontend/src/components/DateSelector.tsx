type DateSelectorProps = {
  selectedDate: string;
  onChangeDate: (value: string) => void;
  selectedDateLabel: string;
};

const inputClass =
  'w-full rounded-2xl border border-[#f1bfda] bg-white/90 px-4 py-3.5 text-[#4f3544] outline-none transition focus:border-[#e8a4cb] focus:ring-2 focus:ring-[#f2bcd2]';

const labelClass = 'mb-2 inline-flex text-xs font-medium tracking-wide text-[#9f6b82]';

export default function DateSelector({
  selectedDate,
  onChangeDate,
  selectedDateLabel,
}: DateSelectorProps) {
  return (
    <article className="relative rounded-[1.75rem] border border-[#f5d3e2] bg-white/95 p-5 shadow-[0_10px_24px_rgba(243,192,216,0.2)] backdrop-blur">
      <h2 className="mb-3 text-lg font-semibold text-[#5a3f4f]">Date</h2>
      <p className={labelClass}>Writing date</p>
      <label className="sr-only" htmlFor="day-input">
        Writing date
      </label>
      <input
        id="day-input"
        type="date"
        className={inputClass}
        value={selectedDate}
        onChange={(event) => onChangeDate(event.target.value)}
      />
      <p className="mt-2 text-xs text-[#9a7383]">
        Selected date: <strong>{selectedDateLabel}</strong>
      </p>
    </article>
  );
}
