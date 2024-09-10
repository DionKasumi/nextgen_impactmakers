from playwright.sync_api import sync_playwright
import MySQLdb
import time

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'  # Ensure this database exists
}

def save_to_database(volunteerings_list):
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for volunteering in volunteerings_list:
            try:
                # Check if the course already exists in the database based on title and trainer
                check_query = "SELECT COUNT(*) FROM all_volunteerings WHERE title = %s AND source = %s"
                cursor.execute(check_query, (volunteering['Title'], 'toka-ks'))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert the volunteering into the database
                    insert_query = """
                    INSERT INTO all_volunteerings (source, title, duration, cause, age_group,  image_url)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    data = ( 'toka-ks',
# The source of the volunteering
                        volunteering['Source'],
                        volunteering['Title'],
                        volunteering['Duration'],
                        volunteering['Cause'],
                        volunteering['Age group'],
                        volunteering['Image URL']
                    )
                    cursor.execute(insert_query, data)
                    db.commit()
                    print(f"Inserted new volunteering: {volunteering['Title']}")
                else:
                    print(f"Volunteering already exists: {volunteering['Title']}")

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

def scrape_volunteerings():
    with sync_playwright() as p:
        page_url = 'https://toka-ks.org/en/kampet/'

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)
        
        
        volunteering_links = page.locator('div.elementor-widget-image a').all()
        print(f'Found {len(volunteering_links)} volunteerings.')

        volunteerings_list = []
        for i, volunteering_link in enumerate(volunteering_links):
            try:
                volunteering_link.click(timeout=5000)

                print(f"Current URL: {page.url}")

                source = None
                try:
                    source = page.locator('h3.elementor-heading-source').inner_text(timeout=10000)
                except:
                    pass

                if not source:
                    try:
                        source = page.locator('h2.tech-source').inner_text(timeout=10000)
                    except:
                        pass

                if not source:
                    print(f"Skipping volunteering {i + 1}: No source found.")
                    page.go_back(timeout=5000)
                    continue

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
                    print(f"Skipping volunteering {i + 1}: No title found.")
                    page.go_back(timeout=5000)
                    continue
                try:
                    duration = page.locator("xpath=//main/div[1]/div[2]/div/div[1]/h3/p/strong").inner_text(timeout=10000)
                except:
                    duration = "N/A"

                age_group = "N/A"
                try:
                    img_element = page.locator('div.brought-section img')
                    if img_element.count() > 0:
                        age_group = img_element.get_attribute('alt', timeout=10000)
                    else:
                        age_group_paragraph = page.locator('p:has-text("brought by")').inner_text(timeout=10000)
                        age_group = age_group_paragraph.split("brought by")[-1].strip()
                except:
                    age_group = "N/A" 

                # Extract cause
                cause = "N/A"  # Default cause
                try:
                    cause_element = page.locator('a.brand-info')
                    if cause_element.count() > 0:
                        cause_text = cause_element.inner_text(timeout=10000)
                        cause = cause_text.strip().split('\n')[-1].strip()
                    else:
                        cause_paragraph = page.locator('p:has-text("in")').inner_text(timeout=10000)
                        if 'in' in cause_paragraph:
                            cause = cause_paragraph.split('in')[-1].strip()
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

                volunteerings_list.append({
                    'Source': source,
                    'Title': title,
                    'Duration': duration,
                    'Cause': cause,
                    'Age group': age_group,
                    'Image URL': image_url
                })

                print(f"Scraped volunteering {i + 1}: {title}")

                page.go_back(timeout=5000)

            except Exception as e:
                print(f"An error occurred while processing volunteering {i + 1}: {e}")

        browser.close()

        return volunteerings_list

def main():
    while True:
        volunteerings_list = scrape_volunteerings()
        save_to_database(volunteerings_list)
        print("Sleeping for 30 minutes...")
        time.sleep(30 * 60)  # Sleep for 30 minutes to retrieve recently added trainings 

if __name__ == '__main__':
    main()
