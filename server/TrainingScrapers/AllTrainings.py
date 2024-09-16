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

# Function to save course data to the database
def save_to_database(courses_list, source):
    db = None
    cursor = None
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for course in courses_list:
            try:
                # Check if the course already exists
                check_query = "SELECT COUNT(*) FROM all_courses WHERE title = %s AND source = %s"
                cursor.execute(check_query, (course['Title'], source))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert new course data
                    insert_query = """
                    INSERT INTO all_courses (source, title, trainer, description, price, students, rating, image_url, duration)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    data = (
                        source,
                        course['Title'],
                        course.get('Trainer', None),
                        course.get('Description', None),
                        course.get('Price', None),
                        course.get('Students', None),
                        course.get('Rating', None),
                        course.get('Image_URL', None),
                        course.get('Duration', None)
                    )
                    cursor.execute(insert_query, data)
                    db.commit()
                    print(f"Inserted new course from {source}: {course['Title']}")
                else:
                    print(f"Course already exists in {source}: {course['Title']}")

            except MySQLdb.Error as e:
                db.rollback()
                print(f"Error inserting data from {source}: {e}")

    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

# Scraper functions
def scrape_beetroot_academy(page):
    page.goto('https://xk.beetroot.academy/courses/online', timeout=60000)
    
    trainings = page.locator('//div[@class="col-lg-4 col-md-6 col-sm-6 intro_boxWrap"]')
    print(f'There are {trainings.count()} courses from Beetroot Academy.')

    courses_list = []
    for i in range(trainings.count()):
        try:
            training = trainings.nth(i)
            title = training.locator('.blueTextWeight').inner_text(timeout=10000)
            rating = training.locator('.design_skill').inner_text(timeout=10000)
            description = training.locator('.blackTextSmall').inner_text(timeout=10000)
            duration = training.locator('.intro_monthIcon').inner_text(timeout=10000)
            image_url = 'https://xk.beetroot.academy/static/logo-c96c7c4d19444146e8b100d14e93d1ac.svg'

            courses_list.append({
                'Title': title,
                'Rating': rating,
                'Description': description,
                'Duration': duration,
                'Trainer': None,
                'Image_URL': image_url
            })
        except Exception as e:
            print(f"Error processing a course from Beetroot Academy: {e}")
    
    return courses_list

def scrape_probit_academy(page):
    page.goto('https://probitacademy.com/courses/', timeout=60000)
    
    courses = page.locator('//div[contains(@class, "course-grid-4")]')
    print(f'There are {courses.count()} courses from Probit Academy.')

    courses_list = []
    for i in range(courses.count()):
        try:
            course = courses.nth(i)
            title = course.locator('.course-title a').inner_text(timeout=5000)
            trainer = course.locator('.course-author .value a').first.inner_text(timeout=5000)
            description = course.locator('.course-description p').inner_text(timeout=5000)
            price = course.locator('.course-price .value').first.inner_text(timeout=5000).strip()
            students = course.locator('.course-students .value').first.inner_text(timeout=5000).strip()
            rating = course.locator('.course-review .value').first.inner_text(timeout=5000).strip()
            image_url = course.locator('.course-thumbnail img').get_attribute('src', timeout=5000)

            courses_list.append({
                'Title': title,
                'Trainer': trainer,
                'Description': description,
                'Price': price,
                'Students': students,
                'Rating': rating,
                'Image_URL': image_url
            })
        except Exception as e:
            print(f"Error processing a course from Probit Academy: {e}")
    
    return courses_list

def scrape_creative_hub_kosovo(page):
    page.goto('https://creativehubkos.com/', timeout=60000)
    
    page.wait_for_load_state('networkidle', timeout=10000)

    def auto_scroll(page):
        last_height = page.evaluate("document.body.scrollHeight")
        while True:
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(2)
            new_height = page.evaluate("document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

    auto_scroll(page)

    page.wait_for_selector('//div[contains(@class, "col-md-3")]', timeout=10000)

    trainings = page.locator('//div[contains(@class, "col-md-3")]').all()
    print(f'There are {len(trainings)} trainings.')

    trainings_list = []
    for i, training in enumerate(trainings):
        try:
            print(f"Processing training {i+1}...")

            title = training.locator('h3.aos-init.aos-animate').inner_text(timeout=10000)
            description = training.locator('p').inner_text(timeout=10000)
            price = training.locator('.price').first.inner_text(timeout=10000).strip()

            trainings_list.append({
                'Source': 'Creative Hub Kosovo',
                'Title': title,
                'Trainer': None,
                'Description': description,
                'Price': price,
                'Students': None,
                'Rating': None
            })
        except Exception as e:
            print(f"An error occurred while processing training {i+1}: {e}")

    return trainings_list

def scrape_outkos_academy(page):
    page.goto('https://outkos.academy/AllCourses/page/1', timeout=60000)
    
    courses = page.locator('.card').all()
    print(f'There are {len(courses)} courses from Outkos Academy.')

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
                'Image_URL': image_url
            })

            print(f"Course details: Title - {title}, Trainer - {trainer}, Description - {description}, Price - {price}, Duration - {duration}, Image URL - {image_url}")

        except Exception as e:
            print(f"An error occurred while processing course {i + 1}: {e}")

    return courses_list

# Main scraping logic that loops through the websites
def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        sources = [
            {'scrape_func': scrape_beetroot_academy, 'source_name': 'Beetroot Academy'},
            {'scrape_func': scrape_probit_academy, 'source_name': 'Probit Academy'},
            {'scrape_func': scrape_creative_hub_kosovo, 'source_name': 'Creative Hub Kosovo'},
            {'scrape_func': scrape_outkos_academy, 'source_name': 'Outkos Academy'}
        ]

        for source in sources:
            try:
                print(f"Scraping courses from {source['source_name']}...")
                courses_list = source['scrape_func'](page)
                if courses_list:
                    save_to_database(courses_list, source['source_name'])
            except Exception as e:
                print(f"Error scraping {source['source_name']}: {e}")

        browser.close()

if __name__ == '__main__':
    while True:
        main()
        print("Sleeping for 30 minutes...")
        time.sleep(30 * 60)  # Sleep for 30 minutes
