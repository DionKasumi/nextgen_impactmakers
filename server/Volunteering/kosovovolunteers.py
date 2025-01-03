from playwright.sync_api import sync_playwright
import MySQLdb
import time
from datetime import datetime
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db_config import db_params


def assign_volunteering_label(title):
    title_lower = title.lower()
    
    # Community & Social Services
    if any(keyword in title_lower for keyword in ['vullnetar', 'volunteer', 'assist', 'support', 'aid', 'community', 'social', 'help', 'komunitet', 'rini', 'activism', 'activist', 'peace']):
        return 'Community & Social Services'
    
    # Environmental Conservation
    elif any(keyword in title_lower for keyword in ['clean', 'environment', 'ambient', 'nature', 'ekologji', 'plant', 'recycle', 'gjelbërim', 'tree', 'earth', 'shkugëzen', 'green', 'cleanup', 'tokë']):
        return 'Environmental Conservation'
    
    # Arts & Culture
    elif any(keyword in title_lower for keyword in ['festival', 'art', 'culture', 'kulturë', 'artist', 'muzikë', 'theater', 'film', 'cinema', 'dokufest', 'green fest', 'origami', 'culinary', 'heritage', 'analizimi']):
        return 'Arts & Culture'
    
    # Youth Empowerment
    elif any(keyword in title_lower for keyword in ['youth', 'rini', 'teen', 'young', 'aktivizim', 'empower', 'leadership', 'mentor', 'junior', 'camp', 'club', 'forum']):
        return 'Youth Empowerment'
    
    # Education & Training
    elif any(keyword in title_lower for keyword in ['education', 'train', 'learn', 'mentorship', 'workshop', 'school', 'academy', 'course', 'mësim', 'session', 'konferencë', 'informues', 'skill']):
        return 'Education & Training'
    
    # Health & Wellness
    elif any(keyword in title_lower for keyword in ['health', 'shëndet', 'wellness', 'care', 'clinic', 'well-being', 'healthcare', 'sos', 'therapy', 'mental', 'tuberkulozi', 'prevention']):
        return 'Health & Wellness'
    
    # Technology & Innovation
    elif any(keyword in title_lower for keyword in ['tech', 'technology', 'it', 'innovation', 'digital', 'ict', 'software', 'platform', 'digital', 'freedom', 'content', 'programer', 'web']):
        return 'Technology & Innovation'
    
    # Animal Welfare
    elif any(keyword in title_lower for keyword in ['animal', 'wildlife', 'pet', 'dog', 'cat', 'veterinary', 'animal care', 'protection']):
        return 'Animal Welfare'

    # Legal & Advocacy
    elif any(keyword in title_lower for keyword in ['legal', 'advocacy', 'rights', 'justice', 'lawyer', 'ligjore', 'advocate', 'law']):
        return 'Legal & Advocacy'

    # Research & Development
    elif any(keyword in title_lower for keyword in ['research', 'hulumtim', 'development', 'analyst', 'project', 'plan', 'analysis']):
        return 'Research & Development'
    
    # Event Management
    elif any(keyword in title_lower for keyword in ['event', 'management', 'coordination', 'plan', 'organize', 'organizer', 'setup']):
        return 'Event Management'
    
    else:
        return 'Activities for Youth'

# Save the scraped opportunity data to the MySQL database
def save_volunteering_opportunity_to_db(opportunity):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        # Assign label to opportunity
        label = assign_volunteering_label(opportunity['title'])

        # Check if the opportunity already exists
        check_query = "SELECT COUNT(*) FROM all_volunteering WHERE title = %s AND source = %s"
        cursor.execute(check_query, (opportunity['title'], opportunity['source']))
        exists = cursor.fetchone()[0] > 0

        if not exists:
            insert_query = """
            INSERT INTO all_volunteering (source, title, duration, cause, age_group, image_url, email, phone_number, office_address, company_logo, apply_link, label)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                opportunity['source'],
                opportunity['title'],
                opportunity['duration'],
                opportunity['cause'],
                opportunity['age_group'],
                opportunity['image_url'],
                opportunity['email'],
                opportunity['phone_number'],
                opportunity['office_address'],
                opportunity['company_logo'],
                opportunity['apply_link'],  
                label
            ))
            db.commit()
            print(f"Inserted new opportunity: {opportunity['title']} with label {label}")
       
    except MySQLdb.Error as e:
        print(f"Error inserting data: {e}")
        db.rollback()
    finally:
        cursor.close()
        db.close()

def load_all_opportunities(page):
    while True:
        try:
            load_more_button = page.locator('//button[contains(@class, "btn-info") and text()="LOAD MORE"]')
            if load_more_button.count() > 0 and load_more_button.is_enabled():
                print("Clicking 'LOAD MORE' button to load more opportunities.")
                load_more_button.click()
                page.wait_for_load_state('networkidle')  
                page.wait_for_timeout(2000) 
            else:
                print("All opportunities loaded.")
                break
        except Exception as e:
            print(f"Error during opportunity loading: {e}")
            break

def fetch_and_update_opportunities():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        page.goto('https://kosovovolunteers.org/login', timeout=60000)
        
        try:
            search_button = page.locator('span#basic-addon2')
            search_button.click()
            page.wait_for_load_state('networkidle')
            print("Successfully navigated to the opportunities page.")
        except Exception as e:
            print(f"Error clicking the search button: {e}")
            return

        load_all_opportunities(page)

        try:
            opportunity_selector = '//div[contains(@class, "OpportunitiesList-single-opportunity")]'
            page.wait_for_selector(opportunity_selector, timeout=20000)

            opportunity_boxes = page.locator(opportunity_selector)
            opportunity_count = opportunity_boxes.count()

            for index in range(opportunity_count):
                try:
                    opportunity_box = opportunity_boxes.nth(index)

                    title_element = opportunity_box.locator('h4 > a')
                    location_element = opportunity_box.locator('li:has-text("Location :") strong')
                    start_date_element = opportunity_box.locator('li:has-text("Start Date :")')
                    cause_element = opportunity_box.locator('#pTag')
                    image_element = opportunity_box.locator('img.opp-img')
                    
                    title = title_element.inner_text() if title_element.count() > 0 else 'N/A'
                    location = location_element.inner_text() if location_element.count() > 0 else 'N/A'
                    start_date_text = start_date_element.text_content().strip() if start_date_element.count() > 0 else 'N/A'

                    start_date = start_date_text.split("Start Date :")[-1].strip() if "Start Date :" in start_date_text else 'N/A'
                    try:
                        start_date = datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y-%m-%d") if start_date != 'N/A' else None
                    except ValueError:
                        print(f"Date parsing failed for: {start_date_text}")
                        start_date = 'Invalid Date'

                    cause = cause_element.inner_text() if cause_element.count() > 0 else 'N/A'
                    image_url = image_element.get_attribute('src') if image_element.count() > 0 else 'N/A'

                    # Get the link directly from the opportunity box
                    apply_link = opportunity_box.locator('a').get_attribute('href') if opportunity_box.locator('a').count() > 0 else 'N/A'
                    if apply_link and not apply_link.startswith("http"):
                        apply_link = f"https://kosovovolunteers.org{apply_link}"

                    # Store all opportunity data
                    opportunity_data = {
                        'source': "Kosovo Volunteers",
                        'title': title,
                        'duration': start_date,
                        'cause': cause,
                        'age_group': 'N/A',
                        'image_url': image_url,
                        'email': 'kastriot.mehmetaj@rks-gov.net',
                        'phone_number': '+383 38200222/59',
                        'office_address': 'Str. Sheshi Nëna Terezë \n Prishtina, Kosovo',
                        'company_logo': 'https://kosovovolunteers.org/static/media/logo_front.64e7f225.png',
                        'apply_link': apply_link
                    }

                    save_volunteering_opportunity_to_db(opportunity_data)

                except Exception as e:
                    print(f"Error handling opportunity box element: {e}")

        except Exception as e:
            print(f"Error during opportunity extraction: {e}")


while True:
    fetch_and_update_opportunities()
    print("Sleeping for 30 minutes...")
    time.sleep(30 * 60)

