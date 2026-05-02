#!/bin/bash

# Test script for Project Matcher ML API (FastText)
# Assumes API is running on port 5003

BASE_URL="http://localhost:5003"

echo "========================================="
echo " Project Matcher ML API - Test Suite"
echo "========================================="

# Test 1: Health check
echo -e "\n[1] Health Check (GET /)..."
HEALTH=$(curl -s "${BASE_URL}/")
echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"

if echo "$HEALTH" | grep -q "running"; then
    echo "✅ API is running"
else
    echo "❌ API is not running. Start it first:"
    echo "   cd api && python app.py"
    exit 1
fi

# Test 2: Match with frontend project skills
echo -e "\n[2] Match teams for project with: react typescript nodejs..."
REC1=$(curl -s -X POST "${BASE_URL}/ml/recommend" \
    -H "Content-Type: application/json" \
    -d '{"skills": "react typescript nodejs", "top_n": 5}')
echo "$REC1" | python3 -m json.tool 2>/dev/null || echo "$REC1"
COUNT1=$(echo "$REC1" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('recommendations',[])))" 2>/dev/null)
echo "Found $COUNT1 team recommendations"

# Test 3: Match with data science project skills
echo -e "\n[3] Match teams for project with: python tensorflow pandas docker..."
REC2=$(curl -s -X POST "${BASE_URL}/ml/recommend" \
    -H "Content-Type: application/json" \
    -d '{"skills": "python tensorflow pandas docker", "top_n": 5}')
echo "$REC2" | python3 -m json.tool 2>/dev/null || echo "$REC2"
COUNT2=$(echo "$REC2" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('recommendations',[])))" 2>/dev/null)
echo "Found $COUNT2 recommendations"

# Test 4: Match with mobile project
echo -e "\n[4] Match teams for project with: flutter dart firebase..."
REC3=$(curl -s -X POST "${BASE_URL}/ml/recommend" \
    -H "Content-Type: application/json" \
    -d '{"skills": "flutter dart firebase", "top_n": 3}')
echo "$REC3" | python3 -m json.tool 2>/dev/null || echo "$REC3"

# Test 5: Test with completely new / unseen skills
echo -e "\n[5] Match teams for UNSEEN skills: langchain llamaindex vectordb..."
REC4=$(curl -s -X POST "${BASE_URL}/ml/recommend" \
    -H "Content-Type: application/json" \
    -d '{"skills": "langchain llamaindex vectordb", "top_n": 3}')
echo "$REC4" | python3 -m json.tool 2>/dev/null || echo "$REC4"

# Test 6: Empty skills
echo -e "\n[6] Match teams with empty skills..."
REC5=$(curl -s -X POST "${BASE_URL}/ml/recommend" \
    -H "Content-Type: application/json" \
    -d '{"skills": "", "top_n": 3}')
echo "$REC5" | python3 -m json.tool 2>/dev/null || echo "$REC5"

# Test 7: No body
echo -e "\n[7] POST without body (should return error)..."
REC6=$(curl -s -X POST "${BASE_URL}/ml/recommend" \
    -H "Content-Type: application/json" \
    -d '{}')
echo "$REC6" | python3 -m json.tool 2>/dev/null || echo "$REC6"

echo -e "\n========================================="
echo "✅ Project Matcher ML API Test Complete!"
echo "========================================="
