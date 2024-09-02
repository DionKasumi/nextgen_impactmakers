from playwright.sync_api import sync_playwright
import MySQLdb
import time

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'  
}

def save_trainings_to_database(trainings_list):
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        for training in trainings_list:
            try:
                # Check if the training already exists in the database based on title and level
                check_query = "SELECT COUNT(*) FROM beetroot_academy WHERE title = %s AND level = %s"
                cursor.execute(check_query, (training['Title'], training['Level']))
                exists = cursor.fetchone()[0] > 0

                if not exists:
                    # Insert the training into the database
                    insert_query = """
                    INSERT INTO beetroot_academy (title, level, description, duration)
                    VALUES (%s, %s, %s, %s)
                    """
                    data = (
                        training['Title'],
                        training['Level'],
                        training['Description'],
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
        trainings = page.locator('//div[@class="col-lg-4 col-md-6 col-sm-6 intro_boxWrap"]').all()
        print(f'There are {len(trainings)} trainings.')

        trainings_list = []
        for training in trainings:
            try:
                training_name = training.locator('.blueTextWeight').inner_text(timeout=5000)
                training_level = training.locator('.design_skill').inner_text(timeout=5000)
                training_description = training.locator('.blackTextSmall').inner_text(timeout=5000)
                training_duration = training.locator('.intro_monthIcon').inner_text(timeout=5000)
                
                trainings_list.append({
                    'Title': training_name,
                    'Level': training_level,
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

# CREATE TABLE beetroot_academy (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     title VARCHAR(255),
#     level VARCHAR(255),
#     description TEXT,
#     duration VARCHAR(255)
# );