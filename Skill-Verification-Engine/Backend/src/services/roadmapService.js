/**
 * roadmapService.js — Generates and persists learning roadmaps for each skill + level.
 * Roadmaps are hardcoded JSON (no LLM call needed).
 */

import User from "../models/user.model.js";

// ─── Hardcoded Roadmap Data ───────────────────────────────────────────────────

const ROADMAPS = {
  React: {
    Beginner: {
      focus_areas: ["JSX syntax and expressions", "Functional components", "Props and state basics", "useEffect hook", "Rendering lists and conditional UI"],
      projects: ["Todo app", "Counter with reset", "Simple weather card"],
      resources: [
        { title: "React Official Docs — Quick Start", url: "https://react.dev/learn", type: "docs" },
        { title: "Scrimba — Learn React for Free", url: "https://scrimba.com/learn/learnreact", type: "course" },
        { title: "Traversy Media — React Crash Course", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", type: "video" },
      ],
      estimated_weeks: 4,
    },
    Intermediate: {
      focus_areas: ["Custom hooks", "Context API", "React Router v6", "Performance optimisation (memo, useMemo, useCallback)", "Error boundaries"],
      projects: ["Full CRUD app with auth", "Dashboard with charts", "Multi-page portfolio site"],
      resources: [
        { title: "React Official Docs — Advanced Guides", url: "https://react.dev/learn/reusing-logic-with-custom-hooks", type: "docs" },
        { title: "roadmap.sh — React Roadmap", url: "https://roadmap.sh/react", type: "docs" },
        { title: "Jack Herrington — Advanced React Patterns", url: "https://www.youtube.com/watch?v=J1nCIqNKj6g", type: "video" },
      ],
      estimated_weeks: 6,
    },
    Advanced: {
      focus_areas: ["React Server Components", "Concurrent mode and Suspense", "Testing with Jest + React Testing Library", "Micro-frontends", "State management (Zustand / Redux Toolkit)"],
      projects: ["Open-source contribution", "Production SaaS feature", "Reusable component library (npm publishable)"],
      resources: [
        { title: "React Docs — Server Components", url: "https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023", type: "docs" },
        { title: "Kent C. Dodds — Epic React", url: "https://epicreact.dev", type: "course" },
        { title: "Theo — React in 2024", url: "https://www.youtube.com/watch?v=CQuTF-bkOgc", type: "video" },
      ],
      estimated_weeks: 8,
    },
  },

  JavaScript: {
    Beginner: {
      focus_areas: ["Variables (let/const/var)", "Data types and type coercion", "Control flow (if/else, loops)", "Functions and scope", "DOM manipulation basics"],
      projects: ["Calculator", "Colour flipper", "Simple quiz game"],
      resources: [
        { title: "MDN — JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "docs" },
        { title: "freeCodeCamp — JS Algorithms and Data Structures", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", type: "course" },
        { title: "Traversy Media — JS Crash Course", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", type: "video" },
      ],
      estimated_weeks: 4,
    },
    Intermediate: {
      focus_areas: ["Promises and async/await", "ES6+ features (destructuring, spread, modules)", "Closures and higher-order functions", "Error handling", "Fetch API and REST"],
      projects: ["Weather app with API", "Movie search app", "Local expense tracker"],
      resources: [
        { title: "JavaScript.info — The Modern JS Tutorial", url: "https://javascript.info", type: "docs" },
        { title: "roadmap.sh — JavaScript Roadmap", url: "https://roadmap.sh/javascript", type: "docs" },
        { title: "Fireship — JavaScript Pro Tips", url: "https://www.youtube.com/watch?v=Mus_vwhTCq0", type: "video" },
      ],
      estimated_weeks: 5,
    },
    Advanced: {
      focus_areas: ["Prototypes and class internals", "Event loop and concurrency", "Design patterns (Observer, Module, Factory)", "TypeScript integration", "Performance profiling"],
      projects: ["Custom promise implementation", "Build a mini framework", "Contribute to open-source JS library"],
      resources: [
        { title: "You Don't Know JS (Book series, free online)", url: "https://github.com/getify/You-Dont-Know-JS", type: "docs" },
        { title: "Frontend Masters — JavaScript: The Hard Parts", url: "https://frontendmasters.com/courses/javascript-hard-parts-v2/", type: "course" },
        { title: "Fireship — JavaScript Under the Hood", url: "https://www.youtube.com/watch?v=FSs_JYwnAdI", type: "video" },
      ],
      estimated_weeks: 7,
    },
  },

  "Node.js": {
    Beginner: {
      focus_areas: ["Node.js runtime and modules", "File system (fs module)", "HTTP module basics", "NPM and package.json", "Building a basic Express server"],
      projects: ["Hello World REST API", "File reader CLI", "Simple JSON server"],
      resources: [
        { title: "Node.js Official Docs", url: "https://nodejs.org/en/docs/", type: "docs" },
        { title: "freeCodeCamp — Node.js Full Course", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", type: "video" },
        { title: "roadmap.sh — Node.js Roadmap", url: "https://roadmap.sh/nodejs", type: "docs" },
      ],
      estimated_weeks: 4,
    },
    Intermediate: {
      focus_areas: ["Express middleware", "REST API design (CRUD)", "JWT authentication", "MongoDB with Mongoose", "Environment variables and config"],
      projects: ["Blog REST API with auth", "E-commerce backend", "URL shortener service"],
      resources: [
        { title: "Express.js Docs", url: "https://expressjs.com", type: "docs" },
        { title: "Traversy Media — Node/Express REST API", url: "https://www.youtube.com/watch?v=enopDSs3DRw", type: "video" },
        { title: "The Odin Project — NodeJS Path", url: "https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs", type: "course" },
      ],
      estimated_weeks: 6,
    },
    Advanced: {
      focus_areas: ["Streams and buffers", "Worker threads and clustering", "WebSockets (ws / Socket.io)", "Rate limiting and security (helmet, express-rate-limit)", "Microservices architecture"],
      projects: ["Real-time chat app", "File upload/processing service", "Production-grade API with logging and monitoring"],
      resources: [
        { title: "Node.js Best Practices (GitHub)", url: "https://github.com/goldbergyoni/nodebestpractices", type: "docs" },
        { title: "Hussein Nasser — Node.js Advanced Concepts", url: "https://www.udemy.com/course/advanced-node-for-developers/", type: "course" },
        { title: "Fireship — Node.js Explained", url: "https://www.youtube.com/watch?v=ENrzD9HAZK4", type: "video" },
      ],
      estimated_weeks: 8,
    },
  },

  Python: {
    Beginner: {
      focus_areas: ["Python syntax and data types", "Control flow and loops", "Functions and modules", "Lists, dicts, sets, tuples", "File I/O"],
      projects: ["Number guessing game", "Basic calculator", "CSV data reader"],
      resources: [
        { title: "Python Official Docs — Tutorial", url: "https://docs.python.org/3/tutorial/", type: "docs" },
        { title: "freeCodeCamp — Python for Beginners", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", type: "video" },
        { title: "Automate the Boring Stuff with Python (free book)", url: "https://automatetheboringstuff.com", type: "docs" },
      ],
      estimated_weeks: 4,
    },
    Intermediate: {
      focus_areas: ["OOP in Python (classes, inheritance)", "Decorators and generators", "Virtual environments and pip", "Exception handling", "Working with APIs (requests library)"],
      projects: ["Weather CLI app", "Web scraper", "REST API with FastAPI or Flask"],
      resources: [
        { title: "Real Python — Tutorials", url: "https://realpython.com", type: "docs" },
        { title: "roadmap.sh — Python Roadmap", url: "https://roadmap.sh/python", type: "docs" },
        { title: "Corey Schafer — Python OOP Tutorial", url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM", type: "video" },
      ],
      estimated_weeks: 5,
    },
    Advanced: {
      focus_areas: ["Async programming (asyncio)", "Type hints and mypy", "Testing (pytest, mocking)", "Data science stack (NumPy, Pandas, Matplotlib)", "Design patterns in Python"],
      projects: ["ML classification pipeline", "Async web scraper", "Contribute to open-source Python library"],
      resources: [
        { title: "Python Docs — asyncio", url: "https://docs.python.org/3/library/asyncio.html", type: "docs" },
        { title: "ArjanCodes — Advanced Python", url: "https://www.youtube.com/@ArjanCodes", type: "video" },
        { title: "Fluent Python (book)", url: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/", type: "course" },
      ],
      estimated_weeks: 8,
    },
  },

  MongoDB: {
    Beginner: {
      focus_areas: ["Document model vs relational", "CRUD operations (insertOne, find, updateOne, deleteOne)", "MongoDB Atlas setup", "Filtering and projection", "Basic indexes"],
      projects: ["Contact book app", "Simple product catalogue", "Note-taking app backend"],
      resources: [
        { title: "MongoDB Official Docs — CRUD", url: "https://www.mongodb.com/docs/manual/crud/", type: "docs" },
        { title: "freeCodeCamp — MongoDB Course", url: "https://www.youtube.com/watch?v=c2M-rlkkT5o", type: "video" },
        { title: "MongoDB University (free)", url: "https://learn.mongodb.com", type: "course" },
      ],
      estimated_weeks: 3,
    },
    Intermediate: {
      focus_areas: ["Aggregation pipeline", "Schema design patterns (embedding vs referencing)", "Mongoose ODM", "Transactions", "TTL indexes and data expiry"],
      projects: ["Blog with comments (nested refs)", "E-commerce product + order system", "Analytics dashboard with aggregations"],
      resources: [
        { title: "MongoDB Docs — Aggregation", url: "https://www.mongodb.com/docs/manual/aggregation/", type: "docs" },
        { title: "Mongoose Docs", url: "https://mongoosejs.com/docs/", type: "docs" },
        { title: "Traversy Media — MongoDB + Mongoose Crash Course", url: "https://www.youtube.com/watch?v=DZBGEVgL2eE", type: "video" },
      ],
      estimated_weeks: 5,
    },
    Advanced: {
      focus_areas: ["Replica sets and sharding", "Change streams", "Atlas Search (full-text)", "Performance tuning and explain plans", "Multi-document ACID transactions"],
      projects: ["Real-time data feed with change streams", "Full-text search feature", "High-availability replica set setup"],
      resources: [
        { title: "MongoDB Docs — Replication", url: "https://www.mongodb.com/docs/manual/replication/", type: "docs" },
        { title: "MongoDB University — Advanced Schema Design", url: "https://learn.mongodb.com/learning-paths/advanced-mongodb", type: "course" },
        { title: "Hussein Nasser — MongoDB Internals", url: "https://www.youtube.com/watch?v=ONzdr4SmOng", type: "video" },
      ],
      estimated_weeks: 7,
    },
  },

  CSS: {
    Beginner: {
      focus_areas: ["Selectors and specificity", "Box model (margin, padding, border)", "Flexbox basics", "Colours, fonts, and units (px, rem, %)", "Basic transitions"],
      projects: ["Personal landing page", "Card component", "Styled navigation bar"],
      resources: [
        { title: "MDN — CSS Reference", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", type: "docs" },
        { title: "freeCodeCamp — Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", type: "course" },
        { title: "Kevin Powell — CSS Fundamentals", url: "https://www.youtube.com/@KevinPowell", type: "video" },
      ],
      estimated_weeks: 3,
    },
    Intermediate: {
      focus_areas: ["CSS Grid layout", "Custom properties (CSS variables)", "Responsive design and media queries", "Animations and keyframes", "Pseudo-classes and pseudo-elements"],
      projects: ["Responsive dashboard layout", "Animated hero section", "Dark/light theme toggle"],
      resources: [
        { title: "CSS-Tricks — A Complete Guide to Grid", url: "https://css-tricks.com/snippets/css/complete-guide-grid/", type: "docs" },
        { title: "roadmap.sh — CSS Roadmap", url: "https://roadmap.sh/css", type: "docs" },
        { title: "Kevin Powell — Responsive CSS", url: "https://www.youtube.com/watch?v=u044iM9xsWU", type: "video" },
      ],
      estimated_weeks: 4,
    },
    Advanced: {
      focus_areas: ["CSS architecture (BEM, OOCSS)", "Container queries", "CSS Houdini and custom paint worklets", "Performance (will-change, layer promotion)", "CSS-in-JS trade-offs"],
      projects: ["Design system with CSS variables", "Complex animated UI (pure CSS)", "Contribute CSS improvements to open-source project"],
      resources: [
        { title: "Smashing Magazine — CSS Architecture", url: "https://www.smashingmagazine.com/category/css/", type: "docs" },
        { title: "Chrome Developers — CSS Houdini", url: "https://developer.chrome.com/docs/css-ui/houdini", type: "docs" },
        { title: "Kevin Powell — Advanced CSS", url: "https://www.youtube.com/watch?v=B2WL6KkqhLQ", type: "video" },
      ],
      estimated_weeks: 6,
    },
  },

  TypeScript: {
    Beginner: {
      focus_areas: ["TypeScript setup and tsconfig", "Basic types (string, number, boolean, any)", "Interfaces and type aliases", "Functions with typed parameters", "Type narrowing and guards"],
      projects: ["Typed Todo app", "Convert plain JS project to TypeScript", "Typed REST API client"],
      resources: [
        { title: "TypeScript Official Docs — Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", type: "docs" },
        { title: "Matt Pocock — TypeScript Tutorial for Beginners", url: "https://www.youtube.com/watch?v=30LWjhZzg50", type: "video" },
        { title: "roadmap.sh — TypeScript Roadmap", url: "https://roadmap.sh/typescript", type: "docs" },
      ],
      estimated_weeks: 3,
    },
    Intermediate: {
      focus_areas: ["Generics and constraints", "Union and intersection types", "Mapped and conditional types", "Declaration merging", "TypeScript with React (TSX)"],
      projects: ["Generic data-fetching hook", "Fully typed Express API", "React component library with TypeScript"],
      resources: [
        { title: "TypeScript Docs — Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html", type: "docs" },
        { title: "Total TypeScript — Beginner to Pro", url: "https://www.totaltypescript.com", type: "course" },
        { title: "Fireship — TypeScript in 100 Seconds", url: "https://www.youtube.com/watch?v=zQnBQ4tB3ZA", type: "video" },
      ],
      estimated_weeks: 5,
    },
    Advanced: {
      focus_areas: ["Template literal types", "Infer keyword and advanced conditionals", "TypeScript compiler API", "Declaration files (.d.ts)", "Strict mode and performance"],
      projects: ["Custom TypeScript utility library", "Type-safe ORM layer", "Contribute to DefinitelyTyped"],
      resources: [
        { title: "TypeScript Deep Dive (free book)", url: "https://basarat.gitbook.io/typescript/", type: "docs" },
        { title: "Matt Pocock — Advanced TypeScript Patterns", url: "https://www.youtube.com/@mattpocockuk", type: "video" },
        { title: "Total TypeScript — Advanced Patterns Workshop", url: "https://www.totaltypescript.com/workshops", type: "course" },
      ],
      estimated_weeks: 7,
    },
  },

  Git: {
    Beginner: {
      focus_areas: ["git init, clone, add, commit, push, pull", "Understanding branches", "Merge vs rebase basics", "GitHub / GitLab workflow", ".gitignore and README"],
      projects: ["Version your first project", "Contribute to a public repo (first PR)", "Set up SSH key + remote repo"],
      resources: [
        { title: "Git Official Docs", url: "https://git-scm.com/doc", type: "docs" },
        { title: "freeCodeCamp — Git & GitHub Crash Course", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", type: "video" },
        { title: "Atlassian Git Tutorials", url: "https://www.atlassian.com/git/tutorials", type: "docs" },
      ],
      estimated_weeks: 2,
    },
    Intermediate: {
      focus_areas: ["Branch strategies (Git Flow, trunk-based)", "Interactive rebase (squash, fixup)", "Cherry-pick and stash", "Resolving merge conflicts", "Tags and semantic versioning"],
      projects: ["Set up a complete Git Flow project", "Automate releases with tags + changelog", "Collaborative project with PRs and code reviews"],
      resources: [
        { title: "Atlassian — Comparing Workflows", url: "https://www.atlassian.com/git/tutorials/comparing-workflows", type: "docs" },
        { title: "GitHub Docs — Pull Request Reviews", url: "https://docs.github.com/en/pull-requests", type: "docs" },
        { title: "Fireship — Git It Together", url: "https://www.youtube.com/watch?v=ecK3EnyGD8o", type: "video" },
      ],
      estimated_weeks: 3,
    },
    Advanced: {
      focus_areas: ["Git internals (objects, refs, pack files)", "Bisect for bug hunting", "Git hooks and Husky", "Monorepo strategies", "CI/CD pipeline with Git triggers"],
      projects: ["Custom Git hook for linting/tests", "Monorepo setup with Turborepo/Nx", "Build a changelog generation script"],
      resources: [
        { title: "Pro Git Book (free online)", url: "https://git-scm.com/book/en/v2", type: "docs" },
        { title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", type: "docs" },
        { title: "Fireship — Git Hooks Explained", url: "https://www.youtube.com/watch?v=aolI_Rz0ZGA", type: "video" },
      ],
      estimated_weeks: 4,
    },
  },

  Java: {
    Beginner: {
      focus_areas: [
        "Java syntax and data types",
        "OOP fundamentals (classes, objects, inheritance)",
        "Control flow and loops",
        "Arrays and ArrayLists",
        "Exception handling basics",
      ],
      projects: [
        "Console-based calculator",
        "Student grade tracker",
        "Simple bank account system",
      ],
      resources: [
        { title: "Java official tutorials", url: "https://docs.oracle.com/javase/tutorial/", type: "docs" },
        { title: "MOOC.fi Java Programming", url: "https://java-programming.mooc.fi/", type: "course" },
        { title: "Codecademy Learn Java", url: "https://www.codecademy.com/learn/learn-java", type: "course" },
      ],
      estimated_weeks: 5,
    },
    Intermediate: {
      focus_areas: [
        "Collections framework (HashMap, LinkedList, Stack)",
        "Generics and interfaces",
        "File I/O and serialization",
        "Multithreading basics",
        "Java Streams and lambdas",
      ],
      projects: [
        "Library management system",
        "Multi-threaded task queue",
        "CSV file parser and reporter",
      ],
      resources: [
        { title: "Baeldung Java guides", url: "https://www.baeldung.com/", type: "docs" },
        { title: "Java Brains YouTube", url: "https://www.youtube.com/@JavaBrainsChannel", type: "video" },
        { title: "Effective Java (summary)", url: "https://github.com/HugoMatilla/Effective-JAVA-Summary", type: "docs" },
      ],
      estimated_weeks: 6,
    },
    Advanced: {
      focus_areas: [
        "Spring Boot and REST APIs",
        "JPA and Hibernate ORM",
        "Design patterns (Factory, Singleton, Observer)",
        "JUnit 5 testing and Mockito",
        "Performance tuning and JVM internals",
      ],
      projects: [
        "Spring Boot REST API with JWT auth",
        "Microservice with Docker",
        "Open source contribution to a Java library",
      ],
      resources: [
        { title: "Spring Boot official docs", url: "https://spring.io/projects/spring-boot", type: "docs" },
        { title: "Spring Framework Guru", url: "https://springframework.guru/", type: "course" },
        { title: "JUnit 5 user guide", url: "https://junit.org/junit5/docs/current/user-guide/", type: "docs" },
      ],
      estimated_weeks: 8,
    },
  },
};


// ─── Generic Fallback ─────────────────────────────────────────────────────────

const GENERIC_ROADMAP = {
  focus_areas: ["Core concepts and fundamentals", "Hands-on practice with examples", "Build a complete project", "Review and debug your work"],
  projects: ["Beginner CRUD app", "API integration project", "Full feature implementation"],
  resources: [
    { title: "Official documentation", url: "#", type: "docs" },
    { title: "freeCodeCamp — Tutorials", url: "https://www.freecodecamp.org", type: "course" },
    { title: "roadmap.sh", url: "https://roadmap.sh", type: "docs" },
  ],
  estimated_weeks: 4,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Canonical alias map — maps any common user input to the exact ROADMAPS key.
 * Checked before falling back to title-case.
 */
const SKILL_ALIASES = {
  "react":      "React",
  "react.js":   "React",
  "javascript": "JavaScript",
  "js":         "JavaScript",
  "node":       "Node.js",
  "nodejs":     "Node.js",
  "node.js":    "Node.js",
  "python":     "Python",
  "mongodb":    "MongoDB",
  "mongo":      "MongoDB",
  "css":        "CSS",
  "typescript": "TypeScript",
  "ts":         "TypeScript",
  "git":        "Git",
  "java":       "Java",
};

/**
 * Normalise a skill name for ROADMAPS lookup.
 * Checks the alias map first; falls back to title-casing the first letter.
 * e.g. "java" → "Java", "node" → "Node.js", "REACT" → "React"
 */
function normaliseSkill(skill) {
  const lower = skill.toLowerCase().trim();
  if (SKILL_ALIASES[lower]) return SKILL_ALIASES[lower];
  // Title-case fallback: capitalise first letter, lowercase rest
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// ─── Exported Functions ───────────────────────────────────────────────────────

/**
 * Returns the roadmap object for a given skill and skill level.
 * Falls back to a generic template for unknown skills.
 *
 * @param {string} skill      - Skill name (case-insensitive)
 * @param {string} skillLevel - "Beginner" | "Intermediate" | "Advanced"
 * @returns {Promise<object>} Roadmap data object
 */
export async function generateRoadmap(skill, skillLevel) {
  // Resolve alias → canonical ROADMAPS key
  const lower = skill.toLowerCase().trim();
  const normalisedSkill = SKILL_ALIASES[lower] ?? normaliseSkill(skill);
  const level = (skillLevel && skillLevel !== "Unknown") ? skillLevel : "Beginner";
  const roadmap = ROADMAPS[normalisedSkill]?.[level] ?? GENERIC_ROADMAP;
  console.log(`\ud83d\uddfa  generateRoadmap("${skill}" → "${normalisedSkill}", "${level}") → ${roadmap === GENERIC_ROADMAP ? 'GENERIC_ROADMAP' : 'specific roadmap'}`);
  return roadmap;
}

/**
 * Persists/updates a student's roadmap for a given skill in their skillProfiles.
 * Uses case-insensitive skill name matching to prevent duplicate entries.
 *
 * @param {string} userId    - MongoDB ObjectId of the student
 * @param {string} skill     - Skill name (raw; will be normalised internally)
 * @param {string} skillLevel - Predicted skill level
 * @param {object} roadmap   - Roadmap data to save
 * @returns {Promise<object>} Updated user document (skillProfiles only)
 */
export async function saveRoadmap(userId, skill, skillLevel, roadmap) {
  const normalisedSkill = normaliseSkill(skill);
  console.log(`\ud83d\udcbe saveRoadmap: userId=${userId}, skill="${skill}" → normalised="${normalisedSkill}", level="${skillLevel}"`);

  try {
    // Load the user so we can do a case-insensitive profile lookup
    const user = await User.findById(userId).select("skillProfiles");
    if (!user) {
      console.error("saveRoadmap: user not found", userId);
      return null;
    }

    // Case-insensitive index search
    const profileIdx = user.skillProfiles?.findIndex(
      sp => sp.skill_name?.toLowerCase() === normalisedSkill.toLowerCase()
    );

    if (profileIdx !== undefined && profileIdx !== -1) {
      // Update existing entry by index (avoids case-mismatch issues with $)
      const result = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            [`skillProfiles.${profileIdx}.skill_name`]:        normalisedSkill,  // normalise on update
            [`skillProfiles.${profileIdx}.verified_level`]:    skillLevel,
            [`skillProfiles.${profileIdx}.roadmap`]:           roadmap,
            [`skillProfiles.${profileIdx}.last_attempt_date`]: new Date(),
          }
        },
        { new: true, select: "skillProfiles" }
      );
      console.log("saveRoadmap: updated existing profile at index", profileIdx);
      return result;
    }

    // No existing entry — push a new one with normalised skill name
    const result = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          skillProfiles: {
            skill_name:        normalisedSkill,
            verified:          false,
            verified_level:    skillLevel,
            last_quiz_score:   0,
            last_attempt_date: new Date(),
            roadmap,
          }
        }
      },
      { new: true, select: "skillProfiles" }
    );
    console.log("saveRoadmap: pushed new profile entry for", normalisedSkill);
    return result;

  } catch (err) {
    console.error("saveRoadmap error:", err.message);
    throw err;
  }
}
