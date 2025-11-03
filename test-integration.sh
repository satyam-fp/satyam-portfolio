#!/bin/bash

# Integration Test Script for Neural Space Portfolio
# Tests backend API and frontend-backend integration

echo "🧪 Neural Space Portfolio - Integration Test"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Testing $name... "
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Expected: $expected"
        echo "  Got: $response"
        ((FAILED++))
    fi
}

echo "📡 Backend API Tests"
echo "-------------------"

# Test backend health
test_endpoint "Neural Data API" "http://localhost:8000/api/neural-data" "projects"
test_endpoint "Projects API" "http://localhost:8000/api/projects" "3D Object Detection"
test_endpoint "Blogs API" "http://localhost:8000/api/blogs" "Getting Started"
test_endpoint "Admin Stats (Unauthorized)" "http://localhost:8000/api/admin/stats" "Not authenticated"

echo ""
echo "🎨 Frontend Tests"
echo "----------------"

# Test frontend pages
test_endpoint "Home Page" "http://localhost:3000" "Neural Space"
test_endpoint "Projects Page" "http://localhost:3000/projects" "Projects"
test_endpoint "Blog Page" "http://localhost:3000/blog" "Blog"
test_endpoint "About Page" "http://localhost:3000/about" "About"

echo ""
echo "🔗 Dynamic Routes Tests"
echo "----------------------"

# Test dynamic routes
test_endpoint "Project Detail" "http://localhost:3000/projects/3d-object-detection-yolo" "3D Object Detection"
test_endpoint "Blog Detail" "http://localhost:3000/blog/getting-started-3d-deep-learning" "Getting Started"

echo ""
echo "🔐 Admin Authentication Test"
echo "---------------------------"

# Test admin login
echo -n "Testing Admin Login... "
login_response=$(curl -s -X POST http://localhost:8000/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' \
    -c /tmp/test_cookies.txt)

if echo "$login_response" | grep -q "success"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
    
    # Test authenticated endpoint
    echo -n "Testing Admin Stats (Authenticated)... "
    stats_response=$(curl -s http://localhost:8000/api/admin/stats -b /tmp/test_cookies.txt)
    
    if echo "$stats_response" | grep -q "total_projects"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

# Cleanup
rm -f /tmp/test_cookies.txt

echo ""
echo "=============================================="
echo "📊 Test Results"
echo "=============================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
