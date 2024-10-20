function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('../backend/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'login',
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('student-list').style.display = 'block';
            document.getElementById('login-title').style.display = 'none'; // Hide heading after login
            
            // Change the border container color
            document.querySelector('.border-container').classList.add('student-portal');
            
            loadStudents();
        } else {
            document.getElementById('login-message').innerText = data.message;
        }
    });
}

function loadStudents() {
    fetch('../backend/index.php?action=getStudents')
    .then(response => response.json())
    .then(students => {
        const table = document.getElementById('students-table');
        table.innerHTML = `<tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Actions</th>
        </tr>`; // Reset table content
        
        students.forEach(student => {
            const row = table.insertRow();
            row.insertCell(0).innerText = student.name;
            row.insertCell(1).innerText = student.subject;
            row.insertCell(2).innerText = student.marks;
            row.insertCell(3).innerHTML = `
                <div class="dropdown">
                    <span class="dropdown-toggle">&#9660;</span> <!-- Down arrow in a circle-->
                    <div class="dropdown-content">
                        <span onclick="editStudent(${student.id})">Edit</span>
                        <span onclick="deleteStudent(${student.id})">Delete</span>
                    </div>
                </div>
            `;
        });
    });
}

function showHome() {
    document.getElementById('student-list').style.display = 'block';
    loadStudents(); // Load students when navigating home
}

function logout() {
    // Reset login fields and hide student list
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('student-list').style.display = 'none';
    document.getElementById('login-title').style.display = 'block'; // Show heading when logging out
    
    // Revert the border container color
    document.querySelector('.border-container').classList.remove('student-portal');
    
    // Clear login fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-message').innerText = '';
}

function showAddStudentModal() {
    document.getElementById('add-student-modal').style.display = 'flex';
}

function closeAddStudentModal() {
    document.getElementById('add-student-modal').style.display = 'none';
}

function addStudent() {
    const name = document.getElementById('student-name').value;
    const subject = document.getElementById('student-subject').value;
    const marks = document.getElementById('student-marks').value;
    
    fetch('../backend/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'addStudent',
            name: name,
            subject: subject,
            marks: marks
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            closeAddStudentModal();
            loadStudents(); // Reload student list
        } else {
            alert(data.message);
        }
    });
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        fetch('../backend/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'deleteStudent',
                id: id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                loadStudents(); // Reload student list
            } else {
                alert(data.message);
            }
        });
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash'); // Change icon to eye-slash when visible
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye'); // Change icon back to eye when hidden
    }
}

// Show the Add Student modal
function showAddStudentModal() {
    document.getElementById('add-student-modal').style.display = 'flex';
}

// Hide the Add Student modal
function closeAddStudentModal() {
    document.getElementById('add-student-modal').style.display = 'none';
}
