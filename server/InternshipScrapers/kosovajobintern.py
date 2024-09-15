from playwright.sync_api import sync_playwright
import MySQLdb
import os
import time

# Database connection parameters loaded from environment variables for security
db_params = {
    'user': os.getenv('DB_USER', 'root'),
    'passwd': os.getenv('DB_PASSWORD', '1234'),
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'db': os.getenv('DB_NAME', 'course_data')
}

def save_to_database(courses_list):
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for course in courses_list:
            try:
                # Check if the course already exists in the database
                check_query = "SELECT COUNT(*) FROM all_internships WHERE title = %s AND duration = %s"
                cursor.execute(check_query, (course['Title'], course['Duration']))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert new course data into the database
                    insert_query = """
                    INSERT INTO all_internships (title, duration, location, image_url)
                    VALUES (%s, %s, %s, %s)
                    """
                    data = (
                        course['Title'],
                        course['Duration'],
                        course['Location'],
                        course['Image']
                    )
                    cursor.execute(insert_query, data)
                    db.commit()

                    # Confirm insertion
                    cursor.execute(check_query, (course['Title'], course['Duration']))
                    inserted = cursor.fetchone()[0] > 0
                    if inserted:
                        print(f"Internship added successfully: {course['Title']}")
                    else:
                        print(f"Failed to insert internship: {course['Title']}")
                else:
                    print(f"Internship already exists: {course['Title']}")

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
        page_url = 'https://kosovajob.com/?q=praktike&jobTitle=internship'

        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)

        # Locate all internship cards with both classes
        courses = page.locator('.jobListCnts.jobListPrm, .jobListCnts.jobListStd').all()
        print(f'There are {len(courses)} internships.')

        courses_list = []
        for i, course in enumerate(courses):
            try:
                print(f"Processing internship {i + 1}...")

                # Extract the internship details
                title = course.locator('.jobListTitle').inner_text(timeout=5000)
                location = course.locator('.jobListCity').inner_text(timeout=5000)
                duration = course.locator('.jobListExpires').inner_text(timeout=5000)

                # Extract the image URL from `data-background-image` attribute
                img_url = course.locator('.jobListImage.lozad').get_attribute('data-background-image', timeout=5000)

                if not img_url:
                    img_url = "No image available"  # Handle missing images

                # Append the course details to the list
                courses_list.append({
                    'Title': title,
                    'Location': location,
                    'Duration': duration,
                    'Image': img_url
                })

                # Print extracted details
                print(f"Internship details: Title - {title}, Location - {location}, Image - {img_url}")

            except Exception as e:
                print(f"An error occurred while processing internship {i + 1}: {e}")

        browser.close()

        return courses_list

def main():
    while True:
        try:
            # Scrape courses and save to database
            courses_list = scrape_courses()
            if courses_list:
                save_to_database(courses_list)
            print("Sleeping for 10 minutes...")
            time.sleep(10 * 60)  # Sleep for 10 minutes before the next scrape cycle
        except Exception as e:
            print(f"An error occurred in the main loop: {e}")
            print("Retrying after 10 minutes...")
            time.sleep(10 * 60)  # Retry after 10 minutes in case of an error

if __name__ == '__main__':
    main()
