"""
Dataset Generator for FastText Skills Model
Generates a tech skills corpus for training FastText word embeddings.
"""

import random
import os

# ============================================================
# SKILL TAXONOMY
# ============================================================

SKILLS = {
    "frontend": {
        "skills": ["react", "reactjs", "angular", "vue", "vuejs", "svelte", "nextjs", "nuxtjs", "gatsby",
                    "html", "css", "javascript", "typescript", "jquery", "bootstrap", "tailwind",
                    "sass", "less", "webpack", "vite", "babel", "redux", "mobx", "zustand",
                    "materialui", "antdesign", "chakraui", "styledcomponents", "emotion"],
        "description": "frontend web development user interface ui client side browser",
        "related_categories": ["javascript", "web", "design"]
    },
    "backend": {
        "skills": ["nodejs", "express", "nestjs", "fastify", "django", "flask", "fastapi",
                    "spring", "springboot", "rails", "rubyonrails", "laravel", "symfony",
                    "aspnet", "dotnet", "gin", "echo", "fiber", "actix", "rocket"],
        "description": "backend server side api web services rest graphql microservices",
        "related_categories": ["database", "api", "devops"]
    },
    "database": {
        "skills": ["mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch",
                    "cassandra", "dynamodb", "firebase", "supabase", "sqlite", "mariadb",
                    "oracle", "mssql", "couchdb", "neo4j", "influxdb", "cockroachdb"],
        "description": "database data storage query sql nosql relational document graph",
        "related_categories": ["backend", "data"]
    },
    "programming_languages": {
        "skills": ["python", "java", "csharp", "cpp", "cplusplus", "go", "golang", "rust",
                    "ruby", "php", "swift", "kotlin", "scala", "perl", "haskell", "elixir",
                    "clojure", "erlang", "lua", "r", "matlab", "julia", "dart", "zig"],
        "description": "programming language coding software development",
        "related_categories": ["backend", "frontend", "mobile"]
    },
    "devops": {
        "skills": ["docker", "kubernetes", "k8s", "jenkins", "gitlab", "github", "githubactions",
                    "circleci", "travisci", "terraform", "ansible", "puppet", "chef",
                    "prometheus", "grafana", "nginx", "apache", "haproxy", "vagrant",
                    "helm", "istio", "argocd"],
        "description": "devops deployment ci cd continuous integration delivery infrastructure automation",
        "related_categories": ["cloud", "backend", "linux"]
    },
    "cloud": {
        "skills": ["aws", "azure", "gcp", "googlecloud", "heroku", "vercel", "netlify",
                    "digitalocean", "linode", "cloudflare", "lambda", "ec2", "s3",
                    "cloudformation", "amplify"],
        "description": "cloud computing platform services hosting serverless iaas paas saas",
        "related_categories": ["devops", "backend"]
    },
    "mobile": {
        "skills": ["flutter", "reactnative", "swift", "kotlin", "android", "ios",
                    "xamarin", "ionic", "capacitor", "expo", "swiftui", "jetpackcompose"],
        "description": "mobile app development ios android cross platform native hybrid",
        "related_categories": ["frontend", "programming_languages"]
    },
    "ai_ml": {
        "skills": ["tensorflow", "pytorch", "keras", "scikitlearn", "sklearn", "pandas",
                    "numpy", "opencv", "nltk", "spacy", "huggingface", "transformers",
                    "xgboost", "lightgbm", "catboost", "mlflow", "wandb", "dvc"],
        "description": "machine learning artificial intelligence deep learning neural network nlp computer vision data science",
        "related_categories": ["data", "programming_languages", "python"]
    },
    "data": {
        "skills": ["spark", "hadoop", "kafka", "airflow", "dbt", "snowflake", "bigquery",
                    "redshift", "tableau", "powerbi", "looker", "metabase", "superset",
                    "pandas", "numpy", "matplotlib", "seaborn", "plotly", "jupyter"],
        "description": "data engineering analytics pipeline etl visualization reporting",
        "related_categories": ["database", "ai_ml", "cloud"]
    },
    "security": {
        "skills": ["owasp", "burpsuite", "wireshark", "nmap", "metasploit", "snort",
                    "vault", "keycloak", "oauth", "jwt", "ssl", "tls", "encryption",
                    "penetrationtesting", "siem", "sonarqube"],
        "description": "security cybersecurity infosec penetration testing vulnerability authentication authorization",
        "related_categories": ["devops", "backend", "cloud"]
    },
    "testing": {
        "skills": ["jest", "mocha", "chai", "pytest", "junit", "selenium", "cypress",
                    "playwright", "puppeteer", "testng", "mockito", "enzyme", "vitest",
                    "cucumber", "postman", "insomnia", "k6", "jmeter", "locust"],
        "description": "testing qa quality assurance unit integration end to end e2e automation performance",
        "related_categories": ["frontend", "backend", "devops"]
    },
    "design": {
        "skills": ["figma", "sketch", "adobexd", "photoshop", "illustrator", "invision",
                    "zeplin", "canva", "blender", "aftereffects", "premiere"],
        "description": "design ui ux user experience interface graphic visual prototyping wireframe",
        "related_categories": ["frontend"]
    },
    "api": {
        "skills": ["rest", "restapi", "graphql", "grpc", "websocket", "soap", "openapi",
                    "swagger", "postman", "insomnia", "apollo", "trpc"],
        "description": "api application programming interface web services endpoint request response",
        "related_categories": ["backend", "frontend"]
    },
    "version_control": {
        "skills": ["git", "github", "gitlab", "bitbucket", "svn", "mercurial"],
        "description": "version control source code management repository branching merging collaboration",
        "related_categories": ["devops"]
    },
    "linux": {
        "skills": ["linux", "ubuntu", "debian", "centos", "redhat", "fedora", "archlinux",
                    "bash", "shell", "zsh", "systemd", "cron"],
        "description": "linux operating system unix system administration command line terminal",
        "related_categories": ["devops", "cloud", "backend"]
    }
}

# ============================================================
# SENTENCE TEMPLATES
# ============================================================

def generate_corpus():
    sentences = []

    # --- 1. Skill-category definitions ---
    for category, data in SKILLS.items():
        cat_label = category.replace("_", " ")
        for skill in data["skills"]:
            sentences.append(f"{skill} is a {cat_label} technology")
            sentences.append(f"{skill} is used in {cat_label}")
            sentences.append(f"{skill} is a tool for {data['description']}")
            sentences.append(f"developers use {skill} for {cat_label} projects")

    # --- 2. Skill co-occurrence within categories ---
    for category, data in SKILLS.items():
        skills = data["skills"]
        cat_label = category.replace("_", " ")
        for _ in range(len(skills) * 3):
            n = random.randint(2, min(5, len(skills)))
            sampled = random.sample(skills, n)
            sentences.append(f"{' '.join(sampled)} are {cat_label} technologies")
            sentences.append(f"a {cat_label} stack includes {' '.join(sampled)}")
            sentences.append(f"for {cat_label} you can use {' '.join(sampled)}")

    # --- 3. Cross-category relationships ---
    for category, data in SKILLS.items():
        for related_cat in data.get("related_categories", []):
            if related_cat in SKILLS:
                for _ in range(20):
                    s1 = random.sample(data["skills"], min(2, len(data["skills"])))
                    s2 = random.sample(SKILLS[related_cat]["skills"], min(2, len(SKILLS[related_cat]["skills"])))
                    sentences.append(f"{' '.join(s1)} works well with {' '.join(s2)}")
                    sentences.append(f"combine {' '.join(s1)} and {' '.join(s2)} for full stack development")

    # --- 4. Job role / project descriptions ---
    role_templates = [
        ("fullstack developer", ["frontend", "backend", "database"]),
        ("frontend developer", ["frontend", "design"]),
        ("backend developer", ["backend", "database", "api"]),
        ("devops engineer", ["devops", "cloud", "linux"]),
        ("data scientist", ["ai_ml", "data", "programming_languages"]),
        ("data engineer", ["data", "database", "cloud"]),
        ("mobile developer", ["mobile", "frontend"]),
        ("cloud architect", ["cloud", "devops"]),
        ("security engineer", ["security", "devops", "linux"]),
        ("qa engineer", ["testing", "frontend", "backend"]),
        ("machine learning engineer", ["ai_ml", "programming_languages", "data"]),
        ("ui ux designer", ["design", "frontend"]),
        ("site reliability engineer", ["devops", "cloud", "linux"]),
        ("api developer", ["api", "backend", "database"]),
    ]

    for role, categories in role_templates:
        for _ in range(50):
            skills = []
            for cat in categories:
                if cat in SKILLS:
                    skills.extend(random.sample(SKILLS[cat]["skills"], min(2, len(SKILLS[cat]["skills"]))))
            random.shuffle(skills)
            sentences.append(f"a {role} needs skills in {' '.join(skills)}")
            sentences.append(f"{role} job requires {' '.join(skills)}")
            sentences.append(f"hiring {role} looking for {' '.join(skills)}")

    # --- 5. Project / team descriptions ---
    project_templates = [
        "web application", "mobile app", "e-commerce platform", "social media platform",
        "data pipeline", "machine learning model", "cloud infrastructure", "api service",
        "dashboard", "content management system", "real time chat application",
        "video streaming platform", "payment gateway", "inventory management system",
        "healthcare platform", "education platform", "fintech application",
        "iot platform", "blockchain application", "game development",
    ]

    for project in project_templates:
        for _ in range(30):
            cat_keys = random.sample(list(SKILLS.keys()), random.randint(2, 4))
            skills = []
            for cat in cat_keys:
                skills.extend(random.sample(SKILLS[cat]["skills"], min(2, len(SKILLS[cat]["skills"]))))
            random.shuffle(skills)
            sentences.append(f"building a {project} requires {' '.join(skills)}")
            sentences.append(f"team for {project} needs {' '.join(skills)}")
            sentences.append(f"the {project} project uses {' '.join(skills)}")

    # --- 6. Synonym / alias sentences ---
    aliases = [
        ("react", "reactjs"), ("vue", "vuejs"), ("angular", "angularjs"),
        ("nodejs", "node"), ("nextjs", "next"), ("nuxtjs", "nuxt"),
        ("postgresql", "postgres"), ("mongodb", "mongo"),
        ("kubernetes", "k8s"), ("golang", "go"),
        ("csharp", "dotnet"), ("cplusplus", "cpp"),
        ("scikitlearn", "sklearn"), ("tensorflow", "tf"),
        ("javascript", "js"), ("typescript", "ts"),
        ("reactnative", "rn"), ("springboot", "spring"),
    ]

    for a, b in aliases:
        for _ in range(15):
            sentences.append(f"{a} also known as {b}")
            sentences.append(f"{a} and {b} refer to the same technology")
            sentences.append(f"{b} is another name for {a}")
            cat_keys = random.sample(list(SKILLS.keys()), 2)
            friends = random.sample(SKILLS[cat_keys[0]]["skills"], 2)
            sentences.append(f"{a} {b} used with {' '.join(friends)}")

    # --- 7. Technology stack sentences ---
    stacks = [
        ["react", "nodejs", "mongodb", "express"],
        ["react", "nextjs", "postgresql", "typescript"],
        ["angular", "spring", "mysql", "java"],
        ["vue", "django", "postgresql", "python"],
        ["react", "flask", "mongodb", "python"],
        ["flutter", "firebase", "dart"],
        ["reactnative", "nodejs", "mongodb"],
        ["svelte", "fastapi", "postgresql", "python"],
        ["nextjs", "prisma", "postgresql", "typescript"],
        ["django", "postgresql", "redis", "docker"],
        ["spring", "mysql", "docker", "kubernetes"],
        ["laravel", "mysql", "php", "redis"],
        ["rails", "postgresql", "ruby", "redis"],
        ["fastapi", "mongodb", "python", "docker"],
        ["nestjs", "postgresql", "typescript", "docker"],
    ]

    for stack in stacks:
        for _ in range(20):
            random.shuffle(stack)
            sentences.append(f"technology stack {' '.join(stack)}")
            sentences.append(f"popular stack includes {' '.join(stack)}")
            sentences.append(f"developers use {' '.join(stack)} together")
            sentences.append(f"project built with {' '.join(stack)}")

    # --- 8. Contextual similarity sentences ---
    similar_groups = [
        ["react", "angular", "vue", "svelte"],
        ["django", "flask", "fastapi"],
        ["express", "nestjs", "fastify"],
        ["spring", "springboot"],
        ["mysql", "postgresql", "mariadb"],
        ["mongodb", "couchdb", "dynamodb"],
        ["docker", "kubernetes", "helm"],
        ["aws", "azure", "gcp"],
        ["tensorflow", "pytorch", "keras"],
        ["jest", "mocha", "vitest"],
        ["selenium", "cypress", "playwright"],
        ["react", "reactnative"],
        ["flutter", "reactnative", "ionic"],
        ["git", "github", "gitlab", "bitbucket"],
        ["jenkins", "githubactions", "circleci", "travisci"],
        ["prometheus", "grafana"],
        ["nginx", "apache", "haproxy"],
        ["figma", "sketch", "adobexd"],
        ["pandas", "numpy", "matplotlib"],
        ["spark", "hadoop", "kafka"],
        ["redis", "elasticsearch"],
    ]

    for group in similar_groups:
        for _ in range(20):
            if len(group) >= 2:
                pair = random.sample(group, 2)
                sentences.append(f"{pair[0]} is similar to {pair[1]}")
                sentences.append(f"{pair[0]} and {pair[1]} are alternatives")
                sentences.append(f"choose between {pair[0]} and {pair[1]}")
                sentences.append(f"{pair[0]} or {pair[1]} for the same purpose")

    # Shuffle all sentences
    random.shuffle(sentences)
    return sentences


def main():
    print("Generating tech skills training corpus...")
    random.seed(42)

    corpus = generate_corpus()

    os.makedirs("dataset", exist_ok=True)
    output_path = "dataset/skills_corpus.txt"

    with open(output_path, "w") as f:
        for sentence in corpus:
            f.write(sentence.lower() + "\n")

    print(f"Generated {len(corpus)} training sentences")
    print(f"Saved to {output_path}")

    # Show sample
    print("\nSample sentences:")
    for s in corpus[:10]:
        print(f"  {s}")


if __name__ == "__main__":
    main()
