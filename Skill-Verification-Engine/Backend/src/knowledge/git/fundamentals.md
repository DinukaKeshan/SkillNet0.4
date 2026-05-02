Git is a distributed version control system that tracks changes in source code.

Repositories contain the project history. git init creates a new repo; git clone copies an existing one.

The three areas: working directory (files), staging area (index), and repository (committed history).

git add stages changes; git commit -m "message" saves staged changes to history.

git status shows the current state; git log shows commit history; git diff shows changes.

Branches are lightweight pointers to commits. git branch feature creates a branch; git checkout -b feature creates and switches.

git merge integrates changes from another branch: git merge feature (from main).

Fast-forward merge: linear history, no merge commit. Three-way merge: creates a merge commit.

git rebase replays commits on top of another branch, creating a linear history.

Interactive rebase (git rebase -i) allows squashing, reordering, editing, or dropping commits.

Merge conflicts occur when the same lines are modified in both branches. Resolved manually.

Conflict markers: <<<<<<< HEAD, =======, >>>>>>> branch-name.

git stash temporarily saves uncommitted changes; git stash pop restores them.

Remote repositories: git remote add origin URL; git push origin main; git fetch; git pull.

git pull = git fetch + git merge. git pull --rebase = git fetch + git rebase.

Pull requests (GitHub) / Merge requests (GitLab) propose changes for review before merging.

Git Flow: main, develop, feature/*, release/*, hotfix/* branches for structured workflows.

Tags mark specific commits (releases): git tag v1.0.0; git push --tags.

git reset moves HEAD and optionally changes staging/working directory: --soft, --mixed, --hard.

git revert creates a new commit that undoes a previous commit (safe for shared history).

.gitignore specifies files/patterns Git should not track: node_modules/, .env, *.log.

GitHub Actions: CI/CD workflows defined in .github/workflows/ YAML files.

GitHub Actions basics: triggers (push, pull_request), jobs, steps, actions (actions/checkout, actions/setup-node).

Cherry-pick: git cherry-pick <commit-hash> applies a specific commit to the current branch.
