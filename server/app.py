from flask import Flask, jsonify
from flask_cors import CORS
import MySQLdb

app = Flask(__name__)
CORS(app)  # Allow CORS for all origins

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'
}

def fetch_courses_from_database():
    courses = []
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        # Fetch course data from the all_courses table
        query = """
        SELECT source, title, trainer, description, price, students, rating, image_url, duration 
        FROM all_courses
        """
        cursor.execute(query)
        courses = cursor.fetchall()

    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")

    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")

    return courses

@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = fetch_courses_from_database()
    return jsonify(courses)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
