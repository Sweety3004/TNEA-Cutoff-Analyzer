import json
import argparse
import os

def load_data(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found.")
        return []
    with open(file_path, 'r') as f:
        return json.load(f)

def filter_data(data, college=None, branch=None, community=None, min_cutoff=None, max_cutoff=None):
    filtered = []
    for entry in data:
        if college and college.lower() not in entry.get('con', '').lower():
            continue
        if branch and branch.lower() not in entry.get('brn', '').lower():
            continue
        
        if community:
            cutoff = entry.get(community)
            if cutoff == "" or cutoff is None:
                continue
            try:
                cutoff_val = float(cutoff)
                if min_cutoff is not None and cutoff_val < min_cutoff:
                    continue
                if max_cutoff is not None and cutoff_val > max_cutoff:
                    continue
            except ValueError:
                continue
        
        filtered.append(entry)
    return filtered

def display_results(results, community):
    if not results:
        print("No matching results found.")
        return

    print(f"{'Code':<6} | {'College Name':<60} | {'Branch':<40} | {community if community else 'Cutoffs'}")
    print("-" * 125)
    for entry in results:
        college_name = (entry.get('con', '')[:57] + '...') if len(entry.get('con', '')) > 60 else entry.get('con', '')
        branch_name = (entry.get('brn', '')[:37] + '...') if len(entry.get('brn', '')) > 40 else entry.get('brn', '')
        code = entry.get('code', '')
        
        if community:
            cutoff = entry.get(community, 'N/A')
            print(f"{code:<6} | {college_name:<60} | {branch_name:<40} | {cutoff}")
        else:
            print(f"{code:<6} | {college_name:<60} | {branch_name:<40}")

def main():
    parser = argparse.ArgumentParser(description="TNEA Cutoff Analyzer")
    parser.add_argument("--file", default="TNEA2024CutOff.json", help="JSON file to analyze")
    parser.add_argument("--college", help="Filter by college name")
    parser.add_argument("--branch", help="Filter by branch name")
    parser.add_argument("--community", help="Community to check cutoff for (OC, BC, BCM, MBC, SC, SCA, ST)")
    parser.add_argument("--min-cutoff", type=float, help="Minimum cutoff mark")
    parser.add_argument("--max-cutoff", type=float, help="Maximum cutoff mark")

    args = parser.parse_args()

    # Try to find the file in TNEA-Cutoff-Analyzer subdirectory if not in root
    file_path = args.file
    if not os.path.exists(file_path):
        alt_path = os.path.join("TNEA-Cutoff-Analyzer", args.file)
        if os.path.exists(alt_path):
            file_path = alt_path

    data = load_data(file_path)
    if not data:
        return

    results = filter_data(data, args.college, args.branch, args.community, args.min_cutoff, args.max_cutoff)
    display_results(results, args.community)

if __name__ == "__main__":
    main()
