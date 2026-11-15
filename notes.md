---
layout: default
permalink: /notes/
math: true
---

<section class="hero">
<div class="riemannsurface riemannsurface--decorative"
     data-surface="riemann-minimal"
     data-placement="center-right">
</div>
<p class="eyebrow">THE ACADEMIC NOTEBOOK / 2026</p>
<h1><span class="accent">Notes</span> from the journey.</h1>

<p class="lede">
  A growing collection of notes, derivations, explanations, and
  questions encountered while studying theoretical high-energy physics.
  This is where I work through ideas, connect mathematical structures
  with physical intuition, and record things worth revisiting.
</p>
<p class="lede">
  These notes are a work in progress. They are intended as a personal
  learning resource and a way to share ideas, rather than a substitute
  for formal textbooks or published research.
</p>
</section>

<section class="section">
  <div class="section-heading">
    <p class="eyebrow">01 / NOTES</p>
    <h2>Recent posts</h2>
  </div>
<article class="publication">
  <p>
    These <span class="accent">Notes</span> are in no manner intended
    to be complete and/or substitute to books and classroom teachings. These
    are just concise summary of my own understanding of the subject. Please 
    feel free to use them and point out erroneous comment and clarifications if any.
  </p>
  <div class="section-content">
    {% assign notes = site.posts | sort: "date" | reverse %}

    {% assign notes_count = 0 %}

    {% for post in notes %}
      {% if post.categories contains "notes" %}
        {% assign notes_count = notes_count | plus: 1 %}

        <article class="entry">
          <div class="entry-meta">
            {{ post.date | date: "%d %b %Y" }}
          </div>

          <div>
            <h3 class="entry-title">
              <a href="{{ post.url | relative_url }}">
                {{ post.title | escape }}
              </a>
            </h3>

            {% if post.description %}
              <p>{{ post.description | escape }}</p>
            {% elsif post.excerpt %}
              <p>{{ post.excerpt | strip_html | normalize_whitespace | truncate: 200 }}</p>
            {% endif %}

            <a class="text-link" href="{{ post.url | relative_url }}">
              Read note ↗
            </a>
          </div>
        </article>
      {% endif %}
    {% endfor %}

    {% if notes_count == 0 %}
      <p class="muted">
        No notes published yet. The first entry will appear here when
        you publish a post in the notes category.
      </p>
    {% endif %}
  </div>
</article>
</section>

<!-- <section class="section">
  <div class="section-heading">
    <p class="section-number">02 / TOPICS</p>
    <h2>Areas of exploration</h2>
  </div>

  <div class="section-content">
    <article class="entry">
      <div class="entry-meta">01</div>
      <div>
        <h3 class="entry-title">Quantum Field Theory</h3>
        <p>
          Fields, quantization, propagators, Feynman diagrams, and
          the mathematical structure of particle interactions.
        </p>
      </div>
    </article>

    <article class="entry">
      <div class="entry-meta">02</div>
      <div>
        <h3 class="entry-title">Mathematical Methods</h3>
        <p>
          Group theory, symmetries, tensors, differential equations,
          and mathematical tools used in theoretical physics.
        </p>
      </div>
    </article>

    <article class="entry">
      <div class="entry-meta">03</div>
      <div>
        <h3 class="entry-title">Conceptual Reflections</h3>
        <p>
          Questions about physical principles, theoretical frameworks,
          and the relationship between mathematics and nature.
        </p>
      </div>
    </article>
  </div>
</section> -->

<section class="section" id="contact">
  <div class="section-heading">
    <p class="eyebrow">03 / Explore</p>
    <h2>Explore</h2>
  </div>

  <div class="section-content math-anchor">
    <p>
      Looking for something else, try exploring
    </p>
    <div class="hero-links">
      <a class="text-link" href="{{ '/publications/' | relative_url }}">My research ↗</a>
      <a class="text-link" href="{{ '/resources/' | relative_url }}">Research resources ↗</a>
      <!-- <a class="text-link" href="{{ '/cv/' | relative_url }}">View curriculum vitae ↗</a> -->
    </div>
  </div>
</section>