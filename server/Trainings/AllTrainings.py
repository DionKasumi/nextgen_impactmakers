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
    'db': 'pye_data'
}

# Function to assign label based on title
def assign_label(title):
    title_lower = title.lower()
    
    # Data & Analytics
    if any(keyword in title_lower for keyword in ['data', 'analitikë', 'analizë', 'analytics', 'statistics', 'big data', 'data science', 'machine learning', 'ai']):
        return 'Data & Analytics'
    
    # Development (Including Programming Languages and Frameworks)
    elif any(keyword in title_lower for keyword in [
        'development', 'zhvillim', 'programim', 'coding', 'kodim', 'applications', 'software', 'programming', 'app',
        'javascript', 'python', 'node', 'html', 'css', 'angular', 'react', 'php', 'sql', 'mysql', 'c++', 'java', 'nosql', 'laravel', 'typescript', 'ruby', 'bash', 'powershell', 'swift','wordpress','kotlin','qa','front','back',
        'seo', '.net'
    ]):
        return 'Development'
    
    # Design
    elif any(keyword in title_lower for keyword in ['design', 'dizajn', 'ux', 'ui', 'graphic', 'graphics', 'vizual', 'multimedia', 'illustrator', 'photoshop', 'adobe']):
        return 'Design'
    
    # Business & Marketing
    elif any(keyword in title_lower for keyword in ['business', 'biznes', 'marketing', 'shitje', 'sales', 'ekonomi', 'economy', 'management', 'menaxhim', 'sociale']):
        return 'Business & Marketing'
    
    # Management
    elif any(keyword in title_lower for keyword in ['management', 'menaxhim', 'leadership', 'udhëheqje', 'administration', 'administratë', 'planning', 'planifikim']):
        return 'Management'
    
    # IT & Networking
    elif any(keyword in title_lower for keyword in ['networking', 'rrjeta', 'it', 'security', 'siguri', 'technology', 'teknologji', 'server', 'cisco']):
        return 'IT & Networking'
    
    # Education & Training
    elif any(keyword in title_lower for keyword in ['education', 'arsim', 'teaching', 'mësim', 'training', 'trajnimi', 'school', 'shkollë', 'qualification', 'kualifikim']):
        return 'Education & Training'
    
    # Other (set to title for easy review)
    else:
        return 'Other'

# Function to save course data to the database
def save_to_database(courses_list, source, email, phone_number, office_address, company_logo):
    db = None
    cursor = None
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for course in courses_list:
            try:
                # Determine the label for the course
                label = assign_label(course['Title'])

                # Check if the course already exists
                check_query = "SELECT COUNT(*) FROM all_courses WHERE title = %s AND source = %s"
                cursor.execute(check_query, (course['Title'], source))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert new course data with additional fields
                    insert_query = """
                    INSERT INTO all_courses (source, title, trainer, description, price, students, rating, image_url, duration, email, phone_number, office_address, company_logo, apply_link,label)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s)
                    """
                    data = (
                        source,
                        course['Title'],
                        course.get('Trainer', 'N/A'),
                        course.get('Description', 'N/A'),
                        course.get('Price', 'N/A'),
                        course.get('Students', 'N/A'),
                        course.get('Rating', 'N/A'),
                        course.get('Image_URL', 'N/A'),
                        course.get('Duration', 'N/A'),
                        email,            
                        phone_number,     
                        office_address,   
                        company_logo,     
                        course.get('apply_link'),
                        label
                    )
                    cursor.execute(insert_query, data)
                    db.commit()
                    print(f"Inserted new course from {source}: {course['Title']} with label {label}")
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


# Scraper function for ICK Kosovo
def scrape_ick_kosovo(page):
    page.goto('https://ickosovo.com/training/courses', timeout=60000)
    
    courses = page.locator('//div[@data-elementor-type="loop-item"]').all()
    print(f'There are {len(courses)} courses from ICK Kosovo.')

    courses_list = []
    for course in courses:
        try:
            title_element = course.locator('.elementor-heading-title a')
            title = title_element.text_content(timeout=10000)
            apply_link = title_element.get_attribute('href', timeout=10000)  
            
            description = course.locator('.elementor-widget-container p').text_content(timeout=10000)
            image_url = course.locator('img.attachment-full').get_attribute('src', timeout=10000)
            duration = course.locator('.meta-timeframe .elementor-button-text').text_content(timeout=10000)
            trainer = 'Unknown'  
            price = 'N/A'  
            students = 0 
            rating = 'N/A'

            courses_list.append({
                'Title': title.strip(),
                'Description': description.strip(),
                'Image_URL': image_url.strip(),
                'Duration': duration.strip(),
                'Trainer': trainer,
                'Price': price,
                'Students': students,
                'Rating': rating,
                'apply_link': apply_link  # Added the apply_link 
            })
        except Exception as e:
            print(f"Error processing a course from ICK Kosovo: {e}")
    
    return courses_list


# Scraper function for BEETROOT ACADEMY
def scrape_beetroot_academy(page):
    page.goto('https://xk.beetroot.academy/courses/online', timeout=60000)
    
    trainings = page.locator('//div[@class="col-lg-4 col-md-6 col-sm-6 intro_boxWrap"]').all()
    print(f'There are {len(trainings)} courses from Beetroot Academy.')

    courses_list = []
    for training in trainings:
        try:
            title = training.locator('.blueTextWeight').inner_text(timeout=10000)
            rating = training.locator('.design_skill').inner_text(timeout=10000)
            description = training.locator('.blackTextSmall').inner_text(timeout=10000)
            duration = training.locator('.intro_monthIcon').inner_text(timeout=10000)
            image_url = 'https://xk.beetroot.academy/static/logo-c96c7c4d19444146e8b100d14e93d1ac.svg'

            # Extract the apply link
            apply_link = training.locator('a.intro_box').get_attribute('href', timeout=10000)
            apply_link = f"https://xk.beetroot.academy{apply_link}"  # Prepend the base URL

            courses_list.append({
                'Title': title,
                'Rating': rating,
                'Description': description,
                'Duration': duration,
                'Trainer': None,
                'Image_URL': image_url,
                'apply_link': apply_link  # Added the apply_link 
            })
        except Exception as e:
            print(f"Error processing a course from Beetroot Academy: {e}")
    
    return courses_list

# Scraper function for PROBIT ACADEMY
def scrape_probit_academy(page):
    page.goto('https://probitacademy.com/courses/', timeout=60000)
    
    courses = page.locator('//div[contains(@class, "course-grid-4")]').all()
    print(f'There are {len(courses)} courses from Probit Academy.')

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

            # Extract the apply link
            apply_link = course.locator('.course-title a').get_attribute('href', timeout=5000)

            courses_list.append({
                'Title': title,
                'Trainer': trainer,
                'Description': description,
                'Price': price,
                'Students': students,
                'Rating': rating,
                'Image_URL': image_url,
                'apply_link': apply_link  # Added the apply_link 
            })
        except Exception as e:
            print(f"Error processing a course from Probit Academy: {e}")
    
    return courses_list


# Scraper function for CREATIVE HUB KOSOVO
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

    trainings = page.locator('//div[contains(@class, "col-md-3")]').all()
    print(f'There are {len(trainings)} trainings from Creative Hub Kosovo.')

    trainings_list = []
    for training in trainings:
        try:
            title = training.locator('h3.aos-init.aos-animate').inner_text(timeout=10000)
            description = training.locator('p').inner_text(timeout=10000)
            price = training.locator('.price').first.inner_text(timeout=10000).strip()

            # Extract the apply link
            apply_link = training.locator('a[href*="creativehubkos.com"]').get_attribute('href', timeout=10000)

            trainings_list.append({
                'Title': title,
                'Description': description,
                'Price': price,
                'Trainer': None,
                'Students': None,
                'Rating': None,
                'apply_link': apply_link  # Add the apply_link 
            })
        except Exception as e:
            print(f"Error processing training from Creative Hub Kosovo: {e}")
    
    return trainings_list

# Scraper function for OUTKOS ACADEMY
def scrape_outkos_academy(page):
    page.goto('https://outkos.academy/AllCourses/page/1', timeout=120000)
    
    courses = page.locator('.card').all()
    print(f'There are {len(courses)} courses from Outkos Academy.')

    courses_list = []
    for course in courses:
        try:
            title = course.locator('.inline').inner_text(timeout=5000)
            trainer = course.locator('.inline2.inline3 span').inner_text(timeout=5000)
            description = course.locator('.p').inner_text(timeout=5000)
            price = course.locator('.span2').inner_text(timeout=5000).strip()
            duration_elements = course.locator('.small-item.small-item1').all()
            duration = duration_elements[0].inner_text(timeout=5000).strip() if duration_elements else "Not Available"
            
            # Extract the image URL from the style attribute
            img_style = course.locator('a.img').get_attribute('style')
            image_url = re.search(r'url\(["\'](.*?)["\']\)', img_style)
            image_url = image_url.group(1) if image_url else None
            
            # Extract the apply link
            apply_link = course.locator('a.info').get_attribute('href', timeout=5000)
            # Prepend the base URL to the relative path
            apply_link = f'https://outkos.academy{apply_link}' if apply_link else 'N/A'

            courses_list.append({
                'Title': title,
                'Trainer': trainer,
                'Description': description,
                'Price': price,
                'Duration': duration,
                'Image_URL': image_url,
                'apply_link': apply_link  # Add the apply_link 
            })
        except Exception as e:
            print(f"Error processing course from Outkos Academy: {e}")

    return courses_list


# Scraper function for SHPIK TRAININGS
def scrape_shpik_trainings(page):
    page.goto('https://trajnimet.info/', timeout=60000)
    
    loaded_courses = set()
    all_courses_loaded = False

    while not all_courses_loaded:
        page.evaluate('window.scrollBy(0, document.body.scrollHeight)')
        page.wait_for_timeout(2000)

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

    courses_list = []
    for course_href in loaded_courses:
        # Check if the course_href is a valid URL
        if not course_href.startswith("http"):
            print(f"Invalid URL found: {course_href}, skipping...")
            continue  # Skip invalid URLs
        
        try:
            page.goto(course_href, timeout=60000)
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(2000)

            title = page.locator('.course-content-box h2').inner_text(timeout=10000) if page.locator('.course-content-box h2').count() > 0 else 'N/A'
            trainer = page.locator('p:has-text("Trajner:")').inner_text(timeout=10000).replace('Trajner:', '').strip() if page.locator('p:has-text("Trajner:")').count() > 0 else 'N/A'
            description = page.locator('.course-content-box .description').inner_text(timeout=10000) if page.locator('.course-content-box .description').count() > 0 else 'N/A'
            price = page.locator('p:has-text("Çmimi:")').inner_text(timeout=10000).replace('Çmimi:', '').strip() if page.locator('p:has-text("Çmimi:")').count() > 0 else 'N/A'
            students = int(page.locator('p:has-text("Numri i studentëve:")').inner_text(timeout=10000).replace('Numri i studentëve:', '').strip()) if page.locator('p:has-text("Numri i studentëve:")').count() > 0 else 0
            rating = page.locator('p:has-text("Vlerësimi:")').inner_text(timeout=10000).replace('Vlerësimi:', '').strip() if page.locator('p:has-text("Vlerësimi:")').count() > 0 else 'N/A'
            
            image_url = page.locator('.featured-image img').first.get_attribute('src') if page.locator('.featured-image img').count() > 0 else 'N/A'
            duration = page.locator('p:has-text("Kohëzgjatja:")').inner_text(timeout=10000).replace('Kohëzgjatja:', '').strip() if page.locator('p:has-text("Kohëzgjatja:")').count() > 0 else 'N/A'

            courses_list.append({
                'Title': title,
                'Trainer': trainer,
                'Description': description,
                'Price': price,
                'Students': students,
                'Rating': rating,
                'Image_URL': image_url,
                'Duration': duration,
                'apply_link': course_href  # Add the apply_link as course_href
            })

        except Exception as e:
            print(f"Error processing a course from ShpikTrainings: {e}")

    return courses_list

# Main scraping logic that loops through the websites
def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        sources = [
            {
                'scrape_func': scrape_ick_kosovo,
                'source_name': 'Innovation Centre Kosovo',
                'email': 'info@ickosovo.com',
                'phone_number': '+383 (0)38 77 11 80',
                'office_address': 'Rexhep Mala 28A, 10000 \n Prishtinë, Kosovë',
                'company_logo': 'https://ickosovo.com/wp-content/uploads/2023/10/ick-white-mainlogo.svg'
            },
            {
                'scrape_func': scrape_beetroot_academy,
                'source_name': 'Beetroot Academy Kosovo',
                'email': 'xk@beetroot.academy',
                'phone_number': '+383 48 248 788',
                'office_address': 'Anton Çetta, nr.29 \n Prishtinë, Kosovë',
                'company_logo': 'https://xk.beetroot.academy/static/logo-c96c7c4d19444146e8b100d14e93d1ac.svg'
            },
            {
                'scrape_func': scrape_probit_academy,
                'source_name': 'Probit Academy',
                'email': 'info@probitacademy.com',
                'phone_number': '+383 45 899 099',
                'office_address': 'Sejdi Kryeziu \n Prishtinë, Kosovë',
                'company_logo': 'https://cdn.shortpixel.ai/spai/w_181+q_lossy+ret_img+to_webp/https://probitacademy.com/wp-content/uploads/2019/12/probit_academy-logo-e1576602302615.png'
            },
            {
                'scrape_func': scrape_creative_hub_kosovo,
                'source_name': 'Creative Hub Kosovo',
                'email': 'contact@creativehubkos.com',
                'phone_number': '+383 49 334 437',
                'office_address': 'Behar Begolli, Building of F&A Engineering \n Prishtinë, Kosovë',
                'company_logo': 'https://creativehubkos.com/images/logo.svg'
            },
            {
                'scrape_func': scrape_outkos_academy,
                'source_name': 'Outkos Academy',
                'email': 'info@outkos.academy',
                'phone_number': '+383 43 560 863',
                'office_address': 'Garcia Lorka, Nr.24 Dragodan 10000 \n Prishtinë, Kosovë',
                'company_logo': 'https://media.licdn.com/dms/image/v2/D4D0BAQGfucha2lH2wg/company-logo_200_200/company-logo_200_200/0/1684841614082?e=1737590400&v=beta&t=1zMA33yRZtolI-p0engjcXSC4NUa3D92cCFUhxYDt5Y'
            },
            {
                'scrape_func': scrape_shpik_trainings,
                'source_name': 'SHPIK Kosovo Informatics Society',
                'email': 'info@shpik.org',
                'phone_number': '+383 44 507 575',
                'office_address': 'Xheladin Hana p.n. F.P. 315. 10000 \n Prishtinë, Kosovë',
                'company_logo': 'https://trajnimet.info/wp-content/uploads/2022/12/shpik-logo.png'
            }
        ]

        for source in sources:
            try:
                print(f"Scraping courses from {source['source_name']}...")
                courses_list = source['scrape_func'](page)
                if courses_list:
                    save_to_database(
                        courses_list,
                        source['source_name'],
                        source['email'],
                        source['phone_number'],
                        source['office_address'],
                        source['company_logo']
                    )
            except Exception as e:
                print(f"Error scraping {source['source_name']}: {e}")

        browser.close()

if __name__ == '__main__':
    while True:
        main()
        print("Sleeping for 30 minutes...")
        time.sleep(30 * 60)
