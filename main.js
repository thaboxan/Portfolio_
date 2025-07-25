// window.addEventListener('load', () => {
//   const loader = document.querySelector('.loader-wrapper');
//   setTimeout(() => {
//     loader.classList.add('hidden');
//   }, 3000); // Hide loader after 3 seconds
// });

// document.addEventListener('DOMContentLoaded', () => {
//   // Show loader
//   const loader = document.querySelector('.loader-wrapper');
  
//   // Hide loader after content loads
//   window.addEventListener('load', () => {
//     setTimeout(() => {
//       loader.classList.add('hidden');
//    }, 1000); 
//   });
// });

import canvasDots from "./heroCanvas.js";
import canvasDotsBg from "./bgCanvas.js";

// Performance optimization: Detect device capabilities
const isLowPerformanceDevice = () => {
  return navigator.hardwareConcurrency <= 2 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Performance optimization: Reduce animations on low-performance devices
const shouldReduceAnimations = isLowPerformanceDevice() || 
  (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// Cache DOM elements for better performance
const cursorElement = document.querySelector(".cursor");
const profileElement = document.querySelector(".profile");
const skillsElements = {
  html: document.querySelector(".skills__item--html"),
  js: document.querySelector(".skills__item--js"),
  git: document.querySelector(".skills__item--git"),
  react: document.querySelector(".skills__item--react"),
  npm: document.querySelector(".skills__item--npm"),
  css: document.querySelector(".skills__item--css")
};

// Optimized cursor tracking with throttling
let mouseX = 0, mouseY = 0;
let cursorAnimationFrame;

function updateCursor() {
  if (cursorElement) {
    cursorElement.style.transform = `translate(${mouseX - 22}px, ${mouseY - 22}px)`;
  }
  cursorAnimationFrame = null;
}

// Only add cursor tracking if not on mobile/low-performance device
if (!shouldReduceAnimations && cursorElement) {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY;
    
    if (!cursorAnimationFrame) {
      cursorAnimationFrame = requestAnimationFrame(updateCursor);
    }
  });

  document.addEventListener("mouseleave", (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY;
    
    if (!cursorAnimationFrame) {
      cursorAnimationFrame = requestAnimationFrame(updateCursor);
    }
  });
}

window.onload = function () {
  // Only load canvas animations if not reducing animations
  if (!shouldReduceAnimations) {
    canvasDotsBg();
    canvasDots();
  } else {
    // Hide canvas elements on low-performance devices
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      if (canvas) canvas.style.display = 'none';
    });
  }
};

// Optimized about section fade-in with better performance
let aboutAnimationTriggered = false;
function aboutFadeIn(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && document.body.scrollWidth > 1300 && !aboutAnimationTriggered) {
      aboutAnimationTriggered = true;
      
      if (profileElement) {
        profileElement.classList.add("profile__fade-in");
      }

      // Use a more efficient timing mechanism
      const skillAnimations = [
        { element: skillsElements.html, delay: 1000 },
        { element: skillsElements.js, delay: 1200 },
        { element: skillsElements.git, delay: 1300 },
        { element: skillsElements.npm, delay: 1500 },
        { element: skillsElements.react, delay: 1700 },
        { element: skillsElements.css, delay: 1900 }
      ];

      skillAnimations.forEach(({ element, delay }) => {
        if (element) {
          setTimeout(() => {
            element.classList.add("skills__item-fade-in");
          }, delay);
        }
      });
      
      // Disconnect observer after animation to prevent re-triggering
      observer.disconnect();
    }
  });
}

let options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

let options2 = {
  root: null,
  rootMargin: "0px",
  threshold: 0.2,
};

let observer = new IntersectionObserver(aboutFadeIn, options);

const aboutContent = document.querySelector(".about__content");
if (aboutContent) {
  observer.observe(aboutContent);
}

// Cache navigation elements
const navLinks = document.querySelectorAll(".navigation__item");

// Optimized navigation highlight with throttling
let lastNavUpdate = 0;
const NAV_THROTTLE_DELAY = 100; // Throttle nav updates to every 100ms

function navFadeIn(entries, observer) {
  const now = Date.now();
  if (now - lastNavUpdate < NAV_THROTTLE_DELAY) return;
  lastNavUpdate = now;
  
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.remove("navigation__item--active");
      });

      const targetNav = document.querySelector(`#nav-${entry.target.id}`);
      if (targetNav) {
        targetNav.classList.add("navigation__item--active");
      }
    }
  });
}

function navFadeInProjects(entries, observer) {
  const now = Date.now();
  if (now - lastNavUpdate < NAV_THROTTLE_DELAY) return;
  lastNavUpdate = now;
  
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.remove("navigation__item--active");
      });

      const targetNav = document.querySelector(`#nav-${entry.target.id}`);
      if (targetNav) {
        targetNav.classList.add("navigation__item--active");
      }
    }
  });
}

let observerNav = new IntersectionObserver(navFadeIn, options);

// Safely observe navigation targets
const navTargets = ["#hero", "#about", "#education", "#contact"];
navTargets.forEach(selector => {
  const element = document.querySelector(selector);
  if (element) {
    observerNav.observe(element);
  }
});

let observerNavProjects = new IntersectionObserver(navFadeInProjects, options2);
const projectsElement = document.querySelector("#projects");
if (projectsElement) {
  observerNavProjects.observe(projectsElement);
}

// Get the current year and update safely
const currentYear = new Date().getFullYear();
const yearElement = document.getElementById("current-year");
if (yearElement) {
  yearElement.textContent = currentYear;
}

// Cache hamburger menu elements
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking a link - with event delegation for better performance
  navMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}


// // Get DOM elements
// const chatbotIcon = document.getElementById('chatbotIcon');
// const chatbot = document.getElementById('chatbot');
// const minimizeBtn = document.getElementById('minimizeBtn');
// const closeBtn = document.getElementById('closeBtn');
// const sendBtn = document.getElementById('sendBtn');
// const userInput = document.getElementById('userInput');
// const chatBox = document.querySelector('.chatbox');

// // Timeout handling
// let inactivityTimeout;
// let warningTimeout;
// let warningActive = false;

// function clearChat() {
//     chatBox.innerHTML = '';
// }

// function showWarningMessage() {
//     if (!warningActive) {
//         addChatMessage("Are you still there? Reply with Yes within 30 seconds to continue the conversation.", 'incoming');
//         warningActive = true;
//         warningTimeout = setTimeout(() => {
//             clearChat();
//             chatbot.style.display = 'none';
//             warningActive = false;
//         }, 30000);
//     }
// }

// function resetTimeout() {
//     clearTimeout(inactivityTimeout);
//     clearTimeout(warningTimeout);
//     warningActive = false;
//     inactivityTimeout = setTimeout(() => {
//         showWarningMessage();
//     }, 120000);
// }

// // Chatbot responses
// const botReplies = {
  
//     "hello": "Hi! I'm your portfolio assistant. How can I help you today?",
//     "hi": "Hello! I'm here to tell you about Thabo Jafta's work and experience. What would you like to know?",
//     "about": "I'm Thabo Jafta, a motivated intern specializing in front-end and cloud technologies. I excel in building efficient and scalable solutions using modern frameworks and tools.",
//     "skills": "My key skills include: JavaScript, Python, HTML5/CSS3, MariaDB/MySQL, AWS cloud development, and version control. I am also proficient with frameworks like React.js, Tailwind CSS, and Bootstrap.",
//     "experience": "I have experience as a Maintenance Planner at Trio Consulting, a Biosafety Engineer at the National Institute for Occupational Health, and currently as an intern at Capaciti/WIPRO. Would you like to know more about any specific role?",
//     "education": "I studied Mechanical Engineering, earning a Bachelor of Technology from the University of Johannesburg and a National Diploma from Walter Sisulu University. I also hold a Certificate in Software Engineering from Codespace Academy.",
//     "projects": "I've worked on several exciting projects, including a Kanban live app and other GitHub-hosted solutions. You can view them on my GitHub profile: https://github.com/thaboxan. Would you like more details about any of them?",
//     "contact": "You can reach me at thvbojafta@gmail.com or connect with me on LinkedIn at https://www.linkedin.com/in/thabojafta1.",
//     "default": "I'm not sure I understand. Try asking about my skills, experience, education, projects, or how to contact me."

// };

// // Event Listeners
// chatbotIcon.addEventListener('click', () => {
//     chatbot.style.display = chatbot.style.display === 'none' || chatbot.style.display === '' ? 'flex' : 'none';
//     resetTimeout();
// });

// minimizeBtn.addEventListener('click', () => {
//     chatbot.style.display = 'none';
// });

// closeBtn.addEventListener('click', () => {
//     chatbot.style.display = 'none';
//     clearChat();
// });

// sendBtn.addEventListener('click', () => {
//     const userText = userInput.value.trim();
//     if (userText) {
//         if (warningActive) {
//             clearTimeout(warningTimeout);
//             warningActive = false;
//         }
//         addChatMessage(userText, 'outgoing');
//         setTimeout(() => {
//             const botResponse = botReplies[userText.toLowerCase()] || botReplies["default"];
//             addChatMessage(botResponse, 'incoming');
//         }, 1000);
//     }
//     userInput.value = '';
//     resetTimeout();
// });

// function addChatMessage(message, type) {
//     const chatMessage = document.createElement('li');
//     chatMessage.classList.add('chat', type);
//     chatMessage.innerHTML = `<p>${message}</p>`;
//     chatBox.appendChild(chatMessage);
//     chatBox.scrollTop = chatBox.scrollHeight;
//     resetTimeout();
// }
