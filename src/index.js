var configuration = {
  fields: {
    cardNumber: {
      selector: "#cardNumber-container",
      placeholder: "****  ****  ****  ****",
      styles: {
        fontSize: "16px",
        padding: "0px 0px 0px 10px",
        backgroundColor: "rgb(247, 247, 247)",
        padding: "0px 0px 0px 10px"
      }
    },
    expirationDate: {
      selector: "#expirationDate-container",
      placeholder: "MM / YY",
      styles: {
        fontSize: "16px",
        padding: "0px 0px 0px 10px",
        backgroundColor: "rgb(247, 247, 247)",
        padding: "0px 0px 0px 10px"
      }
    },
    cvv: {
      selector: "#cvv-container",
      placeholder: "***",
      styles: {
        fontSize: "16px",
        padding: "0px 0px 0px 10px",
        backgroundColor: "rgb(247, 247, 247)",
        padding: "0px 0px 0px 10px"
      }
    },
    pin: {
      selector: "#pin-container",
      placeholder: "* * * *",
      styles: {
        fontSize: "16px",
        padding: "0px 0px 0px 10px",
        backgroundColor: "rgb(247, 247, 247)",
        textAlign: "center"
      }
    },
    otp: {
      selector: "#otp-container",
      placeholder: "* * * * * *",
      styles: {
        fontSize: "16px",
        padding: "0px 0px 0px 10px",
        backgroundColor: "rgb(247, 247, 247)",
        textAlign: "center"
      }
    }
  },
  cardinal: {
    containerSelector: ".cardinal-container",
    activeClass: "show"
  },
  //supplied by demo parameters
  paymentParameters: null
};

var instance,
  showFormErrors = false,
  focusedField;

var createHostedFieldsButton = document.getElementById("create-fields-button");
var payButton = document.getElementById("pay-button");
var continueButton = document.getElementById("continue-button");
var validateButton = document.getElementById("validate-button");
var pinBackButton = document.getElementById("pin-back-button");
var otpBackButton = document.getElementById("otp-back-button");

createHostedFieldsButton.addEventListener("click", function () {
  var paymentParameters = {
    amount: document.getElementById("demo-amount").value,
    currencyCode: document.getElementById("demo-currencyCode").value,
    merchantCode: document.getElementById("demo-merchantCode").value,
    payableCode: document.getElementById("demo-payableCode").value,
    merchantCustomerName: document.getElementById("demo-merchantCustomerName")
      .value,
    transactionReference: document.getElementById("demo-transactionReference")
      .value
  };

  var createConfiguration = configuration;
  createConfiguration.paymentParameters = paymentParameters;

  isw.hostedFields.create(createConfiguration, createHandler);
});

pinBackButton.addEventListener("click", function () {
  setActivePage("card-details");
  instance.clearField("pin");
});

otpBackButton.addEventListener("click", function () {
  setActivePage("pin");
  instance.clearField("otp");
});

//Create hosted field instance callback
function createHandler(createError, hostedFieldsInstance) {
  //handle create error
  if (createError != null) {
    var errorName = createError.name;
    var errorMessage = createError.message;

    alert(errorName + "\n" + errorMessage);
    return;
  }

  // set payment placeholder in payment form
  var selectedAmount = parseInt(document.getElementById("demo-amount").value);
  var amountInMajor = selectedAmount / 100;
  document.querySelector("#amount-placeholder").innerHTML =
    "&#8358; " + amountInMajor;

  //hide the parameter form and show the payment form
  document.querySelector(".create-payment-container").style.display = "none";
  document.querySelector(".payment-form-container").style.display = "block";

  //expose instance to outer scope
  instance = hostedFieldsInstance;

  //Register focus handler to process event when a field gains focus
  instance.on("focus", function (event) {
    var fieldContainerEl = document.querySelector(event.selector);
    fieldContainerEl.style.borderBottomColor = "#a0c8e2";

    focusedField = event.fieldType;

    if (!showFormErrors) {
      return;
    }

    var validationState = instance.getFieldsState();

    checkFieldsValidation(
      ["cardNumber", "expirationDate", "cvv", "pin", "otp"],
      validationState
    );
  });

  //Register blur handler to process event when a field loses focus
  instance.on("blur", function (event) {
    var fieldName = event.fieldType;

    var fieldContainerEl = document.querySelector(event.selector);
    fieldContainerEl.style.borderBottomColor = "#e4e4e4";

    if (showFormErrors) {
      var validationState = instance.getFieldsState();

      if (!validationState[fieldName].valid) {
        fieldContainerEl.style.borderBottomColor = "red";
      }
    }
  });

  //Register validation handler to run some code when validation state updates
  instance.on("validation", function (validationState) {
    if (!showFormErrors) {
      return;
    }

    checkFieldsValidation(
      ["cardNumber", "expirationDate", "cvv", "pin", "otp"],
      validationState
    );
  });

  //Register cardinal-response handler to execute some code when cardinal paymnet completes
  instance.on("cardinal-response", handleCardinalValidateResponse);

  payButton.addEventListener("click", function () {
    showFormErrors = true;

    var validationState = instance.getFieldsState();

    var fieldsValid = checkFieldsValidation(
      ["cardNumber", "expirationDate", "cvv"],
      validationState
    );

    if (!fieldsValid) {
      return;
    }

    instance.getBinConfiguration(handleBinConfigResponse);
  });

  continueButton.addEventListener("click", function () {
    var validationState = instance.getFieldsState();

    var fieldsValid = checkFieldsValidation(["pin"], validationState);

    if (!fieldsValid) {
      return;
    }

    instance.makePayment(handlePayResponse);
  });

  validateButton.addEventListener("click", function () {
    instance.validatePayment(handleValidateResponse);
  });
}

function handleBinConfigResponse(err, response) {
  if (err != null && err.validationError === true) {
    showNotification("Validation Error", true);
    return;
  }

  if (err != null && err.networkError === true) {
    showNotification("Network Error", true);
    return;
  }

  if (err !== null) {
    showNotification(
      "Could not process the request. " + err.responseCode,
      true
    );
    return;
  }

  if (response.supportsPin) {
    setActivePage("pin");
    return;
  }

  instance.makePayment(handlePayResponse);
}

function handlePayResponse(err, response) {
  if (err != null && err.validationError === true) {
    showNotification("Validation Error", true);
    return;
  }

  if (err != null && err.networkError === true) {
    showNotification("Network Error", true);
    return;
  }

  if (err != null) {
    showNotification("Payment failed. " + err.responseCode, true);
    return;
  }

  if (response.responseCode === "00") {
    showNotification("Transaction successful", false);
    setActivePage("card-details");
    return;
  }

  if (
    response.responseCode === "T0" &&
    response.requiresCentinelAuthorization === true
  ) {
    setActivePage("cardinal");
    return;
  }

  if (response.responseCode === "T0") {
    setActivePage("otp");
    return;
  }

  showNotification("Payment failed. " + response.responseCode, true);
}

function handleValidateResponse(err, response) {
  if (err != null && err.validationError === true) {
    showNotification("Validation Error", true);
    return;
  }

  if (err != null && err.networkError === true) {
    showNotification("Network Error", true);
    return;
  }

  if (err != null) {
    showNotification("Payment validation failed. " + err.responseCode, true);
    return;
  }

  if (response.responseCode === "00") {
    showNotification("Transaction successful", false);
    setActivePage("card-details");
    return;
  }

  showNotification("Payment validation failed. " + response.responseCode, true);
}

function handleCardinalValidateResponse(err, response) {
  setActivePage("card-details");

  if (err != null && err.validationError === true) {
  }

  if (err != null) {
    showNotification("Something went wrong", true);
    return;
  }

  if (response.responseCode === "00") {
    showNotification("Transaction successful", false);
    return;
  }

  showNotification(
    "Cardinal payment validation failed. " + response.responseCode,
    true
  );
}

function setActivePage(pageName) {
  var pages = document.querySelectorAll(".form-page");

  for (var i = 0; i < pages.length; i++) {
    var page = pages[i];
    page.classList.remove("show");
  }

  var activePage = document.querySelector(".form-page." + pageName);
  activePage.classList.add("show");
}

function showNotification(message, isError) {
  var notificationBoxEl = document.querySelector(".notification-box");
  notificationBoxEl.classList.add("show");

  var contentEl = notificationBoxEl.querySelector(".content");
  contentEl.innerHTML = message;

  contentEl.classList.remove("error");
  contentEl.classList.remove("success");

  contentEl.classList.add(isError ? "error" : "success");

  setTimeout(function () {
    notificationBoxEl.classList.remove("show");
  }, 3000);
}

function checkFieldsValidation(fieldNames, validationState) {
  var formFieldsValid = true;

  for (var i = 0; i < fieldNames.length; i++) {
    var fieldName = fieldNames[i];
    var fieldValidationState = validationState[fieldName];

    var fieldSelector = fieldValidationState.selector;
    var fieldContainerEl = document.querySelector(fieldSelector);

    if (fieldValidationState.valid === false) {
      formFieldsValid = false;

      fieldContainerEl.style.borderBottomColor = "red";
      continue;
    }

    if (focusedField === fieldName) {
      fieldContainerEl.style.borderBottomColor = "#a0c8e2";
    } else {
      fieldContainerEl.style.borderBottomColor = "#e4e4e4";
    }
  }

  return formFieldsValid;
}
