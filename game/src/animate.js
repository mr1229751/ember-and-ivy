// CSS-transform animation helpers only: shakes, flashes and ember particle bursts.
export function shake(el) {
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 450);
}

export function flash(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 600);
}

export function emberBurst(container, count = 26) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 170;
    p.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(ang) * dist - 60}px`);
    p.style.left = '50%';
    p.style.top = '42%';
    p.style.background = i % 3 === 0 ? '#ffd76a' : '#ff7a26';
    container.appendChild(p);
    setTimeout(() => p.remove(), 1300);
  }
}
