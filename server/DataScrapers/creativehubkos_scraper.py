from playwright.sync_api import sync_playwright
import MySQLdb
import time

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
                check_query = "SELECT COUNT(*) FROM creativehub_trainings WHERE title = %s"
                cursor.execute(check_query, (training['Title'],))  # Correcting tuple syntax
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    insert_query = """
                    INSERT INTO creativehub_trainings (title, description, price, students, rating)
                    VALUES (%s, %s, %s, %s, %s)
                    """
                    data = (
                        training['Title'],
                        training['Description'],
                        training['Price (EUR)'],
                        training['Students'],
                        training['Rating'],
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

        trainings = page.locator('//div[contains(@class, "col-md-3")]').all()
        print(f'There are {len(trainings)} trainings.')


        trainings_list = []
        for training in trainings:
            try:
                title = training.locator('h3.aos-init.aos-animate').inner_text(timeout=5000)
                description = training.locator('p').inner_text(timeout=5000)
                price = training.locator('.price').first.inner_text(timeout=5000).strip()
                
                #on other websites there may be students and rating, so I'm setting them as "none"
                trainer = None
                students = None 
                rating = None
                trainings_list.append({
                    'Title': title,
                    'Trainer': trainer,
                    'Description': description,
                    'Price (EUR)': price,
                    'Students': students,
                    'Rating': rating,
                })
            except Exception as e:
                print(f"An error occurred while processing a course: {e}")

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
            
