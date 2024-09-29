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

def save_volunteering_opportunity_to_db(opportunity):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        check_query = "SELECT COUNT(*) FROM all_volunteering WHERE title = %s AND source = %s"
        cursor.execute(check_query, (opportunity['title'], opportunity['source']))
        exists = cursor.fetchone()[0] > 0

        if not exists:
            insert_query = """
            INSERT INTO all_volunteering (source, title, duration, cause, age_group, image_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                opportunity['source'],
                opportunity['title'],
                opportunity['duration'],
                opportunity['cause'],
                opportunity['age_group'],
                opportunity['image_url']
            ))
            db.commit()
            print(f"Inserted new opportunity: {opportunity['title']}")
       
    except MySQLdb.Error as e:
        print(f"Error inserting data: {e}")
        db.rollback()
    finally:
        cursor.close()
        db.close()

def load_all_opportunities(page):
    while True:
        try:
            
            load_more_button = page.locator('//button[contains(@class, "btn-info") and text()="LOAD MORE"]')
            if load_more_button.count() > 0 and load_more_button.is_enabled():
                print("Clicking 'LOAD MORE' button to load more opportunities.")
                load_more_button.click()
                page.wait_for_load_state('networkidle')  
                page.wait_for_timeout(2000) 
            else:
                print("All opportunities loaded.")
                break
        except Exception as e:
            print(f"Error during opportunity loading: {e}")
            break

def fetch_and_update_opportunities():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Step 1: Go to the first page where the search button is located
        page.goto('https://kosovovolunteers.org/login', timeout=60000)

        # Step 2: Click the search button to go to the page with opportunities
        try:
            search_button = page.locator('span#basic-addon2')
            search_button.click()
            page.wait_for_load_state('networkidle')  # Wait for the page to fully load
            print("Successfully navigated to the opportunities page.")
        except Exception as e:
            print(f"Error clicking the search button: {e}")
            return

       
        load_all_opportunities(page)

       
        try:
            opportunity_selector = '//div[contains(@class, "OpportunitiesList-single-opportunity")]'
            page.wait_for_selector(opportunity_selector, timeout=20000)

            opportunity_boxes = page.locator(opportunity_selector)
            opportunity_count = opportunity_boxes.count()

            if opportunity_count == 0:
                print("No opportunities found, exiting.")
                return

            print(f"Processing {opportunity_count} opportunities on the page.")

            for index in range(opportunity_count):
                try:
                    opportunity_box = opportunity_boxes.nth(index)

                    title_element = opportunity_box.locator('h4 > a')
                    location_element = opportunity_box.locator('li:has-text("Location :") strong')
                    start_date_element = opportunity_box.locator('li:has-text("Start Date :")')

                    cause_element = opportunity_box.locator('#pTag')
                    image_element = opportunity_box.locator('img.opp-img')

                    title = title_element.inner_text() if title_element.count() > 0 else 'N/A'
                    location = location_element.inner_text() if location_element.count() > 0 else 'N/A'

                    
                    start_date_text = start_date_element.text_content().strip() if start_date_element.count() > 0 else 'N/A'

                    
                    if "Start Date :" in start_date_text:
                        start_date = start_date_text.split("Start Date :")[-1].strip()  
                    else:
                        start_date = 'N/A' 

                    try:
                        
                        if start_date != 'N/A':
                            start_date = datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y-%m-%d")
                    except ValueError:
                        print(f"Date parsing failed for: {start_date_text}")
                        start_date = 'Invalid Date'

                    cause = cause_element.inner_text() if cause_element.count() > 0 else 'N/A'
                    image_url = image_element.get_attribute('src') if image_element.count() > 0 else 'N/A'

                    # Construct opportunity data
                    opportunity_data = {
                        'source': "Kosovo Volunteers",
                        'title': title,
                        'duration': start_date,  
                        'cause': cause,
                        'age_group': 'N/A', 
                        'image_url': image_url
                    }

                    # Save to the database
                    save_volunteering_opportunity_to_db(opportunity_data)

                except Exception as e:
                    print(f"Error handling opportunity box element: {e}")

        except Exception as e:
            print(f"Error during opportunity extraction: {e}")

while True:
    fetch_and_update_opportunities()
    print("Sleeping for 30 minutes...")
    time.sleep(30 * 60)

# CREATE TABLE all_volunteering (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     source VARCHAR(255),
#     title VARCHAR(255),
#     duration VARCHAR(255),
#     cause TEXT, 
#     age_group VARCHAR(255),
#     image_url TEXT,
#     UNIQUE(title, source)
# );