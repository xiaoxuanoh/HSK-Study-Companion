"use client";

type Item = {
  id: string;
  word: string;
  pinyin: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
};

export default function VocabPopup({
  item,
  onClose,
  onExplain,
  onSave
}: {
  item: Item;
  onClose: () => void;
  onExplain: () => void;
  onSave: () => void;
}) {
  return (
    <div className="absolute z-40 mt-2 w-80 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
      <div className="flex justify-between">
        <div>
          <h4 className="text-lg font-semibold">{item.word}</h4>
          <p className="text-xs text-muted">{item.pinyin}</p>
        </div>
        <button onClick={onClose} className="text-xs text-muted">Close</button>
      </div>
      <p className="mt-2 text-xs text-slate-600">{item.partOfSpeech}</p>
      <p className="text-sm">{item.meaning}</p>
      <p className="mt-2 text-sm text-slate-700">{item.example}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={onExplain} className="rounded bg-accent px-2 py-1 text-xs text-white">Explain More</button>
        <button onClick={onSave} className="rounded border border-slate-300 px-2 py-1 text-xs">Save</button>
      </div>
    </div>
  );
}
