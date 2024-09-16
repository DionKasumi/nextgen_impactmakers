from playwright.sync_api import sync_playwright
import MySQLdb
import time
import re

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'
}

def save_to_database(courses_list):
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for course in courses_list:
            try:
                # Check if the course already exists in the `all_courses` table
                check_query = "SELECT COUNT(*) FROM all_courses WHERE title = %s AND source = %s"
                cursor.execute(check_query, (course['Title'], 'Outkos Academy'))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert new course into `all_courses` table
                    insert_query = """
                    INSERT INTO all_courses (source, title, trainer, description, price, students, rating, image_url, duration)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    data = (
                        'Outkos Academy',
                        course['Title'],
                        course['Trainer'],
                        course['Description'],
                        course.get('Price', None),  # Handle possible None values
                        None,   # No students info provided
                        None,   # No rating info provided
                        course.get('Image_URL', None),  # Get image URL
                        course['Duration']
                    )
                    cursor.execute(insert_query, data)
                    db.commit()

                    # Confirm insertion
                    cursor.execute(check_query, (course['Title'], 'Outkos Academy'))
                    inserted = cursor.fetchone()[0] > 0
                    if inserted:
                        print(f"Course successfully inserted: {course['Title']}")
                    else:
                        print(f"Failed to insert course: {course['Title']}")
                else:
                    print(f"Course already exists: {course['Title']}")

            except MySQLdb.Error as e:
                db.rollback()
                print(f"Error: {e}")

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
        page_url = 'https://outkos.academy/AllCourses/page/1'

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)

        courses = page.locator('.card').all()
        print(f'There are {len(courses)} courses.')

        courses_list = []
        for i, course in enumerate(courses):
            try:
                print(f"Processing course {i + 1}...")

                title = course.locator('.inline').inner_text(timeout=5000)
                trainer = course.locator('.inline2.inline3 span').inner_text(timeout=5000)
                description = course.locator('.p').inner_text(timeout=5000)
                price = course.locator('.span2').inner_text(timeout=5000).strip()
                duration_elements = course.locator('.small-item.small-item1').all()
                duration = duration_elements[0].inner_text(timeout=5000).strip() if duration_elements else "Not Available"
                
                # Extract image URL from the style attribute
                img_style = course.locator('a.img').get_attribute('style')
                image_url = re.search(r'url\(["\'](.*?)["\']\)', img_style)
                image_url = image_url.group(1) if image_url else None

                courses_list.append({
                    'Title': title,
                    'Trainer': trainer,
                    'Description': description,
                    'Price': price,
                    'Duration': duration,
                    'Image_URL': image_url  # Add image URL to the dictionary
                })

                print(f"Course details: Title - {title}, Trainer - {trainer}, Description - {description}, Price - {price}, Duration - {duration}, Image URL - {image_url}")

            except Exception as e:
                print(f"An error occurred while processing course {i + 1}: {e}")

        browser.close()

        return courses_list

def main():
    while True:
        try:
            courses_list = scrape_courses()
            if courses_list:
                save_to_database(courses_list)
            print("Sleeping for 30 minutes...")
            time.sleep(30 * 60)
        except Exception as e:
            print(f"An error occurred in the main loop: {e}")
            print("Retrying after 30 minutes...")
            time.sleep(30 * 60)

if __name__ == '__main__':
    main()
