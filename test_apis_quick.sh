#!/bin/bash

# Quick API Test - Tests core SME dashboard functionality
BASE_URL="http://localhost:5001/api"

echo "========================================="
echo "SME Dashboard API Quick Test"
echo "========================================="

# Test 1: Login
echo -e "\n[1] Login as SME..."
LOGIN=$(curl -s -X POST "${BASE_URL}/signin" -H "Content-Type: application/json" -d '{"email": "testsme@example.com", "password": "password123"}')
TOKEN=$(echo "$LOGIN" | jq -r '.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed - cannot continue"
  echo "Response: $LOGIN"
  exit 1
fi

echo "✅ Login successful"
echo "Token: ${TOKEN:0:40}..."

# Test 2: Get Profile
echo -e "\n[2] GET /api/sme/profile..."
PROFILE=$(curl -s -X GET "${BASE_URL}/sme/profile" -H "Authorization: Bearer $TOKEN")
echo "$PROFILE" | jq '.'

if echo "$PROFILE" | jq -e '.profile' > /dev/null 2>&1; then
  echo "✅ Profile retrieved"
else
  echo "❌ Profile fetch failed"
fi

# Test 3: Create Project
echo -e "\n[3] POST /api/projects..."
PROJECT=$(curl -s -X POST "${BASE_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "p_name": "Test E-Commerce Platform",
    "p_description": "Full-stack e-commerce web application",
    "p_time_period": "3 months",
    "p_skills_req": ["React", "Node.js", "MongoDB"],
    "p_value_type": "fixed",
    "p_value_amount": 50000
  }')

echo "$PROJECT" | jq '.'
PROJECT_ID=$(echo "$PROJECT" | jq -r '.project.p_id')

if [ -n "$PROJECT_ID" ] && [ "$PROJECT_ID" != "null" ]; then
  echo "✅ Project created (ID: $PROJECT_ID)"
else
  echo "❌ Project creation failed"
  exit 1
fi

# Test 4: Get All Projects
echo -e "\n[4] GET /api/projects..."
PROJECTS=$(curl -s -X GET "${BASE_URL}/projects" -H "Authorization: Bearer $TOKEN")
echo "$PROJECTS" | jq '.'

# Test 5: Get Project Recommendations
echo -e "\n[5] GET /api/projects/${PROJECT_ID}/recommendations..."
RECS=$(curl -s -X GET "${BASE_URL}/projects/${PROJECT_ID}/recommendations" -H "Authorization: Bearer $TOKEN")
echo "$RECS" | jq '.'
TEAM_COUNT=$(echo "$RECS" | jq '.recommendations | length')
echo "Found $TEAM_COUNT team recommendations"

# Test 6: Update Project
echo -e "\n[6] PUT /api/projects/${PROJECT_ID}..."
UPDATE=$(curl -s -X PUT "${BASE_URL}/projects/${PROJECT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "p_name": "Test E-Commerce Platform (Updated)",
    "p_description": "Enhanced platform with new features",
    "p_time_period": "4 months",
    "p_skills_req": ["React", "Node.js", "MongoDB", "Docker"],
    "p_value_type": "fixed",
    "p_value_amount": 60000
  }')

echo "$UPDATE" | jq '.'

# Test 7: Delete Project
echo -e "\n[7] DELETE /api/projects/${PROJECT_ID}..."
DELETE=$(curl -s -X DELETE "${BASE_URL}/projects/${PROJECT_ID}" -H "Authorization: Bearer $TOKEN")
echo "$DELETE" | jq '.'

echo -e "\n========================================="
echo "✅ API Testing Complete!"
echo "========================================="
