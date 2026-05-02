# SkillNet ML Integration — INTEGRATION CHECKLIST (Bug Fix Pass)

> **Last updated:** 2026-05-01 — Bug Fix Pass
> **Fixes:** Bug 1 (all quiz answers scored wrong) + Bug 2 (roadmap page blank)

---

## ✅ Bug Fix Summary

### Bug 1 Root Cause — All Answers Scored Wrong

**File:** `Backend/src/controllers/quiz.controller.js`

**Root causes found:**
1. **Type coercion issue:** `answers.find(a => a.questionIndex === idx)` used strict equality.
   `idx` is always a `Number` from `.map()`, but if `a.questionIndex` came in as a string (e.g. from JSON body), the strict `===` comparison failed silently → `answerEntry` was always `undefined` → `selected` was always `null` → every answer scored as wrong.
   **Fix:** Wrapped with `Number(a.questionIndex)` for coercion-safe comparison.

2. **No case/whitespace normalisation:** `selected === q.correct_answer` was strict string equality with no `.toUpperCase().trim()`. Any edge-case from Ollama (e.g. lowercase, trailing space) or the frontend would cause a false-negative.
   **Fix:** Both sides are normalised with `String(...).toUpperCase().trim()` before comparison.

3. **Feedback UX broken:** `nextQuestion` and `startQuiz` did NOT include `correct_answer` in the response, so the `getOptionState()` in `Quiz.jsx` always compared against `undefined` → the revealed feedback banner always showed "Incorrect" even for correct answers.
   **Fix:** Both endpoints now include `correct_answer` in the question response object.

4. **ML "Unknown" level not handled:** If the ML service was down, `skill_level = "Unknown"` was passed to `generateRoadmap`, which resulted in `ROADMAPS[skill]["Unknown"]` → `undefined` → `GENERIC_ROADMAP` fallback. The `effectiveLevel` variable was also passed back to the frontend as "Unknown", breaking the skill level badge.
   **Fix:** `effectiveLevel = skill_level !== "Unknown" ? skill_level : "Beginner"` is used consistently.

---

### Bug 2 Root Cause — Roadmap Page Blank

**Files:** `Backend/src/services/roadmapService.js`, `Backend/src/controllers/quiz.controller.js`, `Backend/src/controllers/skill.controller.js`, `Frontend/src/pages/RoadmapPage.jsx`

**Root causes found:**
1. **Duplicate skillProfile entries:** `submitQuiz` independently called `User.findOneAndUpdate` to write a `skillProfiles` entry using `quiz.skill` (raw/unnormalized, e.g. `"react"`). Then `saveRoadmap` wrote another entry using `normaliseSkill(quiz.skill)` = `"React"`. Two entries existed. MongoDB's `findOneAndUpdate` with `"skillProfiles.skill_name": "React"` (exact match) would NOT find the `"react"` entry, so it pushed a second entry. The `getRoadmap` fetch found the first matching entry by case-insensitive comparison, which may have been the raw entry without a `roadmap` field or with stale data.
   **Fix:** Removed the independent `skillProfiles` write from `submitQuiz`. `saveRoadmap` now exclusively owns profile creation. It uses a case-insensitive `findIndex` and updates by array index to avoid positional `$` operator issues.

2. **`saveRoadmap` used exact skill name match:** The original code used `{ "skillProfiles.skill_name": normalisedSkill }` in `findOneAndUpdate`. If any existing entry had a differently-cased name, it wouldn't match and would push a duplicate.
   **Fix:** `saveRoadmap` now loads the user document first, does a case-insensitive `findIndex`, then updates by array index.

3. **Mongoose Mixed field not serialized:** `getRoadmap` was returning a raw Mongoose subdocument via `res.json()`. While Express usually handles this, the `.roadmap` field (Mixed type) could be returned as a Mongoose-wrapped object instead of a plain JS object, causing frontend destructuring to get an empty `{}`.
   **Fix:** `profile.toObject()` is called before returning to ensure all Mixed fields are plain JS objects.

4. **`verified_level` empty string:** Schema default for `verified_level` is `""`. The frontend `LEVEL_STYLES[""]` returns `undefined`, which falls back correctly via `?? LEVEL_STYLES.Beginner`. But the Skill Gap section would show blank text. 
   **Fix:** `RoadmapPage.jsx` now normalises `rawLevel` to `"Beginner"` if it's not one of the three valid levels.

5. **Response shape ambiguity:** The `data.roadmap` field could be a nested object or the roadmap could be at `data.focus_areas` directly. The page now supports both shapes.

---

## Files Modified in This Fix Pass

| File | Change |
|------|--------|
| `Backend/src/controllers/quiz.controller.js` | Answer normalisation (toUpperCase/trim); Number() coercion for questionIndex; effectiveLevel for ML "Unknown"; removed duplicate skillProfiles write; fixed getQuizResult topic breakdown comparison; report builder normalized; skill_level in response uses effectiveLevel; correct_answer now included in startQuiz/nextQuestion responses |
| `Backend/src/services/roadmapService.js` | `saveRoadmap` rewritten to use case-insensitive findIndex + array index update (no more duplicate entries); `generateRoadmap` logs roadmap lookup result; "Unknown" level falls back to "Beginner" |
| `Backend/src/services/rag/rag.service.js` | Added post-generation log of all correct_answer values |
| `Backend/src/controllers/skill.controller.js` | `getRoadmap` now calls `profile.toObject()` for clean Mixed field serialization; added logging; 404 returned when profile has no roadmap |
| `Frontend/src/pages/RoadmapPage.jsx` | Added console logging of API response; fixed verified_level normalisation; supports both nested and flat roadmap response shapes; user._id guard during load |

---

## Backend Route Audit (All Pass ✅)

| Route | Auth | Handler | Registered in app.js |
|-------|------|---------|----------------------|
| `POST /api/quiz/start` | ✅ protect | `startQuiz` | ✅ `/api/quiz` |
| `POST /api/quiz/next` | ✅ protect | `nextQuestion` | ✅ `/api/quiz` |
| `POST /api/quiz/submit` | ✅ protect | `submitQuiz` | ✅ `/api/quiz` |
| `GET /api/quiz/:quizId/result` | ✅ protect | `getQuizResult` | ✅ `/api/quiz` |
| `GET /api/quiz/history/:studentId/:skill` | ✅ protect | `getQuizHistory` | ✅ `/api/quiz` |
| `GET /api/skills/student/:id/skills` | ✅ protect | `getStudentSkills` | ✅ `/api/skills` |
| `GET /api/roadmap/:studentId/:skill` | ✅ protect (app.js line 22) | `getRoadmap` | ✅ `/api/roadmap` |
| `POST /api/skills` | ✅ protect | `addSkill` | ✅ `/api/skills` |
| `GET /api/skills` | ✅ protect | `getSkills` | ✅ `/api/skills` |
| `POST /api/skills/claim-badge` | ✅ protect | `claimBadge` | ✅ `/api/skills` |

---

## Frontend Route Audit (All Pass ✅)

| Route | Component | Notes |
|-------|-----------|-------|
| `/quiz/:skill` | `QuizPage` | Starts quiz with skill param |
| `/quiz/result/:attemptId` | `QuizResultPage` | Reads from `location.state.result.data`; falls back to API fetch |
| `/quiz-summary` | `QuizSummary` | Legacy summary page |
| `/roadmap/:skill` | `RoadmapPage` | Fetches `/api/roadmap/:userId/:skill` |
| `/dashboard/skills` | `SkillDashboardPage` | Fetches `/api/skills/student/:id/skills` |

---

## submitQuiz Response Shape (verified)

```json
{
  "success": true,
  "data": {
    "quizId": "...",
    "skill": "react",
    "score": 7,
    "total": 10,
    "scorePercent": 70,
    "verified": true,
    "skill_level": "Intermediate",
    "confidence": 0.82,
    "probabilities": { "Beginner": 0.10, "Intermediate": 0.82, "Advanced": 0.08 },
    "easyCorrect": 2,
    "mediumCorrect": 3,
    "hardCorrect": 2,
    "topicBreakdown": [{ "topic": "React Hooks", "correct": 2, "total": 3 }],
    "roadmap": { "focus_areas": [...], "projects": [...], "resources": [...], "estimated_weeks": 6 },
    "timeTakenSec": 312,
    "attemptNumber": 1,
    "report": [{ "question": "...", "options": [...], "userAnswer": "...", "correctAnswer": "...", "isCorrect": true }]
  }
}
```

---

## Manual Verification Steps

### Verify Bug 1 Fix (Quiz Answers)

1. Start all services (ML, Backend, Frontend, Ollama).
2. Log in → add "React" skill → navigate to `/quiz/react`.
3. Open browser DevTools → Console tab.
4. Answer all 10 questions deliberately (some correct, some wrong).
5. On submit, check the backend console for:
   - `📋 Correct answers from DB: ["A", "C", "B", ...]` — all must be single uppercase letters
   - `📩 Submitted answers: [{ questionIndex: 0, selected: "A" }, ...]`
   - Per-question lines like `Q0: stored=A, submitted=A, correct=true`
6. **Expected:** `scorePercent` reflects actual correct answers (not 0%).
7. Check the in-quiz reveal banner: clicking an option should show green ✓ (correct) or red ✗ (wrong) immediately.

### Verify Bug 2 Fix (Roadmap Page)

1. Complete a quiz for any skill (e.g. "React").
2. On the result page, click **"View Learning Roadmap"**.
3. **Expected:** `/roadmap/react` loads with 7 sections: Header, Skill Gap, Focus Areas, Projects, Resources, Progress Meter, Estimated Time.
4. Check browser DevTools Console for:
   - `🗺️ RoadmapPage: fetching roadmap for user=..., skill="react"`
   - `🗺️ RoadmapPage: raw API response: { success: true, data: { skill_name: "React", verified_level: "...", roadmap: {...} } }`
5. Check backend console for:
   - `📍 getRoadmap: studentId=..., skill="react"`
   - `📍 getRoadmap: user has 1 skill profile(s): ["React"]`
   - `📍 getRoadmap: returning profile for "React", roadmap keys: ["focus_areas", "projects", "resources", "estimated_weeks"]`
6. **Expected:** Focus areas list, projects grid, and resources all render correctly.

### Verify No Bronze/Silver/Platinum Text

- Search all `.jsx` files for "Bronze", "Silver", "Gold", "Platinum" — none should appear.
- `QuizSummary.jsx` line 19 shows `"Verified! Keep building on this."` at 70%+ — no tier labels.

### Verify ML Fallback

1. Stop the Python ML service (`Ctrl+C` in the ml_service terminal).
2. Complete a quiz.
3. **Expected:** Quiz still submits successfully; `skill_level` shows "Beginner" (not "Unknown"); roadmap still loads.
4. Backend console shows: `⚠️  ML service unavailable: ...` then proceeds normally.

---

## Verified Constraints (Updated)

| Constraint | Status |
|---|---|
| No Bronze/Silver/Platinum text anywhere | ✅ Confirmed absent |
| Quiz always returns exactly 10 questions | ✅ Enforced in rag.service.js |
| Verified badge threshold = 70% | ✅ All occurrences updated |
| No Ollama call during nextQuestion | ✅ Uses pre-stored questions |
| All new API routes require auth middleware | ✅ `protect` on all routes |
| ML in Python only; Node calls via HTTP | ✅ mlService.js uses fetch |
| SHA-256 hashes for question dedup | ✅ quiz.controller.js |
| Graceful ML fallback → "Beginner" default | ✅ effectiveLevel logic |
| Answer comparison case-insensitive | ✅ Fixed in this pass |
| Single skillProfiles entry per skill | ✅ Fixed in this pass (saveRoadmap owns writes) |
| Roadmap page never blank silently | ✅ Error/empty states + logging added |
| skill_level never "Unknown" in response | ✅ effectiveLevel replaces raw skill_level |
| correct_answer in question responses for UX | ✅ startQuiz + nextQuestion now include it |

---

## Known Limitations (Unchanged)

1. **Synthetic training data** — ML model trained on 1,000 synthetic records. Retrain with real data as quiz submissions accumulate.
2. **ML service is a separate process** — Must be started independently. Backend falls back gracefully.
3. **RAG knowledge base** — Quiz quality depends on `/Backend/src/knowledge/` files.
4. **Question uniqueness** — SHA-256 hash dedup only catches exact duplicates; near-duplicates may slip through.
5. **Batch quiz generation latency** — All 10 questions generated in a single Ollama call (30–120s depending on hardware).

---

## Setup Commands

```bash
# Step 1 — ML Service
cd d:\Projects\Skill-Verification-Engine\ml_service
pip install -r requirements.txt
python train.py
python api.py   # keep running on port 8000

# Step 2 — Backend
cd d:\Projects\Skill-Verification-Engine\Backend
npm run dev     # port 5000

# Step 3 — Frontend
cd d:\Projects\Skill-Verification-Engine\Frontend
npm run dev     # port 5173

# Step 4 — Ollama (separate terminal)
ollama run llama3
```
