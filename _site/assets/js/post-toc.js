
/* =============================================
   AUTOMATIC POST TABLE OF CONTENTS
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {

  const content = document.querySelector("#post-content");
  const toc = document.querySelector("#post-toc");
  const tocList = document.querySelector("#post-toc-list");

  if (!content || !toc || !tocList) return;

  // Collect article headings.
  const headings = content.querySelectorAll("h2, h3");

  if (headings.length === 0) {
    toc.remove();
    return;
  }

  const links = [];

  // Generate TOC entries.
  headings.forEach((heading, index) => {

    if (!heading.id) {
      heading.id = `post-section-${index + 1}`;
    }

    const item = document.createElement("li");
    const link = document.createElement("a");

    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();

    if (heading.tagName === "H3") {
      item.classList.add("toc-subsection");
    }

    item.appendChild(link);
    tocList.appendChild(item);

    links.push({ heading, link });
  });


  // Smooth scrolling.
  links.forEach(({ heading, link }) => {

    link.addEventListener("click", (event) => {
      event.preventDefault();

      heading.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      history.replaceState(null, "", `#${heading.id}`);
    });

  });


  // Highlight the section currently being read.
  const observer = new IntersectionObserver(
    (entries) => {

      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort(
          (a, b) =>
            a.boundingClientRect.top -
            b.boundingClientRect.top
        );

      if (visible.length === 0) return;

      const activeId = visible[0].target.id;

      links.forEach(({ heading, link }) => {
        link.classList.toggle(
          "active",
          heading.id === activeId
        );
      });

    },
    {
      rootMargin: "-100px 0px -70% 0px",
      threshold: 0
    }
  );

  headings.forEach(heading => observer.observe(heading));

});
