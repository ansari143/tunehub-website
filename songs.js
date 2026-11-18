/*
  Tune Hub song list
  ------------------
  To add a new song: copy one line, paste it at the TOP of the list, and change
    id    = the 11 characters after "watch?v=" in the YouTube link
    name  = the song name shown on the website
    line  = a short line under the name
    moods = any of: "romantic", "sad", "rain", "healing"
    views = YouTube view count (used for the "Most played" sort)
  Newest songs go first.
*/
window.TUNEHUB = {
  channel: {
    name: "Tune Hub",
    handle: "@tunehubsongs",
    id: "UClXoHd1lB9QYrguz7JLUUoA",
    url: "https://www.youtube.com/@tunehubsongs",
    subscribers: "2.99K",
    videos: "264"
  },

  // Weekly upload plan, from the channel description (0 = Sunday)
  schedule: [
    { day: "Sun", label: "Soft Healing",   moods: ["healing", "rain"] },
    { day: "Mon", label: "Romantic Love",  moods: ["romantic"] },
    { day: "Tue", label: "Light Sad",      moods: ["sad"] },
    { day: "Wed", label: "Deep Sad",       moods: ["sad"] },
    { day: "Thu", label: "Love + Emotion", moods: ["romantic"] },
    { day: "Fri", label: "Strong Sad",     moods: ["sad"] },
    { day: "Sat", label: "Romantic Pain",  moods: ["romantic", "sad"] }
  ],

  songs: [
    { id: "hzWtIjm3f74", name: "Adhoori Baarish",        line: "Heart touching Hindi sad song 2026",         moods: ["sad", "rain"],      views: 1,   isNew: true },
    { id: "YA6ncuzJMzM", name: "Tu Meri Dua Hai",        line: "Heart touching Hindi love song",             moods: ["romantic"],         views: 302 },
    { id: "Yy1AVSyJDKY", name: "Aakhri Baar Tu",         line: "Bollywood breakup song",                     moods: ["sad"],              views: 121 },
    { id: "h087XCSpM7w", name: "Bas Teri Yaad Reh Gayi", line: "Bollywood breakup song",                     moods: ["sad"],              views: 183 },
    { id: "UWgnJylNq7Q", name: "Tu Hi Mera Sukoon",      line: "Romantic Bollywood song",                    moods: ["romantic"],         views: 385 },
    { id: "v41yB9at71Y", name: "Tum Mile Toh",           line: "Romantic Bollywood song",                    moods: ["romantic"],         views: 307 },
    { id: "oMAxdfSDvcw", name: "Dil Tera Hi Raha",       line: "Emotional breakup song",                     moods: ["sad"],              views: 325 },
    { id: "ZxLc1_0vAQY", name: "Kya Tum Yaad Ho?",       line: "Bollywood heartbreak song 2026",             moods: ["sad"],              views: 70 },
    { id: "E6kJpzBTpwE", name: "Tera Saath Sukoon",      line: "Romantic Bollywood song",                    moods: ["romantic"],         views: 95 },
    { id: "HU3E00SAXpo", name: "Teri Dua Ban Gaya",      line: "Romantic Hindi love song 2026",              moods: ["romantic"],         views: 197 },
    { id: "Y6TUDfg93zg", name: "Tere Bina Adhoora",      line: "Heart touching Hindi sad song",              moods: ["sad"],              views: 269 },
    { id: "udSAMVU_RSM", name: "Teri Muskaan Se",        line: "Heart touching Hindi love song 2026",        moods: ["romantic"],         views: 103 },
    { id: "uW85v0Ts3wU", name: "Khamosh Dua",            line: "Emotional breakup song 2026",                moods: ["sad"],              views: 142 },
    { id: "prC-9fgRiSY", name: "Khali Ghar",             line: "Emotional breakup song 2026",                moods: ["sad"],              views: 81 },
    { id: "i7CqRI39Bt8", name: "Dil Ki Dua",             line: "Romantic Bollywood song 2026",               moods: ["romantic"],         views: 188 },
    { id: "Ljkjlv6Rvg0", name: "Yaadon Ki Baarish",      line: "Emotional love song 2026",                   moods: ["sad", "rain"],      views: 45 },
    { id: "WHdDgwCbtP0", name: "Aakhri Khat",            line: "Emotional breakup song 2026",                moods: ["sad"],              views: 97 },
    { id: "E1m9anO6ADA", name: "Toota Hua Chaand",       line: "Heart touching breakup song",                moods: ["sad"],              views: 125 },
    { id: "qNQ9dOet0XA", name: "Toota Hua Aasmaan",      line: "Emotional breakup song 2026",                moods: ["sad"],              views: 174 },
    { id: "lEsyWiWE_ig", name: "Adhoori Baarish (Tanhai Ka Safar)", line: "Saddest Hindi love song",         moods: ["sad", "rain"],      views: 161 },
    { id: "t3IX0IqUXDQ", name: "Khamosh Dua (Female Version)",      line: "One sided love",                  moods: ["sad"],              views: 51 },
    { id: "LF1BfdFCtu4", name: "Aansu Bhi Thak Gaye",    line: "Emotional ballad 2026",                      moods: ["sad"],              views: 174 },
    { id: "6YTk-El_EJQ", name: "Yaadon Ka Sheher",       line: "Emotional lofi love song",                   moods: ["sad", "rain"],      views: 60 },
    { id: "mkcWb5Q3j84", name: "Kismat Ne Juda Kiya",    line: "Emotional Bollywood song",                   moods: ["sad"],              views: 115 },
    { id: "jsem1pjSuRg", name: "Ab Theek Hoon Main",     line: "Heart touching Hindi healing song",          moods: ["healing", "sad"],   views: 58 },
    { id: "8w4dFmFhXXg", name: "Tera Naam Aaj Bhi Hai",  line: "Sad romantic song 2026",                     moods: ["romantic", "sad"],  views: 249 },
    { id: "77ZxcMPp-NU", name: "Baarish Mein Tera Naam", line: "Hindi lofi love song, rain romance",         moods: ["romantic", "rain"], views: 128 },
    { id: "304hU0d0eBs", name: "Unread Mohabbat",        line: "Tera aakhri message aaj bhi save hai",       moods: ["sad"],              views: 42 },
    { id: "FaVTZ_MRkPI", name: "Yaadon Ka Mausam",       line: "Aaj phir tum yaad aaye",                     moods: ["sad"],              views: 455 },
    { id: "zhi3NEu2q5U", name: "Tera Naam Dil Mein",     line: "Sad romantic song 2026",                     moods: ["romantic", "sad"],  views: 757 }
  ]
};
