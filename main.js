document.addEventListener('DOMContentLoaded', () => {
  // Show loader
  const loader = document.querySelector('.loader-wrapper');
  
  // Hide loader after content loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 1000); // Adjust time as needed
  });
});

import canvasDots from "./heroCanvas.js";
import canvasDotsBg from "./bgCanvas.js";

let title = document.querySelector(".title");
let curs = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  let x = e.pageX;
  let y = e.pageY;
  curs.style.left = x - 22 + "px";
  curs.style.top = y - 22 + "px";
});

document.addEventListener("mouseleave", (e) => {
  let x = e.pageX;
  let y = e.pageY;
  curs.style.left = x - 22 + "px";
  curs.style.top = y - 22 + "px";
});

window.onload = function () {
  canvasDotsBg();
  canvasDots();
};

// loads in about section on scroll
function aboutFadeIn(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && document.body.scrollWidth > 1300) {
      document.querySelector(".profile").classList.add("profile__fade-in");

      const sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
      };

      //html
      sleep(1000).then(() => {
        document
          .querySelector(".skills__item--html")
          .classList.add("skills__item-fade-in");
      });

      //js
      sleep(1200).then(() => {
        document
          .querySelector(".skills__item--js")
          .classList.add("skills__item-fade-in");
      });

      //git
      sleep(1300).then(() => {
        document
          .querySelector(".skills__item--git")
          .classList.add("skills__item-fade-in");
      });

      //react
      sleep(1700).then(() => {
        document
          .querySelector(".skills__item--react")
          .classList.add("skills__item-fade-in");
      });
      //node
      sleep(1500).then(() => {
        document
          .querySelector(".skills__item--npm")
          .classList.add("skills__item-fade-in");
      });

      //css
      sleep(1900).then(() => {
        document
          .querySelector(".skills__item--css")
          .classList.add("skills__item-fade-in");
      });
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

observer.observe(document.querySelector(".about__content"));

// navigation items in nav bar
const navLinks = document.querySelectorAll(".navigation__item");

// change highlighted nav link depending on page position
function navFadeIn(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.remove("navigation__item--active");
      });

      document
        .querySelector(`#nav-${entry.target.id}`)
        .classList.add("navigation__item--active");
    }
  });
}

// projects section is a lot longer and needs custom settings
function navFadeInProjects(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.remove("navigation__item--active");
      });

      document
        .querySelector(`#nav-${entry.target.id}`)
        .classList.add("navigation__item--active");
    }
  });
}

let observerNav = new IntersectionObserver(navFadeIn, options);

observerNav.observe(document.querySelector("#hero"));
observerNav.observe(document.querySelector("#about"));
observerNav.observe(document.querySelector("#contact"));

let observerNavProjects = new IntersectionObserver(navFadeInProjects, options2);

observerNavProjects.observe(document.querySelector("#projects"));

// Get the current year
const currentYear = new Date().getFullYear();

// Update the span element with the current year
document.getElementById("current-year").textContent = currentYear;

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close menu when clicking a link
document.querySelectorAll(".nav-link").forEach(link => 
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);


// Get DOM elements
const chatbotIcon = document.getElementById('chatbotIcon');
const chatbot = document.getElementById('chatbot');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.querySelector('.chatbox');

// Timeout handling
let inactivityTimeout;
let warningTimeout;
let warningActive = false;

function clearChat() {
    chatBox.innerHTML = '';
}

function showWarningMessage() {
    if (!warningActive) {
        addChatMessage("Are you still there? Reply with Yes within 30 seconds to continue the conversation.", 'incoming');
        warningActive = true;
        warningTimeout = setTimeout(() => {
            clearChat();
            chatbot.style.display = 'none';
            warningActive = false;
        }, 30000);
    }
}

function resetTimeout() {
    clearTimeout(inactivityTimeout);
    clearTimeout(warningTimeout);
    warningActive = false;
    inactivityTimeout = setTimeout(() => {
        showWarningMessage();
    }, 120000);
}

// Chatbot responses
const botReplies = {
  
    "hello": "Hi! I'm your portfolio assistant. How can I help you today?",
    "hi": "Hello! I'm here to tell you about Thabo Jafta's work and experience. What would you like to know?",
    "about": "I'm Thabo Jafta, a motivated intern specializing in front-end and cloud technologies. I excel in building efficient and scalable solutions using modern frameworks and tools.",
    "skills": "My key skills include: JavaScript, Python, HTML5/CSS3, MariaDB/MySQL, AWS cloud development, and version control. I am also proficient with frameworks like React.js, Tailwind CSS, and Bootstrap.",
    "experience": "I have experience as a Maintenance Planner at Trio Consulting, a Biosafety Engineer at the National Institute for Occupational Health, and currently as an intern at Capaciti/WIPRO. Would you like to know more about any specific role?",
    "education": "I studied Mechanical Engineering, earning a Bachelor of Technology from the University of Johannesburg and a National Diploma from Walter Sisulu University. I also hold a Certificate in Software Engineering from Codespace Academy.",
    "projects": "I've worked on several exciting projects, including a Kanban live app and other GitHub-hosted solutions. You can view them on my GitHub profile: https://github.com/thaboxan. Would you like more details about any of them?",
    "contact": "You can reach me at thvbojafta@gmail.com or connect with me on LinkedIn at https://www.linkedin.com/in/thabojafta1.",
    "default": "I'm not sure I understand. Try asking about my skills, experience, education, projects, or how to contact me."

};

// Event Listeners
chatbotIcon.addEventListener('click', () => {
    chatbot.style.display = chatbot.style.display === 'none' || chatbot.style.display === '' ? 'flex' : 'none';
    resetTimeout();
});

minimizeBtn.addEventListener('click', () => {
    chatbot.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
    chatbot.style.display = 'none';
    clearChat();
});

sendBtn.addEventListener('click', () => {
    const userText = userInput.value.trim();
    if (userText) {
        if (warningActive) {
            clearTimeout(warningTimeout);
            warningActive = false;
        }
        addChatMessage(userText, 'outgoing');
        setTimeout(() => {
            const botResponse = botReplies[userText.toLowerCase()] || botReplies["default"];
            addChatMessage(botResponse, 'incoming');
        }, 1000);
    }
    userInput.value = '';
    resetTimeout();
});

function addChatMessage(message, type) {
    const chatMessage = document.createElement('li');
    chatMessage.classList.add('chat', type);
    chatMessage.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(chatMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
    resetTimeout();
}
