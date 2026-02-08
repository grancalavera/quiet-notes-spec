import PocketBase, { RecordModel } from "pocketbase";
import { FormEvent, useEffect, useState } from "react";

const pb = new PocketBase("http://localhost:8090");

export function App() {
  const [message, setMessage] = useState("");
  const [echoes, setEchoes] = useState<RecordModel[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    pb.collection("echoes")
      .getFullList({ sort: "-created" })
      .then(setEchoes);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    const record = await pb.collection("echoes").create({ message });
    setEchoes((prev) => [record, ...prev]);
    setMessage("");
    setSending(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>Echo Tracer Bullet</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message…"
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button type="submit" disabled={sending}>
          Send
        </button>
      </form>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
        {echoes.map((echo) => (
          <li
            key={echo.id}
            style={{
              padding: "0.5rem",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{echo.message}</strong>
            <br />
            <small style={{ color: "#888" }}>
              {echo.id} — {echo.created}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
