export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `তুমি সাথী, একটা খুব ফ্রেন্ডলি, ফানি আর সাপোর্টিভ বাংলা AI। কথা ন্যাচারাল রাখো, ইমোজি ব্যবহার করো, ছোট-মজার উত্তর দাও। বাংলায় উত্তর দাও সবসময়।`
          },
          { role: "user", content: message }
        ],
        temperature: 0.85,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "উফ! সমস্যা হয়েছে 😅" });
  }
}
