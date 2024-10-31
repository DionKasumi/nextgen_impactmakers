from playwright.sync_api import sync_playwright
import MySQLdb
import time
from datetime import datetime

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': 'Profesionist24!',
    'host': 'localhost',
    'port': 3306,
    'db': 'pye_data'
}

def assign_label(title):
    title_lower = title.lower()

    # Information Technology
    if any(keyword in title_lower for keyword in [
        'teknologji', 'informative', 'it', 'development', 'developer', 'programues', 'software', 'networking', 
        'data', 'analitika', 'informatikë', 'programim', 'programming', 'it support', 'administrator', 
        'qa', 'quality assurance', 'system engineer', 'help desk', 'sistemues', 'it consultant', 
        'card personalization', 'database', 'zhvillues softueri','dizajn','dizajner','grafik','grafikë','web','web developer','web designer','graphic designer','graphic design','ui','ux','ui/ux','ui/ux designer'
    ]):
        return 'Information Technology'
    
    # Human Resources
    elif any(keyword in title_lower for keyword in [
        'burime njerëzore', 'hr', 'recruit', 'rekrutues', 'staff', 'punësimi', 'human resources', 
        'administrator', 'hr specialist', 'training', 'customer excellence specialist', 'customer support', 
        'customer care', 'zyrtar burime njerëzore', 'koordinator', 'asistent administrativ', 
        'specialist i burimeve njerëzore dhe administratës','burimeve','njerëzore'
    ]):
        return 'Human Resources'
    
    # Engineering and Construction
    elif any(keyword in title_lower for keyword in [
        'inxhinier', 'ndërtimtari', 'engineering', 'construction', 'architect', 'civil', 'ndërtim', 
        'mechanical engineer', 'automekanik', 'axhustator', 'ashensor', 'polirues mermeri', 'electrician', 
        'technician', 'elektroinstalues', 'prodhues', 'kuzhinier', 'saldues', 'teknik', 'montues', 'mjeshtër'
    ]):
        return 'Engineering and Construction'
    
    # Healthcare
    elif any(keyword in title_lower for keyword in [
        'shëndetësi', 'mjek', 'doktor', 'nurse', 'vet', 'health', 'veterinar', 'psikolog', 
        'dentist', 'infermiere', 'pharmacy', 'edukat', 'medic', 'kujdes për fëmijë', 'fizioterapeut', 
        'laborant', 'farmaci', 'teknike e farmacisë'
    ]):
        return 'Healthcare'
    
    # Transport
    elif any(keyword in title_lower for keyword in [
        'transport', 'logjistikë', 'logistics', 'shipping', 'delivery', 'driver', 'shofer', 
        'transportues', 'motorist', 'logistics unit', 'fleet'
    ]):
        return 'Transport'
    
    # Logistics
    elif any(keyword in title_lower for keyword in [
        'logjistikë', 'depo', 'magazinë', 'warehouse', 'supply', 'distribution', 'depoist', 
        'picker', 'assembler', 'inventory'
    ]):
        return 'Logistics'
    
    # Craft and Trade
    elif any(keyword in title_lower for keyword in [
        'zeje', 'zanat', 'craft', 'artisan', 'artizan', 'punëtor', 'handyman', 'electrician', 
        'plumber', 'repair', 'shankist', 'patronist', 'kamarier', 'banakier', 'polirues', 
        'montim', 'rrobaqepëse', 'berber', 'hairdresser', 'frizer', 'parukier', 'barber', 
        'stitcher', 'operator', 'sektorist', 'avancues', 'gaferr', 'bariste', 'kuzhinier','mirëmbajtëse','pastruese','pastrues','arkëtare','arkatar/e','monter','skarist'
    ]):
        return 'Craft and Trade'
    
    # Legal
    elif any(keyword in title_lower for keyword in [
        'juridik', 'ligj', 'avokat', 'law', 'legal', 'attorney', 'paralegal', 'notary', 
        'specialist ligjor', 'compliance'
    ]):
        return 'Legal'
    
    # Media
    elif any(keyword in title_lower for keyword in [
        'media', 'gazetar', 'journalism', 'press', 'news', 'broadcast', 'reporter', 'kameraman', 
        'fotograf', 'videographer', 'tik tok', 'content creator'
    ]):
        return 'Media'
    
    # Management
    elif any(keyword in title_lower for keyword in [
        'menaxhment', 'menaxher', 'manager', 'management', 'executive', 'coordinator', 
        'team lead', 'supervisor', 'operational assistant', 'patronist', 'service center lead', 
        'viši menadžer za rizike', 'zyrtar në qendrën e thirrjeve'
    ]):
        return 'Management'
    
    # Hospitality
    elif any(keyword in title_lower for keyword in [
        'hotel', 'hotelieri', 'hospitality', 'recepsionist', 'reception', 'kamarier', 'waiter', 
        'banakier', 'restaurant', 'barista', 'housekeeping', 'nanny', 'cook', 'chef', 
        'pastruese', 'bariste', 'kfc', 'kuzhinier'
    ]):
        return 'Hospitality'
    
    # Research and Development
    elif any(keyword in title_lower for keyword in [
        'hulumtim', 'zhvillim', 'research', 'development', 'analizë', 'analysis', 'researcher', 
        'advisor', 'market insights', 'consultant', 'project development'
    ]):
        return 'Research and Development'
    
    # Maintenance and Security
    elif any(keyword in title_lower for keyword in [
        'mirëmbajtje', 'sigurim', 'maintenance', 'security', 'safety', 'janitor', 'cleaning', 
        'security guard', 'guard', 'mechanic', 'operator', 'technical staff', 'kontrakt', 
        'mjeshtër'
    ]):
        return 'Maintenance and Security'
    
    # Electronics and Energy
    elif any(keyword in title_lower for keyword in [
        'elektronikë', 'energjetikë', 'elektricist', 'electronics', 'energy', 'electric', 
        'technician', 'installer', 'power', 'engineering'
    ]):
        return 'Electronics and Energy'
    
    # Manufacturing and Processing
    elif any(keyword in title_lower for keyword in [
        'prodhimtari', 'përpunim', 'manufacturing', 'production', 'assembly', 'assembler', 
        'fabrication', 'production line', 'processing'
    ]):
        return 'Manufacturing and Processing'
    
    # Education and Training
    elif any(keyword in title_lower for keyword in [
        'edukatore', 'arsimi', 'teacher', 'professor', 'mësues', 'mësimdhënës', 'education', 
        'trainer', 'trajnimi', 'learning', 'coach', 'instructor'
    ]):
        return 'Education and Training'
    
    # Finance and Accounting
    elif any(keyword in title_lower for keyword in [
        'finance', 'accounting', 'kontabilist', 'financier', 'financial', 'accountant', 'auditor', 
        'treasury', 'billing', 'finance officer', 'invoice', 'zyrtar i financave', 
        'asistent administrativ në financa', 'faturist','financa'
    ]):
        return 'Finance and Accounting'
    
    # Marketing and Sales
    elif any(keyword in title_lower for keyword in [
        'marketing', 'shitje', 'sales', 'advertising', 'promoter', 'brand', 'public relations', 
        'pr', 'agent', 'marketing specialist', 'market', 'customer service', 'merchandiser', 
        'agjent doganor', 'agjent'
    ]):
        return 'Marketing and Sales'
    
    # Fallback
    else:
        return 'Other'

# Function to save job data to the database
def save_job_to_db(job):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        label = assign_label(job['title'])

        check_query = "SELECT COUNT(*) FROM all_internships WHERE title = %s AND source = %s"
        cursor.execute(check_query, (job['title'], job['source']))
        exists = cursor.fetchone()[0] > 0

        if not exists:
            insert_query = """
            INSERT INTO all_internships (source, title, description, posted_date, salary, duration, location, image_url, email, phone_number, office_address, company_logo, apply_link, label)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s)
            """
            cursor.execute(insert_query, (
                job['source'],
                job['title'],
                job['description'],
                job['posted_date'],
                job['salary'],
                job['duration'],
                job['location'],
                job['image_url'],
                job.get('email'),
                job.get('phone_number'),
                job.get('office_address'),
                job.get('company_logo'),
                job.get('apply_link'),
                label
            ))
            db.commit()
            print(f"Inserted new job: {job['title']} with label {label}")
        else:
            print(f"Job already exists: {job['title']} at {job['company_name']}")

    except MySQLdb.Error as e:
        print(f"Error inserting data: {e}")
        db.rollback()
    finally:
        cursor.close()
        db.close()

# Function for scraper 1 (Kosova Job)
def scrape_kosova_job():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://kosovajob.com/', timeout=60000)

        max_scrolls = 10
        scroll_count = 0
        previous_job_count = 0

        try:
            while scroll_count < max_scrolls:
                job_boxes_selector = '//div[@class="jobListCnts  jobListPrm  "]'
                page.wait_for_selector(job_boxes_selector, timeout=20000)
                job_boxes = page.locator(job_boxes_selector)
                job_box_count = job_boxes.count()

                if job_box_count == previous_job_count:
                    break

                previous_job_count = job_box_count

                for index in range(job_box_count):
                    try:
                        job_box = job_boxes.nth(index)
                        title_element = job_box.locator('.jobListTitle')
                        apply_link = job_box.locator('a').get_attribute('href')  # Ensure you get the link correctly
                        location_element = job_box.locator('.jobListCity')
                        posted_date_element = title_element.get_attribute('date')
                        image_element = job_box.locator('.jobListImage')

                        title = title_element.inner_text() if title_element.count() > 0 else 'N/A'
                        location = location_element.inner_text() if location_element.count() > 0 else 'N/A'
                        posted_date = posted_date_element if posted_date_element else 'N/A'
                        image_url = image_element.get_attribute('data-background-image') if image_element.count() > 0 else 'N/A'
                        company_name = 'Kosova Job'

                        posted_date_db = datetime.strptime(posted_date, '%Y-%m-%d %H:%M:%S').date() if posted_date != 'N/A' else None

                        job_data = {
                            'source': "Kosova Job",
                            'title': title,
                            'company_name': company_name,
                            'description': 'N/A',
                            'posted_date': posted_date_db,
                            'salary': 'N/A',
                            'duration': 'N/A',
                            'location': location,
                            'image_url': image_url,
                            'apply_link': apply_link,  # Added apply_link here
                            'email': 'info@kosovajob.com',
                            'phone_number': '+383 45 111 414',
                            'office_address': 'Rr. Perandori Justinian Nr. 62 \n Prishtinë, Kosovë 10000',
                            'company_logo': 'https://media.licdn.com/dms/image/v2/C510BAQEag0LO89qZXg/company-logo_200_200/company-logo_200_200/0/1631397947063?e=1737590400&v=beta&t=kgGYn5GtFXkacaKXrJRAmNk-dZFbHd3SSjP8IGi0pvo'
                        }
                        save_job_to_db(job_data)
                    except Exception as e:
                        print(f"Error handling job box element: {e}")

                page.evaluate('window.scrollBy(0, document.body.scrollHeight)')
                page.wait_for_timeout(3000)
                scroll_count += 1

        except Exception as e:
            print(f"Error during job extraction from Kosova Job: {e}")
        finally:
            browser.close()

# Function for scraper 2 (Kosovo Generation)
def scrape_kosovo_generation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://kosovogenu.com/opportunitiesinterships', timeout=60000)

        try:
            while True:
                job_cards_selector = '//div[@class="ant-card ant-card-bordered jobCards null"]'
                page.wait_for_selector(job_cards_selector, timeout=20000)
                job_cards = page.locator(job_cards_selector)
                job_card_count = job_cards.count()

                if job_card_count == 0:
                    break

                for index in range(job_card_count):
                    try:
                        job_card = job_cards.nth(index)
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

                         # Click the job card to open the detail page
                        job_card.click()
                        page.wait_for_load_state('networkidle')

                        # Get the current URL for the job details
                        apply_link = page.url
                        print(f"Found apply link: {apply_link}")

                       
                        job_data = {
                            'source': "Kosovo Generation Unlimited",
                            'title': title,
                            'company_name': 'N/A', 
                            'description': description,  
                            'posted_date': None,
                            'salary': 'N/A',
                            'duration': duration,
                            'location': location,
                            'image_url': image_url,
                            'email': 'info@kosovogenu.com',  
                            'phone_number': '+383 49 236 543',  
                            'office_address': 'Tringe Ismajli Nr. 23 \n Prishtinë, Kosovë 10000', 
                            'company_logo': 'https://kosovogenu.com/images/Frame.png',
                            'apply_link' : apply_link
                        }
                        save_job_to_db(job_data)

                        # Go back to the job list page
                        page.go_back()
                        page.wait_for_load_state('networkidle')

                    except Exception as e:
                        print(f"Error handling internship element: {e}")

                next_button = page.locator('//button[@aria-label="Next"]')
                if next_button.count() > 0 and next_button.is_enabled():
                    next_button.click()
                    page.wait_for_load_state('networkidle')
                    page.wait_for_timeout(2000)
                else:
                    break
        except Exception as e:
            print(f"Error during internship extraction from Kosovo Generation: {e}")
        finally:
            browser.close()


# Function for scraper 3 (Superpuna RKS)
def scrape_superpuna_rks():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://superpuna.rks-gov.net/job-seeker?criteria=', timeout=60000)

        try:
            previous_job_count = 0
            while True:
                job_boxes_selector = '//a[contains(@class, "mb-10 block")]'  # Updated selector to target the <a> element
                page.wait_for_selector(job_boxes_selector, timeout=20000)
                job_boxes = page.locator(job_boxes_selector)
                job_box_count = job_boxes.count()

                if job_box_count == 0 or job_box_count == previous_job_count:
                    print("No more job boxes found, breaking loop.")
                    break

                print(f"Found {job_box_count} job boxes on the page.")

                for index in range(previous_job_count, job_box_count):
                    try:
                        job_box = job_boxes.nth(index)

                        title_element = job_box.locator('h3')
                        company_element = job_box.locator('h4')
                        location_element = job_box.locator('span:has-text("Lokacioni") + strong')
                        posted_date_element = job_box.locator('span:has-text("Shpallur më") + strong')
                        salary_element = job_box.locator('span:has-text("Paga") + strong')

                        title = title_element.inner_text() if title_element.count() > 0 else 'N/A'
                        company_name = company_element.inner_text() if company_element.count() > 0 else 'N/A'
                        location = location_element.inner_text() if location_element.count() > 0 else 'N/A'
                        posted_date = posted_date_element.inner_text() if posted_date_element.count() > 0 else 'N/A'
                        salary = salary_element.inner_text() if salary_element.count() > 0 else 'N/A'

                        posted_date_db = datetime.strptime(posted_date, '%b %d, %Y').date() if posted_date != 'N/A' else None

                        # Get the apply link directly from the <a> tag
                        apply_link = job_box.get_attribute('href')  # Extracting the href attribute
                        print(f"Found apply link: {apply_link}")

                        job_data = {
                            'source': "Superpuna",
                            'title': title,
                            'company_name': company_name,
                            'description': 'N/A',
                            'posted_date': posted_date_db,
                            'salary': salary,
                            'duration': 'N/A',
                            'location': location,
                            'image_url': 'https://superpuna.rks-gov.net/images/MFPT-logo.svg',
                            'email': 'kontakt.superpuna@rks-gov.net',
                            'phone_number': 'N/A',
                            'office_address': 'Ndërtesa e Qeverisë, Sheshi Nëna Terezë \n Prishtinë, Republika e Kosovës',
                            'company_logo': 'https://media.licdn.com/dms/image/v2/C4D0BAQFtUr7p40eSIQ/company-logo_200_200/company-logo_200_200/0/1675417948635/superpuna_logo?e=1737590400&v=beta&t=KF2U6tR5UDgshxeWXZGEn95ZIIZ95QdvA8GV0cFL8Uo',
                            'apply_link': apply_link
                        }

                        save_job_to_db(job_data)

                    except Exception as e:
                        print(f"Error handling job box element at index {index}: {e}")
                        # Wait for the job boxes to reload before retrying
                        page.wait_for_selector(job_boxes_selector, timeout=20000)

                previous_job_count = job_box_count

                next_button = page.locator('//button[contains(@class, "bg-blue-550")]')
                if next_button.count() > 0 and next_button.is_enabled():
                    print("Clicking 'Shiko më shumë' button to load more jobs.")
                    next_button.click()
                    print("Waiting for 10 seconds for new jobs to load...")
                    page.wait_for_timeout(10000)
                else:
                    print("No more pages to load.")
                    break

        except Exception as e:
            print(f"Error during job extraction from Superpuna RKS: {e}")
        finally:
            browser.close()

# Function to run all scrapers
def run_all_scrapers():
    print("Starting Kosova Job scraper...")
    scrape_kosova_job()
    print("Kosova Job scraper completed.")

    print("Starting Kosovo Generation scraper...")
    scrape_kosovo_generation()
    print("Kosovo Generation scraper completed.")

    print("Starting Superpuna RKS scraper...")
    scrape_superpuna_rks()
    print("Superpuna RKS scraper completed.")

# Main loop to refresh jobs every 30 minutes
while True:
    run_all_scrapers()
    print("All scrapers completed. Sleeping for 30 minutes...")
    time.sleep(30 * 60)

