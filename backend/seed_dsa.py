"""
Seed script to populate DSA Tracker with all problems from the DSA sheet.
Each problem is added under each pattern it appears in (with duplicates across patterns).
"""
import requests
import os
import re
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Use the external URL for API calls
API_URL = "http://localhost:8001/api"

def name_to_slug(name):
    """Convert a problem name to its LeetCode URL slug."""
    slug = name.lower()
    slug = re.sub(r"[()']", "", slug)
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = slug.strip()
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug

def make_link(name):
    return f"https://leetcode.com/problems/{name_to_slug(name)}/"

# ============================================================
# DSA PATTERNS AND PROBLEMS - from user's DSA SHEET
# ============================================================

patterns = {
    "Arrays": {
        "problems": [
            ("Missing Number", "easy"),
            ("Find All Numbers Disappeared in an Array", "easy"),
            ("Single Number", "easy"),
            ("Squares of a Sorted Array", "easy"),
            ("Backspace String Compare", "easy"),
            ("Index Pairs of a String", "medium"),
            ("Majority Element", "easy"),
            ("Convert 1D Array Into 2D Array", "easy"),
            ("Move Zeroes", "easy"),
            ("Is Subsequence", "easy"),
            ("Maximum Average Subarray I", "easy"),
            ("Product of Array Except Self", "medium"),
            ("Find the Duplicate Number", "medium"),
            ("Find All Duplicates in an Array", "medium"),
            ("Set Matrix Zeroes", "medium"),
            ("Spiral Matrix", "medium"),
            ("Rotate Image", "medium"),
            ("Word Search", "medium"),
            ("Longest Consecutive Sequence", "medium"),
            ("First Missing Positive", "hard"),
            ("Trapping Rain Water", "hard"),
        ]
    },
    "Linked Lists": {
        "problems": [
            ("Linked List Cycle", "easy"),
            ("Middle of the Linked List", "easy"),
            ("Reverse Linked List", "easy"),
            ("Palindrome Linked List", "easy"),
            ("Remove Linked List Elements", "easy"),
            ("Remove Duplicates from Sorted List", "easy"),
            ("Merge Two Sorted Lists", "easy"),
            ("Add Two Numbers", "medium"),
            ("Remove Nth Node From End of List", "medium"),
            ("Sort List", "medium"),
            ("Reorder List", "medium"),
            ("Reverse Linked List II", "medium"),
            ("Rotate List", "medium"),
            ("Swap Nodes in Pairs", "medium"),
            ("Odd Even Linked List", "medium"),
            ("Reverse Nodes in k-Group", "hard"),
            ("Merge k Sorted Lists", "hard"),
        ]
    },
    "Trees": {
        "problems": [
            ("Average of Levels in Binary Tree", "easy"),
            ("Minimum Depth of Binary Tree", "easy"),
            ("Same Tree", "easy"),
            ("Path Sum", "easy"),
            ("Maximum Depth of Binary Tree", "easy"),
            ("Diameter of Binary Tree", "easy"),
            ("Merge Two Binary Trees", "easy"),
            ("Subtree of Another Tree", "easy"),
            ("Invert Binary Tree", "easy"),
            ("Binary Tree Paths", "easy"),
            ("Binary Tree Level Order Traversal II", "medium"),
            ("Binary Tree Level Order Traversal", "medium"),
            ("Binary Tree Zigzag Level Order Traversal", "medium"),
            ("Populating Next Right Pointers in Each Node", "medium"),
            ("Populating Next Right Pointers in Each Node II", "medium"),
            ("Binary Tree Right Side View", "medium"),
            ("All Nodes Distance K in Binary Tree", "medium"),
            ("Lowest Common Ancestor of a Binary Search Tree", "medium"),
            ("Path Sum II", "medium"),
            ("Path Sum III", "medium"),
            ("Lowest Common Ancestor of a Binary Tree", "medium"),
            ("Maximum Binary Tree", "medium"),
            ("Maximum Width of Binary Tree", "medium"),
            ("Construct Binary Tree from Preorder and Inorder Traversal", "medium"),
            ("Validate Binary Search Tree", "medium"),
            ("Kth Smallest Element in a BST", "medium"),
            ("Binary Tree Maximum Path Sum", "hard"),
            ("Serialize and Deserialize Binary Tree", "hard"),
        ]
    },
    "Binary Search": {
        "problems": [
            ("Binary Search", "easy"),
            ("Find Smallest Letter Greater Than Target", "easy"),
            ("Peak Index in a Mountain Array", "easy"),
            ("Search in Rotated Sorted Array", "medium"),
            ("Search in Rotated Sorted Array II", "medium"),
            ("Find Minimum in Rotated Sorted Array", "medium"),
            ("Find Peak Element", "medium"),
            ("Search a 2D Matrix", "medium"),
            ("Search a 2D Matrix II", "medium"),
            ("Find K Closest Elements", "medium"),
            ("Minimum Size Subarray Sum", "medium"),
            ("Kth Smallest Element in a Sorted Matrix", "medium"),
            ("Median of Two Sorted Arrays", "hard"),
        ]
    },
    "Graphs": {
        "problems": [
            ("Number of Islands", "medium"),
            ("Clone Graph", "medium"),
            ("Pacific Atlantic Water Flow", "medium"),
            ("Graph Valid Tree", "medium"),
            ("Number of Connected Components in an Undirected Graph", "medium"),
            ("Course Schedule", "medium"),
            ("Course Schedule II", "medium"),
            ("Minimum Height Trees", "medium"),
            ("Word Search", "medium"),
            ("Sequence Reconstruction", "medium"),
            ("Alien Dictionary", "hard"),
            ("Word Search II", "hard"),
            ("Sort Items by Groups Respecting Dependencies", "hard"),
        ]
    },
    "Recursion & Backtracking": {
        "problems": [
            ("Subsets", "medium"),
            ("Subsets II", "medium"),
            ("Permutations", "medium"),
            ("Permutations II", "medium"),
            ("Combinations", "medium"),
            ("Combination Sum", "medium"),
            ("Combination Sum II", "medium"),
            ("Combination Sum III", "medium"),
            ("Generate Parentheses", "medium"),
            ("Target Sum", "medium"),
            ("Palindrome Partitioning", "medium"),
            ("Letter Combinations of a Phone Number", "medium"),
            ("Generalized Abbreviation", "medium"),
            ("Word Break", "medium"),
            ("Word Search", "medium"),
            ("Factor Combinations", "medium"),
            ("Split a String Into the Max Number of Unique Substrings", "medium"),
            ("N-Queens", "hard"),
            ("Sudoku Solver", "hard"),
            ("Rearrange String k Distance Apart", "hard"),
            ("Word Search II", "hard"),
            ("Concatenated Words", "hard"),
            ("Word Squares", "hard"),
        ]
    },
    "Two Pointers": {
        "problems": [
            ("Two Sum", "easy"),
            ("Squares of a Sorted Array", "easy"),
            ("Backspace String Compare", "easy"),
            ("Move Zeroes", "easy"),
            ("Is Subsequence", "easy"),
            ("Container With Most Water", "medium"),
            ("3Sum", "medium"),
            ("3Sum Closest", "medium"),
            ("Sort Colors", "medium"),
            ("Subarray Product Less Than K", "medium"),
            ("Remove Nth Node From End of List", "medium"),
            ("Swap Nodes in Pairs", "medium"),
            ("Reverse Linked List II", "medium"),
            ("Rotate List", "medium"),
        ]
    },
    "Sliding Window": {
        "problems": [
            ("Best Time to Buy and Sell Stock", "easy"),
            ("Maximum Average Subarray I", "easy"),
            ("Maximum Number of Vowels in a Substring of Given Length", "medium"),
            ("Max Consecutive Ones III", "medium"),
            ("Longest Subarray of 1s After Deleting One Element", "medium"),
            ("Longest Repeating Character Replacement", "medium"),
            ("Longest Substring Without Repeating Characters", "medium"),
            ("Minimum Size Subarray Sum", "medium"),
            ("Fruit Into Baskets", "medium"),
            ("Permutation in String", "medium"),
            ("Substring with Concatenation of All Words", "hard"),
            ("Sliding Window Maximum", "hard"),
            ("Minimum Window Substring", "hard"),
            ("Sliding Window Median", "hard"),
            ("Count Unique Characters of All Substrings of a Given String", "hard"),
        ]
    },
    "Dynamic Programming": {
        "problems": [
            ("Climbing Stairs", "easy"),
            ("Best Time to Buy and Sell Stock", "easy"),
            ("Counting Bits", "easy"),
            ("House Robber", "medium"),
            ("House Robber II", "medium"),
            ("Coin Change", "medium"),
            ("Maximum Subarray", "medium"),
            ("Maximum Product Subarray", "medium"),
            ("Longest Increasing Subsequence", "medium"),
            ("Longest Palindromic Substring", "medium"),
            ("Word Break", "medium"),
            ("Decode Ways", "medium"),
            ("Unique Paths", "medium"),
            ("Jump Game", "medium"),
            ("Palindromic Substrings", "medium"),
            ("Target Sum", "medium"),
            ("Partition Equal Subset Sum", "medium"),
            ("Partition to K Equal Sum Subsets", "medium"),
            ("Best Time to Buy and Sell Stock with Cooldown", "medium"),
            ("Number of Longest Increasing Subsequence", "hard"),
            ("Concatenated Words", "hard"),
            ("Count of Range Sum", "hard"),
            ("Minimum Number of K Consecutive Bit Flips", "hard"),
            ("Count Unique Characters of All Substrings of a Given String", "hard"),
            ("Course Schedule III", "hard"),
        ]
    },
    "Greedy": {
        "problems": [
            ("Best Time to Buy and Sell Stock", "easy"),
            ("Meeting Rooms", "easy"),
            ("Jump Game", "medium"),
            ("Meeting Rooms II", "medium"),
            ("Minimum Number of Arrows to Burst Balloons", "medium"),
            ("Task Scheduler", "medium"),
            ("Insert Interval", "medium"),
            ("Non-overlapping Intervals", "medium"),
            ("Sort Characters By Frequency", "medium"),
            ("Reorganize String", "medium"),
        ]
    },
    "Heaps": {
        "problems": [
            ("Kth Smallest Element in a Sorted Matrix", "medium"),
            ("Find K Pairs with Smallest Sums", "medium"),
            ("Meeting Rooms II", "medium"),
            ("Top K Frequent Elements", "medium"),
            ("K Closest Points to Origin", "medium"),
            ("Kth Largest Element in an Array", "medium"),
            ("Kth Smallest Element in a BST", "medium"),
            ("Merge k Sorted Lists", "hard"),
            ("Smallest Range Covering Elements from K Lists", "hard"),
            ("Sliding Window Maximum", "hard"),
            ("Sliding Window Median", "hard"),
            ("Find Median from Data Stream", "hard"),
            ("Maximum Frequency Stack", "hard"),
            ("Employee Free Time", "hard"),
        ]
    },
    "Strings": {
        "problems": [
            ("Backspace String Compare", "easy"),
            ("Index Pairs of a String", "medium"),
            ("Is Subsequence", "easy"),
            ("Generate Parentheses", "medium"),
            ("Palindrome Partitioning", "medium"),
            ("Letter Combinations of a Phone Number", "medium"),
            ("Longest Palindromic Substring", "medium"),
            ("Word Break", "medium"),
            ("Decode Ways", "medium"),
            ("Palindromic Substrings", "medium"),
            ("Longest Repeating Character Replacement", "medium"),
            ("Longest Substring Without Repeating Characters", "medium"),
            ("Sort Characters By Frequency", "medium"),
            ("Reorganize String", "medium"),
            ("Longest Word in Dictionary", "medium"),
            ("Alien Dictionary", "hard"),
            ("Concatenated Words", "hard"),
            ("Prefix and Suffix Search", "hard"),
            ("Palindrome Pairs", "hard"),
            ("Word Squares", "hard"),
            ("Count Unique Characters of All Substrings of a Given String", "hard"),
            ("Substring with Concatenation of All Words", "hard"),
            ("Rearrange String k Distance Apart", "hard"),
        ]
    },
    "Intervals": {
        "problems": [
            ("Meeting Rooms", "easy"),
            ("Merge Intervals", "medium"),
            ("Interval List Intersections", "medium"),
            ("Non-overlapping Intervals", "medium"),
            ("Meeting Rooms II", "medium"),
            ("Insert Interval", "medium"),
            ("Minimum Number of Arrows to Burst Balloons", "medium"),
            ("Employee Free Time", "hard"),
        ]
    },
    "Matrix": {
        "problems": [
            ("Set Matrix Zeroes", "medium"),
            ("Spiral Matrix", "medium"),
            ("Rotate Image", "medium"),
            ("Word Search", "medium"),
            ("Search a 2D Matrix", "medium"),
            ("Search a 2D Matrix II", "medium"),
            ("Kth Smallest Element in a Sorted Matrix", "medium"),
        ]
    },
    "Bit Manipulation": {
        "problems": [
            ("Missing Number", "easy"),
            ("Single Number", "easy"),
            ("Counting Bits", "easy"),
            ("Maximum XOR of Two Numbers in an Array", "medium"),
            ("Minimum Number of K Consecutive Bit Flips", "hard"),
        ]
    },
    "Design": {
        "problems": [
            ("Implement Trie (Prefix Tree)", "medium"),
            ("Design Search Autocomplete System", "hard"),
            ("Serialize and Deserialize Binary Tree", "hard"),
            ("Find Median from Data Stream", "hard"),
            ("Maximum Frequency Stack", "hard"),
        ]
    },
}

def seed():
    # First, clear existing topics
    print("Clearing existing topics...")
    resp = requests.get(f"{API_URL}/topics")
    if resp.status_code == 200:
        existing = resp.json()
        for t in existing:
            requests.delete(f"{API_URL}/topics/{t['id']}")
        print(f"  Cleared {len(existing)} existing topics")

    total = 0
    for pattern_name, pattern_data in patterns.items():
        problems = pattern_data["problems"]
        print(f"\n--- Seeding pattern: {pattern_name} ({len(problems)} problems) ---")
        for name, difficulty in problems:
            link = make_link(name)
            payload = {
                "name": name,
                "category": pattern_name,
                "difficulty": difficulty,
                "notes": "",
                "problem_link": link
            }
            resp = requests.post(f"{API_URL}/topics", json=payload)
            if resp.status_code == 200:
                total += 1
                print(f"  + {name} ({difficulty})")
            else:
                print(f"  ERROR: {name} -> {resp.status_code}: {resp.text}")

    print(f"\n{'='*50}")
    print(f"DONE! Seeded {total} problems across {len(patterns)} patterns.")
    print(f"{'='*50}")

if __name__ == "__main__":
    seed()
