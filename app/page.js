"use client";

import { useState } from "react";

export default function Home() {
  const [offerInput, setOfferInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!offerInput.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer: offerInput }),
      });

      if (!res.ok) throw new Error("সার্ভার থেকে সঠিক রেসপন্স আসেনি");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("অ্যানালাইসিস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Offer Analyzer</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        অফারের নাম, লিংক, বা বর্ণনা দিন — AI সেটা অ্যানালাইসিস করে রিপোর্ট দেবে।
      </p>

      <textarea
        value={offerInput}
        onChange={(e) => setOfferInput(e.target.value)}
        placeholder="যেমন: 'Weight loss supplement CPA offer, $45 payout, targeting US traffic' অথবা শুধু অফারের লিংক পেস্ট করুন"
        rows={5}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 15,
          border: "1px solid #ccc",
          borderRadius: 8,
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: "10px 24px",
          fontSize: 15,
          fontWeight: 600,
          color: "#fff",
          background: loading ? "#999" : "#111",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "অ্যানালাইসিস চলছে..." : "অ্যানালাইজ করুন"}
      </button>

      {error && (
        <p style={{ color: "#c0392b", marginTop: 16 }}>{error}</p>
      )}

      {result && (
        <div
          style={{
            marginTop: 28,
            padding: 20,
            background: "#f7f7f8",
            borderRadius: 10,
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
          }}
        >
          {result.analysis}
        </div>
      )}
    </main>
  );
          }
