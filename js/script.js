// 页面切换3D效果
function switchPage(targetPage) {
  const currentPage = document.querySelector('.page.active');
  const nextPage = document.querySelector(`.${targetPage}`);

  if (currentPage === nextPage) return;

  // 更新body类
  document.body.classList.remove('login-page', 'explore-page');
  document.body.classList.add(targetPage);

  // GSAP动画
  gsap.to(currentPage, {
    opacity: 0,
    x: targetPage === 'explore-page' ? '-50%' : '50%',
    rotationY: targetPage === 'explore-page' ? 15 : -15,
    duration: 1.2,
    ease: "power3.inOut",
    onComplete: () => {
      currentPage.classList.remove('active');
    }
  });

  gsap.fromTo(nextPage,
    {
      opacity: 0,
      x: targetPage === 'explore-page' ? '50%' : '-50%',
      rotationY: targetPage === 'explore-page' ? -15 : 15
    },
    {
      opacity: 1,
      x: 0,
      rotationY: 0,
      duration: 1.2,
      ease: "power3.inOut",
      onStart: () => {
        nextPage.classList.add('active');
      }
    }
  );

  // 背景元素动画
  animateDecorations(targetPage);
}

// 文化装饰元素动画
function animateDecorations(targetPage) {
  const yungang = document.querySelector('.decoration.yungang');
  const wall = document.querySelector('.decoration.wall');
  const coal = document.querySelector('.decoration.coal');

  if (targetPage === 'login-page') {
    gsap.to(yungang, { x: '0%', duration: 1.5, ease: "elastic.out(1, 0.5)" });
    gsap.to(wall, { x: '0%', duration: 1.5, ease: "elastic.out(1, 0.5)", delay: 0.2 });
    gsap.to(coal, { scale: 1, opacity: 0.15, duration: 1 });
  } else {
    gsap.to(yungang, { x: '-100%', duration: 1 });
    gsap.to(wall, { x: '100%', duration: 1 });
    gsap.to(coal, { scale: 1.5, opacity: 0.05, duration: 1 });
  }
}

// 高级粒子背景
class ParticleBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.colors = ['#8B4513', '#D4AF37', '#B22222', '#4A3C2A'];
    this.maxParticles = window.innerWidth < 768 ? 50 : 150;

    this.init();
    this.animate();

    window.addEventListener('resize', this.resize.bind(this));
  }

  init() {
    this.resize();

    // 创建粒子
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const type = Math.floor(Math.random() * 3); // 0-云冈, 1-城墙, 2-煤

    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 5 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      type: type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.02 - 0.01
    };
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  drawParticle(particle) {
    this.ctx.save();
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);

    // 根据类型绘制不同形状
    switch (particle.type) {
      case 0: // 云冈石窟风格
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        break;

      case 1: // 城墙风格
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(-particle.size, -particle.size / 2, particle.size * 2, particle.size);
        break;

      case 2: // 煤块风格
        this.ctx.beginPath();
        this.ctx.moveTo(0, -particle.size);
        this.ctx.lineTo(particle.size, 0);
        this.ctx.lineTo(0, particle.size);
        this.ctx.lineTo(-particle.size, 0);
        this.ctx.closePath();
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        break;
    }

    this.ctx.restore();
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // 更新位置
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // 边界检查
      if (p.x < 0 || p.x > this.width) p.speedX *= -1;
      if (p.y < 0 || p.y > this.height) p.speedY *= -1;
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 绘制粒子
    for (let i = 0; i < this.particles.length; i++) {
      this.drawParticle(this.particles[i]);
    }

    this.updateParticles();
    requestAnimationFrame(this.animate.bind(this));
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
  // 初始化粒子背景
  const canvas = document.getElementById('particle-canvas');
  new ParticleBackground(canvas);

  // 导航点击事件
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('data-page') ||
        this.getAttribute('href').replace('.html', '').replace('/', '');

      if (target === 'login' || target === 'register') {
        switchPage('login-page');
      } else if (target === 'explore') {
        switchPage('explore-page');
      }
    });
  });

  // 表单切换
  document.querySelectorAll('.switch-form').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('data-target');

      document.querySelectorAll('.form').forEach(form => {
        form.classList.toggle('active', form.id === `${target}-form`);
      });
    });
  });

  // 视差效果
  if (document.querySelector('.explore-page')) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      document.querySelectorAll('.cultural-card').forEach((card, index) => {
        const depth = index * 0.1 + 0.1;
        const xMove = x * 20 * depth;
        const yMove = y * 20 * depth;

        card.style.transform = `translate3d(${xMove}px, ${yMove}px, ${depth * 20}px)`;
      });
    });
  }
});