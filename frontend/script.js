"use strict";

/* =========================================================
   MindPredict AI
   Frontend Application
   ========================================================= */

/*
 * ============================================================
 * API CONFIGURATION
 * ============================================================
 *
 * Change this constant if your FastAPI server uses another
 * host, port, or API path.
 */
const API_ENDPOINT = "/predict";

/*
 * ============================================================
 * DOM REFERENCES
 * ============================================================
 */

const predictionForm = document.getElementById("predictionForm");
const predictButton = document.getElementById("predictButton");
const resultSection = document.getElementById("resultSection");
const predictionValue = document.getElementById("predictionValue");
const resultStatus = document.getElementById("resultStatus");
const predictAgainButton = document.getElementById("predictAgainButton");
const formMessage = document.getElementById("formMessage");

/*
 * Slider references.
 */
const sliders = [
    {
        input: document.getElementById("avgDailyUsageHours"),
        output: document.getElementById("avgDailyUsageHoursValue"),
        suffix: "hours/day"
    },
    {
        input: document.getElementById("studyHours"),
        output: document.getElementById("studyHoursValue"),
        suffix: "hours/day"
    },
    {
        input: document.getElementById("physicalActivityHours"),
        output: document.getElementById("physicalActivityHoursValue"),
        suffix: "hours/day"
    },
    {
        input: document.getElementById("sleepHoursPerNight"),
        output: document.getElementById("sleepHoursPerNightValue"),
        suffix: "hours/night"
    }
];

/*
 * ============================================================
 * INITIALIZATION
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
    initializeSliders();
    initializeNavigation();
    initializeLiveValidation();
    initializeFormSubmission();
    initializePredictAgainButton();
}

/*
 * ============================================================
 * SLIDERS
 * ============================================================
 */

function initializeSliders() {
    sliders.forEach(({ input, output, suffix }) => {
        if (!input || !output) {
            return;
        }

        updateSliderOutput(input, output, suffix);

        input.addEventListener("input", () => {
            updateSliderOutput(input, output, suffix);
        });
    });
}

function updateSliderOutput(input, output, suffix) {
    const value = Number(input.value);

    output.textContent = `${formatNumber(value)} ${suffix}`;
}

function formatNumber(value) {
    return Number(value).toFixed(1).replace(/\.0$/, "");
}

/*
 * ============================================================
 * NAVIGATION
 * ============================================================
 */

function initializeNavigation() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion() ? "auto" : "smooth",
                block: "start"
            });
        });
    });
}

/*
 * ============================================================
 * LIVE VALIDATION
 * ============================================================
 */

function initializeLiveValidation() {
    const age = document.getElementById("age");
    const dailyUnlocks = document.getElementById("dailyUnlocks");

    age.addEventListener("blur", () => {
        validateAge();
    });

    age.addEventListener("input", () => {
        if (age.value.trim() !== "") {
            validateAge();
        }
    });

    dailyUnlocks.addEventListener("blur", () => {
        validateDailyUnlocks();
    });

    dailyUnlocks.addEventListener("input", () => {
        if (dailyUnlocks.value.trim() !== "") {
            validateDailyUnlocks();
        }
    });

    document
        .querySelectorAll("select")
        .forEach((select) => {
            select.addEventListener("change", () => {
                clearFieldError(select.id);
            });
        });

    document
        .querySelectorAll('input[type="radio"]')
        .forEach((radio) => {
            radio.addEventListener("change", () => {
                clearRadioGroupError(radio.name);
            });
        });
}

function validateAge() {
    const ageInput = document.getElementById("age");
    const age = Number(ageInput.value);

    if (ageInput.value.trim() === "") {
        setFieldError("age", "Age is required.");
        return false;
    }

    if (!Number.isInteger(age) || age < 10 || age > 100) {
        setFieldError(
            "age",
            "Age must be between 10 and 100."
        );

        return false;
    }

    clearFieldError("age");
    return true;
}

function validateDailyUnlocks() {
    const input = document.getElementById("dailyUnlocks");

    if (input.value.trim() === "") {
        setFieldError(
            "dailyUnlocks",
            "Daily phone unlocks are required."
        );

        return false;
    }

    const value = Number(input.value);

    if (!Number.isInteger(value) || value < 0) {
        setFieldError(
            "dailyUnlocks",
            "Daily phone unlocks must be 0 or greater."
        );

        return false;
    }

    clearFieldError("dailyUnlocks");
    return true;
}

/*
 * ============================================================
 * FORM SUBMISSION
 * ============================================================
 */

function initializeFormSubmission() {
    predictionForm.addEventListener("submit", handlePredictionSubmit);
}

async function handlePredictionSubmit(event) {
    event.preventDefault();

    clearFormMessage();

    const validationResult = validateForm();

    if (!validationResult.isValid) {
        showFormMessage(
            "Please complete all required fields.",
            "error"
        );

        focusFirstInvalidField(validationResult.invalidElements);

        return;
    }

    const payload = buildPayload();

    setLoadingState(true);

    try {
        const data = await requestPrediction(payload);

        /*
         * =====================================================
         * API RESPONSE ADAPTER
         * =====================================================
         *
         * IMPORTANT:
         * The backend response structure was not provided.
         *
         * If your FastAPI endpoint returns:
         *
         * {
         *     "prediction": "Some result"
         * }
         *
         * the following line is already correct.
         *
         * If it returns something else, modify only this
         * function / extraction logic.
         */

        const prediction = extractPredictionFromResponse(data);

        if (
            prediction === null ||
            prediction === undefined ||
            prediction === ""
        ) {
            throw new Error("UNEXPECTED_RESPONSE");
        }

        renderPredictionResult(prediction);

    } catch (error) {
        handlePredictionError(error);
    } finally {
        setLoadingState(false);
    }
}

/*
 * ============================================================
 * VALIDATION
 * ============================================================
 */

function validateForm() {
    const invalidElements = [];

    /*
     * Age
     */
    if (!validateAge()) {
        invalidElements.push(document.getElementById("age"));
    }

    /*
     * Required selects.
     */
    const requiredSelects = [
        {
            id: "gender",
            label: "Gender"
        },
        {
            id: "country",
            label: "Country"
        },
        {
            id: "academicLevel",
            label: "Academic level"
        },
        {
            id: "mostUsedPlatform",
            label: "Most used platform"
        }
    ];

    requiredSelects.forEach(({ id, label }) => {
        const input = document.getElementById(id);

        if (!input.value) {
            setFieldError(id, `${label} is required.`);
            invalidElements.push(input);
        } else {
            clearFieldError(id);
        }
    });

    /*
     * Purpose of use.
     */
    const purposeOfUse = document.querySelector(
        'input[name="purpose_of_use"]:checked'
    );

    if (!purposeOfUse) {
        setRadioGroupError(
            "purpose_of_use",
            "Please select a purpose of use."
        );

        invalidElements.push(
            document.querySelector('input[name="purpose_of_use"]')
        );
    } else {
        clearRadioGroupError("purpose_of_use");
    }

    /*
     * Daily unlocks.
     */
    if (!validateDailyUnlocks()) {
        invalidElements.push(
            document.getElementById("dailyUnlocks")
        );
    }

    /*
     * Stress level.
     */
    const stressLevel = document.querySelector(
        'input[name="stress_level"]:checked'
    );

    if (!stressLevel) {
        setRadioGroupError(
            "stress_level",
            "Please select a stress level."
        );

        invalidElements.push(
            document.querySelector('input[name="stress_level"]')
        );
    } else {
        clearRadioGroupError("stress_level");
    }

    return {
        isValid: invalidElements.length === 0,
        invalidElements
    };
}

/*
 * ============================================================
 * PAYLOAD
 * ============================================================
 *
 * The field names here intentionally match the FastAPI model
 * exactly.
 */

function buildPayload() {
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const country = document.getElementById("country").value;
    const academicLevel =
        document.getElementById("academicLevel").value;

    const mostUsedPlatform =
        document.getElementById("mostUsedPlatform").value;

    const purposeOfUse =
        document.querySelector(
            'input[name="purpose_of_use"]:checked'
        ).value;

    const avgDailyUsageHours =
        document.getElementById("avgDailyUsageHours").value;

    const dailyUnlocks =
        document.getElementById("dailyUnlocks").value;

    const studyHours =
        document.getElementById("studyHours").value;

    const physicalActivityHours =
        document.getElementById("physicalActivityHours").value;

    const sleepHoursPerNight =
        document.getElementById("sleepHoursPerNight").value;

    const stressLevel =
        document.querySelector(
            'input[name="stress_level"]:checked'
        ).value;

    const payload = {
        age: Number(age),
        gender: gender,
        country: country,
        academic_level: academicLevel,
        most_used_platform: mostUsedPlatform,
        purpose_of_use: purposeOfUse,
        avg_daily_usage_hours: Number(avgDailyUsageHours),
        daily_unlocks: Number(dailyUnlocks),
        study_hours: Number(studyHours),
        physical_activity_hours: Number(physicalActivityHours),
        sleep_hours_per_night: Number(sleepHoursPerNight),
        stress_level: stressLevel
    };

    return payload;
}

/*
 * ============================================================
 * API REQUEST
 * ============================================================
 */

async function requestPrediction(payload) {
    let response;

    try {
        response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        /*
         * Fetch itself failed, which usually indicates that the
         * backend is offline, unreachable, or blocked by CORS.
         */
        throw new Error("BACKEND_OFFLINE");
    }

    let data;

    try {
        data = await response.json();
    } catch (error) {
        throw new Error("INVALID_JSON");
    }

    if (!response.ok) {
        const apiError = new Error("API_ERROR");
        apiError.status = response.status;
        apiError.data = data;

        throw apiError;
    }

    return data;
}

/*
 * ============================================================
 * API RESPONSE PARSER
 * ============================================================
 *
 * This is intentionally isolated from the request function.
 *
 * Default expected response:
 *
 * {
 *     "prediction": "..."
 * }
 *
 * If your FastAPI response is different, modify this function.
 */

function extractPredictionFromResponse(data) {
    if (
        data &&
        Object.prototype.hasOwnProperty.call(data, "predicted_mental_health_score")
    ) {
        return data.predicted_mental_health_score;
    }
    return null;
}

/*
 * ============================================================
 * RESULT RENDERING
 * ============================================================
 *
 * This function is independent from the API request logic.
 */

function renderPredictionResult(prediction) {
    predictionValue.textContent = formatPrediction(prediction);

    resultStatus.textContent =
        "Prediction generated successfully.";

    resultSection.hidden = false;

    /*
     * Force the browser to start the section animation again
     * when predicting multiple times.
     */
    const resultCard =
        document.getElementById("resultCard");

    resultCard.style.animation = "none";

    /*
     * Reading offsetWidth forces a reflow.
     */
    void resultCard.offsetWidth;

    resultCard.style.animation = "";

    resultSection.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center"
    });
}

function formatPrediction(prediction) {
    /*
     * Objects and arrays are rendered as readable JSON instead
     * of [object Object].
     */
    if (
        typeof prediction === "object" &&
        prediction !== null
    ) {
        return JSON.stringify(
            prediction,
            null,
            2
        );
    }

    return String(prediction);
}

/*
 * ============================================================
 * ERROR HANDLING
 * ============================================================
 */

function handlePredictionError(error) {
    console.error("Prediction request failed:", error);

    if (error.message === "BACKEND_OFFLINE") {
        showFormMessage(
            "Unable to connect to the prediction server. Please make sure the FastAPI backend is running.",
            "error"
        );

        return;
    }

    if (error.message === "API_ERROR") {
        showFormMessage(
            "Unable to generate a prediction. Please try again.",
            "error"
        );

        return;
    }

    if (
        error.message === "INVALID_JSON" ||
        error.message === "UNEXPECTED_RESPONSE"
    ) {
        showFormMessage(
            "The server returned an unexpected response.",
            "error"
        );

        return;
    }

    showFormMessage(
        "Unable to generate a prediction. Please try again.",
        "error"
    );
}

/*
 * ============================================================
 * LOADING STATE
 * ============================================================
 */

function setLoadingState(isLoading) {
    predictButton.disabled = isLoading;

    if (isLoading) {
        predictButton.classList.add("is-loading");

        const label =
            predictButton.querySelector(".button-label");

        label.textContent = "Analyzing...";

        showFormMessage(
            "Analyzing student data with the machine learning model...",
            "success"
        );
    } else {
        predictButton.classList.remove("is-loading");

        const label =
            predictButton.querySelector(".button-label");

        label.textContent = "Predict Mental Health";

        /*
         * Don't automatically remove error messages here.
         * A successful request will naturally move the user
         * to the result.
         */
        if (
            formMessage.classList.contains("success")
        ) {
            clearFormMessage();
        }
    }
}

/*
 * ============================================================
 * PREDICT AGAIN
 * ============================================================
 */

function initializePredictAgainButton() {
    predictAgainButton.addEventListener("click", () => {
        resultSection.hidden = true;

        document
            .getElementById("assessment")
            .scrollIntoView({
                behavior: prefersReducedMotion()
                    ? "auto"
                    : "smooth",
                block: "start"
            });
    });
}

/*
 * ============================================================
 * FIELD ERROR HELPERS
 * ============================================================
 */

function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);

    if (!input) {
        return;
    }

    const field = input.closest(".field");

    if (!field) {
        return;
    }

    field.classList.add("invalid");

    const errorElement =
        document.getElementById(`${fieldId}Error`);

    if (errorElement) {
        errorElement.textContent = message;
    }

    input.setAttribute("aria-invalid", "true");
}

function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);

    if (!input) {
        return;
    }

    const field = input.closest(".field");

    if (field) {
        field.classList.remove("invalid");
    }

    const errorElement =
        document.getElementById(`${fieldId}Error`);

    if (errorElement) {
        errorElement.textContent = "";
    }

    input.removeAttribute("aria-invalid");
}

function setRadioGroupError(groupName, message) {
    const firstRadio = document.querySelector(
        `input[name="${groupName}"]`
    );

    if (!firstRadio) {
        return;
    }

    const fieldset =
        firstRadio.closest(".choice-fieldset");

    if (!fieldset) {
        return;
    }

    fieldset.classList.add("invalid");

    const errorId =
        groupName === "purpose_of_use"
            ? "purposeOfUseError"
            : "stressLevelError";

    const errorElement =
        document.getElementById(errorId);

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearRadioGroupError(groupName) {
    const firstRadio = document.querySelector(
        `input[name="${groupName}"]`
    );

    if (!firstRadio) {
        return;
    }

    const fieldset =
        firstRadio.closest(".choice-fieldset");

    if (fieldset) {
        fieldset.classList.remove("invalid");
    }

    const errorId =
        groupName === "purpose_of_use"
            ? "purposeOfUseError"
            : "stressLevelError";

    const errorElement =
        document.getElementById(errorId);

    if (errorElement) {
        errorElement.textContent = "";
    }
}

/*
 * ============================================================
 * FORM MESSAGE
 * ============================================================
 */

function showFormMessage(message, type = "error") {
    formMessage.hidden = false;
    formMessage.textContent = message;

    formMessage.classList.toggle(
        "success",
        type === "success"
    );
}

function clearFormMessage() {
    formMessage.hidden = true;
    formMessage.textContent = "";
    formMessage.classList.remove("success");
}

/*
 * ============================================================
 * INVALID FIELD FOCUS
 * ============================================================
 */

function focusFirstInvalidField(invalidElements) {
    const firstInvalid = invalidElements.find(Boolean);

    if (!firstInvalid) {
        return;
    }

    firstInvalid.focus({
        preventScroll: false
    });
}

/*
 * ============================================================
 * MOTION PREFERENCE
 * ============================================================
 */

function prefersReducedMotion() {
    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
}