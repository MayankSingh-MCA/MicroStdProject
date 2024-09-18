// API Configuration
const baseUrl = "http://api.login2explore.com:5577";
const irlUrl = "/api/irl";
const imlUrl = "/api/iml";
const token = "90932011|-31949225345156437|90962650"; // Replace with your actual token
const dbName = "studentDB";
const relName = "studentData";

// Form Initialization
$(document).ready(function () {
    $("#rollNo").focus();
    $("#rollNo").on("blur", function () {
        checkStudent();
    });

    $("#fullName").on("blur", function () {
        $("#class").prop("disabled", false).focus();
    });

    $("#class").on("blur", function () {
        $("#birthDate").prop("disabled", false).focus();
    });

    $("#birthDate").on("blur", function () {
        $("#address").prop("disabled", false).focus();
    });

    $("#address").on("blur", function () {
        $("#enrollmentDate").prop("disabled", false).focus();
    });

    $("#enrollmentDate").on("blur", function () {
        $("#saveBtn").prop("disabled", false);
        $("#updateBtn").prop("disabled", false);
    });
});

// Function to check if student exists in the database
function checkStudent() {
    const rollNo = $("#rollNo").val();
    if (rollNo) {
        $.post(baseUrl + irlUrl, {
            token: token,
            cmd: "GET_BY_KEY",
            dbName: dbName,
            rel: relName,
            jsonStr: JSON.stringify({ "rollNo": rollNo })
        }, function (response) {
            if (response && response.jsonStr) {
                const data = JSON.parse(response.jsonStr);
                populateForm(data);
            } else {
                resetFormFields();
                $("#saveBtn").prop("disabled", false);
                $("#updateBtn").prop("disabled", true);
            }
        });
    }
}

// Function to populate form fields when student data is found
function populateForm(data) {
    $("#fullName").val(data.fullName).prop("disabled", false);
    $("#class").val(data.class).prop("disabled", false);
    $("#birthDate").val(data.birthDate).prop("disabled", false);
    $("#address").val(data.address).prop("disabled", false);
    $("#enrollmentDate").val(data.enrollmentDate).prop("disabled", false);
    $("#rollNo").prop("disabled", true);
    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", false);
}

// Function to get form data
function getFormData() {
    const rollNo = $("#rollNo").val();
    const fullName = $("#fullName").val();
    const classValue = $("#class").val();
    const birthDate = $("#birthDate").val();
    const address = $("#address").val();
    const enrollmentDate = $("#enrollmentDate").val();

    if (!rollNo || !fullName || !classValue || !birthDate || !address || !enrollmentDate) {
        alert("All fields are required!");
        return null;
    }

    return {
        rollNo: rollNo,
        fullName: fullName,
        class: classValue,
        birthDate: birthDate,
        address: address,
        enrollmentDate: enrollmentDate
    };
}

// Function to save student data to the database
function saveStudent() {
    const studentData = getFormData();
    if (studentData) {
        $.post(baseUrl + imlUrl, {
            token: token,
            cmd: "PUT",
            dbName: dbName,
            rel: relName,
            jsonStr: JSON.stringify(studentData)
        }, function () {
            alert("Student data saved successfully!");
            resetForm();
        });
    }
}

// Function to update existing student data
function updateStudent() {
    const studentData = getFormData();
    if (studentData) {
        $.post(baseUrl + imlUrl, {
            token: token,
            cmd: "UPDATE",
            dbName: dbName,
            rel: relName,
            jsonStr: JSON.stringify(studentData)
        }, function () {
            alert("Student data updated successfully!");
            resetForm();
        });
    }
}

// Function to reset form fields
function resetFormFields() {
    $("#fullName").prop("disabled", true).val('');
    $("#class").prop("disabled", true).val('');
    $("#birthDate").prop("disabled", true).val('');
    $("#address").prop("disabled", true).val('');
    $("#enrollmentDate").prop("disabled", true).val('');
}

// Function to reset the entire form
function resetForm() {
    $("#studentForm")[0].reset();
    $("#rollNo").prop("disabled", false).focus();
    resetFormFields();
    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", true);
}
