<?php
$servername = "localhost";
$username = "root";
$password = "Welcome@123"; // Replace with your MySQL password
$dbname = "teacher_portal";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'login') {
    $user = $conn->real_escape_string($_POST['username']);
    $pass = $conn->real_escape_string($_POST['password']);

    // Hash the password if you're storing it hashed in the database
    $sql = "SELECT * FROM teachers WHERE username='$user' AND password='$pass'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
}

// Handle student listing
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['action']) && $_GET['action'] == 'getStudents') {
    $sql = "SELECT * FROM students";
    $result = $conn->query($sql);
    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
    echo json_encode($students);
}

// Handle adding new students
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'addStudent') {
    $name = $conn->real_escape_string($_POST['name']);
    $subject = $conn->real_escape_string($_POST['subject']);
    $marks = intval($_POST['marks']); // Convert to integer to prevent SQL injection

    // Check if student already exists
    $sql = "SELECT marks FROM students WHERE name='$name' AND subject='$subject'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Update marks if student exists
        $row = $result->fetch_assoc();
        $newMarks = $row['marks'] + $marks;

        $sql = "UPDATE students SET marks='$newMarks' WHERE name='$name' AND subject='$subject'";
    } else {
        // Insert new student record
        $sql = "INSERT INTO students (name, subject, marks) VALUES ('$name', '$subject', '$marks')";
    }

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}

// Handle deleting a student
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'deleteStudent') {
    $id = intval($_POST['id']); // Convert to integer to prevent SQL injection

    $sql = "DELETE FROM students WHERE id='$id'";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}
// Handle editing a student
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'editStudent') {
    $id = intval($_POST['id']);
    $name = $conn->real_escape_string($_POST['name']);
    $subject = $conn->real_escape_string($_POST['subject']);
    $marks = intval($_POST['marks']); // Convert to integer

    // Update student record
    $sql = "UPDATE students SET name='$name', subject='$subject', marks='$marks' WHERE id='$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}

// Handle fetching a specific student
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['action']) && $_GET['action'] == 'getStudent' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $sql = "SELECT * FROM students WHERE id='$id'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(null); // No student found
    }
}



$conn->close();
?>
