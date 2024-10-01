from playwright.sync_api import sync_playwright
import MySQLdb
import time

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',  # Replace with your actual password
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'  # Ensure this database exists
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
                cursor.execute(check_query, (event['Title'], 'Shpik Events'))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert new event data into the database
                    insert_query = """
                    INSERT INTO all_events (source, organizer, title, duration, location, image_url)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    data = (
                        'Shpik Events',  # The source of the event
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

# Scrape event data from the Shpik Events page
def scrape_events():
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
                # Extract event details from the card
                title = event_card.locator('h2.title a').text_content(timeout=5000).strip()
                event_link = event_card.locator('h2.title a').get_attribute('href', timeout=5000)

                image_url = event_card.locator('div.ova_thumbnail img').get_attribute('src', timeout=5000)

                # Extract the location (e.g., "Online Training")
                location = event_card.locator('div.venue').text_content(timeout=5000).strip()

                # Extract the duration (month and date)
                time_element = event_card.locator('div.time')
                duration = time_element.locator('span.month').text_content(timeout=5000).strip() + " " + time_element.locator('span.date').text_content(timeout=5000).strip()

                # Extract the price
                price = time_element.locator('span.price').text_content(timeout=5000).strip()

                # Organizer is not directly available on the card, using default
                organizer = 'N/A'  

                events_list.append({
                    'Title': title,
                    'Organizer': organizer,
                    'Duration': duration,
                    'Location': location,
                    'Image URL': image_url
                })
                
                print(f"Scraped event {i + 1}: {title} | Location: {location}")

            except Exception as e:
                print(f"An error occurred while processing event {i + 1}: {e}")

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
