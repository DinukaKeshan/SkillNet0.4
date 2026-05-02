import random
import pandas as pd

skills_pool = [
    # --- Core Software & Web Development ---
    "frontend", "backend", "full stack", "database", "api", "microservices",
    "html", "css", "javascript", "typescript", "react", "nextjs", "vue", "angular",
    "svelte", "redux", "vite", "nodejs", "express", "nestjs", "php", "laravel",
    "django", "flask", "fastapi", "spring boot", "dotnet", "asp.net", "graphql",
    "websocket", "tailwind", "bootstrap", "sass", "webpack", "babel",
    "cross-browser testing", "ui", "ux", "design", "responsive design",
    "accessibility", "web performance", "api integration",

    # --- Programming Languages ---
    "python", "java", "c", "c++", "c#", "go", "rust", "ruby", "perl", "php",
    "javascript", "typescript", "sql", "r", "matlab", "bash", "powershell",
    "scala", "haskell", "lua", "dart", "swift", "kotlin",

    # --- Mobile Development ---
    "flutter", "react native", "kotlin", "swift", "java (android)", "android studio",
    "xcode", "mobile ui", "mobile testing", "firebase", "app store", "play store",
    "push notifications", "in-app payments", "mobile security", "api integration",

    # --- DevOps, Cloud & Automation ---
    "devops", "cloud", "aws", "azure", "google cloud", "gcp", "cloud architecture",
    "serverless", "lambda", "kubernetes", "docker", "jenkins", "ansible",
    "terraform", "prometheus", "grafana", "ci/cd", "infrastructure as code",
    "monitoring", "logging", "load balancing", "autoscaling", "vpc", "ec2",
    "s3", "cloudfront", "route53", "helm", "gitlab ci", "github actions",
    "artifact registry", "cloud storage", "mlops", "gitops",

    # --- AI, ML & Data Science ---
    "ai", "machine learning", "deep learning", "neural networks", "supervised learning",
    "unsupervised learning", "reinforcement learning", "tensorflow", "pytorch",
    "keras", "nlp", "computer vision", "image processing", "speech recognition",
    "recommendation systems", "transfer learning", "model optimization",
    "feature engineering", "data preprocessing", "hyperparameter tuning",
    "model evaluation", "autoML", "ai ethics", "llm", "chatbot",
    "predictive analytics", "time series analysis", "dimensionality reduction",
    "classification", "regression", "clustering", "anomaly detection",
    "model deployment", "data labeling", "generative ai", "openai api",
    "langchain", "huggingface", "vector databases",

    # --- Data Engineering & Analytics ---
    "data", "data analysis", "data mining", "data visualization", "power bi",
    "tableau", "excel", "data wrangling", "data modeling", "pandas", "numpy",
    "matplotlib", "seaborn", "scikit-learn", "statistics", "probability",
    "data pipelines", "big data", "apache spark", "hadoop", "etl", "sql",
    "nosql", "data governance", "data warehousing", "snowflake", "data lakes",
    "business intelligence", "descriptive analytics", "predictive modeling",
    "kafka", "elasticsearch", "data lakehouse",

    # --- Cybersecurity & Networking ---
    "security", "cybersecurity", "network security", "ethical hacking",
    "penetration testing", "firewall", "vpn", "ids", "ips", "wireshark", "nmap",
    "metasploit", "information security", "cryptography", "encryption", "ssl",
    "tls", "web security", "application security", "zero trust", "siem", "soc",
    "incident response", "forensics", "vulnerability scanning", "ddos protection",
    "network architecture", "tcp/ip", "routing", "switching", "dns", "dhcp",
    "load balancing", "proxy servers",

    # --- Operating Systems & Infrastructure ---
    "linux", "bash scripting", "shell scripting", "system administration",
    "ubuntu", "centos", "windows server", "macos", "automation", "cron jobs",
    "virtualization", "vmware", "virtualbox", "proxmox", "storage management",
    "file systems", "process management", "system monitoring",

    # --- Software Engineering & QA ---
    "software engineering", "system design", "oop", "functional programming",
    "design patterns", "api development", "agile", "scrum", "kanban", "unit testing",
    "integration testing", "test automation", "selenium", "postman", "jest", "mocha",
    "cypress", "tdd", "bdd", "version control", "git", "github", "gitlab",
    "bitbucket", "code review", "pair programming", "software architecture",
    "performance optimization", "debugging", "documentation", "release management",

    # --- Tools & Platforms ---
    "jira", "confluence", "notion", "trello", "monday", "slack", "figma", "miro",
    "postman", "vscode", "intellij", "eclipse", "pycharm", "visual studio",
    "docker desktop", "datadog", "splunk", "sonarqube", "grafana", "prometheus",
    "new relic", "airflow", "gitkraken",

    # --- Engineering & Emerging Tech ---
    "embedded systems", "iot", "arduino", "raspberry pi", "verilog", "vhdl",
    "electronics", "robotics", "signal processing", "matlab", "autocad",
    "solidworks", "mechanical design", "simulation", "control systems",
    "plc", "scada", "cad modeling", "industrial automation", "communication systems",
    "project management", "problem solving", "team collaboration", "leadership",
    "research", "innovation", "critical thinking", "troubleshooting", "presentation"
]

# Generate teams
teams = []
for i in range(1, 2001):
    name = f"Team {chr(64+i)}"
    team_skills = " ".join(random.sample(skills_pool, k=3))
    teams.append({"team_id": i, "team_name": name, "skills": team_skills})

pd.DataFrame(teams).to_csv("data/teams.csv", index=False)

# Generate students
students = []
for i in range(1, 10001):
    name = f"Student{i}"
    student_skills = " ".join(random.sample(skills_pool, k=2))
    students.append({"student_id": i, "name": name, "skills": student_skills})

pd.DataFrame(students).to_csv("data/students.csv", index=False)

print("Datasets generated successfully!")

