export const metadata = {
  title: "Offer Analyzer",
  description: "AI দিয়ে অ্যাফিলিয়েট অফার অ্যানালাইসিস",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
