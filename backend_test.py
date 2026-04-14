import requests
import sys
import json
from datetime import datetime

class DSATrackerAPITester:
    def __init__(self, base_url="https://algo-master-hub.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_topics = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")

            return success, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_get_topics_empty(self):
        """Test getting topics when empty"""
        success, response = self.run_test(
            "Get Topics (Empty)",
            "GET",
            "topics",
            200
        )
        if success:
            print(f"Found {len(response)} topics")
        return success

    def test_create_topic(self):
        """Test creating a new topic"""
        topic_data = {
            "name": "Two Sum",
            "category": "Arrays",
            "difficulty": "easy",
            "notes": "Use hash map for O(n) solution",
            "problem_link": "https://leetcode.com/problems/two-sum/"
        }
        
        success, response = self.run_test(
            "Create Topic",
            "POST",
            "topics",
            200,
            data=topic_data
        )
        
        if success and 'id' in response:
            self.created_topics.append(response['id'])
            print(f"Created topic with ID: {response['id']}")
            return response['id']
        return None

    def test_get_topics_with_data(self):
        """Test getting topics when data exists"""
        success, response = self.run_test(
            "Get Topics (With Data)",
            "GET",
            "topics",
            200
        )
        if success:
            print(f"Found {len(response)} topics")
        return success

    def test_get_topic_filters(self):
        """Test topic filtering"""
        # Test category filter
        success1, _ = self.run_test(
            "Filter by Category",
            "GET",
            "topics",
            200,
            params={"category": "Arrays"}
        )
        
        # Test difficulty filter
        success2, _ = self.run_test(
            "Filter by Difficulty",
            "GET",
            "topics",
            200,
            params={"difficulty": "easy"}
        )
        
        # Test status filter
        success3, _ = self.run_test(
            "Filter by Status",
            "GET",
            "topics",
            200,
            params={"status": "not_started"}
        )
        
        # Test search filter
        success4, _ = self.run_test(
            "Search Topics",
            "GET",
            "topics",
            200,
            params={"search": "Two"}
        )
        
        return success1 and success2 and success3 and success4

    def test_update_topic(self, topic_id):
        """Test updating a topic"""
        if not topic_id:
            print("❌ No topic ID provided for update test")
            return False
            
        update_data = {
            "status": "completed",
            "notes": "Updated notes - solved using hash map approach"
        }
        
        success, response = self.run_test(
            "Update Topic",
            "PUT",
            f"topics/{topic_id}",
            200,
            data=update_data
        )
        
        if success:
            print(f"Updated topic status to: {response.get('status', 'unknown')}")
        return success

    def test_get_stats(self):
        """Test getting statistics"""
        success, response = self.run_test(
            "Get Statistics",
            "GET",
            "stats",
            200
        )
        
        if success:
            print(f"Stats - Total: {response.get('total', 0)}, Completed: {response.get('completed', 0)}")
        return success

    def test_get_reminders(self):
        """Test getting revision reminders"""
        success, response = self.run_test(
            "Get Revision Reminders",
            "GET",
            "topics/reminders/due",
            200
        )
        
        if success:
            print(f"Found {len(response)} reminders due")
        return success

    def test_mark_reviewed(self, topic_id):
        """Test marking a topic as reviewed"""
        if not topic_id:
            print("❌ No topic ID provided for review test")
            return False
            
        success, response = self.run_test(
            "Mark Topic Reviewed",
            "POST",
            f"topics/{topic_id}/review",
            200
        )
        
        if success:
            print(f"Next review date: {response.get('next_review', 'unknown')}")
        return success

    def test_delete_topic(self, topic_id):
        """Test deleting a topic"""
        if not topic_id:
            print("❌ No topic ID provided for delete test")
            return False
            
        success, response = self.run_test(
            "Delete Topic",
            "DELETE",
            f"topics/{topic_id}",
            200
        )
        
        if success:
            print("Topic deleted successfully")
        return success

    def test_error_cases(self):
        """Test error handling"""
        # Test getting non-existent topic
        success1, _ = self.run_test(
            "Get Non-existent Topic",
            "PUT",
            "topics/non-existent-id",
            404,
            data={"status": "completed"}
        )
        
        # Test deleting non-existent topic
        success2, _ = self.run_test(
            "Delete Non-existent Topic",
            "DELETE",
            "topics/non-existent-id",
            404
        )
        
        # Test creating topic with invalid data
        success3, _ = self.run_test(
            "Create Topic Invalid Data",
            "POST",
            "topics",
            422,
            data={"name": ""}  # Missing required fields
        )
        
        return success1 and success2 and success3

def main():
    print("🚀 Starting DSA Tracker API Tests")
    print("=" * 50)
    
    tester = DSATrackerAPITester()
    
    # Test sequence
    tests_passed = []
    
    # Basic endpoint tests
    tests_passed.append(tester.test_root_endpoint())
    tests_passed.append(tester.test_get_topics_empty())
    
    # Create and test topic
    topic_id = tester.test_create_topic()
    if topic_id:
        tests_passed.append(True)
        tests_passed.append(tester.test_get_topics_with_data())
        tests_passed.append(tester.test_get_topic_filters())
        tests_passed.append(tester.test_update_topic(topic_id))
        tests_passed.append(tester.test_get_stats())
        tests_passed.append(tester.test_get_reminders())
        tests_passed.append(tester.test_mark_reviewed(topic_id))
        tests_passed.append(tester.test_delete_topic(topic_id))
    else:
        tests_passed.extend([False] * 7)
    
    # Error handling tests
    tests_passed.append(tester.test_error_cases())
    
    # Clean up any remaining topics
    for topic_id in tester.created_topics:
        try:
            requests.delete(f"{tester.base_url}/topics/{topic_id}")
        except:
            pass
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Tests completed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"❌ {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())