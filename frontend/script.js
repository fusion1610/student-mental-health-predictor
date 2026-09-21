"use strict";

/*
 * ============================================
 * DOM Elements
 * ============================================
 */

const predictionForm = document.getElementById("predictionForm");

const predictButton = document.getElementById("predictButton");
const buttonText = document.getElementById("buttonText");
const loadingSpinner = document.getElementById("loadingSpinner");

const resetButton = document.getElementById("resetButton");

const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const resultSection = document.getElementById("resultSection");
const predictionValue = document.getElementById("predictionValue");

const newPredictionButton =
    document.getElementById("newPredictionButton");


/*
 * ============================================
 * Form Submission
 * ============================================
 */

predictionForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    hideError();

    const validationError = validateForm();

    if (validationError) {
        showError(validationError);
        return;
    }

    const requestData = collectFormData();

    setLoadingState(true);

    try {

        const response = await fetch('/predict', {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(requestData)
        });


        /*
         * Try to parse the response as JSON.
         */
        let responseData;

        try {
            responseData = await response.json();
        } catch (jsonError) {
            throw new Error(
                "The server returned an invalid response."
            );
        }


        /*
         * FastAPI validation or server error.
         */
        if (!response.ok) {

            const backendMessage =
                extractBackendError(responseData);

            throw new Error(
                backendMessage ||
                `Request failed with status ${response.status}.`
            );
        }


        /*
         * Validate expected response property.
         */
        if (
            typeof responseData.predicted_mental_health_score !==
            "number"
        ) {
            throw new Error(
                "The server response does not contain a valid predicted score."
            );
        }


        /*
         * Display result.
         */
        displayPrediction(
            responseData.predicted_mental_health_score
        );

    } catch (error) {

        console.error("Prediction error:", error);

        showError(
            getFriendlyErrorMessage(error)
        );

    } finally {

        setLoadingState(false);
    }
});


/*
 * ============================================
 * Collect Form Data
 * ============================================
 */

function collectFormData() {

    return {
        age: Number(
            document.getElementById("age").value
        ),

        gender:
            document.getElementById("gender").value,

        country:
            document.getElementById("country").value,

        academic_level:
            document.getElementById("academic_level").value,

        most_used_platform:
            document.getElementById("most_used_platform").value,

        purpose_of_use:
            document.getElementById("purpose_of_use").value,

        avg_daily_usage_hours: Number(
            document.getElementById(
                "avg_daily_usage_hours"
            ).value
        ),

        daily_unlocks: Number(
            document.getElementById(
                "daily_unlocks"
            ).value
        ),

        study_hours: Number(
            document.getElementById(
                "study_hours"
            ).value
        ),

        physical_activity_hours: Number(
            document.getElementById(
                "physical_activity_hours"
            ).value
        ),

        sleep_hours_per_night: Number(
            document.getElementById(
                "sleep_hours_per_night"
            ).value
        ),

        stress_level:
            document.getElementById("stress_level").value
    };
}


/*
 * ============================================
 * Client-side Validation
 * ============================================
 */

function validateForm() {

    const age = Number(
        document.getElementById("age").value
    );

    const dailyUsage = Number(
        document.getElementById(
            "avg_daily_usage_hours"
        ).value
    );

    const dailyUnlocks = Number(
        document.getElementById(
            "daily_unlocks"
        ).value
    );

    const studyHours = Number(
        document.getElementById(
            "study_hours"
        ).value
    );

    const physicalActivity = Number(
        document.getElementById(
            "physical_activity_hours"
        ).value
    );

    const sleepHours = Number(
        document.getElementById(
            "sleep_hours_per_night"
        ).value
    );


    if (age < 10 || age > 100) {
        return "Age must be between 10 and 100.";
    }


    if (dailyUsage < 0 || dailyUsage > 24) {
        return "Daily social media usage must be between 0 and 24 hours.";
    }


    if (dailyUnlocks < 0) {
        return "Daily phone unlocks cannot be negative.";
    }


    if (studyHours < 0 || studyHours > 24) {
        return "Study hours must be between 0 and 24.";
    }


    if (
        physicalActivity < 0 ||
        physicalActivity > 24
    ) {
        return "Physical activity must be between 0 and 24 hours.";
    }


    if (
        sleepHours < 0 ||
        sleepHours > 24
    ) {
        return "Sleep hours must be between 0 and 24.";
    }


    return null;
}


/*
 * ============================================
 * Display Prediction
 * ============================================
 */

function displayPrediction(score) {

    /*
     * Convert to a clean display value.
     *
     * Your backend already rounds the value
     * to 2 decimal places, but this keeps the
     * frontend robust.
     */
    const formattedScore = Number(score).toFixed(2);

    predictionValue.textContent = formattedScore;

    resultSection.classList.add("visible");

    /*
     * Scroll smoothly to the result.
     */
    setTimeout(() => {

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);
}


/*
 * ============================================
 * Loading State
 * ============================================
 */

function setLoadingState(isLoading) {

    predictButton.disabled = isLoading;

    if (isLoading) {

        buttonText.textContent = "Predicting...";

        loadingSpinner.hidden = false;

    } else {

        buttonText.textContent =
            "Predict Mental Health Score";

        loadingSpinner.hidden = true;
    }
}


/*
 * ============================================
 * Error Handling
 * ============================================
 */

function showError(message) {

    errorText.textContent = message;

    errorMessage.classList.add("visible");

    errorMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function hideError() {

    errorMessage.classList.remove("visible");

    errorText.textContent = "";
}


/*
 * ============================================
 * FastAPI Error Extraction
 * ============================================
 */

function extractBackendError(responseData) {

    if (!responseData) {
        return null;
    }


    /*
     * Typical FastAPI validation response:
     *
     * {
     *   "detail": [...]
     * }
     */
    if (Array.isArray(responseData.detail)) {

        return responseData.detail
            .map(error => {

                if (
                    error &&
                    typeof error.msg === "string"
                ) {
                    return error.msg;
                }

                return "Invalid input.";
            })
            .join(" ");
    }


    if (
        typeof responseData.detail === "string"
    ) {
        return responseData.detail;
    }


    return null;
}


/*
 * ============================================
 * Friendly Network Errors
 * ============================================
 */

function getFriendlyErrorMessage(error) {

    if (
        error instanceof TypeError &&
        error.message.toLowerCase().includes("fetch")
    ) {
        return (
            "Unable to connect to the FastAPI server. " +
            "Make sure your backend is running at " +
            BASE_API_URL
        );
    }


    if (
        error.message &&
        error.message.length > 0
    ) {
        return error.message;
    }


    return "Something went wrong while making the prediction.";
}


/*
 * ============================================
 * Reset
 * ============================================
 */

resetButton.addEventListener("click", function () {

    predictionForm.reset();

    hideError();

    resultSection.classList.remove("visible");

    predictionValue.textContent = "--";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/*
 * ============================================
 * New Prediction
 * ============================================
 */

newPredictionButton.addEventListener(
    "click",
    function () {

        predictionForm.reset();

        hideError();

        resultSection.classList.remove("visible");

        predictionValue.textContent = "--";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        document.getElementById("age").focus();
    }
);