from playwright.sync_api import sync_playwright
import MySQLdb
import time

db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'  # Ensure this database exists
}

def save_to_database(courses_list):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for course in courses_list:
            try:
                # Check if the course already exists
                check_query = "SELECT COUNT(*) FROM ick_courses WHERE title = %s AND source = %s"
                cursor.execute(check_query, (course['Title'], 'ICK'))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert new course with the trainer information
                    insert_query = """
                    INSERT INTO ick_courses (source, title, description, image_url, duration)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    data = (
                        'ICK',
                        course['Title'],
                        course['Description'],
                        course['Image URL'],
                        course['Duration']
                    )
                    cursor.execute(insert_query, data)
                    db.commit()
                    print(f"Inserted new course: {course['Title']}")
                else:
                    print(f"Course already exists: {course['Title']}")

            except MySQLdb.Error as e:
                db.rollback()
                print(f"Error inserting data: {e}")

    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")

def scrape_courses():
    with sync_playwright() as p:
        page_url = 'https://ickosovo.com/training'

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)
        
        courses = page.locator('//div[@data-elementor-type="loop-item"]').all()
        print(f'There are {len(courses)} courses.')

        courses_list = []
        for course in courses:
            try:
                title = course.locator('.elementor-heading-title .elementor-size-defaul h2 a').inner_text(timeout=5000)
                description = course.locator('.elementor-widget-container p').inner_text(timeout=5000)
                image_url = course.locator('.attachment-full .size-full .wp-image-9377').get_attribute('src', timeout=5000)
                duration = course.locator('.elementor-button next .elementor-button-text').inner_text(timeout=5000)

                courses_list.append({
                    'Title': title,
                    'Description': description,
                    'Duration': duration,
                    'Image URL': image_url
                })
            except Exception as e:
                print(f"An error occurred while processing a course: {e}")

        browser.close()

        return courses_list

def main():
    while True:
        courses_list = scrape_courses()
        save_to_database(courses_list)
        print("Sleeping for 2 minutes...")
        time.sleep(30 * 60)  # Sleep for 30 minutes to retrieve recently added trainings 

if __name__ == '__main__':
    main()
