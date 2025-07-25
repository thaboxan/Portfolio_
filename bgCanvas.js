const canvasDotsBg = function () {
  const canvas = document.querySelector(".canvas-2"),
    ctx = canvas.getContext("2d"),
    colorDot = [
      "rgb(81, 162, 233)",
      "rgb(81, 162, 233)",
      "rgb(81, 162, 233)",
      "rgb(255, 77, 90)",
    ], // 75% of dots are blue. 25% pink
    color = "rgb(81, 162, 233)";

  canvas.width = document.body.scrollWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";
  ctx.lineWidth = 0.3;
  ctx.strokeStyle = color;

  let mousePosition = {
    x: (30 * canvas.width) / 100,
    y: (30 * canvas.height) / 100,
  };

  const windowSize = window.innerWidth;
  let dots;

  // Optimized particle counts
  if (windowSize > 1600) {
    dots = {
      nb: 60, // Reduced from 100
      distance: 0,
      d_radius: 0,
      array: [],
    };
  } else if (windowSize > 1300) {
    dots = {
      nb: 45, // Reduced from 75
      distance: 0,
      d_radius: 0,
      array: [],
    };
  } else if (windowSize > 1100) {
    dots = {
      nb: 30, // Reduced from 50
      distance: 0,
      d_radius: 0,
      array: [],
    };
  } else if (windowSize > 800) {
    dots = {
      nb: 1,
      distance: 0,
      d_radius: 0,
      array: [],
    };
    ctx.globalAlpha = 0;
  } else if (windowSize > 600) {
    dots = {
      nb: 1,
      distance: 0,
      d_radius: 0,
      array: [],
    };
    ctx.globalAlpha = 0;
  } else {
    dots = {
      nb: 1,
      distance: 0,
      d_radius: 0,
      array: [],
    };
    ctx.globalAlpha = 0;
  }

  // Object pooling for background dots
  const dotPool = [];
  
  function Dot() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();
    this.radius = Math.random() * 1.5;
    this.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
    this.cachedFillStyle = null;
  }
  
  function getDot() {
    return dotPool.length > 0 ? dotPool.pop() : new Dot();
  }
  
  function releaseDot(dot) {
    dotPool.push(dot);
  }

  Dot.prototype = {
    create: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

      // Cache fill style calculation to avoid repeated string operations
      if (!this.cachedFillStyle) {
        const top = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);
        const dotDistance = Math.sqrt(
          (this.x - mousePosition.x) ** 2 + 
          (this.y - mousePosition.y + top) ** 2
        );
        const distanceRatio = dotDistance / (windowSize / 2);
        this.cachedFillStyle = this.colour.slice(0, -1) + `,${Math.max(0, 1 - distanceRatio)})`;
      }

      ctx.fillStyle = this.cachedFillStyle;
      ctx.fill();
    },

    update: function () {
      if (this.y < 0 || this.y > canvas.height) {
        this.vy = -this.vy;
      } else if (this.x < 0 || this.x > canvas.width) {
        this.vx = -this.vx;
      }
      this.x += this.vx;
      this.y += this.vy;
      
      // Invalidate cache when position changes
      this.cachedFillStyle = null;
    },

    animate: function () {
      // Update all dots except the first one
      for (let i = 1; i < dots.nb; i++) {
        dots.array[i].update();
      }
    },

    line: function () {
      // Background canvas typically doesn't need line connections
      // This can be left empty or removed for better performance
    },
  };

  let animationId;
  let lastUpdateTime = 0;
  const targetFPS = 20; // Lower FPS for background animation
  const frameDelay = 1000 / targetFPS;

  function initializeDots() {
    // Clear and pool existing dots
    dots.array.forEach(dot => releaseDot(dot));
    dots.array = [];
    
    // Create new dots using object pool
    for (let i = 0; i < dots.nb; i++) {
      const dot = getDot();
      dot.x = Math.random() * canvas.width;
      dot.y = Math.random() * canvas.height;
      dot.vx = -0.5 + Math.random();
      dot.vy = -0.5 + Math.random();
      dot.radius = Math.random() * 1.5;
      dot.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
      dot.cachedFillStyle = null;
      
      dots.array.push(dot);
    }

    // Configure first dot
    if (dots.array[0]) {
      dots.array[0].radius = 1.5;
      dots.array[0].colour = "#51a2e9";
    }
  }

  function updateDots(currentTime) {
    // Throttle to target FPS
    if (currentTime - lastUpdateTime < frameDelay) {
      animationId = requestAnimationFrame(updateDots);
      return;
    }
    lastUpdateTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create and animate dots
    for (let i = 0; i < dots.nb; i++) {
      dots.array[i].create();
    }

    if (dots.array[0]) {
      dots.array[0].animate();
    }

    animationId = requestAnimationFrame(updateDots);
  }

  window.onscroll = function (parameter) {
    mousePosition.x = window.innerWidth / 2;
    mousePosition.y = window.innerHeight / 2;

    const top = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);
    mousePosition.y += top;
    
    // Invalidate cached styles when scrolling
    dots.array.forEach(dot => {
      dot.cachedFillStyle = null;
    });
  };

  // Initialize and start animation
  initializeDots();
  animationId = requestAnimationFrame(updateDots);

  window.onresize = function () {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    canvasDotsBg();
  };
};

export default canvasDotsBg;
