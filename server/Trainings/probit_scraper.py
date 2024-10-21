from playwright.sync_api import sync_playwright
import MySQLdb
import time

db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'pye_data'  
}

def save_to_database(courses_list):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for course in courses_list:
            try:
                # Check if the course already exists
                check_query = "SELECT COUNT(*) FROM all_courses WHERE title = %s AND source = %s"
                cursor.execute(check_query, (course['Title'], 'Probit Academy Kosova'))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert new course with the trainer information
                    insert_query = """
                    INSERT INTO all_courses (source, title, trainer, description, price, students, rating, image_url, duration)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    data = (
                        'Probit Academy Kosova',
                        course['Title'],
                        course['Trainer'],  # Add trainer to the database
                        course['Description'],
                        course['Price (EUR)'],
                        course['Students'],
                        course['Rating'],
                        course['Image URL'],
                        None   # No duration provided
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
        
        courses = page.locator('//div[contains(@class, "course-grid-4")]').all()
        print(f'There are {len(courses)} courses.')

        courses_list = []
        for course in courses:
            try:
                title = course.locator('.course-title a').inner_text(timeout=5000)
                trainer = course.locator('.course-author .value a').first.inner_text(timeout=5000)
                description = course.locator('.course-description p').inner_text(timeout=5000)
                price = course.locator('.course-price .value').first.inner_text(timeout=5000).strip()
                students = course.locator('.course-students .value').first.inner_text(timeout=5000).strip()
                rating = course.locator('.course-review .value').first.inner_text(timeout=5000).strip()
                image_url = course.locator('.course-thumbnail img').get_attribute('src', timeout=5000)

                courses_list.append({
                    'Title': title,
                    'Trainer': trainer,  # Add trainer to the course dictionary
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
        print("Sleeping for 30 minutes...")
        time.sleep(30 * 60)  # Sleep for 30 minutes to retrieve recently added trainings 

if __name__ == '__main__':
    main()
