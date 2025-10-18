import React, { useState } from "react";

export default function PartRequestForm() {
  const [form, setForm] = useState({
    name: "",
    model: "",
    qty: 1,
    urgency: "Medium",
    notes: "",
  });

  const onChange = (k: string, v: unknown) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now simply log — hook to API or context to add to list
    console.log("New part request", form);
    alert("Part request submitted (mock)");
    setForm({ name: "", model: "", qty: 1, urgency: "Medium", notes: "" });
  };

  return (
    <form onSubmit={onSubmit} style={{ background: "#111", padding: 16, borderRadius: 8, color: "#ddd" }}>
      <h2 style={{ color: "#cfe8ff" }}>Request New Part</h2>
      <label style={{ display: "block", marginTop: 8 }}>
        Part Name
        <input required value={form.name} onChange={(e) => onChange("name", e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }} />
      </label>
      <label style={{ display: "block", marginTop: 8 }}>
        Vehicle Model
        <input required value={form.model} onChange={(e) => onChange("model", e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }} />
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <label style={{ flex: 1 }}>
          Quantity
          <input type="number" min={1} value={form.qty} onChange={(e) => onChange("qty", Number(e.target.value))} style={{ width: "100%", padding: 8, marginTop: 4 }} />
        </label>
        <label style={{ flex: 1 }}>
          Urgency
          <select value={form.urgency} onChange={(e) => onChange("urgency", e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
      </div>
      <label style={{ display: "block", marginTop: 8 }}>
        Notes
        <textarea value={form.notes} onChange={(e) => onChange("notes", e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }} />
      </label>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button type="submit" style={{ background: "#0b63b6", color: "#fff", padding: "8px 12px", borderRadius: 6, border: "none" }}>
          Request
        </button>
        <button type="button" onClick={() => setForm({ name: "", model: "", qty: 1, urgency: "Medium", notes: "" })} style={{ padding: "8px 12px", borderRadius: 6 }}>
          Reset
        </button>
      </div>
    </form>
  );
}