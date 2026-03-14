export function CulturalNotes({ notes }) {
  if (!notes?.length) return null;

  return (
    <div className="culture-notes">
      {notes.map((note, i) => (
        <div key={i} className="culture-note">
          <div className="culture-note-title">{note.title}</div>
          <div className="culture-note-body">{note.body}</div>
        </div>
      ))}
    </div>
  );
}
