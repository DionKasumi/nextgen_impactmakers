from playwright.sync_api import sync_playwright
import MySQLdb
import time

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'
}

def save_course_to_db(course):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        # Check if the course already exists based on title and source
        check_query = "SELECT COUNT(*) FROM all_courses WHERE title = %s AND source = %s"
        cursor.execute(check_query, (course['Title'], course['Source']))
        exists = cursor.fetchone()[0] > 0

        if not exists:
            insert_query = """
            INSERT INTO all_courses (source, title, trainer, description, price, students, rating, image_url, duration)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            cursor.execute(insert_query, (
                course['Source'],
                course['Title'],
                course['Trainer'],
                course['Description'],
                course['Price'],
                course['Students'],
                course['Rating'],
                course['Image URL'],
                course['Duration']
            ))
            db.commit()
            print(f"Inserted new course: {course['Title']}")
        else:
            print(f"Course already exists: {course['Title']}")

    except MySQLdb.Error as e:
        print(f"Error inserting data: {e}")
        db.rollback()
    finally:
        cursor.close()
        db.close()

def fetch_and_update_courses():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://trajnimet.info/', timeout=60000)

        loaded_courses = set()
        all_courses_loaded = False

        while not all_courses_loaded:
            page.evaluate('window.scrollBy(0, document.body.scrollHeight)')
            page.wait_for_timeout(2000)  # Wait for the page to load new content

            courses = page.locator('//div[contains(@class, "item")]')
            current_courses = [course.locator('a.training-post').get_attribute('href') for course in courses.all()]
            
            new_courses = set(current_courses) - loaded_courses
            loaded_courses.update(new_courses)
            
            if not new_courses:
                all_courses_loaded = True

            print(f'Current loaded courses count: {len(loaded_courses)}')
            if len(loaded_courses) >= 437:
                all_courses_loaded = True

        print(f'Total courses found: {len(loaded_courses)}')

        for course_href in loaded_courses:
            try:
                page.goto(course_href, timeout=60000)
                page.wait_for_load_state('networkidle')  # Ensure the page has fully loaded
                page.wait_for_timeout(2000)  # Give extra time for dynamic content to load

                # Extracting data
                title = page.locator('.course-content-box h2').inner_text(timeout=10000) if page.locator('.course-content-box h2').count() > 0 else 'N/A'
                trainer = page.locator('p:has-text("Trajner:")').inner_text(timeout=10000).replace('Trajner:', '').strip() if page.locator('p:has-text("Trajner:")').count() > 0 else 'N/A'
                description = page.locator('.course-content-box .description').inner_text(timeout=10000) if page.locator('.course-content-box .description').count() > 0 else 'N/A'
                price = page.locator('p:has-text("Çmimi:")').inner_text(timeout=10000).replace('Çmimi:', '').strip() if page.locator('p:has-text("Çmimi:")').count() > 0 else 'N/A'
                students = int(page.locator('p:has-text("Numri i studentëve:")').inner_text(timeout=10000).replace('Numri i studentëve:', '').strip()) if page.locator('p:has-text("Numri i studentëve:")').count() > 0 else 0
                rating = page.locator('p:has-text("Vlerësimi:")').inner_text(timeout=10000).replace('Vlerësimi:', '').strip() if page.locator('p:has-text("Vlerësimi:")').count() > 0 else 'N/A'
                
                # Scraping the first image found
                image_url = page.locator('.featured-image img').first.get_attribute('src') if page.locator('.featured-image img').count() > 0 else 'N/A'

                duration = page.locator('p:has-text("Kohëzgjatja:")').inner_text(timeout=10000).replace('Kohëzgjatja:', '').strip() if page.locator('p:has-text("Kohëzgjatja:")').count() > 0 else 'N/A'

                # Prepare course data
                course_data = {
                    'Source': course_href,
                    'Title': title,
                    'Trainer': trainer,
                    'Description': description,
                    'Price': price,
                    'Students': students,
                    'Rating': rating,
                    'Image URL': image_url,
                    'Duration': duration
                }

                # Save to database
                save_course_to_db(course_data)

            except Exception as e:
                print(f"An error occurred while processing a course: {str(e).encode('utf-8', 'ignore').decode('utf-8')}")

        browser.close()

# Main loop to refresh courses every 30 minutes
while True:
    fetch_and_update_courses()
    print("Sleeping for 30 minutes...")
    time.sleep(30 * 60)  # Sleep for 30 minutes (30 * 60 seconds)
