import { useState, useMemo } from "react";
import { HeartIcon, CheckIcon, SearchIcon, PlusIcon, XIcon, PinIcon, SpeakerIcon } from "../components/Icons";
import { saveLS, K_CUSTOM } from "../utils/storage";
import { useApp } from "../context/AppContext";

function AddWordModal({ cats, onSave, onClose }) {
  const [form, setForm] = useState({
    thai:"", phonetics:"", english:"", category:"Food", emoji:"📝",
    example_thai:"", example_phonetics:"", example_english:""
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const valid = form.thai.trim() && form.phonetics.trim() && form.english.trim();
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-t">Add Word</div>
        <div className="modal-s">Capture a new word from your tutor session</div>
        <div className="field"><label>Thai script *</label>
          <input placeholder="e.g. กาแฟ" value={form.thai} onChange={e=>set("thai",e.target.value)} style={{fontFamily:"var(--thai)",fontSize:16}}/></div>
        <div className="field"><label>Phonetics *</label>
          <input placeholder="e.g. gaa-fɛɛ" value={form.phonetics} onChange={e=>set("phonetics",e.target.value)}/></div>
        <div className="field"><label>English meaning *</label>
          <input placeholder="e.g. coffee" value={form.english} onChange={e=>set("english",e.target.value)}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div className="field"><label>Category</label>
            <select value={form.category} onChange={e=>set("category",e.target.value)}>
              {cats.map(c=><option key={c}>{c}</option>)}
              <option>Custom</option>
            </select></div>
          <div className="field"><label>Emoji</label>
            <input placeholder="📝" value={form.emoji} onChange={e=>set("emoji",e.target.value)}/></div>
        </div>
        <div className="field"><label>Example (Thai) — optional</label>
          <input placeholder="e.g. กาแฟร้อนไหม" value={form.example_thai} onChange={e=>set("example_thai",e.target.value)} style={{fontFamily:"var(--thai)"}}/></div>
        <div className="field"><label>Example phonetics</label>
          <input placeholder="e.g. gaa-fɛɛ rón mái" value={form.example_phonetics} onChange={e=>set("example_phonetics",e.target.value)}/></div>
        <div className="field"><label>Example translation</label>
          <input placeholder="e.g. Is the coffee hot?" value={form.example_english} onChange={e=>set("example_english",e.target.value)}/></div>
        <div className="modal-btns">
          <button className="modal-btn sec" onClick={onClose}>Cancel</button>
          <button className="modal-btn prim" onClick={()=>valid&&onSave(form)} style={{opacity:valid?1:0.5}}>Save word</button>
        </div>
      </div>
    </div>
  );
}

function VocabCard({ v, isFav, isStudied, isPinned, toggleFav, toggleStudied, togglePin, onDelete, expanded, toggle }) {
  const [speaking, setSpeaking] = useState(false);
  const speak = e => {
    e.stopPropagation();
    setSpeaking(true);
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(v.thai);
    u.lang = "th-TH"; u.rate = 0.85;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };
  return (
    <div className={`vc${expanded?" open":""}${v.isCustom?" custom":""}${isPinned?" pinned":""}${isStudied?" studied":""}`} onClick={toggle}>
      <div className="vc-top">
        <span className="vc-ej">{v.emoji||"📝"}</span>
        <span className="vc-th">{v.thai}</span>
        <span className="vc-en">{v.english}</span>
        <button className={`ic-btn${speaking?" spk":""}`} title="Pronounce" onClick={e=>{e.stopPropagation();speak(e);}}><SpeakerIcon on={speaking}/></button>
      </div>
      <div className="vc-bot">
        <span className="vc-ph">{v.phonetics}</span>
        {expanded && <span className="vc-cat">{v.category}</span>}
      </div>
      {expanded && (
        <div className="vc-acts" onClick={e=>e.stopPropagation()}>
          <button className={`ic-btn${isPinned?" pin":""}`} title="Pin to this week" onClick={()=>togglePin(v.id)}><PinIcon on={isPinned}/></button>
          <button className={`ic-btn${isFav?" fav":""}`} title="Favourite" onClick={()=>toggleFav(v.id)}><HeartIcon on={isFav}/></button>
          <button className={`ic-btn${isStudied?" stu":""}`} title="Mark studied" onClick={()=>toggleStudied(v.id)}><CheckIcon/></button>
          <button className="ic-btn del" title="Delete" onClick={()=>onDelete(v.id)}><XIcon/></button>
        </div>
      )}
      {expanded && (v.example_thai||v.example_english) && (
        <div className="vc-ex">
          {v.example_thai && <div className="vc-ex-th">{v.example_thai}</div>}
          {v.example_phonetics && <div className="vc-ex-ph">{v.example_phonetics}</div>}
          {v.example_english && <div className="vc-ex-en">{v.example_english}</div>}
        </div>
      )}
    </div>
  );
}

export function VocabPage() {
  const { allVocab, customWords, setCustomWords, hideWord, cats, favs, toggleFav, studied, toggleStudied, pinned, togglePin } = useApp();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [view, setView] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    let items = allVocab;
    if (view==="week") items = items.filter(v=>pinned.has(v.id));
    else if (view==="favs") items = items.filter(v=>favs.has(v.id));
    if (filterCat!=="All") items = items.filter(v=>v.category===filterCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(v=>v.thai.includes(search)||v.phonetics.toLowerCase().includes(q)||v.english.toLowerCase().includes(q));
    }
    return items;
  }, [search, filterCat, view, allVocab, pinned, favs]);

  const addWord = form => {
    const w = {...form, id:`c_${Date.now()}`, isCustom:true};
    const up = [...customWords, w];
    setCustomWords(up); saveLS(K_CUSTOM, up); setShowAdd(false);
  };
  const deleteWord = id => {
    if (customWords.find(w=>w.id===id)) {
      const up = customWords.filter(w=>w.id!==id);
      setCustomWords(up); saveLS(K_CUSTOM, up);
    } else {
      hideWord(id);
    }
  };

  return (
    <div className="page">
      <div className="ph" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div><div className="ph-t">Vocabulary</div>
          <div className="ph-s">{allVocab.length} words · {studied.size} studied · {pinned.size} pinned this week</div></div>
        <button className="btn btn-pri" onClick={()=>setShowAdd(true)}><PlusIcon/> Add word</button>
      </div>
      <div className="tabs">
        {[["all","All words"],["week","📌 This week"],["favs","♥ Favourites"]].map(([k,l])=>
          <button key={k} className={`tab${view===k?" on":""}`} onClick={()=>{setView(k);setFilterCat("All");}}>{l}</button>)}
      </div>
      {view==="week" && pinned.size===0 && <div className="pinned-banner">Pin words with the 📍 icon to build your active study list. Aim for 20–30 words per week to keep sessions focused.</div>}
      {view==="week" && pinned.size>0 && <div className="pinned-banner">📌 {pinned.size} words pinned this week. Master these before rotating in new ones.</div>}
      <div className="srch"><span className="srch-ic"><SearchIcon/></span>
        <input placeholder="Search Thai, phonetics, or English…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="chips">
        {["All",...cats].map(c=><span key={c} className={`chip${filterCat===c?" on":""}`} onClick={()=>setFilterCat(c)}>{c}</span>)}
      </div>
      <div className="filter-row"><span className="filter-ct">{filtered.length} word{filtered.length!==1?"s":""}</span></div>
      <div className="vocab-list">
        {filtered.length===0 ? <div className="empty">No words found</div> :
          filtered.map(v=><VocabCard key={v.id} v={v}
            isFav={favs.has(v.id)} isStudied={studied.has(v.id)} isPinned={pinned.has(v.id)}
            toggleFav={toggleFav} toggleStudied={toggleStudied} togglePin={togglePin}
            onDelete={deleteWord} expanded={expandedId===v.id}
            toggle={()=>setExpandedId(expandedId===v.id?null:v.id)}/>)}
      </div>
      {showAdd && <AddWordModal cats={cats} onSave={addWord} onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}
