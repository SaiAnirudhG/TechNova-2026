document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("technova-registration-form");
    const pTypeRadio = document.getElementsByName("participationType");
    const teamSection = document.getElementById("team-details-section");
    const globalError = document.getElementById("global-error");
    
    // Receipt Elements
    const successReceipt = document.getElementById("success-receipt");
    const totalCountEl = document.getElementById("total-count");
    const closeReceiptBtn = document.getElementById("close-receipt-btn");

    // Mock Database to keep track of dynamic registration data
    let registrationsDb = [];
    const CLOSED_EVENTS = ["robo-wars"]; // Robo Wars is simulating closed status

    // --- Dynamic Field Toggle Configuration ---
    pTypeRadio.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "team") {
                teamSection.classList.remove("hidden");
            } else {
                teamSection.classList.add("hidden");
                clearError("team-name", "error-team-name");
                clearError("team-size", "error-team-size");
            }
        });
    });

    // --- Validation Helper Functions ---
    function setError(inputId, errorId, message) {
        const inputField = document.getElementById(inputId);
        const errorSpan = document.getElementById(errorId);
        if (inputField) inputField.classList.add("invalid-input");
        if (errorSpan) errorSpan.innerText = message;
    }

    function clearError(inputId, errorId) {
        const inputField = document.getElementById(inputId);
        const errorSpan = document.getElementById(errorId);
        if (inputField) inputField.classList.remove("invalid-input");
        if (errorSpan) errorSpan.innerText = "";
    }

    // --- Form Submission Event Listener ---
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Stop standard dispatch page reload
        
        // Hide previous error banner
        globalError.classList.add("hidden");
        globalError.innerText = "";

        // Extract and Sanitize Form Values
        const name = document.getElementById("student-name").value.trim();
        const email = document.getElementById("student-email").value.trim();
        const mobile = document.getElementById("student-mobile").value.trim();
        const regNo = document.getElementById("student-id").value.trim().toUpperCase();
        const eventSelected = document.getElementById("event-select").value;
        const pType = document.querySelector('input[name="participationType"]:checked').value;
        const teamName = document.getElementById("team-name").value.trim();
        const teamSize = parseInt(document.getElementById("team-size").value, 10);

        let isValid = true;

        // 1. Full Name Validation
        if (name === "") {
            setError("student-name", "error-name", "Name is required.");
            isValid = false;
        } else {
            clearError("student-name", "error-name");
        }

        // 2. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("student-email", "error-email", "Please enter a valid email address.");
            isValid = false;
        } else {
            clearError("student-email", "error-email");
        }

        // 3. Mobile Validation (Basic 10-digit format lookup)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            setError("student-mobile", "error-mobile", "Enter a valid 10-digit mobile number.");
            isValid = false;
        } else {
            clearError("student-mobile", "error-mobile");
        }

        // 4. Registration Number Format Validation (Ex: TECH-2026-1234)
        const regNoRegex = /^TECH-2026-[0-9]{4}$/;
        if (!regNoRegex.test(regNo)) {
            setError("student-id", "error-id", "Required format: TECH-2026-XXXX (4 digits).");
            isValid = false;
        } else {
            clearError("student-id", "error-id");
        }

        // 5. Event Selection Validation
        if (eventSelected === "") {
            setError("event-select", "error-event", "Please select an event.");
            isValid = false;
        } else if (CLOSED_EVENTS.includes(eventSelected)) {
            // 6. Closed Event Restriction
            setError("event-select", "error-event", "Registration closed. This event is full!");
            isValid = false;
        } else {
            clearError("event-select", "error-event");
        }

        // 7. Team Details Validation (Conditional execution)
        if (pType === "team") {
            if (teamName === "") {
                setError("team-name", "error-team-name", "Team name is required.");
                isValid = false;
            } else {
                clearError("team-name", "error-team-name");
            }

            if (isNaN(teamSize) || teamSize < 2 || teamSize > 4) {
                setError("team-size", "error-team-size", "Team size must be between 2 and 4.");
                isValid = false;
            } else {
                clearError("team-size", "error-team-size");
            }
        }

        // 8. Cross-Reference Duplication Check (Reg Number + Event Combo)
        if (isValid) {
            const isDuplicate = registrationsDb.some(reg => reg.regNo === regNo && reg.event === eventSelected);
            if (isDuplicate) {
                globalError.innerText = `Error: Registration number ${regNo} is already registered for this event!`;
                globalError.classList.remove("hidden");
                return; // Cease execution immediately
            }
        }

        // --- Post-Validation Success Processing Handling ---
        if (isValid) {
            // Construct Data Object Record
            const record = {
                regNo,
                name,
                email,
                mobile,
                event: eventSelected,
                type: pType,
                teamName: pType === "team" ? teamName : null,
                teamSize: pType === "team" ? teamSize : null
            };

            // Save object to runtime storage array
            registrationsDb.push(record);

            // Trigger Display Success Panel & Populating Dynamically
            document.getElementById("rec-id").innerText = record.regNo;
            document.getElementById("rec-name").innerText = record.name;
            document.getElementById("rec-event").innerText = document.querySelector(`#event-select option[value="${record.event}"]`).text;
            document.getElementById("rec-type").innerText = record.type.toUpperCase();

            const teamRow = document.getElementById("rec-team-row");
            if (record.type === "team") {
                document.getElementById("rec-team").innerText = `${record.teamName} (${record.teamSize} members)`;
                teamRow.classList.remove("hidden");
            } else {
                teamRow.classList.add("hidden");
            }

            // Update Global Counter View
            totalCountEl.innerText = registrationsDb.length;

            // Interface Toggles
            form.classList.add("hidden");
            successReceipt.classList.remove("hidden");
        }
    });

    // --- Reset Form to register another student ---
    closeReceiptBtn.addEventListener("click", () => {
        form.reset();
        teamSection.classList.add("hidden"); // Reset team section state display
        successReceipt.classList.add("hidden");
        form.classList.remove("hidden");
    });
});
// Append or include this code in your script.js file
document.addEventListener("DOMContentLoaded", () => {
    const feedbackForm = document.getElementById("technova-feedback-form");
    const dashboardSection = document.getElementById("analytics-dashboard");
    const summaryList = document.getElementById("feedback-summary-list");
    const backToFormBtn = document.getElementById("back-to-form-btn");

    // Runtime database to accumulate submissions
    let feedbackDb = [];

    // --- Dynamic Metric Aggregator Engine ---
    function updateAnalyticsDashboard() {
        if (feedbackDb.length === 0) return;

        // Calculate Average Rating Score
        const totalRatingSum = feedbackDb.reduce((acc, entry) => acc + entry.rating, 0);
        const averageRating = (totalRatingSum / feedbackDb.length).toFixed(1);

        // Render values directly to screen cards
        document.getElementById("avg-rating-value").innerText = averageRating;
        document.getElementById("total-feedbacks-count").innerText = feedbackDb.length;

        // Render dynamic text logs into the feedback feed
        summaryList.innerHTML = ""; // Clear existing records
        feedbackDb.slice().reverse().forEach(entry => {
            const item = document.createElement("div");
            item.className = "summary-item";
            item.innerHTML = `
                <div>
                    <strong>${entry.name}</strong> (${entry.regNo}) 
                    <span class="stars">★ ${entry.rating}/5</span>
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Attended: ${entry.eventName}</div>
                <p>"${entry.comments}"</p>
            `;
            summaryList.appendChild(item);
        });
    }

    // --- Auxiliary Error State Toggles ---
    function setInputError(inputId, errorId, msg) {
        const field = document.getElementById(inputId);
        const errSpan = document.getElementById(errorId);
        if (field) field.classList.add("invalid-input");
        if (errSpan) errSpan.innerText = msg;
    }

    function clearInputError(inputId, errorId) {
        const field = document.getElementById(inputId);
        const errSpan = document.getElementById(errorId);
        if (field) field.classList.remove("invalid-input");
        if (errSpan) errSpan.innerText = "";
    }

    // --- Validation Event Handler ---
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1. Value Reading
        const name = document.getElementById("student-name").value.trim();
        const regNo = document.getElementById("student-id").value.trim().toUpperCase();
        const eventSelect = document.getElementById("event-attended");
        const eventVal = eventSelect.value;
        const eventName = eventSelect.options[eventSelect.selectedIndex]?.text;
        const comments = document.getElementById("feedback-comments").value.trim();
        
        // Target checked radio elements explicitly
        const selectedRatingRadio = document.querySelector('input[name="eventRating"]:checked');
        const ratingVal = selectedRatingRadio ? parseInt(selectedRatingRadio.value, 10) : null;

        let isFormValid = true;

        // 2. Student Name Check
        if (name === "") {
            setInputError("student-name", "error-name", "Name cannot be left blank.");
            isFormValid = false;
        } else {
            clearInputError("student-name", "error-name");
        }

        // 3. Registration Number Regex Verification
        const regNoPattern = /^TECH-2026-[0-9]{4}$/;
        if (!regNoPattern.test(regNo)) {
            setInputError("student-id", "error-id", "Required structural format: TECH-2026-XXXX");
            isFormValid = false;
        } else {
            clearInputError("student-id", "error-id");
        }

        // 4. Dropdown Event Selection Check
        if (eventVal === "") {
            setInputError("event-attended", "error-event", "Please pick an attended event.");
            isFormValid = false;
        } else {
            clearInputError("event-attended", "error-event");
        }

        // 5. Radio Metric Rating Validation
        const ratingErrorSpan = document.getElementById("error-rating");
        if (!ratingVal) {
            ratingErrorSpan.innerText = "Please select a rating score.";
            isFormValid = false;
        } else {
            ratingErrorSpan.innerText = "";
        }

        // 6. Comments Structural Character Bounds Evaluation
        if (comments.length < 20) {
            setInputError("feedback-comments", "error-comments", `Comments must be at least 20 characters long. (Current: ${comments.length})`);
            isFormValid = false;
        } else {
            clearInputError("feedback-comments", "error-comments");
        }

        // --- Processing If Validation Matrix Pass ---
        if (isFormValid) {
            // Package response data entry
            const feedbackEntry = {
                name,
                regNo,
                eventVal,
                eventName,
                rating: ratingVal,
                comments
            };

            // Save record block to database store array
            feedbackDb.push(feedbackEntry);

            // Execute recalculations and refresh layouts
            updateAnalyticsDashboard();

            // Toggle view panels
            feedbackForm.classList.add("hidden");
            dashboardSection.classList.remove("hidden");
        }
    });

    // --- Restore view to input state layout ---
    backToFormBtn.addEventListener("click", () => {
        feedbackForm.reset();
        dashboardSection.classList.add("hidden");
        feedbackForm.removeClassName ? feedbackForm.removeClassName("hidden") : feedbackForm.classList.remove("hidden");
    });
});