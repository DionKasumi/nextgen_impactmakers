from playwright.sync_api import sync_playwright
import MySQLdb
import time
from datetime import datetime

db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'
}

def save_job_to_db(job):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

       
        check_query = "SELECT COUNT(*) FROM all_internships WHERE title = %s AND source = %s"
        cursor.execute(check_query, (job['title'], job['source']))
        exists = cursor.fetchone()[0] > 0

        if not exists:
            insert_query = """
            INSERT INTO all_internships (source, title, description, posted_date, salary, duration, location, image_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                job['source'],
                job['title'],
                job['company_name'],  
                job['posted_date'],  
                job['salary'],  
                job['duration'],
                job['location'],
                job['image_url']
            ))
            db.commit()
            print(f"Inserted new job: {job['title']} at {job['company_name']}")
        else:
            print(f"Job already exists: {job['title']} at {job['company_name']}")

    except MySQLdb.Error as e:
        print(f"Error inserting data: {e}")
        db.rollback()
    finally:
        cursor.close()
        db.close()

def fetch_and_update_jobs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://superpuna.rks-gov.net/job-seeker?criteria=', timeout=60000)

        while True:
            try:
                job_boxes_selector = '//div[contains(@class, "px-7 py-6 border border-gray-200")]'
                page.wait_for_selector(job_boxes_selector, timeout=20000)

                job_boxes = page.locator(job_boxes_selector)
                job_box_count = job_boxes.count()

               
                if job_box_count == 0:
                    print("No job boxes found, breaking loop.")
                    break

                print(f"Found {job_box_count} job boxes on the page.")

                for index in range(job_box_count):
                    try:
                        job_box = job_boxes.nth(index)

                       
                        title_element = job_box.locator('h3')
                        company_element = job_box.locator('h4')
                        location_element = job_box.locator('span:has-text("Lokacioni") + strong')
                        posted_date_element = job_box.locator('span:has-text("Shpallur më") + strong')
                        salary_element = job_box.locator('span:has-text("Paga") + strong')

                        title = title_element.inner_text() if title_element.count() > 0 else 'N/A'
                        company_name = company_element.inner_text() if company_element.count() > 0 else 'N/A'
                        location = location_element.inner_text() if location_element.count() > 0 else 'N/A'
                        posted_date = posted_date_element.inner_text() if posted_date_element.count() > 0 else 'N/A'
                        salary = salary_element.inner_text() if salary_element.count() > 0 else 'N/A'

                       
                        posted_date_db = datetime.strptime(posted_date, '%b %d, %Y').date() if posted_date != 'N/A' else None

                        
                        job_data = {
                            'source': "Superpuna RKS",
                            'title': title,
                            'company_name': company_name,  
                            'posted_date': posted_date_db,
                            'salary': salary,
                            'duration': 'N/A', 
                            'location': location,
                            'image_url': 'https://superpuna.rks-gov.net/images/MFPT-logo.svg'  
                        }

                        
                        save_job_to_db(job_data)

                    except Exception as e:
                        print(f"Error handling job box element: {e}")

               
                next_button = page.locator('//button[contains(@class, "bg-blue-550")]')
                if next_button.count() > 0 and next_button.is_enabled():
                    print("Clicking 'Shiko më shumë' button to load more jobs.")
                    next_button.click()
                    page.wait_for_load_state('networkidle')  
                    page.wait_for_timeout(2000)  
                else:
                    print("No more pages to load.")
                    break

            except Exception as e:
                print(f"Error during job box extraction: {e}")
                break  

while True:
    fetch_and_update_jobs()
    print("Sleeping for 30 minutes...")
    time.sleep(30 * 60)


