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
            # Test enhanced stats with category_progress
            if 'category_progress' in response:
                print(f"✅ Category progress field found with {len(response['category_progress'])} categories")
                # Check structure of category_progress
                for cat, data in response['category_progress'].items():
                    if all(key in data for key in ['total', 'completed', 'in_progress', 'not_started']):
                        print(f"✅ Category '{cat}' has correct progress structure")
                    else:
                        print(f"❌ Category '{cat}' missing required progress fields")
                        return False
            else:
                print("❌ Category progress field missing from stats response")
                return False
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

    def test_bulk_update_status(self):
        """Test bulk updating topic status"""
        # First create multiple topics for bulk update
        topic_ids = []
        for i in range(3):
            topic_data = {
                "name": f"Bulk Test Topic {i+1}",
                "category": "Arrays",
                "difficulty": "easy",
                "notes": f"Test topic {i+1} for bulk update",
                "problem_link": f"https://example.com/problem{i+1}"
            }
            
            success, response = self.run_test(
                f"Create Bulk Test Topic {i+1}",
                "POST",
                "topics",
                200,
                data=topic_data
            )
            
            if success and 'id' in response:
                topic_ids.append(response['id'])
                self.created_topics.append(response['id'])
        
        if len(topic_ids) < 3:
            print("❌ Failed to create topics for bulk update test")
            return False
        
        # Test bulk update to completed
        bulk_data = {
            "topic_ids": topic_ids,
            "status": "completed"
        }
        
        success, response = self.run_test(
            "Bulk Update Status to Completed",
            "PUT",
            "topics/bulk-update",
            200,
            data=bulk_data
        )
        
        if success:
            print(f"✅ Bulk update response: {response}")
            
            # Verify the topics were actually updated
            for topic_id in topic_ids:
                verify_success, verify_response = self.run_test(
                    f"Verify Topic {topic_id} Status",
                    "GET",
                    f"topics?search=Bulk Test Topic",
                    200
                )
                
                if verify_success:
                    # Find the specific topic and check its status
                    topic_found = False
                    for topic in verify_response:
                        if topic['id'] == topic_id:
                            topic_found = True
                            if topic['status'] == 'completed':
                                print(f"✅ Topic {topic_id} successfully updated to completed")
                            else:
                                print(f"❌ Topic {topic_id} status is {topic['status']}, expected completed")
                                return False
                            break
                    
                    if not topic_found:
                        print(f"❌ Topic {topic_id} not found in verification")
                        return False
        
        return success

    def test_sorting_functionality(self):
        """Test sorting functionality"""
        # Test sorting by different fields
        sort_tests = [
            ("name", "asc"),
            ("name", "desc"),
            ("difficulty", "asc"),
            ("difficulty", "desc"),
            ("category", "asc"),
            ("category", "desc"),
            ("status", "asc"),
            ("status", "desc"),
            ("created_at", "asc"),
            ("created_at", "desc")
        ]
        
        all_passed = True
        for sort_by, sort_order in sort_tests:
            success, response = self.run_test(
                f"Sort by {sort_by} {sort_order}",
                "GET",
                "topics",
                200,
                params={"sort_by": sort_by, "sort_order": sort_order}
            )
            
            if success:
                print(f"✅ Sorting by {sort_by} {sort_order} returned {len(response)} topics")
            else:
                print(f"❌ Sorting by {sort_by} {sort_order} failed")
                all_passed = False
        
        return all_passed

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
        
        # Test new enhanced features
        tests_passed.append(tester.test_bulk_update_status())
        tests_passed.append(tester.test_sorting_functionality())
        
        tests_passed.append(tester.test_delete_topic(topic_id))
    else:
        tests_passed.extend([False] * 9)
    
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