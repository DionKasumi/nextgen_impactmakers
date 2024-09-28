from playwright.sync_api import sync_playwright
import MySQLdb
import time

db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'
}

def save_internship_to_db(internship):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        
        check_query = "SELECT COUNT(*) FROM all_internships WHERE title = %s AND source = %s"
        cursor.execute(check_query, (internship['title'], internship['source']))
        exists = cursor.fetchone()[0] > 0

        if not exists:
            insert_query = """
            INSERT INTO all_internships (source, title, description, posted_date, salary, duration, location, image_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                internship['source'],
                internship['title'],
                internship['description'],
                None,  
                'N/A',  
                internship['duration'],
                internship['location'],
                internship['image_url']
            ))
            db.commit()
            print(f"Inserted new internship: {internship['title']}")
        else:
            print(f"Internship already exists: {internship['title']}")

    except MySQLdb.Error as e:
        print(f"Error inserting data: {e}")
        db.rollback()
    finally:
        cursor.close()
        db.close()

def fetch_and_update_internships():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://kosovogenu.com/opportunitiesinterships', timeout=60000)

        while True:
            try:
                job_cards_selector = '//div[@class="ant-card ant-card-bordered jobCards null"]'
                page.wait_for_selector(job_cards_selector, timeout=20000)

                job_cards = page.locator(job_cards_selector)
                job_card_count = job_cards.count()

            
                if job_card_count == 0:
                    print("No job cards found, breaking loop.")
                    break

                print(f"Found {job_card_count} job cards on the page.")

                for index in range(job_card_count):
                    try:
                        job_card = job_cards.nth(index)

                      
                        title_element = job_card.locator('.titlePosting')
                        description_element = job_card.locator('#pTag')
                        duration_element = job_card.locator('h6:has-text("Kohëzgjatja e Angazhimit") + h6.valuePosting')
                        location_element = job_card.locator('h6:has-text("Vendi") + h6.valuePosting')
                        image_element = job_card.locator('.companyLogo')

                        title = title_element.inner_text() if title_element.count() > 0 else 'N/A'
                        description = description_element.inner_text() if description_element.count() > 0 else 'N/A'
                        duration = duration_element.inner_text() if duration_element.count() > 0 else 'N/A'
                        location = location_element.inner_text() if location_element.count() > 0 else 'N/A'
                        image_url = image_element.get_attribute('src') if image_element.count() > 0 else 'N/A'
                        posted_date = 'N/A'  
                        salary = 'N/A'  

                     
                        internship_data = {
                            'source': "Kosovo Generation",
                            'title': title,
                            'description': description,
                            'posted_date': None,  
                            'salary': salary,  
                            'duration': duration,
                            'location': location,
                            'image_url': image_url
                        }

                    
                        save_internship_to_db(internship_data)

                    except Exception as e:
                        print(f"Error handling internship element: {e}")

                
                next_button = page.locator('//button[@aria-label="Next"]')
                if next_button.count() > 0 and next_button.is_enabled():
                    print("Clicking 'Next' button to load more internships.")
                    next_button.click()
                    page.wait_for_load_state('networkidle')  
                    page.wait_for_timeout(2000) 
                else:
                    print("No more pages to load.")
                    break

            except Exception as e:
                print(f"Error during job card extraction: {e}")
                break  

# Main loop to refresh internships every 30 minutes
while True:
    fetch_and_update_internships()
    print("Sleeping for 30 minutes...")
    time.sleep(30 * 60)
