from playwright.sync_api import sync_playwright
import MySQLdb
import time
from datetime import datetime

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',  
    'host': 'localhost',
    'port': 3306,
    'db': 'pye_data'  
}

# Save the scraped event data to the MySQL database
def save_event_to_db(event):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        check_query = "SELECT COUNT(*) FROM all_events WHERE title = %s AND source = %s"
        cursor.execute(check_query, (event['Title'], event['Source']))
        exists = cursor.fetchone()[0] > 0

        if not exists:
            insert_query = """
            INSERT INTO all_events (source, organizer, title, duration, location, image_url, email, phone_number, office_address, company_logo)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                event['Source'],
                event['Organizer'],
                event['Title'],
                event['Duration'],
                event['Location'],
                event['Image URL'],
                event['Email'],
                event['Phone Number'],
                event['Office Address'],
                event['Company Logo']
            ))
            db.commit()
            print(f"Inserted new event: {event['Title']}")
        else:
            print(f"Event already exists: {event['Title']}")

    except MySQLdb.Error as e:
        print(f"Error inserting data: {e}")
        db.rollback()
    finally:
        cursor.close()
        db.close()

# Scrape event data from Shpik Events
def scrape_shpik_events():
    with sync_playwright() as p:
        page_url = 'https://events.shpik.org/?name_event&name_city&name_venue&time=future&ovaem_date_from&ovaem_date_to&post_type=event&search=search-event'
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)

        event_cards = page.locator('div.ova-item.style1').all()
        print(f'Found {len(event_cards)} events.')

        events_list = []
        for i, event_card in enumerate(event_cards):
            try:
                title = event_card.locator('h2.title a').text_content(timeout=5000).strip()
                image_url = event_card.locator('div.ova_thumbnail img').get_attribute('src', timeout=5000)
                location = event_card.locator('div.venue').text_content(timeout=5000).strip()
                time_element = event_card.locator('div.time')
                duration = time_element.locator('span.month').text_content(timeout=5000).strip() + " " + time_element.locator('span.date').text_content(timeout=5000).strip()
                organizer = 'N/A'

                events_list.append({
                    'Source': 'SHPIK Events',
                    'Title': title,
                    'Organizer': organizer,
                    'Duration': duration,
                    'Location': location,
                    'Image URL': image_url, 
                    'Email': 'info@shpik.org',
                    'Phone Number': '+383 44 507 575',
                    'Office Address': 'Xheladin Hana p.n. F.P. 315. 10000 \n Prishtinë, Kosovë',
                    'Company Logo': 'https://trajnimet.info/wp-content/uploads/2022/12/shpik-logo.png'
                })
                
                print(f"Scraped event {i + 1}: {title} | Location: {location}")

            except Exception as e:
                print(f"An error occurred while processing event {i + 1}: {e}")

        browser.close()
        return events_list

# Scrape event data from ICT Kosovo
def scrape_ict_kosovo():
    with sync_playwright() as p:
        page_url = 'https://ictkosovo.eu/ict-conferences-2/'
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)

        event_links = page.locator('div.elementor-widget-image a').all()
        print(f'Found {len(event_links)} events.')

        events_list = []
        for i, event_link in enumerate(event_links):
            try:
                event_link.click(timeout=5000)
                title = page.locator('h3.elementor-heading-title').inner_text(timeout=10000)
                if not title:
                    title = page.locator('h2.tech-title').inner_text(timeout=10000)

                duration = page.locator("xpath=//main/div[1]/div[2]/div/div[1]/h3/p/strong").inner_text(timeout=10000)
                organizer = 'N/A'
                location = page.locator('a.brand-info').inner_text(timeout=10000).strip()
                image_url = page.locator('img').first.get_attribute('src', timeout=10000)

                events_list.append({
                    'Source': 'ICT Kosovo',
                    'Title': title,
                    'Organizer': organizer,
                    'Duration': duration,
                    'Location': location,
                    'Image URL': image_url,
                    'Email': 'info@ictkosovo.eu',  
                    'Phone Number': '+383 44 916 156',  
                    'Office Address': 'Rruga Zagrebi, Hyrja 23 Kati 2 \n Prishtinë, Kosovë 10000', 
                    'Company Logo': 'https://ictkosovo.eu/wp-content/uploads/2023/05/white.svg'
                })
                
                print(f"Scraped event {i + 1}: {title}")

                page.go_back(timeout=5000)

            except Exception as e:
                print(f"An error occurred while processing event {i + 1}: {e}")
                page.go_back(timeout=5000)

        browser.close()
        return events_list

# Function to run all scrapers
def run_all_event_scrapers():
    print("Starting Shpik Events scraper...")
    shpik_events = scrape_shpik_events()
    for event in shpik_events:
        save_event_to_db(event)
    print("Shpik Events scraper completed.")

    print("Starting ICT Kosovo scraper...")
    ict_events = scrape_ict_kosovo()
    for event in ict_events:
        save_event_to_db(event)
    print("ICT Kosovo scraper completed.")

# Main loop to refresh events every 30 minutes
while True:
    run_all_event_scrapers()
    print("All scrapers completed. Sleeping for 30 minutes...")
    time.sleep(30 * 60)
