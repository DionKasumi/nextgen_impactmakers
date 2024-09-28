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
                '',  
                job['posted_date'],  
                job['salary'],  
                'N/A', 
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
        page.goto('https://kosovajob.com/', timeout=60000)

        previous_job_count = 0
        max_scrolls = 10  
        scroll_count = 0

        try:
            while scroll_count < max_scrolls:
                job_boxes_selector = '//div[@class="jobListCnts  jobListPrm  "]'
                page.wait_for_selector(job_boxes_selector, timeout=20000)

                job_boxes = page.locator(job_boxes_selector)
                job_box_count = job_boxes.count()

                if job_box_count == previous_job_count:
                    print("No more new jobs found.")
                    break

                previous_job_count = job_box_count
                print(f"Found {job_box_count} job boxes on the page after scrolling {scroll_count + 1} times.")

                for index in range(job_box_count):
                    try:
                        job_box = job_boxes.nth(index)

                        title_element = job_box.locator('.jobListTitle')
                        location_element = job_box.locator('.jobListCity')
                        posted_date_element = title_element.get_attribute('date')  
                        image_element = job_box.locator('.jobListImage')

                        title = title_element.inner_text() if title_element.count() > 0 else 'N/A'
                        location = location_element.inner_text() if location_element.count() > 0 else 'N/A'
                        posted_date = posted_date_element if posted_date_element else 'N/A'
                        image_url = image_element.get_attribute('data-background-image') if image_element.count() > 0 else 'N/A'
                        company_name = 'Kosova Job'  

                        posted_date_db = datetime.strptime(posted_date, '%Y-%m-%d %H:%M:%S').date() if posted_date != 'N/A' else None

                     
                        job_data = {
                            'source': "Kosova Job",
                            'title': title,
                            'company_name': company_name,  
                            'posted_date': posted_date_db,
                            'salary': 'N/A',  
                            'duration': 'N/A',  
                            'location': location,
                            'image_url': image_url
                        }

                        
                        job_data['description'] = ''

                        save_job_to_db(job_data)

                    except Exception as e:
                        print(f"Error handling job box element: {e}")

                
                page.evaluate('window.scrollBy(0, document.body.scrollHeight)')
                page.wait_for_timeout(3000)  

                scroll_count += 1

        except Exception as e:
            print(f"Error during job box extraction: {e}")

# Main loop to refresh jobs every 30 minutes
while True:
    fetch_and_update_jobs()
    print("Sleeping for 30 minutes...")
    time.sleep(30 * 60)
