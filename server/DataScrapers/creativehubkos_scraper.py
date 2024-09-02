from playwright.sync_api import sync_playwright
import MySQLdb
import time

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'  
}

def fetch_and_update_job_listings(trainings_list):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for training in trainings_list:
            try:
                # Check if the course already exists in the all_courses table
                check_query = "SELECT COUNT(*) FROM all_courses WHERE title = %s AND source = %s"
                cursor.execute(check_query, (training['Title'], training['Source']))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert the new training into the all_courses table
                    insert_query = """
                    INSERT INTO all_courses (source, title, trainer, description, price, duration)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    data = (
                        training['Source'],  # Now using the Source key
                        training['Title'],
                        training['Trainer'],
                        training['Description'],
                        training['Price (EUR)'],
                        None  # Duration is not available in the current data structure
                    )
                
                    cursor.execute(insert_query, data)
                    db.commit()
                    print(f"Inserted new training: {training['Title']}")
                else:
                    print(f"Training already exists: {training['Title']}")

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


def scrape_trainings():
    with sync_playwright() as p:
        page_url = 'https://creativehubkos.com/'
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)
        
        # Wait for the necessary elements to load
        page.wait_for_load_state('networkidle', timeout=10000)
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
                
                # On other websites there may be students and rating, so I'm setting them as "None"
                trainer = None
                students = None 
                rating = None
                
                trainings_list.append({
                    'Source': 'Creative Hub Kosovo',  # Adding the source here
                    'Title': title,
                    'Trainer': trainer,
                    'Description': description,
                    'Price (EUR)': price,
                    'Students': students,
                    'Rating': rating,
                })
            except Exception as e:
                print(f"An error occurred while processing training {i+1}: {e}")

        browser.close()

        return trainings_list
    
def main():
    while True:
        trainings_list = scrape_trainings()
        fetch_and_update_job_listings(trainings_list)
        print("Sleeping for 30 minutes...")
        time.sleep(30 * 60)


if __name__ == '__main__':
    main()
