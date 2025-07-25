const canvasDots = function () {
  const canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    colorDot = [
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(81, 162, 233)',
      'rgb(255, 77, 90)',
    ], // 80% of dots are blue. 20% pink
    color = 'rgb(81, 162, 233)';

  // Performance optimizations
  canvas.width = document.body.scrollWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  ctx.lineWidth = 0.3;
  ctx.strokeStyle = color;

  let mousePosition = {
    x: (30 * canvas.width) / 100,
    y: (30 * canvas.height) / 100,
  };

  const windowSize = window.innerWidth;
  let dots;

  // Significantly reduced particle counts for better performance
  if (windowSize > 1600) {
    dots = {
      nb: 150, // Reduced from 600
      distance: 70,
      d_radius: 300,
      array: [],
    };
  } else if (windowSize > 1300) {
    dots = {
      nb: 120, // Reduced from 575
      distance: 60,
      d_radius: 280,
      array: [],
    };
  } else if (windowSize > 1100) {
    dots = {
      nb: 100, // Reduced from 500
      distance: 55,
      d_radius: 250,
      array: [],
    };
  } else if (windowSize > 800) {
    dots = {
      nb: 80, // Reduced from 300
      distance: 0,
      d_radius: 0,
      array: [],
    };
  } else if (windowSize > 600) {
    dots = {
      nb: 50, // Reduced from 200
      distance: 0,
      d_radius: 0,
      array: [],
    };
  } else {
    dots = {
      nb: 30, // Reduced from 100
      distance: 0,
      d_radius: 0,
      array: [],
    };
  }


  // Object pooling for better memory management
  const dotPool = [];
  
  function Dot() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();

    this.radius = Math.random() * 1.5;

    this.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
    this.colorWithAlpha = null; // Cache for color with alpha
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

      // Cache distance and color calculations
      if (!this.colorWithAlpha) {
        const dotDistance =
          ((this.x - mousePosition.x) ** 2 + (this.y - mousePosition.y) ** 2) **
          0.5;
        const distanceRatio = dotDistance / (windowSize / 1.7);
        this.colorWithAlpha = this.colour.slice(0, -1) + `,${1 - distanceRatio})`;
      }

      ctx.fillStyle = this.colorWithAlpha;
      ctx.fill();
    },

    update: function () {
      // Update position
      if (this.y < 0 || this.y > canvas.height) {
        this.vy = -this.vy;
      } else if (this.x < 0 || this.x > canvas.width) {
        this.vx = -this.vx;
      }
      this.x += this.vx;
      this.y += this.vy;
      
      // Invalidate cached color when position changes significantly
      this.colorWithAlpha = null;
    },

    animate: function () {
      // Update all dots except the first one (mouse follower)
      for (let i = 1; i < dots.nb; i++) {
        dots.array[i].update();
      }
    },

    line: function () {
      // Optimized line drawing with early exit conditions
      const mouseX = mousePosition.x;
      const mouseY = mousePosition.y;
      const dRadius = dots.d_radius;
      const distance = dots.distance;
      
      for (let i = 0; i < dots.nb; i++) {
        const i_dot = dots.array[i];
        
        // Skip if dot is too far from mouse
        if (Math.abs(i_dot.x - mouseX) > dRadius || Math.abs(i_dot.y - mouseY) > dRadius) {
          continue;
        }
        
        for (let j = i + 1; j < dots.nb; j++) { // Start from i+1 to avoid duplicate lines
          const j_dot = dots.array[j];
          
          const dx = i_dot.x - j_dot.x;
          const dy = i_dot.y - j_dot.y;
          
          // Quick distance check
          if (Math.abs(dx) < distance && Math.abs(dy) < distance) {
            ctx.beginPath();
            ctx.moveTo(i_dot.x, i_dot.y);
            ctx.lineTo(j_dot.x, j_dot.y);

            // Optimized distance calculation
            const dotDistance = Math.sqrt(dx * dx + dy * dy);
            let distanceRatio = dotDistance / dRadius;

            distanceRatio = Math.max(0, distanceRatio - 0.3);
            ctx.strokeStyle = `rgb(81, 162, 233, ${1 - distanceRatio})`;

            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    },
  };

  let animationId;
  let lastUpdateTime = 0;
  const targetFPS = 30;
  const frameDelay = 1000 / targetFPS;

  function initializeDots() {
    // Clear existing dots and return them to pool
    dots.array.forEach(dot => releaseDot(dot));
    dots.array = [];
    
    // Create new dots
    for (let i = 0; i < dots.nb; i++) {
      const dot = getDot();
      dot.x = Math.random() * canvas.width;
      dot.y = Math.random() * canvas.height;
      dot.vx = -0.5 + Math.random();
      dot.vy = -0.5 + Math.random();
      dot.radius = Math.random() * 1.5;
      dot.colour = colorDot[Math.floor(Math.random() * colorDot.length)];
      dot.colorWithAlpha = null;
      
      dots.array.push(dot);
    }

    // Configure first dot
    dots.array[0].radius = 1.5;
    dots.array[0].colour = '#51a2e9';
  }

  function updateDots(currentTime) {
    // Throttle to target FPS
    if (currentTime - lastUpdateTime < frameDelay) {
      animationId = requestAnimationFrame(updateDots);
      return;
    }
    lastUpdateTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create dots
    for (let i = 0; i < dots.nb; i++) {
      dots.array[i].create();
    }

    // Animate and draw connections
    if (dots.array[0]) {
      dots.array[0].line();
      dots.array[0].animate();
    }

    animationId = requestAnimationFrame(updateDots);
  }

  window.onmousemove = function (parameter) {
    mousePosition.x = parameter.pageX;
    mousePosition.y = parameter.pageY;

    // Update first dot position if it exists
    if (dots.array[0]) {
      dots.array[0].x = parameter.pageX;
      dots.array[0].y = parameter.pageY;
      dots.array[0].colorWithAlpha = null; // Invalidate cache
    }
  };

  mousePosition.x = window.innerWidth / 2;
  mousePosition.y = window.innerHeight / 2;

  // Initialize and start animation
  initializeDots();
  animationId = requestAnimationFrame(updateDots);

  window.onresize = function () {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    canvasDots();
  };
};

export default canvasDots;
