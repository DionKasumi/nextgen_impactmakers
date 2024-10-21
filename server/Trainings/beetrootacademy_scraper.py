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

def save_trainings_to_database(trainings_list):
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for training in trainings_list:
            try:
                # Check if the training already exists in the database based on title and source
                check_query = "SELECT COUNT(*) FROM all_courses WHERE title = %s AND source = %s"
                cursor.execute(check_query, (training['Title'], 'Beetroot Academy'))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert the training into the database
                    insert_query = """
                      INSERT INTO all_courses (source, title, trainer, description, price, students, rating, image_url, duration)
                      VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                      """
                    data = (
                         'Beetroot Academy',
                        training['Title'],
                        None, # No trainer info provided
                        training['Description'],
                        None, # No price info provided
                        None, # No students info provided
                        training['Rating'], 
                        'https://xk.beetroot.academy/static/logo-c96c7c4d19444146e8b100d14e93d1ac.svg',  # Image URL
                        training['Duration']
                    )
                    cursor.execute(insert_query, data)
                    db.commit()
                    print(f"Inserted new training: {training['Title']}")
                else:
                    print(f"Training already exists: {training['Title']}")

            except MySQLdb.Error as e:
                db.rollback()
                print(f"Error inserting training data: {e}")

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
        page_url = 'https://xk.beetroot.academy/courses/online'

        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(page_url, timeout=60000)
        
        # Locate the training cards on the page
        trainings = page.locator('//div[@class="col-lg-4 col-md-6 col-sm-6 intro_boxWrap"]')
        print(f'There are {trainings.count()} trainings.')

        trainings_list = []
        for i in range(trainings.count()):
            try:
                training = trainings.nth(i)
                training_name = training.locator('.blueTextWeight').inner_text(timeout=10000)
                training_rating = training.locator('.design_skill').inner_text(timeout=10000)
                training_description = training.locator('.blackTextSmall').inner_text(timeout=10000)
                training_duration = training.locator('.intro_monthIcon').inner_text(timeout=10000)
                
                trainings_list.append({
                    'Title': training_name,
                    'Rating': training_rating,
                    'Description': training_description,
                    'Duration': training_duration
                })
            except Exception as e:
                print(f"An error occurred while processing a training: {e}")

        browser.close()

        return trainings_list

def main():
    while True:
        trainings_list = scrape_trainings()
        save_trainings_to_database(trainings_list)
        print("Sleeping for 30 minutes...")
        time.sleep(30 * 60)  

if __name__ == '__main__':
    main()
