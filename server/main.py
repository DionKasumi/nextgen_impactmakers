import subprocess
from concurrent.futures import ThreadPoolExecutor
import os

# List of scripts to run
scripts = [
    "app.py",  # Flask app that needs to keep running
    "Events/AllEvents.py",
    "Internships/AllInternships.py",
    "Trainings/AllTrainings.py",
    "Volunteering/kosovovolunteers.py",
    "setup_db.py",
    "db_config.py"
]

def run_script(script, keep_alive=False):
    """
    Runs a script. If `keep_alive` is True, the script will keep running (e.g., app.py).
    """
    if keep_alive:
        print(f"Starting {script} (continuous process)...")
        # Start in the background without blocking the rest
        return subprocess.Popen(["python", script], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    else:
        print(f"Running {script}...")
        result = subprocess.run(["python", script], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode != 0:
            print(f"Error running {script}: {result.stderr}")
        else:
            print(f"{script} completed successfully.")
        return None

if __name__ == "__main__":
    # Start app.py as a long-running script
    processes = [run_script("app.py", keep_alive=True)]

    # Run other scripts in parallel
    with ThreadPoolExecutor(max_workers=5) as executor:
        # Submit the remaining scripts (non-persistent ones) to the executor
        executor.map(run_script, scripts[1:])

    try:
        print("All scripts have been started.")
        # Keep the main process alive while app.py runs
        for process in processes:
            process.wait()
    except KeyboardInterrupt:
        print("Shutting down...")
        # Terminate long-running processes like app.py
        for process in processes:
            process.terminate()
            process.wait()
        print("Processes terminated.")
