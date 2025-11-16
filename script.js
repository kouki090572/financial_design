'use strict';
// （任意）ページ内リンクのスムーススクロール
document.addEventListener('click', (e) => {
                    const link = e.target.closest('a[href^="#"]');
                    if (!link) return;
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                      e.preventDefault();
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  });
                  
                  // （任意）Q&Aアコーディオン（qa__question がある場合のみ動作）
                  document.querySelectorAll('.qa__question').forEach((q) => {
                    q.addEventListener('click', () => {
                      const answer = q.parentElement.querySelector('.qa__answer');
                      if (!answer) return;
                      const isOpen = answer.style.display === 'block';
                      answer.style.display = isOpen ? 'none' : 'block';
                    });
                  });


/* Carousel with Continuous Loop on Right Click */
(function(){
                    const track = document.getElementById('slider-track');
                    if(!track) return;
                  
                    const slides = Array.from(track.querySelectorAll('.slide'));
                    const dots   = Array.from(document.querySelectorAll('.slider__dots .dot'));
                    const prev   = document.querySelector('.slider__nav--prev');
                    const next   = document.querySelector('.slider__nav--next');
                  
                    let current = 0, autoNextTimer = null, snapTimer = null;
                  
                    // スライド移動
                    function go(i){
                      if (i >= slides.length) i = 0;
                      if (i < 0) i = slides.length - 1;
                      const x = i * track.clientWidth;
                      track.scrollTo({ left: x, behavior: 'smooth' });
                      dots.forEach((d, idx) => {
                        d.classList.toggle('is-active', idx === i);
                        d.setAttribute('aria-selected', String(idx === i));
                      });
                      current = i;
                    }
                  
                    // スクロール同期
                    function syncByScroll(){
                      clearTimeout(snapTimer);
                      snapTimer = setTimeout(() => {
                        const i = Math.round(track.scrollLeft / track.clientWidth);
                        if (i !== current) go(i);
                      }, 80);
                    }
                  
                    // 通常クリック
                    next?.addEventListener('click', () => go(current + 1));
                    prev?.addEventListener('click', () => go(current - 1));
                  
                    // 🔹右ボタン押しっぱなしで自動送り
                    next?.addEventListener('mousedown', startAutoNext);
                    next?.addEventListener('touchstart', startAutoNext);
                    next?.addEventListener('mouseup', stopAutoNext);
                    next?.addEventListener('mouseleave', stopAutoNext);
                    next?.addEventListener('touchend', stopAutoNext);
                  
                    function startAutoNext(){
                      stopAutoNext(); // 重複防止
                      autoNextTimer = setInterval(() => {
                        go(current + 1);
                      }, 900); // 🔹0.9秒ごとに次へ（調整可）
                    }
                    function stopAutoNext(){
                      clearInterval(autoNextTimer);
                    }
                  
                    // ドットクリック
                    dots.forEach((d, idx) => d.addEventListener('click', () => go(idx)));
                  
                    // スクロール／リサイズ同期
                    track.addEventListener('scroll', syncByScroll);
                    window.addEventListener('resize', () => go(current));
                  
                    // キーボード操作
                    track.addEventListener('keydown', (e) => {
                      if (e.key === 'ArrowRight') go(current + 1);
                      if (e.key === 'ArrowLeft')  go(current - 1);
                    });
                  
                    // ドラッグ／スワイプ操作
                    let isDown = false, startX = 0, startLeft = 0, pid = null;
                    track.addEventListener('pointerdown', e => {
                      isDown = true; startX = e.clientX; startLeft = track.scrollLeft; pid = e.pointerId;
                      track.setPointerCapture(pid);
                    });
                    track.addEventListener('pointermove', e => {
                      if (!isDown) return;
                      track.scrollLeft = startLeft - (e.clientX - startX);
                    });
                    track.addEventListener('pointerup', () => {
                      if (!isDown) return; isDown = false;
                      const i = Math.round(track.scrollLeft / track.clientWidth);
                      go(i);
                    });
                  
                    // 初期化
                    go(0);
                  })();
                  // FAQ Accordion – tap/click to open answer
(function(){
                    const root = document.querySelector('.accordion');
                    if(!root) return;
                  
                    const singleMode = root.dataset.accordion === 'single';
                    const items = Array.from(root.querySelectorAll('.acc-item'));
                  
                    // アンサーにinnerを包んで高さアニメを自然に
                    items.forEach(item => {
                      const a = item.querySelector('.acc-a');
                      if(!a) return;
                      if(!a.firstElementChild || !a.firstElementChild.classList.contains('acc-a-inner')){
                        const wrap = document.createElement('div');
                        wrap.className = 'acc-a-inner';
                        while (a.firstChild) wrap.appendChild(a.firstChild);
                        a.appendChild(wrap);
                      }
                    });
                  
                    function closeAll(except){
                      if(!singleMode) return;
                      items.forEach(it=>{
                        if(it===except) return;
                        const btn = it.querySelector('.acc-q');
                        const panel = it.querySelector('.acc-a');
                        if(btn.getAttribute('aria-expanded') === 'true'){
                          toggle(it, false);
                        }
                      });
                    }
                  
                    function toggle(item, expand){
                      const btn = item.querySelector('.acc-q');
                      const panel = item.querySelector('.acc-a');
                      const inner = panel.querySelector('.acc-a-inner');
                  
                      const willOpen = (expand !== undefined) ? expand : btn.getAttribute('aria-expanded') !== 'true';
                      btn.setAttribute('aria-expanded', String(willOpen));
                  
                      if(willOpen){
                        panel.hidden = false;
                        // 高さアニメーション
                        const h = inner.offsetHeight;
                        panel.style.height = '0px';
                        panel.getBoundingClientRect(); // reflow
                        panel.style.transition = 'height .25s ease';
                        panel.style.height = h + 'px';
                        panel.addEventListener('transitionend', function end() {
                          panel.style.height = 'auto';
                          panel.style.transition = '';
                          panel.removeEventListener('transitionend', end);
                        });
                      } else {
                        // 閉じるとき
                        const h = inner.offsetHeight;
                        panel.style.height = h + 'px';
                        panel.getBoundingClientRect(); // reflow
                        panel.style.transition = 'height .25s ease';
                        panel.style.height = '0px';
                        panel.addEventListener('transitionend', function end() {
                          panel.hidden = true;
                          panel.style.transition = '';
                          panel.removeEventListener('transitionend', end);
                        });
                      }
                    }
                  
                    // 各ボタンにクリックイベント付与
                    items.forEach(item => {
                      const btn = item.querySelector('.acc-q');
                      btn.addEventListener('click', () => {
                        closeAll(item);
                        toggle(item);
                      });
                    });
                  })();
//公式LINEのACT//
                  const actButton = document.querySelector('.cta-fixed');

                  (() => {
                    const fab = document.querySelector('.cta-fab');
                    const trigger = document.querySelector('.solutions'); // 表示開始
                    const footer = document.getElementById('diagnosis');  // 消える位置
                  
                    if (!fab || !trigger || !footer) return;
                  
                    // 表示（solutionsが見えたら）
                    const showObserver = new IntersectionObserver(([entry]) => {
                      if (entry.isIntersecting) {
                        fab.classList.add('is-visible');
                        document.body.classList.add('cta-active');
                      }
                    }, { threshold: 0.3 });
                  
                    // 非表示（footerに近づいたら）
                    const hideObserver = new IntersectionObserver(([entry]) => {
                      if (entry.isIntersecting) {
                        fab.classList.remove('is-visible');
                        document.body.classList.remove('cta-active');
                      }
                    }, { threshold: 0, rootMargin: '0px 0px -180px 0px' });
                  
                    showObserver.observe(trigger);
                    hideObserver.observe(footer);
                  })();

// heroが画面内にある間は隠す → 抜けたら表示
const hero = document.querySelector('.hero');
const toggleCTA = (show) =>
  document.body.classList.toggle('cta-active', show);

const io = new IntersectionObserver(([e])=>{
  // heroが見えている＝true → 非表示 / 見えなくなったら表示
  toggleCTA(!e.isIntersecting);
}, {threshold: 0.4});
io.observe(hero);

// ページ最下部（footer付近）はCTAを少し下げて邪魔しない（任意）
const footer = document.querySelector('footer');
if (footer){
  const io2 = new IntersectionObserver(([e])=>{
    document.querySelector('.cta-fab')
      .style.transform = e.isIntersecting
        ? 'translateX(-50%) translateY(10px)'
        : '';
  }, {rootMargin: '0px 0px -20% 0px'});
  io2.observe(footer);
}