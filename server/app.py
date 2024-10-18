from flask import Flask, jsonify, abort, request
from flask_cors import CORS
import MySQLdb
import bcrypt

app = Flask(__name__)
CORS(app)  # Allow CORS for all origins

# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '',
    'host': 'localhost',
    'port': 3306,
    'db': 'course_data'
}

def fetch_courses_from_database():
    courses = []
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
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
    course = None
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
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
    course = fetch_course_by_id(course_id)
    if course is None:
        abort(404, description="Course not found")
    return jsonify(course)

# --- Helper Functions ---
def add_participant(username, email, phone, password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "INSERT INTO participants (username, email, phone, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (username, email, phone, hashed_password))
        db.commit()
        cursor.close()
    except MySQLdb.Error as e:
        print(f"MySQL error during participant creation: {e}")
        return jsonify({"error": f"MySQL error: {e}"}), 500
    finally:
        db.close()
    return jsonify({"message": "Participant created successfully."}), 201

def add_organization(name_of_org, email_of_org, phone_number_of_org, password_of_org, url_of_org, description_of_org):
    hashed_password = bcrypt.hashpw(password_of_org.encode('utf-8'), bcrypt.gensalt())
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "INSERT INTO organizations (name_of_org, email_of_org, phone_number_of_org, password_of_org, url_of_org, description_of_org) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (name_of_org, email_of_org, phone_number_of_org, hashed_password, url_of_org, description_of_org))
        db.commit()
        cursor.close()
    except MySQLdb.Error as e:
        print(f"MySQL error during organization creation: {e}")
        return jsonify({"error": f"MySQL error: {e}"}), 500
    finally:
        db.close()
    return jsonify({"message": "Organization created successfully."}), 201

# --- Sign Up Route --- (Fixed and Updated)
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print(f"Signup data received: {data}")  # Log the incoming data for debugging

    if 'isOrg' in data and data['isOrg']:
        # Organization signup
        required_fields = ['name_of_org', 'email_of_org', 'phone_number_of_org', 'password_of_org', 'url_of_org', 'description_of_org']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field {field} for organization signup."}), 400
        return add_organization(
            data['name_of_org'], 
            data['email_of_org'], 
            data['phone_number_of_org'], 
            data['password_of_org'], 
            data['url_of_org'], 
            data['description_of_org']
        )
    else:
        # Participant signup
        required_fields = ['username', 'email', 'phone', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field {field} for participant signup."}), 400
        return add_participant(
            data['username'], 
            data['email'], 
            data['phone'], 
            data['password']
        )

# --- Helper Functions for Login ---
def check_participant(email, password):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM participants WHERE email = %s"
        cursor.execute(query, [email])
        user = cursor.fetchone()
        cursor.close()
        db.close()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return True
        return False
    except MySQLdb.Error as e:
        print(f"MySQL error during participant login: {e}")
        return False

def check_organization(email_of_org, password_of_org):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM organizations WHERE email_of_org = %s"
        cursor.execute(query, [email_of_org])
        user = cursor.fetchone()
        cursor.close()
        db.close()

        if user and bcrypt.checkpw(password_of_org.encode('utf-8'), user['password_of_org'].encode('utf-8')):
            return True
        return False
    except MySQLdb.Error as e:
        print(f"MySQL error during organization login: {e}")
        return False

# --- Login Route ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    is_org = data.get('isOrg', False)

    print(f"Login attempt for {'Organization' if is_org else 'Participant'} with email: {email}")

    if is_org:
        if check_organization(email, password):
            return jsonify({"success": True, "message": "Login successful"})
        else:
            return jsonify({"success": False, "message": "Invalid organization credentials"}), 401
    else:
        if check_participant(email, password):
            return jsonify({"success": True, "message": "Login successful"})
        else:
            return jsonify({"success": False, "message": "Invalid participant credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)