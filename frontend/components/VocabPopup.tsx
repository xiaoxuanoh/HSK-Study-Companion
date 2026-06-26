"use client";

type Item = {
  id: string;
  word: string;
  pinyin: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
};

type Position = { x: number; y: number; above: boolean };

export default function VocabPopup({
  item,
  position,
  onClose,
  onExplain,
  onSave
}: {
  item: Item;
  position: Position;
  onClose: () => void;
  onExplain: () => void;
  onSave: () => void;
}) {
  const style: React.CSSProperties = position.above
    ? { bottom: window.innerHeight - position.y + 8, left: position.x }
    : { top: position.y + 8, left: position.x };

  return (
    <div
      className="fixed z-50 w-fit min-w-[200px] max-w-xs rounded-lg border border-stone-200 bg-white p-3 shadow-lg"
      style={style}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-ink">{item.word}</h4>
          <p className="text-xs text-muted">{item.pinyin}</p>
        </div>
        <button onClick={onClose} className="shrink-0 text-xs text-muted hover:text-ink">Close</button>
      </div>
      <p className="mt-2 text-xs text-muted">{item.partOfSpeech}</p>
      <p className="text-sm text-ink">{item.meaning}</p>
      <p className="mt-2 text-sm text-muted">{item.example}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={onExplain} className="rounded bg-accent px-2 py-1 text-xs text-white hover:bg-accent-hover">Explain More</button>
        <button onClick={onSave} className="rounded border border-stone-300 px-2 py-1 text-xs text-ink hover:bg-paper">Save</button>
      </div>
    </div>
  );
}
