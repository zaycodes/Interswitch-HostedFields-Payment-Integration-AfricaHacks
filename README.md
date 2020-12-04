# Interswitch-HostedFields-Payment-Integration-AfricaHacks
Integrating to Interswitch Hosted Fields for payments, an SDK designed for non PCI DSS(Payment Card Industry Data Security Standard) compliant merchants

## Introduction
Hosted Fields is an SDK designed by [Interswitch Group](https://www.interswitchgroup.com/) for businesses who are non [PCIDSS](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard#Requirements) compliant to integrate with it's payment gateway giving you control over how your checkout page feels. 

With hosted fields, you can host Interswitch's [payment gateway](https://developer.interswitchgroup.com/docs/payment-gateway/) on your domain and present the fields to your users in an iframe to handle input of the following payments fields: **Expiry Date**, **CVV**, **PIN** and **OTP** on your checkout page. This gives you the control over the look and feel of your checkout page while ensuring that you are compliant with PCIDSS requirements.

## **Setup**

Set up SDK as shown below, 

> Javascript

```javascript
<script src="https://nwp.qa.interswitchng.com/sdk.js"></script>

<script> 
    isw.hostedFields.create(configuration, function createCallback(error, hostedFieldsinstance){
        if(error != null) {
            //handle create error
            return;
        }

        //create an hosted fields instance
    })
</script>
```

Then create a configuration object and a callback function, pass the two as arguments to the **isw.hostedFields.create()** method. The configuration object has three properties,  which are fields, cardinal and paymentParameters.

### Sample configuration object 

Find below a sample configuration object written in JavaScript. 

>Javascript

```javascript
var configuration = {
    fields: {
        cardNumber: {
            selector: '', //this indicates the id of the div
            placeholder: '',
            styles: {}
        },
        //other fields of the hosted fields follows the same pattern
        //with keys expirationDate, cvv, pin, otp
    },
    cardinal: {
        containerSelector: '', //indicates the identifier forthe cardinal div
        activeClass: '', //a css class that display the div
    },
    paymentParameters: {
        amount: //amount in minor(kobo),
        currencyCode: //merchant currency code,
        dateOfPayment: //date in YYYY-MM-DDTHH:mm:ss format,
        payableCode: //merchant payable code as provided,
        merchantCustomerName: //merchant name as provided,
        merchantCode: //provided merchant code as provided,
        transactionReference: //transaction reference as provided
    }
}
```

### The Callback Function

The callback function takes two parameters which are `error` and `hostedFieldsInstance`. Error catch error resulting from hosted fields creation while the instance creates a new instance of the hosted fields. The instance of the hosted fields has the following methods on it:

* makepayment(),
* validatePayment(),
* binConfiguration(), 
* getFieldsState(),
* on() 

The `on()` method handles events like `focus`, `blur`, `validation`, and `cardinal-response`. To check for the validation of each field you can call `instance.getFieldsState()`.


> Sample Code  

```javascript
var instance;
var showFormErrors = false;
var focusedField;

function createCallback(error, hostedFieldsInstance){
    //handleError

    instance = hostedFieldsInstance

    instance.on('blur', function(event){
        //handle event
        if(!showFormErrors) {
            return;
        }

        var validationState = instance.getFieldsState();
        checkFieldsValidation([['cardNumber', 'expirationDate', 'cvv', 'pin', 'otp']], validationstate);
    });

    instance.on('focus', function(event){
        //handle event
        if(!showFormErrors) {
            return;
        }

        var validationState = instance.getFieldsState();
        checkFieldsValidation([['cardNumber', 'expirationDate', 'cvv', 'pin', 'otp']], validationstate);
    })

    instance.on('validation', function(event){
        //handle event
        if(!showFormErrors) {
            return;
        }

        var validationState = instance.getFieldsState();
        checkFieldsValidation([['cardNumber', 'expirationDate', 'cvv', 'pin', 'otp']], validationstate);
    })

    instance.on('cardinal-response', function(error, response){
        //handle page switching
        setActivePage('card-details');

        if (err != null && err.validationError === true) {
            //handle validation error
        }

        if (err != null) {
            //handle api error
        }

        if (response.responseCode === '00') {
            //handle succesfull response
        }

        //handle response that is not a success
    })


    //add eventListener
}
```

---

## **Events**

The **instance.on** method gives you the ability to hook into `focus`, `blur`, `validation` and this allow you to subscribe to those events. 

### Focus and Blur Events

For the focus and blur events, the event returns an object which contains fieldType and selector as seen in the table below. 

<table class="payment-token-table"> 
    <tr> 
        <th>Key</th> 
        <th>Type</th> 
        <th>Description</th> 
    </tr> 
    <tr> 
        <td>fieldType</td> 
        <td>string</td>
        <td>Displays the  type of input field which can be cardNumber, expiratuonDate, cvv, pin or otp</td> 
    </tr> 
    <tr> 
        <td>selector</td> 
        <td>string</td>
        <td>Displays the id of the div container.</td> 
    </tr> 
</table>

### Validate Event

For the validate event, the event returns an object of objects that contains cardNumber, cvv, expirationDate, otp and pin as seen in the table below.

<table class="payment-token-table"> 
    <tr> 
        <th>Key</th> 
        <th>Type</th> 
        <th>Description</th> 
    </tr> 
    <tr> 
        <td>cardNumber</td> 
        <td>object</td>
        <td>
            <table class="payment-token-table">
                <tr>
                    <td>cardType</td>
                    <td>string</td>
                </tr>
                <tr>
                    <td>isEmpty</td>
                    <td>boolean</td>
                </tr>
                <tr>
                    <td>valid</td>
                    <td>boolean</td>
                </tr>
            </table>
        </td> 
    </tr> 
    <tr> 
        <td>cvv</td> 
        <td>object</td>
        <td>
            <table class="payment-token-table">
                <tr>
                    <td>isEmpty</td>
                    <td>boolean</td>
                </tr>
                <tr>
                    <td>valid</td>
                    <td>boolean</td>
                </tr>
            </table>
        </td>  
    </tr>
    <tr> 
        <td>expirationDate</td> 
        <td>object</td>
        <td>
            <table class="payment-token-table">
                <tr>
                    <td>expired</td>
                    <td>boolean</td>
                </tr>
                <tr>
                    <td>isEmpty</td>
                    <td>boolean</td>
                </tr>
                <tr>
                    <td>valid</td>
                    <td>boolean</td>
                </tr>
            </table>
        </td>  
    </tr>
    <tr> 
        <td>otp</td> 
        <td>object</td>
        <td>
            <table class="payment-token-table">
                <tr>
                    <td>isEmpty</td>
                    <td>boolean</td>
                </tr>
                <tr>
                    <td>valid</td>
                    <td>boolean</td>
                </tr>
            </table>
        </td>  
    </tr>
    <tr> 
        <td>pin</td> 
        <td>object</td>
        <td>
            <table class="payment-token-table">
                <tr>
                    <td>isEmpty</td>
                    <td>boolean</td>
                </tr>
                <tr>
                    <td>valid</td>
                    <td>boolean</td>
                </tr>
            </table>
        </td>  
    </tr>  
</table>

---

## **Integration**

To start using Hosted Fields, you need to create a basic HTML checkout form. You will need to define containers that will hold the iframe input fields for the following inour fields (Card Number, Expiry Date, CVV, PIN, OTP).

### **Test Details**

<table class="test-details-table"> 
    <tr> 
        <td>Currency Code</td> 
        <td>566</td>
    </tr> 
    <tr> 
        <td>Merchant Code</td> 
        <td>MX6072</td>
    </tr>
    <tr> 
        <td>Payable Code</td> 
        <td>9405967</td>
    </tr>
    <tr> 
        <td>Card Number</td> 
        <td>5060 9905 8000 0217 499</td>
    </tr>
    <tr> 
        <td>Expiry Date</td> 
        <td>03/50</td>
    </tr>
    <tr> 
        <td>CVV</td> 
        <td>111</td>
    </tr>
    <tr> 
        <td>PIN</td> 
        <td>1111</td>
    </tr> 
</table>

## **Response Codes**

Find below different response codes depening on the success or failure of the integration

### On Bin Configuration call

<table class="payment-token-table"> 
    <tr> 
        <th>Response Code</th> 
        <th>Description</th> 
    </tr> 
    <tr> 
        <td>Z81</td> 
        <td>No bin was found for this pan</td> 
    </tr> 
</table>

### On Pay call

<table class="payment-token-table">
<thead>
<tr>
<th style="color:#428dff;" colspan="2">Successful Response</th>
</tr>
</thead> 
    <tr>
        <th>Response Code</th> 
        <th>Description</th> 
    </tr>
    <tr> 
        <td>00</td> 
        <td>Approved by Financial Institution</td>
    </tr>
    <tr> 
        <td>T0</td> 
        <td>Continue Transaction</td> 
    </tr>
</table>


<table class="payment-token-table">
<thead>
<tr>
<th style="color:#428dff;" colspan="2">Error Response</th>
</tr>
</thead> 
    <tr> 
        <th>Response Code</th> 
        <th>Description</th> 
    </tr>  
    <tr> 
        <td>XS1</td> 
        <td>Your payment has exceeded the time required to pay.</td>
    </tr>
    <tr> 
        <td>Z1</td> 
        <td>Transaction Error.</td> 
    </tr>
    <tr> 
        <td>Z5</td> 
        <td>PAYMENT_ALREADY_PROCESSED</td>
    </tr>
    <tr> 
        <td>T1</td> 
        <td>CANNOT_GENERATE_OTP</td>
    </tr>
    <tr> 
        <td>X03</td> 
        <td>Amount greater than daily transaction limit</td>
    </tr>
    <tr> 
        <td>54</td> 
        <td>Expired Card</td>
    </tr>
    <tr> 
        <td>55</td> 
        <td>Incorrect Pin</td>
    </tr>
    <tr> 
        <td>91</td> 
        <td>Issuer or Switch Inoperative</td>
    </tr>
    <tr> 
        <td>56</td> 
        <td>No card Record</td>
    </tr>
</table>

### On Authenticate Call

<table class="payment-token-table">
<thead>
<tr>
<th style="color:#428dff;" colspan="2">Successful Response</th>
</tr>
</thead>
    <tr> 
        <th>Response Code</th> 
        <th>Description</th> 
    </tr>
    <tr> 
        <td>00</td> 
        <td>Approved by Financial Institution</td>
    </tr>
</table>

<table class="payment-token-table">
<thead>
<tr>
<th style="color:#428dff;" colspan="2">Error Response</th>
</tr>
</thead>
    <tr> 
        <th>Response Code</th> 
        <th>Description</th> 
    </tr>
    <tr> 
        <td>T1</td> 
        <td>INVALID_TOKEN_SUPPLIED</td>
    </tr>
    <tr> 
        <td>91</td> 
        <td>Issuer or Switch Inoperative</td>
    </tr> 
</table>



## Additional Information

For more details on how to integrate with Interswitch Hosted Fields, see the [official documentation](https://developer.interswitchgroup.com/docs/payment-gateway/hosted-fields/#introduction)

---
**NOTE**

Do note that the details used in this project only works for test purposes. For information on how to integrate on production, contact [Interswitch Support](https://help.interswitchgroup.com/) 

---


