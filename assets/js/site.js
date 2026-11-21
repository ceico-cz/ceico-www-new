// Email links are kept out of the HTML source to deter address harvesting,
// as on the old site (which used jQuery for the same thing).
const rot13 = (s) =>
  s.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });

// Footer link: user and domain are joined here.
for (const a of document.querySelectorAll("a.BLA")) {
  const address = `${a.dataset.user}@${a.dataset.domain}`;
  a.href = `mailto:${address}`;
  a.textContent = address;
}

// Content links: href (and text, unless it says "email") are ROT13-encoded.
for (const a of document.querySelectorAll("a.BLAM")) {
  a.href = rot13(a.getAttribute("href"));
  if (a.textContent.trim().toLowerCase() !== "email") a.textContent = rot13(a.textContent);
}
