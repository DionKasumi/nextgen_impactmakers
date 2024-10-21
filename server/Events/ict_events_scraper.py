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

# Save the scraped event data to the MySQL database
def save_to_database(events_list):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for event in events_list:
            try:
                # Check if the event already exists
                check_query = "SELECT COUNT(*) FROM all_events WHERE title = %s AND source = %s"
                cursor.execute(check_query, (event['Title'], 'ICT Kosovo'))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert new event data into the database
                    insert_query = """
                    INSERT INTO all_events (source, organizer, title, duration, location, image_url)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    data = (
                        'ICT Kosovo',  # The source of the event
                        event['Organizer'],
                        event['Title'],
                        event['Duration'],
                        event['Location'],
                        event['Image URL']
                    )
                    cursor.execute(insert_query, data)
                    db.commit()
                    print(f"Inserted new event: {event['Title']}")
                else:
                    print(f"Event already exists: {event['Title']}")

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

# Scrape event data from the ICT Kosovo page
def scrape_events():
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
                
                print(f"Current URL: {page.url}")

                title = None
                try:
                    title = page.locator('h3.elementor-heading-title').inner_text(timeout=10000)
                except:
                    pass

                if not title:
                    try:
                        title = page.locator('h2.tech-title').inner_text(timeout=10000)
                    except:
                        pass

                if not title:
                    print(f"Skipping event {i + 1}: No title found.")
                    page.go_back(timeout=5000)
                    continue

                try:
                    duration = page.locator("xpath=//main/div[1]/div[2]/div/div[1]/h3/p/strong").inner_text(timeout=10000)
                except:
                    duration = "N/A"

                organizer = "N/A"
                try:
                    img_element = page.locator('div.brought-section img')
                    if img_element.count() > 0:
                        organizer = img_element.get_attribute('alt', timeout=10000)
                    else:
                        organizer_paragraph = page.locator('p:has-text("brought by")').inner_text(timeout=10000)
                        organizer = organizer_paragraph.split("brought by")[-1].strip()
                except:
                    organizer = "N/A" 

                # Extract location
                location = "N/A"  # Default location
                try:
                    location_element = page.locator('a.brand-info')
                    if location_element.count() > 0:
                        location_text = location_element.inner_text(timeout=10000)
                        location = location_text.strip().split('\n')[-1].strip()
                    else:
                        location_paragraph = page.locator('p:has-text("in")').inner_text(timeout=10000)
                        if 'in' in location_paragraph:
                            location = location_paragraph.split('in')[-1].strip()
                except:
                    pass

                # Extract image URL
                image_url = "N/A"  # Default image URL
                try:
                    # Try to find the first image on the page
                    img_element = page.locator('img').first
                    if img_element:
                        image_url = img_element.get_attribute('src', timeout=10000)
                except:
                    pass

                events_list.append({
                    'Title': title,
                    'Organizer': organizer,
                    'Duration': duration,
                    'Location': location,
                    'Image URL': image_url
                })
                
                print(f"Scraped event {i + 1}: {title}")

                page.go_back(timeout=5000)

            except Exception as e:
                print(f"An error occurred while processing event {i + 1}: {e}")
                page.go_back(timeout=5000)

        browser.close()
        return events_list




def main():
    while True:
        events_list = scrape_events()
        save_to_database(events_list)
        print("Sleeping for 30 minutes...")
        time.sleep(30 * 60)  # Sleep for 30 minutes to retrieve newly added events

if __name__ == '__main__':
    main()
