
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

        # Check if the internship already exists based on title and source
        check_query = "SELECT COUNT(*) FROM all_internships WHERE title = %s AND source = %s"
        cursor.execute(check_query, (internship['title'], internship['source']))
        exists = cursor.fetchone()[0] > 0

        if not exists:
            insert_query = """
            INSERT INTO all_internships (source, title, description, duration, location, image_url)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                internship['source'],
                internship['title'],
                internship['description'],
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

                # If no job cards are found, break the loop (end of pagination or loading issue)
                if job_card_count == 0:
                    print("No job cards found, breaking loop.")
                    break

                print(f"Found {job_card_count} job cards on the page.")

                for index in range(job_card_count):
                    try:
                        job_card = job_cards.nth(index)

                        # Extracting data from the card
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

                        # Prepare internship data
                        internship_data = {
                            'source': "Kosovo Generation",
                            'title': title,
                            'description': description,
                            'duration': duration,
                            'location': location,
                            'image_url': image_url
                        }

                        # Save to database
                        save_internship_to_db(internship_data)

                    except Exception as e:
                        print(f"Error handling internship element: {e}")

                # Check for the "Next" button and click it if exists
                next_button = page.locator('//button[@aria-label="Next"]')
                if next_button.count() > 0 and next_button.is_enabled():
                    print("Clicking 'Next' button to load more internships.")
                    next_button.click()
                    page.wait_for_load_state('networkidle')  # Wait for network requests to be idle
                    page.wait_for_timeout(2000)  # Small delay to ensure content loads
                else:
                    print("No more pages to load.")
                    break

            except Exception as e:
                print(f"Error during job card extraction: {e}")
                break  # Exit the loop on error to avoid infinite retries

# Main loop to refresh internships every 30 minutes
while True:
    fetch_and_update_internships()
    print("Sleeping for 30 minutes...")
    time.sleep(30 * 60)  


#  CREATE TABLE all_internships (
#    id INT AUTO_INCREMENT PRIMARY KEY,
#    source VARCHAR(255),
#    title VARCHAR(255),
#    description TEXT,
#    duration VARCHAR(255),
#    location VARCHAR(255),
#    image_url VARCHAR(255),
#    UNIQUE(title, source)
# );