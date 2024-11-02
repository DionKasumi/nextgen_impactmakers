from flask import Flask, jsonify, abort, redirect, request, session, render_template
from flask_cors import CORS
import MySQLdb
import bcrypt
from datetime import datetime
import secrets

app = Flask(__name__)

# Configure CORS to allow credentials (cookies) to be sent from cross-origin requests
CORS(app, supports_credentials=True)

# Set a secret key for session management
app.secret_key = secrets.token_hex(16)

# Configure session cookie settings for cross-origin requests
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Set to 'None' for strict cross-origin environments
app.config['SESSION_COOKIE_SECURE'] = False    # Disable secure cookies for development (set to True in production if using HTTPS)


# Database connection parameters
db_params = {
    'user': 'root',
    'passwd': '1234',
    'host': 'localhost',
    'port': 3306,
    'db': 'pye_data'
}

def fetch_courses_from_database():
    courses = []
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = """
        SELECT id, source, title, trainer, description, price, students, rating, image_url, duration , email, phone_number, office_address, company_logo 
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
        SELECT id, source, title, trainer, description, price, students, rating, image_url, duration, email, phone_number, office_address, company_logo 
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
def add_participant(username, email, phone, password, preferences):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    
    if isinstance(preferences, list):
        preferences_str = ', '.join(preferences)  
    else:
        preferences_str = preferences

    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "INSERT INTO participants (username, email, phone, password, preferences) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (username, email, phone, hashed_password, preferences_str))
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
            data['password'],
            data.get('preferences', [])
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

        if not user:
            return {"success": False, "message": "Organization not found."}, 404

        # Check if the password matches
        if bcrypt.checkpw(password_of_org.encode('utf-8'), user['password_of_org'].encode('utf-8')):
            # Check the organization's status
            if user['status'] == 'pending':
                return {"success": False, "message": "Organization approval is pending."}, 403
            elif user['status'] == 'rejected':
                return {"success": False, "message": "Organization has been rejected by the admin."}, 403
            elif user['status'] == 'approved':
                return {"success": True, "message": "Login successful."}, 200
        return {"success": False, "message": "Invalid credentials."}, 401
    except MySQLdb.Error as e:
        print(f"MySQL error during organization login: {e}")
        return {"success": False, "message": "Database error."}, 500


# --- Login Route ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    is_org = data.get('isOrg', False)

    print(f"Login attempt for {'Organization' if is_org else 'Participant'} with email: {email}")

    if is_org:
        response, status_code = check_organization(email, password)
        if status_code == 200:
            session['user_type'] = 'organization'
            session['user_email'] = email
        return jsonify(response), status_code
    else:
        if check_participant(email, password):
            session['user_type'] = 'participant'
            session['user_email'] = email
            return jsonify({"success": True, "message": "Login successful"}), 200
        else:
            return jsonify({"success": False, "message": "Invalid participant credentials"}), 401

# --- Session Check Route (For Debugging) ---
@app.route('/api/session', methods=['GET'])
def check_session():
    if 'user_email' in session:
        return jsonify({"isLoggedIn": True, "user_email": session['user_email']}), 200
    else:
        return jsonify({"isLoggedIn": False}), 200

# --- Logout Route ---
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_type', None)
    session.pop('user_email', None)
    return jsonify({"success": True, "message": "Logged out successfully"}), 200


# --- Admin Functions, Login, and Logout ---

def insert_admin(username, password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "INSERT INTO admins (username, password) VALUES (%s, %s)"
        cursor.execute(query, (username, hashed_password))
        db.commit()
        cursor.close()
    except MySQLdb.Error as e:
        return {"error": f"MySQL error: {e}"}, 500
    finally:
        db.close()
    return {"message": "Admin created successfully."}, 201


# API to create an admin
@app.route('/api/admins', methods=['POST'])
def create_admin():
    data = request.get_json()
    if 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required."}), 400
    return jsonify(insert_admin(data['username'], data['password']))


# Function to check admin credentials
def check_admin(username, password):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM admins WHERE username = %s"
        cursor.execute(query, [username])
        admin = cursor.fetchone()
        cursor.close()
        db.close()

        if admin and bcrypt.checkpw(password.encode('utf-8'), admin['password'].encode('utf-8')):
            return True
        return False
    except MySQLdb.Error as e:
        print(f"MySQL error during admin check: {e}")
        return False

@app.route('/admin/login', methods=['GET'])
def show_login_page():
    return render_template('admin_login.html')

# API to login admin
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required."}), 400

    if check_admin(data['username'], data['password']):
        session['admin'] = data['username']  # Store admin in session
        return jsonify({"success": True, "message": "Login successful"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid admin credentials"}), 401

# Admin dashboard route
@app.route('/admin/dashboard', methods=['GET'])
def admin_dashboard():
    if 'admin' in session:
        return render_template('admin_dashboard.html')
    else:
        return redirect('/api/admin/login')
    
# API to log out the admin
@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    # Check if admin is in the session
    if 'admin' in session:
        session.pop('admin', None)  # Remove admin from the session
        return jsonify({"success": True, "message": "Logged out successfully"}), 200
    else:
        return jsonify({"error": "No admin logged in"}), 400
    

# Function to get organizations from the database
def get_organizations():
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM organizations WHERE status = 'pending'"
        cursor.execute(query)
        organizations = cursor.fetchall()
        cursor.close()
        return organizations
    except MySQLdb.Error as e:
        print(f"MySQL error during fetching organizations: {e}")
        return []
    finally:
        db.close()

# API to get organizations
@app.route('/api/admin/organizations', methods=['GET'])
def admin_get_organizations():
    organizations = get_organizations()
    return jsonify(organizations), 200

# Function to update organization status
def update_organization_status(org_id, status):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "UPDATE organizations SET status = %s WHERE id = %s"
        cursor.execute(query, (status, org_id))
        db.commit()
        cursor.close()
    except MySQLdb.Error as e:
        print(f"MySQL error during updating organization status: {e}")
        return {"error": f"MySQL error: {e}"}, 500
    finally:
        db.close()
    return {"message": "Organization status updated successfully."}, 200

# API to approve organization
@app.route('/api/admin/organizations/approve/<int:org_id>', methods=['POST'])
def admin_approve_organization(org_id):
    return jsonify(update_organization_status(org_id, 'approved'))

# API to reject organization
@app.route('/api/admin/organizations/reject/<int:org_id>', methods=['POST'])
def admin_reject_organization(org_id):
    return jsonify(delete_organization(org_id))

# Function to delete the rejected orgs from database
def delete_organization(org_id):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "DELETE FROM organizations WHERE id = %s"
        cursor.execute(query, (org_id,))
        db.commit()
        cursor.close()
    except MySQLdb.Error as e:
        print(f"MySQL error during deleting organization: {e}")
        return {"error": f"MySQL error: {e}"}, 500
    finally:
        db.close()
    return {"message": "Organization deleted successfully."}, 200


# Function to get events from the database
def get_events():
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM all_events"  # Adjust the query as needed
        cursor.execute(query)
        internships = cursor.fetchall()
        cursor.close()
        return internships
    except MySQLdb.Error as e:
        print(f"MySQL error during fetching events: {e}")
        return []
    finally:
        db.close()

# API to get events
@app.route('/api/admin/managecards/events', methods=['GET'])
def admin_get_events():
    events = get_events()
    return jsonify(events), 200

# Function to get internships from the database
def get_internships():
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM all_internships"  # Adjust the query as needed
        cursor.execute(query)
        internships = cursor.fetchall()
        cursor.close()
        return internships
    except MySQLdb.Error as e:
        print(f"MySQL error during fetching internships: {e}")
        return []
    finally:
        db.close()

# API to get internships
@app.route('/api/admin/managecards/internships', methods=['GET'])
def admin_get_internships():
    internships = get_internships()
    return jsonify(internships), 200


# Function to get training events from the database
def get_trainings():
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM all_courses"  # Adjust the query as needed
        cursor.execute(query)
        training_events = cursor.fetchall()
        cursor.close()
        return training_events
    except MySQLdb.Error as e:
        print(f"MySQL error during fetching trainings: {e}")
        return []
    finally:
        db.close()

# API to get training events
@app.route('/api/admin/managecards/training', methods=['GET'])
def admin_get_trainings():
    training_events = get_trainings()
    return jsonify(training_events), 200


# Function to get volunteering opportunities from the database
def get_volunteering():
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM all_volunteering"  # Adjust the query as needed
        cursor.execute(query)
        volunteering = cursor.fetchall()
        cursor.close()
        return volunteering
    except MySQLdb.Error as e:
        print(f"MySQL error during fetching volunteering opportunities: {e}")
        return []
    finally:
        db.close()

# API to get volunteering opportunities
@app.route('/api/admin/managecards/volunteering', methods=['GET'])
def admin_get_volunteering():
    volunteering = get_volunteering()
    return jsonify(volunteering), 200

# Example function to update an event in the database
def update_event(event_data):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = """UPDATE all_events SET source=%s, organizer=%s, title=%s, duration=%s, location=%s, image_url=%s,
         email=%s, phone_number=%s, office_address=%s, company_logo=%s WHERE id=%s"""
        cursor.execute(query, (
            event_data['source'],
            event_data['organizer'],
            event_data['title'],
            event_data['duration'],
            event_data['location'],
            event_data['image_url'],
            event_data['email'],
            event_data['phone_number'],
            event_data['office_address'],
            event_data['company_logo'],
            event_data['id']
        ))
        db.commit()
        cursor.close()
        return True
    except MySQLdb.Error as e:
        print(f"MySQL error during updating event: {e}")
        return False
    finally:
        db.close()

# API to update an event
@app.route('/api/admin/managecards/events/<int:event_id>', methods=['PUT'])
def admin_update_event(event_id):
    event_data = request.json
    event_data['id'] = event_id  # Add the event ID to the data
    if update_event(event_data):
        return jsonify({'message': 'Event updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update event'}), 500


def update_internship(internship_data):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        # Convert the posted_date to the correct format if it exists
        if 'posted_date' in internship_data:
            try:
                # Assuming posted_date is a string
                internship_data['posted_date'] = datetime.strptime(internship_data['posted_date'], "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d")
            except ValueError as ve:
                print(f"Date formatting error: {ve}")

        query = """UPDATE all_internships SET source=%s, title=%s, description=%s, posted_date=%s, salary=%s,
                   duration=%s, location=%s, image_url=%s, email=%s, phone_number=%s, office_address=%s,
                   company_logo=%s WHERE id=%s"""
        cursor.execute(query, (
            internship_data['source'],
            internship_data['title'],
            internship_data['description'],
            internship_data['posted_date'],  # Now correctly formatted
            internship_data['salary'],
            internship_data['duration'],
            internship_data['location'],
            internship_data['image_url'],
            internship_data['email'],
            internship_data['phone_number'],
            internship_data['office_address'],
            internship_data['company_logo'],
            internship_data['id']
        ))
        db.commit()
        cursor.close()
        return True
    except MySQLdb.Error as e:
        print(f"MySQL error during updating internship: {e}")
        return False
    finally:
        db.close()


@app.route('/api/admin/managecards/internships/<int:internship_id>', methods=['PUT'])
def admin_update_internship(internship_id):
    internship_data = request.json
    internship_data['id'] = internship_id  # Add the internship ID to the data
    if update_internship(internship_data):
        return jsonify({'message': 'Internship updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update internship'}), 500

def update_volunteering(volunteering_data):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = """UPDATE volunteering SET source=%s, title=%s, duration=%s, cause=%s, age_group=%s,
                   image_url=%s, email=%s, phone_number=%s, office_address=%s, company_logo=%s WHERE id=%s"""
        cursor.execute(query, (
            volunteering_data['source'],
            volunteering_data['title'],
            volunteering_data['duration'],
            volunteering_data['cause'],
            volunteering_data['age_group'],
            volunteering_data['image_url'],
            volunteering_data['email'],
            volunteering_data['phone_number'],
            volunteering_data['office_address'],
            volunteering_data['company_logo'],
            volunteering_data['id']
        ))
        db.commit()
        cursor.close()
        return True
    except MySQLdb.Error as e:
        print(f"MySQL error during updating volunteering: {e}")
        return False
    finally:
        db.close()

@app.route('/api/admin/managecards/volunteering/<int:volunteering_id>', methods=['PUT'])
def admin_update_volunteering(volunteering_id):
    volunteering_data = request.json
    volunteering_data['id'] = volunteering_id  # Add the volunteering ID to the data
    if update_volunteering(volunteering_data):
        return jsonify({'message': 'Volunteering updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update volunteering'}), 500

def update_training(training_data):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        
        # Convert 'N/A' to None or 0 for database update
        students_value = training_data['students']
        if students_value == 'N/A':
            students_value = 0  # or use 0 if you prefer
        
        query = """UPDATE all_courses SET source=%s, title=%s, trainer=%s, description=%s, price=%s,
                   students=%s, rating=%s, image_url=%s, duration=%s WHERE id=%s"""
        cursor.execute(query, (
            training_data['source'],
            training_data['title'],
            training_data['trainer'],
            training_data['description'],
            training_data['price'],
            students_value,  # Use the converted value here
            training_data['rating'],
            training_data['image_url'],
            training_data['duration'],
            training_data['id']
        ))
        db.commit()
        cursor.close()
        return True
    except MySQLdb.Error as e:
        print(f"MySQL error during updating training: {e}")
        return False
    finally:
        db.close()


@app.route('/api/admin/managecards/training/<int:training_id>', methods=['PUT'])
def admin_update_training(training_id):
    training_data = request.json
    training_data['id'] = training_id  # Add the training ID to the data
    if update_training(training_data):
        return jsonify({'message': 'Training updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update training'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)