from playwright.sync_api import sync_playwright
import MySQLdb
import time

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',    
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'  # Ensure this database exists
}

def save_to_database(courses_list):
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for course in courses_list:
            try:
                # Check if the course already exists in the database based on title and author
                check_query = "SELECT COUNT(*) FROM courses WHERE title = %s AND trainer = %s"
                cursor.execute(check_query, (course['Title'], course['Trainer']))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert the course into the database
                    insert_query = """
                    INSERT INTO courses (title, trainer, description, price_eur, students, rating, image_url)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """
                    data = (
                        course['Title'],
                        course['Trainer'],
                        course['Description'],
                        course['Price (EUR)'],
                        course['Students'],
                        course['Rating'],
                        course['Image URL']
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
        page_url = 'https://probitacademy.com/courses/'

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)
        
        # Locate the course cards on the page
        courses = page.locator('//div[contains(@class, "course-grid-4")]').all()
        print(f'There are {len(courses)} courses.')

        courses_list = []
        for course in courses:
            try:
                title = course.locator('.course-title a').inner_text(timeout=5000)
                trainer = course.locator('.course-author .value a').first.inner_text(timeout=5000)  # Use .first to select the first matching element
                description = course.locator('.course-description p').inner_text(timeout=5000)
                price = course.locator('.course-price .value').first.inner_text(timeout=5000).strip()
                students = course.locator('.course-students .value').first.inner_text(timeout=5000).strip()
                rating = course.locator('.course-review .value').first.inner_text(timeout=5000).strip()
                image_url = course.locator('.course-thumbnail img').get_attribute('src', timeout=5000)

                courses_list.append({
                    'Title': title,
                    'Trainer': trainer,
                    'Description': description,
                    'Price (EUR)': price,
                    'Students': students,
                    'Rating': rating,
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
