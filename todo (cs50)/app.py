from datetime import datetime, timezone
from flask import flash, Flask, render_template, request, redirect, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required

app = Flask(__name__)

# Configure session to be non-permanent and use filesystem for session storage
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Setup the database URI and disable track modifications
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///todo.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User model to store user information
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def __repr__(self) -> str:
        return f"<User {self.username}>"


# Todo model to store user tasks
class Todo(db.Model):
    sno = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(250), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    user = db.relationship("User", backref="todos")

    def __repr__(self) -> str:
        return f"{self.sno} - {self.title}"


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Route for the home page displaying all tasks for logged-in users
@app.route('/')
@login_required
def index():
    # Get the logged-in user's ID
    user_id = session.get('user_id')  

    # Retrieve all todos for the logged-in user from the database
    allTodo = Todo.query.filter_by(user_id=user_id).all()

    return render_template('index.html', todos=allTodo)


# Route for the "About" page
@app.route('/about')
@login_required
def about():
    return render_template('about.html')


# Route to add a new task
@app.route('/add', methods=['GET', 'POST'])
@login_required
def add():
    if request.method == 'POST':
        # Get the title of the new task
        title = request.form.get('title')

        # Get the category of the new task
        category = request.form.get('category')

        # Ensure title and category are provided
        if not title or not category:
            return apology("missing title and/or category", 400)
        
        # Add a new todo item and associate it with the logged-in user
        user_id = session.get("user_id")
        todo = Todo(title=title, category=category, user_id=user_id)

        # Add the todo item to the database
        db.session.add(todo)
        db.session.commit()

        # Flash a success message
        flash('Todo item created successfully!', 'success')

        # Redirect to the home page
        return redirect('/')

    return render_template('add.html')


# Route to change password for logged-in user
@app.route('/password', methods=['GET', 'POST'])
@login_required
def change_password():
    """Change Password."""
    user_id = session.get('user_id')

    user = User.query.filter_by(id=user_id).first()

    if not user:
        return apology("user not found", 404)

    if request.method == "POST":
        old_password = request.form.get("old_password")
        if not old_password:
            return apology("must provide old password", 400)

        new_password = request.form.get("new_password")
        confirmation = request.form.get("confirmation")
        if not new_password or not confirmation:
            return apology("must provide password", 400)

        if new_password != confirmation:
            return apology("passwords do not match", 400)

        if not check_password_hash(user.password_hash, old_password):
            return apology("incorrect old password", 400)

        # Hash the new password and update in the database
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        return redirect("/login")

    else:
        return render_template('password.html')
    

# Route to delete a todo item
@app.route('/delete/<int:sno>')
@login_required
def delete(sno):
    # Retrieve the task by its 'sno'
    todo = Todo.query.filter_by(sno=sno).first()
    
    # Delete the todo from the database
    db.session.delete(todo)
    db.session.commit()

    # Flash a success message
    flash('Todo item deleted successfully!', 'success')
    
    return redirect("/")


# Route for user login
@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Clear any existing session data (i.e., logout the user)
    session.clear()

    if request.method == "POST":
        username = request.form.get("username")
        if not username:
            return apology("must provide username", 400)

        password = request.form.get("password")
        if not password:
            return apology("must provide password", 400)

        # Check if the user exists in the database
        user = User.query.filter_by(username=username).first()

        # Verify the provided password
        if not user or not check_password_hash(user.password_hash, password):
            return apology("invalid username and/or password", 403)

        # Store the user's ID in the session
        session["user_id"] = user.id

        # Flash a success message
        flash('Successfully Logged In!', 'success')

        return redirect("/") 
    else:
        return render_template("login.html")


# Route to log the user out
@app.route("/logout")
def logout():
    """Log user out"""

    # Clear the session data (logout)
    session.clear()

    # Redirect to the login page
    return redirect("/")


# Route for user registration
@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "POST":
        username = request.form.get("username")
        if not username:
            return apology("must provide username", 400)

        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        if not password or not confirmation:
            return apology("must provide password", 400)

        if password != confirmation:
            return apology("passwords do not match", 400)

        try:
            # Hash the password
            hash_password = generate_password_hash(password) 

            # Create new user and save to the database
            user = User(username=username, password_hash=hash_password)
            db.session.add(user)
            db.session.commit()

            # Log the user in automatically after successful registration
            session["user_id"] = user.id

            return redirect("/login")

        except Exception:
            return apology(f"username already exists", 400)

    else:
        return render_template("register.html")


# Route to update a todo item
@app.route('/update/<int:sno>', methods=['GET', 'POST'])
@login_required
def update(sno):
    if request.method == 'POST':
        title = request.form.get('title')
        category = request.form.get('category')
        
        # Retrieve the todo item to be updated
        todo = Todo.query.filter_by(sno=sno).first()
        todo.title = title 
        todo.category = category

        # Save changes to the database
        db.session.add(todo)  
        db.session.commit()

        flash("Todo updated successfully!", 'success')
        return redirect("/")
    
     # Get todo details for the update form
    todo = Todo.query.filter_by(sno=sno).first() 
    return render_template('update.html', todo=todo)


# Run the Flask app in debug mode
if __name__ == '__main__':
    app.run(debug=True)
