import { useState, useMemo } from "react";
import { FlashcardDeck } from "../components/FlashcardDeck";

export function FlashcardPage({ allVocab, favs, studied, toggleStudied, pinned, cats, confidence, updateConfidence }) {
  const [view, setView] = useState("all");
  const [filterCat, setFilterCat] = useState("");

  const words = useMemo(() => {
    let list = allVocab;
    if (view === "pinned") list = list.filter(v => pinned.has(v.id));
    if (view === "favs") list = list.filter(v => favs.has(v.id));
    if (filterCat) list = list.filter(v => v.category === filterCat);
    return list;
  }, [allVocab, view, filterCat, favs, pinned]);

  return (
    <div className="page">
      <div className="ph">
        <div className="ph-t">Flashcards</div>
        <div className="ph-s">{words.length} words &middot; {words.filter(w => studied.has(w.id)).length} studied</div>
      </div>

      {/* View tabs */}
      <div className="tabs">
        {[["all","All words"],["pinned","📌 Pinned cards"],["favs","♥ Favourites"]].map(([k,l]) => (
          <button key={k} className={`tab${view === k ? " on" : ""}`} onClick={() => setView(k)}>{l}</button>
        ))}
      </div>

      {/* Category filter chips */}
      <div className="chips">
        <button className={`chip${!filterCat ? " on" : ""}`} onClick={() => setFilterCat("")}>All categories</button>
        {cats.map(c => (
          <button key={c} className={`chip${filterCat === c ? " on" : ""}`} onClick={() => setFilterCat(c)}>{c}</button>
        ))}
      </div>

      {/* Flashcard deck */}
      <FlashcardDeck words={words} studied={studied} toggleStudied={toggleStudied} confidence={confidence} updateConfidence={updateConfidence} />
    </div>
  );
}
