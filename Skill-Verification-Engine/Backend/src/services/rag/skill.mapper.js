const SKILL_MAP = {
  // ─── EXISTING ──────────────────────────────────────────────
  // JavaScript
  "javascript": "javascript",
  "java script": "javascript",
  "js": "javascript",

  // React
  "react": "react",
  "reactjs": "react",
  "react.js": "react",

  // Node.js
  "node": "node",
  "nodejs": "node",
  "node.js": "node",

  // Java
  "java": "java",
  "javacode": "java",

  // ─── PROGRAMMING LANGUAGES ─────────────────────────────────
  // Python
  "python": "python",
  "python3": "python",
  "py": "python",

  // TypeScript
  "typescript": "typescript",
  "ts": "typescript",

  // C
  "c": "c",
  "c language": "c",
  "clang": "c",

  // C++
  "c++": "cpp",
  "cpp": "cpp",
  "cplusplus": "cpp",
  "c plus plus": "cpp",

  // C#
  "c#": "csharp",
  "csharp": "csharp",
  "c sharp": "csharp",

  // Go
  "go": "go",
  "golang": "go",

  // Rust
  "rust": "rust",
  "rustlang": "rust",

  // PHP
  "php": "php",

  // Swift
  "swift": "swift",
  "swiftlang": "swift",

  // Kotlin
  "kotlin": "kotlin",
  "kt": "kotlin",

  // Dart / Flutter
  "dart": "dart-flutter",
  "flutter": "dart-flutter",
  "dart flutter": "dart-flutter",
  "dart/flutter": "dart-flutter",

  // ─── WEB & FRONTEND ────────────────────────────────────────
  // HTML & CSS
  "html": "html-css",
  "css": "html-css",
  "css3": "html-css",
  "html5": "html-css",
  "html css": "html-css",
  "html & css": "html-css",
  "html and css": "html-css",

  // Next.js
  "next": "nextjs",
  "nextjs": "nextjs",
  "next.js": "nextjs",

  // Vue.js
  "vue": "vuejs",
  "vuejs": "vuejs",
  "vue.js": "vuejs",

  // Angular
  "angular": "angular",
  "angularjs": "angular",

  // ─── BACKEND & DATABASES ───────────────────────────────────
  // Express.js
  "express": "expressjs",
  "expressjs": "expressjs",
  "express.js": "expressjs",

  // SQL
  "sql": "sql",
  "mysql": "sql",
  "relational databases": "sql",

  // MongoDB
  "mongodb": "mongodb",
  "mongo": "mongodb",
  "mongoose": "mongodb",

  // PostgreSQL
  "postgresql": "postgresql",
  "postgres": "postgresql",
  "psql": "postgresql",

  // ─── APIs & ARCHITECTURE ───────────────────────────────────
  // REST APIs
  "rest": "rest-api",
  "rest api": "rest-api",
  "rest apis": "rest-api",
  "restful": "rest-api",
  "restful api": "rest-api",

  // GraphQL
  "graphql": "graphql",
  "graph ql": "graphql",

  // System Design
  "system design": "system-design",
  "systems design": "system-design",
  "system architecture": "system-design",

  // ─── CS FUNDAMENTALS ───────────────────────────────────────
  // Data Structures & Algorithms
  "data structures": "dsa",
  "algorithms": "dsa",
  "dsa": "dsa",
  "data structures and algorithms": "dsa",
  "data structures & algorithms": "dsa",

  // ─── TOOLS & DEVOPS ────────────────────────────────────────
  // Git & GitHub
  "git": "git",
  "github": "git",
  "git version control": "git",
  "git & github": "git",

  // Docker
  "docker": "docker",
  "docker containers": "docker",

  // DevOps / CI/CD
  "devops": "devops",
  "ci/cd": "devops",
  "cicd": "devops",
  "ci cd": "devops",
  "continuous integration": "devops",

  // ─── EMERGING ──────────────────────────────────────────────
  // Machine Learning
  "machine learning": "machine-learning",
  "ml": "machine-learning",
  "deep learning": "machine-learning",
  "artificial intelligence": "machine-learning",
  "ai": "machine-learning",
};

export function mapSkillToFolder(skill) {
  return SKILL_MAP[skill.toLowerCase().trim()];
}
