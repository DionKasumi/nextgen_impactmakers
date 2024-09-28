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

def save_to_database(courses_list):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for course in courses_list:
            try:
                # Check if the course already exists
                check_query = "SELECT COUNT(*) FROM all_courses WHERE title = %s AND source = %s"
                cursor.execute(check_query, (course['Title'], 'ICK'))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert new course with all relevant fields
                    insert_query = """
                    INSERT INTO all_courses (source, title, trainer, description, price, students, rating, image_url, duration)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    data = (
                        'ICK',  # Source
                        course['Title'],
                        course.get('Trainer', 'Unknown'),  
                        course['Description'],
                        course.get('Price', 'N/A'),  
                        course.get('Students', 0),
                        course.get('Rating', 'N/A'),
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
        page_url = 'https://ickosovo.com/training/courses'

        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)
        
     
        page.wait_for_load_state('networkidle')

       
        page.locator('//div[@data-elementor-type="loop-item"]').first.wait_for(timeout=10000)

        courses = page.locator('//div[@data-elementor-type="loop-item"]').all()
        print(f'There are {len(courses)} courses.')

        courses_list = []
        for course in courses:
            try:
              
                course.locator('.elementor-heading-title a').wait_for(timeout=10000)

                # Fetch the data
                title = course.locator('.elementor-heading-title a').text_content(timeout=10000)
                description = course.locator('.elementor-widget-container p').text_content(timeout=10000)
                image_url = course.locator('img.attachment-full').get_attribute('src', timeout=10000)
                duration = course.locator('.meta-timeframe .elementor-button-text').text_content(timeout=10000)

             
                trainer = 'Unknown'  
                price = 'N/A'  
                students = 0 
                rating = 'N/A'  

                courses_list.append({
                    'Title': title.strip() if title else 'N/A',
                    'Description': description.strip() if description else 'N/A',
                    'Image URL': image_url.strip() if image_url else 'N/A',
                    'Duration': duration.strip() if duration else 'N/A',
                    'Trainer': trainer,
                    'Price': price,
                    'Students': students,
                    'Rating': rating
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
        time.sleep(30 * 60)  # Sleep for 30 minutes

if __name__ == '__main__':
    main()