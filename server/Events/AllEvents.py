from playwright.sync_api import sync_playwright
import MySQLdb
import time

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',  
    'host': 'localhost',
    'port': 3306,
    'db': 'pye_data'  
}

# Function to assign label based on event title
def assign_event_label(title):
    title_lower = title.lower()
    
    if any(keyword in title_lower for keyword in ['technology', 'it', 'tech', 'software', 'programming', 'development', 'coding', 'ai']):
        return 'Technology & IT'
    elif any(keyword in title_lower for keyword in ['business', 'marketing', 'seo', 'sales', 'entrepreneurship']):
        return 'Business & Marketing'
    elif any(keyword in title_lower for keyword in ['design', 'multimedia', 'graphics', 'illustrator', 'photoshop', 'aftereffect']):
        return 'Design & Multimedia'
    elif any(keyword in title_lower for keyword in ['education', 'training', 'workshop', 'conference', 'learning', 'academy']):
        return 'Education & Training'
    elif any(keyword in title_lower for keyword in ['networking', 'meetup', 'connect', 'conference']):
        return 'Networking'
    else:
        return 'Other'

# Save the scraped event data to the MySQL database
def save_event_to_db(event):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        # Assign label to event
        label = assign_event_label(event['Title'])

        # Check if the event already exists
        check_query = "SELECT COUNT(*) FROM all_events WHERE title = %s AND source = %s"
        cursor.execute(check_query, (event['Title'], event['Source']))
        exists = cursor.fetchone()[0] > 0

        if not exists:
            insert_query = """
            INSERT INTO all_events (source, organizer, title, duration, location, image_url, email, phone_number, office_address, company_logo, apply_link, label)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
                event['Company Logo'],
                event['Apply Link'],
                label
            ))
            db.commit()
            print(f"Inserted new event: {event['Title']} with label {label}")
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
        page.goto(page_url, wait_until="domcontentloaded", timeout=60000)

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
                apply_link = event_card.locator('h2.title a').get_attribute('href', timeout=5000)

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
                    'Company Logo': 'https://trajnimet.info/wp-content/uploads/2022/12/shpik-logo.png',
                    'Apply Link': apply_link
                })
                
                print(f"Scraped event {i + 1}: {title} | Location: {location} | Apply Link: {apply_link}")

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
        page.goto(page_url, wait_until="networkidle", timeout=60000)

        event_links = page.locator('div.elementor-widget-image a').all()
        print(f"Found {len(event_links)} events.")

        events_list = []
        for i, event_link in enumerate(event_links):
            try:
                apply_link = event_link.get_attribute('href', timeout=5000)
                event_link.click(timeout=5000)

                # Wait for title to appear
                page.wait_for_selector('h3.elementor-heading-title', timeout=20000)
                title = page.locator('h3.elementor-heading-title').inner_text(timeout=20000)

                duration = page.locator("xpath=//main/div[1]/div[2]/div/div[1]/h3/p/strong").inner_text(timeout=10000)
                location = page.locator('a.brand-info').inner_text(timeout=10000).strip()
                image_url = page.locator('img').first.get_attribute('src', timeout=10000)

                events_list.append({
                    'Source': 'ICT Kosovo',
                    'Title': title,
                    'Organizer': 'N/A',
                    'Duration': duration,
                    'Location': location,
                    'Image URL': image_url,
                    'Email': 'info@ictkosovo.eu',
                    'Phone Number': '+383 44 916 156',
                    'Office Address': 'Rruga Zagrebi, Hyrja 23 Kati 2 \n Prishtinë, Kosovë 10000',
                    'Company Logo': 'https://ictkosovo.eu/wp-content/uploads/2023/05/white.svg',
                    'Apply Link': apply_link
                })
                
                print(f"Scraped event {i + 1}: {title} | Apply Link: {apply_link}")
                page.go_back(wait_until="networkidle")

            except Exception as e:
                print(f"An error occurred while processing event {i + 1}: {e}")
                page.go_back(wait_until="networkidle")

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
if __name__ == '__main__':
    while True:
        run_all_event_scrapers()
        print("All scrapers completed. Sleeping for 30 minutes...")
        time.sleep(30 * 60)
