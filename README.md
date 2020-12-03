# Interswitch-HostedFields-Payment-Integration-AfricaHacks
Integrating to Interswitch Hosted Fields for payments, an SDK designed for non PCI DSS(Payment Card Industry Data Security Standard) compliant merchants

## Introduction
The [Payment Card Industry Data Security Standard (PCI DSS)](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard#Requirements) is a set of requirements intended to ensure that all companies that process, store, or transmit credit card information maintain a secure environment.

There are [12 requirements](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard#Requirements) merchants must meet before they can be deemed fit to proces, store or transmit credit card information, however, not all merchants or businesses are PCIDSS compliant and this is where hosted fields SDK comes in 

Hosted Fields is an SDK designed by Interswitch Group for businesses who are non PCIDSS compliant to integrate with it's payment gateway giving you control over how your checkout page feels. 

With hosted fields, you can host Interswitch's payment gateway on your domain and present the fields to your users in an iframe to handle input of the following payments fields: **Expiry Date**, **CVV**, **PIN** and **OTP** on your checkout page. This gives you the control over the look and feel of your checkout page while ensuring that you are compliant with PCIDSS requirements.

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

To start using Hosted Fields, you need to create a basic HTML checkout form. You will need to define containers that will hold the iframe input fields for the following inour fields (Card Number, Expiry Date, CVV, PIN, OTP). Here is a sample form that uses Hosted Fields. 

### Method 1

<br>

<strong>Hosted Fields Demo</strong>

<p class="codepen" data-height="601" data-theme-id="dark" data-default-tab="js,result" data-user="basitomania" data-slug-hash="GRKyRrW" style="height: 601px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Hosted Fields: Demo">
  <span>See the Pen <a href="https://codepen.io/basitomania/pen/GRKyRrW/">
  Hosted Fields: Demo</a> by Abdulkareem Abdulbasit (<a href="https://codepen.io/basitomania">@basitomania</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<br>


### Method 2

<br>

<strong>Custom WebPay Hosted Field</strong>

<p class="codepen" data-height="601" data-theme-id="dark" data-default-tab="js,result" data-user="edyasikpo" data-slug-hash="JjdBomo" style="height: 601px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Hosted Fields: Demo">
  <span>See the Pen <a href="https://codepen.io/edyasikpo/pen/JjdBomo">
  Custom WebPay Hosted Field</a> by Edidiong Asikpo (<a href="https://codepen.io/edyasikpo/pen/JjdBomo">@edyasikpo</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<br>

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
