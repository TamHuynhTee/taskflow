// LAB 07 — Resetting state with `key`
// 🐞 Select card 1, edit the title field, then select card 2 → the field still shows card 1's draft.
//    Pressing "Save" at that point overwrites card 2's title with card 1's text!
// Keep as is: the `KeyLab` export, card buttons named after their title, the input labelled "Title", the "Save" button.
// DON'T use useEffect to sync the draft with the card (see "You Might Not Need an Effect").
import { useState } from "react";

interface LabCard {
  id: string;
  title: string;
}

const INITIAL: LabCard[] = [
  { id: "c1", title: "Fix login bug" },
  { id: "c2", title: "Write API docs" },
];

export function KeyLab() {
  const [cards, setCards] = useState(INITIAL);
  const [selectedId, setSelectedId] = useState("c1");
  const card = cards.find((c) => c.id === selectedId)!;

  return (
    <div className="lab-col">
      <div className="lab-row">
        {cards.map((c) => (
          <button
            key={c.id}
            aria-pressed={c.id === selectedId}
            onClick={() => setSelectedId(c.id)}
          >
            {c.title}
          </button>
        ))}
      </div>
      <CardEditor
        card={card}
        onSave={(title) =>
          setCards((cs) => cs.map((c) => (c.id === card.id ? { ...c, title } : c)))
        }
      />
    </div>
  );
}

function CardEditor({
  card,
  onSave,
}: {
  card: LabCard;
  onSave: (title: string) => void;
}) {
  const [draft, setDraft] = useState(card.title);
  return (
    <div className="lab-row">
      <label>
        Title <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      </label>
      <button onClick={() => onSave(draft)}>Save</button>
    </div>
  );
}
