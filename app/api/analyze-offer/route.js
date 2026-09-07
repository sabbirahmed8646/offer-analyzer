export async function POST(request) {
  try {
    const { offer } = await request.json();

    if (!offer || !offer.trim()) {
      return Response.json({ error: "Offer input is required" }, { status: 400 });
    }

    const systemPrompt = `তুমি একজন অভিজ্ঞ অ্যাফিলিয়েট মার্কেটিং কনসালট্যান্ট। ইউজার একটা অফার (নাম/লিংক/বর্ণনা) দেবে, তোমাকে নিচের ফরম্যাটে বাংলায় একটা সংক্ষিপ্ত কিন্তু কার্যকরী অ্যানালাইসিস দিতে হবে:

১. ভার্টিকাল/নিশ (কোন ক্যাটাগরির অফার)
২. সম্ভাব্য পেআউট টাইপ (CPA/CPL/RevShare/CPS ইত্যাদি) ও আনুমানিক রেঞ্জ
৩. উপযুক্ত GEO/টায়ার (কোন দেশ/টায়ার ভালো পারফর্ম করতে পারে, কারণসহ)
৪. উপযুক্ত ট্রাফিক সোর্স (পেইড: FB Ads/Google Ads/Native/Push, অর্গানিক: SEO/Social/Influencer) — কোনটা বেশি মানানসই
৫. টার্গেট অডিয়েন্স (বয়স, আগ্রহ, ডেমোগ্রাফিক)
৬. সম্ভাব্য চ্যালেঞ্জ/রেস্ট্রিকশন (যদি থাকে)
৭. পরবর্তী পদক্ষেপের সাজেশন

যদি অফারের তথ্য অস্পষ্ট বা অসম্পূর্ণ হয়, তোমার সাধারণ অ্যাফিলিয়েট মার্কেটিং জ্ঞান দিয়ে সবচেয়ে সম্ভাব্য অনুমান দাও এবং কোথায় অনুমান করছ সেটা উল্লেখ করো। উত্তর সংক্ষিপ্ত, স্পষ্ট এবং একশনেবল রাখো।`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: "user", content: offer }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return Response.json({ error: "AI analysis failed" }, { status: 500 });
    }

    const data = await response.json();
    const textBlock = data.content?.find((block) => block.type === "text");
    const analysis = textBlock?.text || "কোনো ফলাফল পাওয়া যায়নি, আবার চেষ্টা করুন।";

    return Response.json({ analysis });
  } catch (err) {
    console.error("Offer analysis error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
