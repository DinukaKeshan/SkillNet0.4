#!/bin/bash

# SME Dashboard API Test Script
# Tests all 13 endpoints with comprehensive scenarios

BASE_URL="http://localhost:5000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "======================================"
echo "SME Dashboard API Testing"
echo "======================================"

# Test 1: Register SME user
echo -e "\n${BLUE}[1] Testing: Register SME user${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test SME Company",
    "email": "testsme@example.com",
    "password": "password123",
    "role": "sme"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
if echo "$REGISTER_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ SME registration successful${NC}"
else
  echo -e "${RED}✗ SME registration failed${NC}"
fi

# Test 2: Login as SME
echo -e "\n${BLUE}[2] Testing: SME Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testsme@example.com",
    "password": "password123"
  }')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo "Token: ${TOKEN:0:20}..."

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓ Login successful${NC}"
else
  echo -e "${RED}✗ Login failed${NC}"
  exit 1
fi

# Test 3: Get SME Profile
echo -e "\n${BLUE}[3] Testing: GET /api/sme/profile${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "${BASE_URL}/sme/profile" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROFILE_RESPONSE" | jq '.'
if echo "$PROFILE_RESPONSE" | jq -e '.profile' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Profile fetch successful${NC}"
else
  echo -e "${RED}✗ Profile fetch failed${NC}"
fi

# Test 4: Update SME Profile
echo -e "\n${BLUE}[4] Testing: PUT /api/sme/profile${NC}"
UPDATE_PROFILE=$(curl -s -X PUT "${BASE_URL}/sme/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Updated SME Company",
    "email": "testsme@example.com"
  }')

echo "$UPDATE_PROFILE" | jq '.'
if echo "$UPDATE_PROFILE" | jq -e '.message' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Profile update successful${NC}"
else
  echo -e "${RED}✗ Profile update failed${NC}"
fi

# Test 5: Create Project
echo -e "\n${BLUE}[5] Testing: POST /api/projects${NC}"
CREATE_PROJECT=$(curl -s -X POST "${BASE_URL}/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "p_name": "E-Commerce Web Application",
    "p_description": "Modern full-stack e-commerce platform with React frontend and Node.js backend",
    "p_time_period": "3 months",
    "p_skills_req": ["React", "Node.js", "MongoDB", "TypeScript"],
    "p_value_type": "fixed",
    "p_value_amount": 50000
  }')

echo "$CREATE_PROJECT" | jq '.'
PROJECT_ID=$(echo "$CREATE_PROJECT" | jq -r '.project.p_id')

if [ "$PROJECT_ID" != "null" ] && [ -n "$PROJECT_ID" ]; then
  echo -e "${GREEN}✓ Project creation successful (ID: $PROJECT_ID)${NC}"
else
  echo -e "${RED}✗ Project creation failed${NC}"
  exit 1
fi

# Test 6: Get All Projects
echo -e "\n${BLUE}[6] Testing: GET /api/projects${NC}"
GET_PROJECTS=$(curl -s -X GET "${BASE_URL}/projects" \
  -H "Authorization: Bearer $TOKEN")

echo "$GET_PROJECTS" | jq '.'
PROJECT_COUNT=$(echo "$GET_PROJECTS" | jq '.projects | length')
echo -e "${GREEN}✓ Found $PROJECT_COUNT project(s)${NC}"

# Test 7: Get Single Project
echo -e "\n${BLUE}[7] Testing: GET /api/projects/:id${NC}"
GET_PROJECT=$(curl -s -X GET "${BASE_URL}/projects/${PROJECT_ID}" \
  -H "Authorization: Bearer $TOKEN")

echo "$GET_PROJECT" | jq '.'
if echo "$GET_PROJECT" | jq -e '.project' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Single project fetch successful${NC}"
else
  echo -e "${RED}✗ Single project fetch failed${NC}"
fi

# Test 8: Update Project
echo -e "\n${BLUE}[8] Testing: PUT /api/projects/:id${NC}"
UPDATE_PROJECT=$(curl -s -X PUT "${BASE_URL}/projects/${PROJECT_ID}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "p_name": "E-Commerce Web Application (Updated)",
    "p_description": "Enhanced e-commerce platform with additional features",
    "p_time_period": "4 months",
    "p_skills_req": ["React", "Node.js", "MongoDB", "TypeScript", "Docker"],
    "p_value_type": "fixed",
    "p_value_amount": 60000
  }')

echo "$UPDATE_PROJECT" | jq '.'
if echo "$UPDATE_PROJECT" | jq -e '.message' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Project update successful${NC}"
else
  echo -e "${RED}✗ Project update failed${NC}"
fi

# Test 9: Get Project Recommendations (AI Matcher)
echo -e "\n${BLUE}[9] Testing: GET /api/projects/:id/recommendations${NC}"
RECOMMENDATIONS=$(curl -s -X GET "${BASE_URL}/projects/${PROJECT_ID}/recommendations" \
  -H "Authorization: Bearer $TOKEN")

echo "$RECOMMENDATIONS" | jq '.'
TEAM_COUNT=$(echo "$RECOMMENDATIONS" | jq '.recommendations | length')

if [ "$TEAM_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ Recommendations successful (Found $TEAM_COUNT teams)${NC}"
  TEAM_ID=$(echo "$RECOMMENDATIONS" | jq -r '.recommendations[0].t_id')
  echo "Top recommended team ID: $TEAM_ID"
else
  echo -e "${BLUE}ℹ No teams available for recommendations${NC}"
  TEAM_ID=""
fi

# Test 10: Send Hiring Request (if teams available)
if [ -n "$TEAM_ID" ] && [ "$TEAM_ID" != "null" ]; then
  echo -e "\n${BLUE}[10] Testing: POST /api/projects/:id/send-request${NC}"
  SEND_REQUEST=$(curl -s -X POST "${BASE_URL}/projects/${PROJECT_ID}/send-request" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"team_id\": $TEAM_ID,
      \"message\": \"We would like to hire your team for this exciting project!\",
      \"sme_contact\": \"testsme@example.com\"
    }")

  echo "$SEND_REQUEST" | jq '.'
  if echo "$SEND_REQUEST" | jq -e '.message' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Hiring request sent successfully${NC}"
  else
    echo -e "${RED}✗ Hiring request failed${NC}"
  fi
else
  echo -e "\n${BLUE}[10] Skipping: No teams available for hiring request${NC}"
fi

# Test 11: Register Student (Team Leader)
echo -e "\n${BLUE}[11] Testing: Register Student for hiring workflow${NC}"
STUDENT_REGISTER=$(curl -s -X POST "${BASE_URL}/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student Leader",
    "email": "teststudent@example.com",
    "password": "password123",
    "role": "student"
  }')

echo "$STUDENT_REGISTER" | jq '.'

# Student Login
STUDENT_LOGIN=$(curl -s -X POST "${BASE_URL}/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teststudent@example.com",
    "password": "password123"
  }')

STUDENT_TOKEN=$(echo "$STUDENT_LOGIN" | jq -r '.token')
echo "Student Token: ${STUDENT_TOKEN:0:20}..."

# Test 12: Get Hiring Requests (Student View)
if [ -n "$TEAM_ID" ] && [ "$TEAM_ID" != "null" ]; then
  echo -e "\n${BLUE}[12] Testing: GET /api/teams/hiring-requests${NC}"
  GET_REQUESTS=$(curl -s -X GET "${BASE_URL}/teams/hiring-requests" \
    -H "Authorization: Bearer $STUDENT_TOKEN")

  echo "$GET_REQUESTS" | jq '.'
  REQUEST_COUNT=$(echo "$GET_REQUESTS" | jq '.requests | length')
  
  if [ "$REQUEST_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $REQUEST_COUNT hiring request(s)${NC}"
    REQUEST_ID=$(echo "$GET_REQUESTS" | jq -r '.requests[0].hr_id')
    
    # Test 13: Accept Hiring Request
    if [ -n "$REQUEST_ID" ] && [ "$REQUEST_ID" != "null" ]; then
      echo -e "\n${BLUE}[13] Testing: POST /api/teams/hiring-requests/:id/accept${NC}"
      ACCEPT_REQUEST=$(curl -s -X POST "${BASE_URL}/teams/hiring-requests/${REQUEST_ID}/accept" \
        -H "Authorization: Bearer $STUDENT_TOKEN")

      echo "$ACCEPT_REQUEST" | jq '.'
      if echo "$ACCEPT_REQUEST" | jq -e '.message' > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Hiring request accepted successfully${NC}"
      else
        echo -e "${RED}✗ Hiring request acceptance failed${NC}"
      fi
    fi
  else
    echo -e "${BLUE}ℹ No hiring requests found (student may not be team leader)${NC}"
  fi
else
  echo -e "\n${BLUE}[12-13] Skipping: No hiring requests to test${NC}"
fi

# Test 14: Verify Project Update (Should show hired team)
echo -e "\n${BLUE}[14] Testing: Verify project shows hired team${NC}"
VERIFY_PROJECT=$(curl -s -X GET "${BASE_URL}/projects/${PROJECT_ID}" \
  -H "Authorization: Bearer $TOKEN")

echo "$VERIFY_PROJECT" | jq '.'
HIRED_TEAM=$(echo "$VERIFY_PROJECT" | jq -r '.project.hired_team_id')

if [ "$HIRED_TEAM" != "null" ] && [ -n "$HIRED_TEAM" ]; then
  echo -e "${GREEN}✓ Project correctly shows hired team (ID: $HIRED_TEAM)${NC}"
else
  echo -e "${BLUE}ℹ Project has no hired team yet${NC}"
fi

# Optional: Delete Project (Test DELETE endpoint)
echo -e "\n${BLUE}[15] Testing: DELETE /api/projects/:id (optional)${NC}"
read -p "Delete test project? (y/n): " DELETE_CONFIRM

if [ "$DELETE_CONFIRM" = "y" ]; then
  DELETE_PROJECT=$(curl -s -X DELETE "${BASE_URL}/projects/${PROJECT_ID}" \
    -H "Authorization: Bearer $TOKEN")

  echo "$DELETE_PROJECT" | jq '.'
  if echo "$DELETE_PROJECT" | jq -e '.message' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Project deletion successful${NC}"
  else
    echo -e "${RED}✗ Project deletion failed${NC}"
  fi
else
  echo "Skipping project deletion"
fi

echo -e "\n======================================"
echo "API Testing Complete!"
echo "======================================"
