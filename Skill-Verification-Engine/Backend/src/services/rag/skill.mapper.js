const SKILL_MAP = {
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

  // Python
  "python": "python",
  "python3": "python",
  "py": "python",

  // MongoDB
  "mongodb": "mongodb",
  "mongo": "mongodb",

  // CSS
  "css": "css",
  "css3": "css",

  // TypeScript
  "typescript": "typescript",
  "ts": "typescript",

  // Git
  "git": "git",
  "git version control": "git",
};

export function mapSkillToFolder(skill) {
  return SKILL_MAP[skill.toLowerCase().trim()];
}

