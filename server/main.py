import subprocess
from concurrent.futures import ThreadPoolExecutor
import logging
import os
import signal

logging.basicConfig(
    filename="script_manager.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

scripts = [
     "db_config.py",
    "app.py",  
    "Events/AllEvents.py",
    "Internships/AllInternships.py",
    "Trainings/AllTrainings.py",
    "Volunteering/kosovovolunteers.py",
]

def run_script(script_path, keep_alive=False):
    """
    Runs a script. If keep_alive=True, the script will run continuously.
    """
    try:
        if keep_alive:
            logging.info(f"Starting {script_path} (continuous process)...")
            process = subprocess.Popen(
                ["python", script_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            return process
        else:
            logging.info(f"Running {script_path}...")
            result = subprocess.run(
                ["python", script_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.returncode != 0:
                logging.error(f"Error in {script_path}: {result.stderr}")
            else:
                logging.info(f"{script_path} completed successfully.")
            return None
    except Exception as e:
        logging.error(f"Failed to run {script_path}: {str(e)}")
        return None


def terminate_process(process):
    try:
        os.kill(process.pid, signal.SIGTERM)
        process.wait()
        logging.info(f"Terminated process {process.pid}.")
    except Exception as e:
        logging.error(f"Failed to terminate process {process.pid}: {str(e)}")


if __name__ == "__main__":
    print("To access the admin panel, visit: http://127.0.0.1:8080/admin/login")
    print("Logs are being saved to the file: script_manager.log in the server-side folder.")
    
    processes = [run_script("app.py", keep_alive=True)]

    
    with ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(lambda script: run_script(script), scripts[1:])

    try:
        logging.info("All scripts have been started. Monitoring...")
        for process in processes:
            process.wait()
    except KeyboardInterrupt:
        logging.info("Shutting down...")
        for process in processes:
            terminate_process(process)
        logging.info("All processes terminated.")