from flask import Flask, jsonify, abort
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
        SELECT id, source, title, trainer, description, price, students, rating, image_url, duration 
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

def fetch_course_by_id(course_id):
    """Fetch a single course by ID from the database."""
    course = None
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        # Fetch a specific course by ID
        query = """
        SELECT id, source, title, trainer, description, price, students, rating, image_url, duration 
        FROM all_courses
        WHERE id = %s
        """
        cursor.execute(query, (course_id,))
        course = cursor.fetchone()

    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")

    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")

    return course

@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = fetch_courses_from_database()
    return jsonify(courses)

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    """Endpoint to get a specific course by its ID."""
    course = fetch_course_by_id(course_id)
    if course is None:
        abort(404, description="Course not found")
    return jsonify(course)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
