from flask import Flask, jsonify, abort, redirect, request, session, render_template
from flask_cors import CORS
import MySQLdb
import bcrypt
from datetime import datetime
import secrets


## Integrate the setup_db.py to run each time the app starts 
from setup_db import create_database

create_database()


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
    'passwd': '12345678',
    'host': 'localhost',
    'port': 3306,
    'db': 'pye_data'
}

def fetch_courses_from_database(page=1, limit=10):
    courses = []
    total = 0
    offset = (page - 1) * limit
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        # Query to get the total count of records
        total_query = "SELECT COUNT(*) AS total FROM all_courses"
        cursor.execute(total_query)
        total = cursor.fetchone()['total']

        # Query to get paginated results
        query = """
        SELECT id, source, title, trainer, description, price, students, rating, image_url, duration, email, phone_number, office_address, company_logo, apply_link 
        FROM all_courses
        LIMIT %s OFFSET %s
        """
        cursor.execute(query, (limit, offset))
        courses = cursor.fetchall()
    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")

    # Return both the paginated data and the total count
    return {"data": courses, "total": total, "page": page, "limit": limit}


def fetch_course_by_id(course_id):
    course = None
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = """
        SELECT id, source, title, trainer, description, price, students, rating, image_url, duration,label, email, phone_number, office_address, company_logo, apply_link
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

def fetch_internships_from_database(page=1, limit=10):
    internships = []
    total = 0
    offset = (page - 1) * limit
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        # Query to get the total count of records
        total_query = "SELECT COUNT(*) AS total FROM all_internships"
        cursor.execute(total_query)
        total = cursor.fetchone()['total']

        # Query to get paginated results
        query = """
        SELECT id, source, title, description, posted_date, salary, duration, location, image_url, email, phone_number, office_address, company_logo, apply_link
        FROM all_internships
        LIMIT %s OFFSET %s
        """
        cursor.execute(query, (limit, offset))
        internships = cursor.fetchall()
    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")

    # Return both the paginated data and the total count
    return {"data": internships, "total": total, "page": page, "limit": limit}


def fetch_internship_by_id(internship_id):
    internship = None
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = """
         SELECT id, source, title, description, posted_date, salary, duration,label, location, image_url, email, phone_number, office_address, company_logo, apply_link
        FROM all_internships
        WHERE id = %s
        """
        cursor.execute(query, (internship_id,))
        internship = cursor.fetchone()
    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")
    return internship

@app.route('/api/internships', methods=['GET'])
def get_internships():
    internships = fetch_internships_from_database()
    return jsonify(internships)

@app.route('/api/internships/<int:internship_id>', methods=['GET'])
def get_internship(internship_id):
    internship = fetch_internship_by_id(internship_id)
    if internship is None:
        abort(404, description="Internship not found")
    return jsonify(internship)

def fetch_events_from_database(page=1, limit=10):
    events = []
    total = 0
    offset = (page - 1) * limit
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        # Query to get the total count of records
        total_query = "SELECT COUNT(*) AS total FROM all_events"
        cursor.execute(total_query)
        total = cursor.fetchone()['total']

        # Query to get paginated results
        query = """
        SELECT id, source, organizer, title, duration, location, image_url, email, phone_number, office_address, company_logo, apply_link
        FROM all_events
        LIMIT %s OFFSET %s
        """
        cursor.execute(query, (limit, offset))
        events = cursor.fetchall()
    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")

    # Return both the paginated data and the total count
    return {"data": events, "total": total, "page": page, "limit": limit}


def fetch_event_by_id(event_id):
    event = None
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = """
        SELECT id, source, organizer, title, duration, label,location, image_url, email, phone_number, office_address, company_logo, apply_link
        FROM all_events
        WHERE id = %s
        """
        cursor.execute(query, (event_id,))
        event = cursor.fetchone()
    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")
    return event

@app.route('/api/events', methods=['GET'])
def get_events():
    events = fetch_events_from_database()
    return jsonify(events)

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = fetch_event_by_id(event_id)
    if event is None:
        abort(404, description="Event not found")
    return jsonify(event)

def fetch_volunteering_from_database(page=1, limit=10):
    volunteering_opportunities = []
    total = 0
    offset = (page - 1) * limit
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        # Query to get the total count of records
        total_query = "SELECT COUNT(*) AS total FROM all_volunteering"
        cursor.execute(total_query)
        total = cursor.fetchone()['total']

        # Query to get paginated results
        query = """
        SELECT id, source, title, duration, cause, age_group, image_url, email, phone_number, office_address, company_logo, apply_link
        FROM all_volunteering
        LIMIT %s OFFSET %s
        """
        cursor.execute(query, (limit, offset))
        volunteering_opportunities = cursor.fetchall()
    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")

    # Return both the paginated data and the total count
    return {"data": volunteering_opportunities, "total": total, "page": page, "limit": limit}


def fetch_volunteering_by_id(volunteering_id):
    volunteering = None
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = """
        SELECT id, source, title, duration,label, cause, age_group, image_url, email, phone_number, office_address, company_logo, apply_link
        FROM all_volunteering
        WHERE id = %s
        """
        cursor.execute(query, (volunteering_id,))
        volunteering = cursor.fetchone()
    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
    finally:
        try:
            cursor.close()
            db.close()
        except MySQLdb.Error as e:
            print(f"Error closing connection: {e}")
    return volunteering

@app.route('/api/volunteering', methods=['GET'])
def get_volunteering():
    volunteering_opportunities = fetch_volunteering_from_database()
    return jsonify(volunteering_opportunities)

@app.route('/api/volunteering/<int:volunteering_id>', methods=['GET'])
def get_volunteering_by_id(volunteering_id):
    volunteering = fetch_volunteering_by_id(volunteering_id)
    if volunteering is None:
        abort(404, description="Volunteering opportunity not found")
    return jsonify(volunteering)


# --- Helper Functions ---
def fetch_unique_labels():
    labels = set()  # Using a set to avoid duplicates

    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        # List of tables to query
        tables = ['all_courses', 'all_events', 'all_internships', 'all_volunteering']

        for table in tables:
            query = f"SELECT DISTINCT label FROM {table} WHERE label IS NOT NULL"
            cursor.execute(query)
            table_labels = [row[0] for row in cursor.fetchall()]
            labels.update(table_labels)  # Add to the set to keep unique values

    except MySQLdb.Error as e:
        print(f"Database error: {e}")
    finally:
        cursor.close()
        db.close()

    return list(labels)  # Convert the set back to a list for JSON serialization

# API endpoint to get unique labels (preferences) for the frontend
@app.route('/api/labels', methods=['GET'])
def get_labels():
    labels = fetch_unique_labels()
    return jsonify(labels=labels), 200

# Add participant with preferences
def add_participant(username, email, phone, password, preferences):
    # Fetch valid labels for validation
    valid_labels = fetch_unique_labels()
    
    # Filter preferences to ensure only valid labels are stored
    valid_preferences = [pref for pref in preferences if pref in valid_labels]

    # Convert preferences list to a string if needed
    preferences_str = ', '.join(valid_preferences)

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

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

# Add organization
def add_organization(name_of_org, email_of_org, phone_number_of_org, password_of_org, url_of_org, description_of_org):
    # Hash the password
    hashed_password = bcrypt.hashpw(password_of_org.encode('utf-8'), bcrypt.gensalt())
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = """
            INSERT INTO organizations (name_of_org, email_of_org, phone_number_of_org, password_of_org, url_of_org, description_of_org)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name_of_org, email_of_org, phone_number_of_org, hashed_password, url_of_org, description_of_org))
        db.commit()
        cursor.close()
    except MySQLdb.Error as e:
        print(f"MySQL error during organization creation: {e}")
        return jsonify({"error": f"MySQL error: {e}"}), 500
    finally:
        db.close()
    return jsonify({"message": "Organization created successfully."}), 201

# --- Signup Route ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print(f"Signup data received: {data}")  # Log the incoming data for debugging

    email = data.get('email')  # Get the email for validation

    # Check if the user is banned before proceeding with signup
    if is_email_banned(email):
        return jsonify({"error": "You cannot register with a banned email."}), 403

    # Check if the signup is for an organization
    if 'isOrg' in data and data['isOrg']:
        # Organization signup
        required_fields = ['name_of_org', 'email_of_org', 'phone_number_of_org', 'password_of_org', 'url_of_org', 'description_of_org']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field {field} for organization signup."}), 400
            
     # Check if the organization already exists and if it has been banned
        if is_email_banned_org(data['email_of_org']):
            return jsonify({"error": "This organization is banned and cannot sign up again."}), 403
        

        return add_organization(
            data['name_of_org'], 
            data['email_of_org'], 
            data['phone_number_of_org'], 
            data['password_of_org'], 
            data['url_of_org'], 
            data['description_of_org']
        )

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

# Helper function to check if email is banned
def is_email_banned(email):
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        
        # Check if the user is banned
        query = "SELECT status FROM participants WHERE email = %s"
        cursor.execute(query, [email])
        user = cursor.fetchone()
        
        cursor.close()
        db.close()

        return user and user['status'] == 'banned'
    except MySQLdb.Error as e:
        print(f"MySQL error during email ban check: {e}")
        return False

# Helper function to check if organization email is banned
def is_email_banned_org(email_of_org):
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        
        # Check if the organization is banned
        query = "SELECT status FROM organizations WHERE email_of_org = %s"
        cursor.execute(query, [email_of_org])
        org = cursor.fetchone()
        
        cursor.close()
        db.close()

        return org and org['status'] == 'banned'
    except MySQLdb.Error as e:
        print(f"MySQL error during organization email ban check: {e}")
        return False

def check_participant(email, password):
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        
        # Retrieve the participant's data
        query = "SELECT * FROM participants WHERE email = %s"
        cursor.execute(query, [email])
        user = cursor.fetchone()
        
        cursor.close()
        db.close()

        # Check if user exists and if password matches
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            # Save user preferences and other data in session
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['email'] = user['email']
            session['phone'] = user['phone']
            session['preferences'] = user['preferences'].split(', ') if user['preferences'] else []

            return user  # Return all user data as needed
        return None
    except MySQLdb.Error as e:
        print(f"MySQL error during participant login: {e}")
        return None
def check_organization(email_of_org, password_of_org):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        query = "SELECT * FROM organizations WHERE email_of_org = %s"
        cursor.execute(query, [email_of_org])
        org = cursor.fetchone()
        cursor.close()
        db.close()

        if not org:
            return {"success": False, "message": "Organization not found.", "status": "not_found"}, 404

        # Check if the password matches
        if bcrypt.checkpw(password_of_org.encode('utf-8'), org['password_of_org'].encode('utf-8')):
            # Check the organization's status and add a consistent response structure
            if org['status'] == 'banned':
                return {"success": False, "message": "Your organization account has been banned. Please contact support.", "status": "banned"}, 403
            elif org['status'] == 'pending':
                return {"success": False, "message": "Organization approval is pending.", "status": "pending"}, 403
            elif org['status'] == 'rejected':
                return {"success": False, "message": "Organization has been rejected by the admin.", "status": "rejected"}, 403
            elif org['status'] == 'approved':
                return {"success": True, "message": "Login successful.", "status": "approved"}, 200

        # If password does not match, return an error with a clear structure
        return {"success": False, "message": "Invalid credentials.", "status": "invalid_credentials"}, 401

    except MySQLdb.Error as e:
        print(f"MySQL error during organization login: {e}")
        return {"success": False, "message": "Database error.", "status": "error"}, 500




# --- Login Route ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    is_org = data.get('isOrg', False)

    print(f"Login attempt for {'Organization' if is_org else 'Participant'} with email: {email}")

    if is_org:
        # Check organization status and credentials
        response, status_code = check_organization(email, password)
        
        # Handle the response structure with a safer check
        org_status = response.get('status')
        if org_status == 'banned':
            return jsonify({"success": False, "message": "Your organization account has been banned. Please contact support."}), 403
        elif org_status == 'approved':
            session['user_type'] = 'organization'
            session['user_email'] = email
            return jsonify(response), status_code
        
        return jsonify(response), status_code  # Handle invalid credentials

    else:
        user = check_participant(email, password)
        if user:
            if user.get('status') == 'banned':
                return jsonify({"success": False, "message": "Your account has been banned. Please contact support."}), 403
            
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
        events = cursor.fetchall()
        cursor.close()
        return events
    except MySQLdb.Error as e:
        print(f"MySQL error during fetching events: {e}")
        return []
    finally:
        db.close()

# API to get events
@app.route('/api/admin/managecards/events', methods=['GET'])
def admin_get_events():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    events = fetch_events_from_database(page, limit)
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
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    internships = fetch_internships_from_database(page, limit)
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
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    training_events = fetch_courses_from_database(page, limit)
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
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    volunteering = fetch_volunteering_from_database(page,limit)
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


def fetch_data_from_table(table_name, preferences):
    data = []
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        # If preferences exist, filter the query
        if preferences:
            placeholders = ', '.join(['%s'] * len(preferences))
            query = f"SELECT * FROM {table_name} WHERE label IN ({placeholders})"
            cursor.execute(query, preferences)
        else:
            # Return an empty result if no preferences are set
            return []

        data = cursor.fetchall()
    except MySQLdb.Error as e:
        print(f"MySQL error in {table_name}: {e}")
    finally:
        cursor.close()
        db.close()
    return data

# API to fetch all user data based on preferences
@app.route('/api/user/all_data', methods=['GET'])
def get_all_user_data():
    # Retrieve user preferences from the session
    preferences = session.get('preferences', [])
    
    # Fetch data from each table based on preferences
    courses = fetch_data_from_table('all_courses', preferences)
    internships = fetch_data_from_table('all_internships', preferences)
    events = fetch_data_from_table('all_events', preferences)
    volunteering = fetch_data_from_table('all_volunteering', preferences)

    # Combine the results into one JSON response
    response_data = {
        "courses": courses,
        "internships": internships,
        "events": events,
        "volunteering": volunteering
    }
    
    return jsonify(response_data), 200


## API for the REVIEWS
@app.route('/api/submit_review', methods=['POST'])
def submit_review():
    if 'user_email' not in session:
        return jsonify({"error": "Unauthorized. Please log in."}), 401

    data = request.get_json()
    review_text = data.get("review")
    user_email = session['user_email']

    if not review_text:
        return jsonify({"error": "Review text is required."}), 400

    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        
        # Update the review field for the participant
        query = """
        UPDATE participants
        SET review = %s
        WHERE email = %s
        """
        cursor.execute(query, (review_text, user_email))
        db.commit()
        cursor.close()
    except MySQLdb.Error as e:
        print(f"MySQL error during review submission: {e}")
        return jsonify({"error": f"MySQL error: {e}"}), 500
    finally:
        db.close()

    return jsonify({"message": "Review submitted successfully."}), 201

## Retrieve Reviews
@app.route('/api/retrieve_reviews', methods=['GET'])
def get_reviews():
    try:
        # Connect to the database
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        
        # Query to get usernames and reviews
        query = "SELECT username, review FROM participants WHERE review IS NOT NULL;"
        cursor.execute(query)
        reviews = cursor.fetchall()
        
        # Format the reviews as a list of dictionaries
        reviews_list = [{"username": row[0], "review": row[1]} for row in reviews]
        return jsonify(reviews_list), 200
    except MySQLdb.Error as e:
        print(f"MySQL error during fetching reviews: {e}")
        return jsonify({"error": f"MySQL error: {e}"}), 500
    
## Delete Reviews
@app.route('/api/delete_review', methods=['DELETE'])
def delete_review():
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username is required to delete review."}), 400

    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        # Delete query
        delete_query = "UPDATE participants SET review = NULL WHERE username = %s"
        cursor.execute(delete_query, (username,))
        db.commit()

        cursor.close()
    except MySQLdb.Error as e:
        print(f"MySQL error during review deletion: {e}")
        return jsonify({"error": f"MySQL error: {e}"}), 500
    finally:
        db.close()

    return jsonify({"message": "Review deleted successfully."}), 200


# Function to get users from the database
def get_users():
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM participants"  # Adjust the status filter if needed
        cursor.execute(query)
        users = cursor.fetchall()
        cursor.close()
        return users
    except MySQLdb.Error as e:
        print(f"MySQL error during fetching users: {e}")
        return []
    finally:
        db.close()

# API to get users
@app.route('/api/admin/users', methods=['GET'])
def admin_get_users():
    users = get_users()
    return jsonify(users), 200


@app.route('/api/admin/users/delete/<int:user_id>', methods=['POST'])
def admin_delete_user(user_id):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "DELETE FROM participants WHERE id = %s"
        cursor.execute(query, (user_id,))
        db.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except MySQLdb.Error as e:
        print(f"MySQL error during deleting user: {e}")
        return jsonify({'error': 'Failed to delete user'}), 500
    finally:
        cursor.close()
        db.close()


@app.route('/api/admin/users/ban/<int:user_id>', methods=['POST'])
def ban_user(user_id):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "UPDATE participants SET status = 'banned' WHERE id = %s"
        cursor.execute(query, (user_id,))
        
        # Check if any rows were updated
        if cursor.rowcount == 0:
            return jsonify({"message": "User not found."}), 404
        
        db.commit()
        cursor.close()
        return jsonify({"message": "User banned successfully."}), 200
    except MySQLdb.Error as e:
        print(f"MySQL error during banning user: {e}")  # Log error details
        return jsonify({"message": "Failed to ban user.", "error": str(e)}), 500
    finally:
        if db:
            db.close()

@app.route('/api/admin/organizations/all', methods=['GET'])
def get_all_organizations():
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM organizations WHERE status='approved"  # Fetch all organizations
        cursor.execute(query)
        organizations = cursor.fetchall()
        cursor.close()
        return jsonify(organizations), 200
    except MySQLdb.Error as e:
        print(f"MySQL error during fetching organizations: {e}")
        return jsonify([]), 500
    finally:
        if db:
            db.close()


@app.route('/api/admin/organizations/delete/<int:org_id>', methods=['POST'])
def admin_delete_organization(org_id):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "DELETE FROM organizations WHERE id = %s"
        cursor.execute(query, (org_id,))
        db.commit()
        return jsonify({'message': 'Organization deleted successfully'}), 200
    except MySQLdb.Error as e:
        print(f"MySQL error during deleting organization: {e}")
        return jsonify({'error': 'Failed to delete organization'}), 500
    finally:
        cursor.close()
        db.close()


@app.route('/api/admin/organizations/ban/<int:org_id>', methods=['POST'])
def ban_organization(org_id):
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "UPDATE organizations SET status = 'banned' WHERE id = %s"
        cursor.execute(query, (org_id,))
        
        if cursor.rowcount == 0:
            return jsonify({"message": "Organization not found."}), 404
        
        db.commit()
        return jsonify({"message": "Organization banned successfully."}), 200
    except MySQLdb.Error as e:
        print(f"MySQL error during banning organization: {e}")
        return jsonify({"message": "Failed to ban organization.", "error": str(e)}), 500
    finally:
        if db:
            db.close()

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    if 'user_email' not in session:
        return jsonify({"error": "User not logged in"}), 401

    user_email = session['user_email']
    user_type = session['user_type']  # This could be 'participant' or 'organization'
    
    # Initialize an empty response dictionary
    user_data = {}

    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)
        
        if user_type == 'participant':
            query = "SELECT username, email, phone, preferences, status, review FROM participants WHERE email = %s"
        else:
            query = "SELECT name_of_org AS username, email_of_org AS email, phone_number_of_org AS phone, url_of_org, description_of_org, status FROM organizations WHERE email_of_org = %s"
        
        cursor.execute(query, [user_email])
        user_data = cursor.fetchone() or {}

        # Add session data if required
        if 'preferences' in session:
            user_data['preferences'] = session['preferences']
        
        cursor.close()
    except MySQLdb.Error as e:
        print(f"MySQL error during profile retrieval: {e}")
        return jsonify({"error": "Failed to retrieve user data"}), 500
    finally:
        db.close()

    return jsonify(user_data), 200

# --- User Update Route ---
@app.route('/api/user/update', methods=['PUT'])
def update_user():
    if 'user_id' not in session or 'user_type' not in session:
        return jsonify({"error": "User not logged in"}), 401

    user_id = session['user_id']
    user_type = session['user_type']
    data = request.json

    # Define allowed fields based on user type
    if user_type == 'participant':
        allowed_fields = {
            'email': 'email',
            'phone': 'phone',
            'preferences': 'preferences',
            'review': 'review',
            'username': 'username'
        }
        table_name = 'participants'
    elif user_type == 'organization':
        allowed_fields = {
            'description_of_org': 'description_of_org',
            'email': 'email_of_org',
            'phone': 'phone_number_of_org',
            'url_of_org': 'url_of_org',
            'username': 'name_of_org'
        }
        table_name = 'organizations'
    else:
        return jsonify({"error": "Invalid user type"}), 400

    # Filter data to only include allowed fields
    update_data = {allowed_fields[k]: v for k, v in data.items() if k in allowed_fields}

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    # Prepare update query
    placeholders = ', '.join(f"{key} = %s" for key in update_data.keys())
    values = list(update_data.values())
    values.append(user_id)  # Add user_id as the last parameter for WHERE clause

    query = f"UPDATE {table_name} SET {placeholders} WHERE id = %s"

    # Execute query
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        cursor.execute(query, values)
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Profile updated successfully"}), 200
    except MySQLdb.Error as e:
        print(f"MySQL error during profile update: {e}")
        return jsonify({"error": "Failed to update profile"}), 500

@app.route('/api/favorites/add', methods=['POST'])
def add_favorite():

    if 'user_id' not in session:
        print("User ID not found in session.")  # Debug statement
        return jsonify({"error": "User not logged in"}), 401

    data = request.get_json()
    card_id = data.get('card_id')
    card_type = data.get('card_type')
    user_id = session['user_id']
    
    print(f"Attempting to add favorite - User ID: {user_id}, Card ID: {card_id}, Card Type: {card_type}")  # Debug statement

    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()

        # Check if the favorite already exists
        check_query = """
        SELECT COUNT(*) FROM favorites WHERE participant_id = %s AND card_id = %s AND card_type = %s
        """
        cursor.execute(check_query, (user_id, card_id, card_type))
        (count,) = cursor.fetchone()

        if count > 0:
            print("Favorite already exists in the database")  # Debug statement
            return jsonify({"message": "Already in favorites"}), 200

        # Insert if it doesn't already exist
        query = """
        INSERT INTO favorites (participant_id, card_id, card_type) VALUES (%s, %s, %s)
        """
        cursor.execute(query, (user_id, card_id, card_type))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Added to favorites"}), 201
    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
        return jsonify({"error": "Failed to add favorite"}), 500



@app.route('/api/favorites/remove', methods=['DELETE'])
def remove_favorite():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 401

    data = request.get_json()
    card_id = data.get('card_id')
    user_id = session['user_id']

    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor()
        query = "DELETE FROM favorites WHERE participant_id = %s AND card_id = %s"
        cursor.execute(query, (user_id, card_id))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Removed from favorites"}), 200
    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
        return jsonify({"error": "Failed to remove favorite"}), 500

@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 401

    user_id = session['user_id']
    try:
        db = MySQLdb.connect(**db_params)
        cursor = db.cursor(MySQLdb.cursors.DictCursor)

        # Get the favorites for the user
        cursor.execute("SELECT card_id, card_type FROM favorites WHERE participant_id = %s", (user_id,))
        favorites = cursor.fetchall()

        detailed_favorites = []

        for fav in favorites:
            card_id = fav['card_id']
            card_type = fav['card_type']
            print(f"Fetching details for card_id {card_id} of type {card_type}")  # Debug print

            query = None
            if card_type == 'courses':
                query = "SELECT id AS card_id, title AS card_title, image_url AS card_img, duration AS card_duration, description AS card_description, price AS card_price, source AS card_source FROM all_courses WHERE id = %s"
            elif card_type == 'internships':
                query = "SELECT id AS card_id, title AS card_title, image_url AS card_img, duration AS card_duration, description AS card_description, salary AS card_price, source AS card_source FROM all_internships WHERE id = %s"
            elif card_type == 'events':
                query = "SELECT id AS card_id, title AS card_title, image_url AS card_img, duration AS card_duration, '' AS card_description, '' AS card_price, source AS card_source FROM all_events WHERE id = %s"
            elif card_type == 'volunteering':
                query = "SELECT id AS card_id, title AS card_title, image_url AS card_img, duration AS card_duration, cause AS card_description, '' AS card_price, source AS card_source FROM all_volunteering WHERE id = %s"

            if query:
                cursor.execute(query, (card_id,))
                result = cursor.fetchone()
                print("Result for current favorite:", result)  # Debug print
                if result:
                    detailed_favorites.append(result)

        cursor.close()
        db.close()
        print("Detailed Favorites List:", detailed_favorites)
        response = jsonify(detailed_favorites)
        print("JSON Response after jsonify:", response)
        return response, 200


    except MySQLdb.Error as e:
        print(f"MySQL error: {e}")
        return jsonify({"error": "Failed to fetch favorites"}), 500
   
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)