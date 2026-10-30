const viewer = document.querySelector('#photo-viewer');
const links = [...document.querySelectorAll('main a[data-photo]')];
if (viewer && links.length) {
  const photo = viewer.querySelector('[data-viewer-image]');
  const caption = viewer.querySelector('[data-viewer-caption]');
  const counter = viewer.querySelector('[data-viewer-count]');
  const previous = viewer.querySelector('[data-viewer-previous]');
  const next = viewer.querySelector('[data-viewer-next]');
  const error = viewer.querySelector('[data-viewer-error]');
  let index = 0;
  let opener;
  function display(position) {
    index = (position + links.length) % links.length;
    const link = links[index];
    error.hidden = true;
    photo.hidden = false;
    photo.alt = link.dataset.alt || '';
    photo.src = link.href;
    caption.textContent = link.dataset.caption || '';
    counter.textContent = `${index + 1} ${viewer.dataset.separator} ${links.length}`;
    previous.hidden = next.hidden = links.length < 2;
  }
  photo.addEventListener('error', () => { photo.hidden = true; error.hidden = false; });
  links.forEach((link, position) => link.addEventListener('click', event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (typeof viewer.showModal !== 'function') return;
    event.preventDefault();
    opener = link;
    display(position);
    viewer.showModal();
    document.documentElement.classList.add('photo-viewer-open');
  }));
  viewer.querySelector('[data-viewer-close]').addEventListener('click', () => viewer.close());
  previous.addEventListener('click', () => display(index - 1));
  next.addEventListener('click', () => display(index + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); display(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => {
    document.documentElement.classList.remove('photo-viewer-open');
    photo.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });
}
