// Actualizar el año en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// anime.js timeline for hero
document.addEventListener('DOMContentLoaded', ()=> {
  anime.timeline({duration:700, easing:'easeOutExpo'})
    .add({targets:'.glitch', translateY:[-20,0], opacity:[0,1], delay:120})
    .add({targets:'.role', opacity:[0,1], translateY:[-6,0]}, '-=450')
    .add({targets:'.lead', opacity:[0,1], translateY:[-6,0]}, '-=430')
    // Animación para el contenedor del avatar
    .add({targets:'.avatar-container', scale:[0.9,1], opacity:[0,1], delay:200}, '-=500'); 

  
  // Iniciar la animación de los átomos con la lógica de rebote
  animateAtom(); 
  animateBounce('.atom-1', 0.5, 0.4, 1.0); // Atomo 1: Velocidad media, tamaño normal
  animateBounce('.atom-2', 0.4, 0.6, 0.8); // Atomo 2: Velocidad diferente, más pequeño
});

// Función para animar el Átomo (Rotación Interna)
function animateAtom() {
    // 1. Rotación continua de los electrones sobre sus órbitas (Animación interna)
    anime({
        targets: '.electron-cyan',
        rotate: '360deg', 
        duration: 12000,
        easing: 'linear',
        loop: true
    });

    anime({
        targets: '.electron-magenta',
        rotate: '-360deg', 
        duration: 8000,
        easing: 'linear',
        loop: true
    });

    // 2. Rotación ambiental muy lenta del contenedor 3D
    anime({
        targets: '.atom-container',
        rotateY: '+=360',
        rotateX: '+=360',
        duration: 80000, 
        easing: 'linear',
        loop: true
    });
}


/* LÓGICA DE REBOTE (SCREENSAVER) - NUEVA FUNCIÓN CLAVE */
function animateBounce(selector, vx_initial, vy_initial, scale_val) {
    const element = document.querySelector(selector);
    const container = document.querySelector('.animation-box');

    if (!element || !container) return;

    let x = parseFloat(element.style.left || element.style.left) || (selector === '.atom-1' ? 10 : 80);
    let y = parseFloat(element.style.top || element.style.top) || (selector === '.atom-1' ? 5 : 40);
    let vx = vx_initial;
    let vy = vy_initial;
    const atom_size = 100 * scale_val; // Tamaño del átomo con escala

    // Función de actualización por frame
    function updatePosition() {
        // Obtenemos las dimensiones de la caja
        const container_width = container.clientWidth;
        const container_height = container.clientHeight;
        
        // Convertimos X e Y de % a píxeles para el cálculo
        let x_px = (x / 100) * container_width;
        let y_px = (y / 100) * container_height;

        // 1. Aplicar movimiento
        x_px += vx;
        y_px += vy;

        // 2. Detección de Colisión (Eje X)
        if (x_px + atom_size > container_width || x_px < 0) {
            vx *= -1; // Cambiar dirección horizontal
            x_px = Math.max(0, Math.min(x_px, container_width - atom_size)); // Evita que se salga
        }

        // 3. Detección de Colisión (Eje Y)
        if (y_px + atom_size > container_height || y_px < 0) {
            vy *= -1; // Cambiar dirección vertical
            y_px = Math.max(0, Math.min(y_px, container_height - atom_size)); // Evita que se salga
        }
        
        // 4. Aplicar la nueva posición (usando transform para el rendimiento)
        element.style.transform = `translate(${x_px}px, ${y_px}px) scale(${scale_val})`;
        
        // 5. Convertimos de nuevo a % para mantener un estado lógico
        x = (x_px / container_width) * 100;
        y = (y_px / container_height) * 100;
        
        requestAnimationFrame(updatePosition);
    }
    
    // Establecer la posición inicial
    element.style.left = '0';
    element.style.top = '0';
    
    updatePosition();
}


// PARTICLES canvas (simple floating neon particles)
(function(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], maxP = 80;

  function resize(){
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(min,max){ return Math.random()*(max-min)+min }

  function Particle(){
    this.x = rand(0,W);
    this.y = rand(0,H);
    this.r = rand(0.8,2.8);
    this.vx = rand(-0.3,0.3);
    this.vy = rand(-0.2,0.6);
    this.life = rand(60,400);
    this.tick = 0;
    // color gradient neon
    const choice = Math.random();
    if(choice < 0.4) this.color = 'rgba(0,255,209,';
    else if(choice < 0.75) this.color = 'rgba(163,47,240,';
    else this.color = 'rgba(111,255,179,';
  }

  Particle.prototype.step = function(){
    this.x += this.vx;
    this.y -= this.vy; // upward drift
    this.tick++;
    if(this.tick > this.life || this.y < -10 || this.x < -10 || this.x > W+10){
      // reset
      this.x = rand(0,W);
      this.y = H + rand(10,80);
      this.tick = 0;
      this.life = rand(60,400);
      this.vx = rand(-0.3,0.3);
      this.vy = rand(-0.2,0.6);
    }
  }

  Particle.prototype.draw = function(){
    ctx.beginPath();
    const alpha = 0.2 + 0.8*(1 - (this.tick/this.life));
    ctx.fillStyle = this.color + alpha + ')';
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
  }

  function init(){
    particles = [];
    for(let i=0;i<maxP;i++) particles.push(new Particle());
  }
  function loop(){
    ctx.clearRect(0,0,W,H);
    for(let p of particles){
      p.step();
      p.draw();
    }
    requestAnimationFrame(loop);
  }
  init();
  loop();
})();

// small parallax for holo glow (cursor)
window.addEventListener('mousemove', (e) => {
  const holo = document.querySelector('.holo');
  if(!holo) return;
  // Parallax más suave
  const x = (e.clientX / window.innerWidth - 0.5) * 15;
  const y = (e.clientY / window.innerHeight - 0.5) * 15;
  holo.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});