// El proceso como un git graph: la línea de commits se dibuja con el scroll y un cursor de texto (HEAD) la recorre.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initProcess(reduced) {
  const wrap = document.getElementById('processWrap');
  const svgPath = document.getElementById('pPath');
  const maskPath = document.getElementById('pMask');
  const needle = document.getElementById('needle');
  const nodesEl = document.getElementById('nodes');
  let nodes = [];
  const steps = [...wrap.querySelectorAll('.step')];
  let len = 0, pts = [];
  const build = () => {
    const H = wrap.offsetHeight, Wd = wrap.offsetWidth, mobile = Wd < 760;
    pts = [[mobile ? 8 : 50, 0]];
    steps.forEach((s, i) => {
      const y = ((s.offsetTop + s.offsetHeight * 0.5) / H) * 400;
      pts.push([mobile ? 8 : i % 2 ? 58 : 42, y]);
    });
    pts.push([mobile ? 8 : 50, 400]);
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const dy = y1 - y0;
      d += ` L${x0} ${y0 + dy * 0.38} L${x1} ${y0 + dy * 0.62} L${x1} ${y1}`;
    }
    svgPath.setAttribute('d', d); maskPath.setAttribute('d', d);
    len = maskPath.getTotalLength();
    maskPath.style.strokeDasharray = len; maskPath.style.strokeDashoffset = reduced ? 0 : len;
    nodesEl.textContent = '';
    nodes = pts.slice(1, -1).map(([px, py]) => {
      const el = document.createElement('i'); el.className = 'pnode';
      el.style.left = px + '%'; el.style.top = (py / 400 * H) + 'px'; nodesEl.appendChild(el); return el;
    });
  };
  build();
  const place = (p) => {
    const L = p * len, a = maskPath.getPointAtLength(L), b = maskPath.getPointAtLength(Math.min(len, L + 2));
    const H = wrap.offsetHeight, Wd = wrap.offsetWidth;
    const x = (a[0] ?? a.x) / 100 * Wd, y = a.y / 400 * H;
    gsap.set(needle, { x, y });
    steps.forEach((s, i) => { const c = s.offsetTop + s.offsetHeight * 0.5; const on = y >= c - 10; s.classList.toggle('is-on', on); if (nodes[i]) nodes[i].classList.toggle('is-on', on); });
  };
  if (reduced) { needle.style.display = 'none'; steps.forEach((s) => s.classList.add('is-on')); nodes.forEach((n2) => n2.classList.add('is-on')); return; }
  place(0);
  ScrollTrigger.create({
    trigger: wrap, start: 'top 65%', end: 'bottom 55%', scrub: 0.4,
    onUpdate(self) { maskPath.style.strokeDashoffset = len * (1 - self.progress); place(self.progress); },
    onRefresh() { build(); },
  });
}
