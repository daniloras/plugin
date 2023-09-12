async function scrollToNextVisibleArea() {
  const viewportHeight = window.innerHeight;
  const scrollPosition = window.scrollY;
  const nextScrollPosition = scrollPosition + viewportHeight;

  window.scrollTo(0, nextScrollPosition);
}


scrollToNextVisibleArea();