// Email links are kept out of the HTML source to deter address harvesting,
// as on the old site (which used jQuery for the same thing).
const rot13 = (s) =>
  s.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });

// Email links: user and domain are stored apart (data-u, data-d), each
// ROT13-encoded; here they are joined into a mailto link. The text becomes the
// address unless the link has its own label (data-label).
for (const a of document.querySelectorAll("a.BLAM")) {
  const address = `${rot13(a.dataset.u || "")}@${rot13(a.dataset.d || "")}`;
  a.href = `mailto:${address}`;
  if (!("label" in a.dataset)) a.textContent = address;
}

// Phone menu: the Menu button (shown by CSS on small screens only) folds the
// main navigation. Without JavaScript the navigation simply stays open.
const header = document.querySelector(".brand-header");
const menuButton = header && header.querySelector(".brand-menu-button");
if (menuButton) {
  const label = menuButton.querySelector(".brand-menu-button__label");
  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close" : "Menu";
  };
  header.classList.add("has-menu");
  menuButton.hidden = false;
  menuButton.addEventListener("click", () =>
    setOpen(menuButton.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("is-open")) {
      setOpen(false);
      menuButton.focus();
    }
  });
}
