/**
 * Script Name: 
 * 
 * Generated using  New Relic Synthetics Formatter for Katalon
 *
 * Feel free to explore, or check out the full documentation
 * https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/scripting-monitors/writing-scripted-browsers
 * for details.
 */

/** CONFIGURATIONS **/

// Theshold for duration of entire script - fails test if script lasts longer than X (in ms)
var ScriptTimeout = 180000;
// Script-wide timeout for all wait and waitAndFind functions (in ms)
var DefaultTimeout = 60000;
// Change to any User Agent you want to use.
// Leave as "default" or empty to use the Synthetics default.
var UserAgent = "default";

/** HELPER VARIABLES AND FUNCTIONS **/

const assert = require('assert'),
	By = $driver.By,
	browser = $browser.manage()
/** BEGINNING OF SCRIPT **/

console.log('Starting synthetics script: ');
console.log('Default timeout is set to ' + (DefaultTimeout/1000) + ' seconds');

/** Read Token from Vault */
const fs = require('fs');
const config = {
  apiVersion: 'v1',
  endpoint: $env.USER_DEFINED_VARIABLES.VAULT_ADDR,
  token: $env.USER_DEFINED_VARIABLES.VAULT_TOKEN,
  requestOptions: {
    ca: fs.readFileSync('/etc/ca-certificates/ca-bundle.crt'),
  }
};

const vault = require('node-vault')(config);

const vault_read = async (secretPath) => {
  try {
    const dataFromVault = await vault.read(secretPath);
    // return dataFromVault.data.token;
    return dataFromVault;
  } catch (err) {
    throw new Error(`Vault: ${err.message}`);
  }
};

const sidPath = 'secret/sre/raw/aloha/svc_zabbix_aloha/sid';
let aloha_sid = null;
(async () => {
    aloha_sid = await vault_read(sidPath);
    console.log("Vault aloha SID has been returned !");
})();


// Setting User Agent is not then-able, so we do this first (if defined and not default)
if (UserAgent && (0 !== UserAgent.trim().length) && (UserAgent != 'default')) {
  $browser.addHeader('User-Agent', UserAgent);
  console.log('Setting User-Agent to ' + UserAgent);
}

// Get browser capabilities and do nothing with it, so that we start with a then-able command
$browser.getCapabilities().then(function () { })
    .then(() => {
            $browser.sleep(4000);
        })
	.then(() => {
            logger.log(1, "Opened browser with aloha.my.salesforce.com");
            let url = 'https://aloha.my.salesforce.com/secur/frontdoor.jsp?sid=' + aloha_sid.data.sid;
            console.log('Before URL call :' + url);
            return $browser.get(url);
        })
	.then(() => {
            // etsf             - //*[@id="0H4d0000000CjacCAC"]/a  - Able to load home page 
            // Org62            - //*[@id="0H4d000000001YwCAI"]/a  - back to sign-on page
            // Volunteerforce   - //*[@id="0H40W0000010wm6SAA"]/a  - back to sign-on page
            // Org chart        - //*[@id="0H4d0000001DWi5CAG"]/a  - HTTP ERROR 500 
            // leaseacclerator  -                                  - working implemented by david
            // peopleforce      - //*[@id="0H4d000000002ETCAY"]/a  - back to sign-on page
            // supportforce     - //*[@id="0H4d000000001Z1CAI"]/a  - back to sign-on page

            //logger.log(2, "click on Title Element");
            return $browser.waitForAndFindElement(By.xpath('//*[@id="0H4d000000001Z1CAI"]/a'), DefaultTimeout)
                .then(function (el) {
                    el.click();
                })
        })
    
	// .then(() => {
                // Lease Accelerator
    //         logger.log(4, "Open https://aloha.my.salesforce.com/idp/login?app=0sp0W0000010wLz&RelayState=https://www.leaseaccelerator.com/auth/logon");
    //         return $browser.get("https://aloha.my.salesforce.com/idp/login?app=0sp0W0000010wLz&RelayState=https://www.leaseaccelerator.com/auth/logon");
    //     })
    
    .then(() => {
            
            //ETSF - working
            // title url - https://aloha.my.salesforce.com/idp/login?app=0spd0000000PB2r
            //return $browser.get("https://aloha.my.salesforce.com/idp/login?app=0spd0000000PB2r");
            
            //Volunteerforce - notworking - back to Sign-on page
            // title url - https://aloha.my.salesforce.com/idp/login?app=0sp0W000001Hisy
            //return $browser.get("https://aloha.my.salesforce.com/idp/login?app=0sp0W000001Hisy");
            
            // Org62 tiles - Not working - back to Sign-on page
            // title url - https://aloha.my.salesforce.com/idp/login?app=0spd0000000Cafs
            // Home url - https://org62.lightning.force.com/lightning/page/home
            // Login page - ?
            //return $browser.get("https://aloha.my.salesforce.com/idp/login?app=0spd0000000Cafs");

            //Orgchart - Error 500
            // title url - https://orgchart.it.salesforce.com/
            //return $browser.get("https://orgchart.it.salesforce.com/login");

            //Peopleforce - notworking - back to Sign-on page
            // title url - https://aloha.my.salesforce.com/idp/login?app=0spd0000000CajV
            //return $browser.get("https://aloha.my.salesforce.com/idp/login?app=0spd0000000CajV");

            //supportforce - notworking - back to sign-on page
            //title url - https://aloha.my.salesforce.com/idp/login?app=0spd0000000Cafx
            return $browser.get("https://aloha.my.salesforce.com/idp/login?app=0spd0000000Cafx");


            
        })
    .then(() => {
            $browser.waitForPendingRequests();
            $browser.sleep(5000);
        })
    // .then(() => {
    //         logger.log(9, "verify text of /html/body/div[2]/div/div/div[1]/div/form/ul[1]/li[1]/a includes Home");
    //         return $browser.waitForAndFindElement(By.xpath('//*[@id="navBarHomeLink"]/a'), DefaultTimeout)
    //             .then(function(el){
    //                 return el.getText().then(function(text){
    //                     var found = text.includes("Home");
    //                     // assert.equal(true, found, "Verification failed! Unable to find text Home in element /html/body/div[2]/div/div/div[1]/div/form/ul[1]/li[1]/a" +text);
    //                     assert.equal(true, found, "Verification OK! able to find text Home in element //*[@id=\"navBarHomeLink\"]/a" +text);
    //                 })
    //             })
    //     })
	// .then(() => {
    //         logger.log(8, "clickElement xpath=//img");
    //         return $browser.waitForAndFindElement(By.xpath("//img"), DefaultTimeout)
    //             .then(function (el) {
    //                 el.click();
    //             })
    //     })
	// .then(() => {
    //         logger.log(9, "clickElement link=Log Out");
    //         return $browser.waitForAndFindElement(By.linkText("Log Out"), DefaultTimeout)
    //             .then(function (el) {
    //                 el.click();
    //             })
    //     })
	.then(function() {
		logger.end();
		console.log('Browser script execution SUCCEEDED.');
	}, function(err) {
		logger.end();
		console.log ('Browser script execution FAILED.');
		throw(err);
	});


//** Export Functions
const logger=(function (timeout=3000, mode='production') {

    var startTime = Date.now(),
        stepStartTime = Date.now(),
        prevMsg = '',
        prevStep = 0;


    if (typeof $util == 'undefined'  ){
        $util = {
            insights: {
                set: (msg) => {
                    console.log(`dryRun: sending to Insights using ${msg}`)
                }
            }
        }

    }

    function log(thisStep, thisMsg) {

        if (thisStep > prevStep && prevStep != 0) {
            end()
        }

        stepStartTime = Date.now() - startTime;

        if (mode != "production") {
            stepStartTime = 0

        }

        console.log(`Step ${thisStep}: ${thisMsg} STARTED at ${stepStartTime}ms.`);

        prevMsg = thisMsg;
        prevStep = thisStep;

    }

    function end() {
        var totalTimeElapsed = Date.now() - startTime;
        var prevStepTimeElapsed = totalTimeElapsed - stepStartTime;

        if (mode != 'production') {
            prevStepTimeElapsed = 0
            totalTimeElapsed = 0
        }

        console.log(`Step ${prevStep}: ${prevMsg} FINISHED. It took ${prevStepTimeElapsed}ms to complete.`);

        $util.insights.set(`Step ${prevStep}: ${prevMsg}`, prevStepTimeElapsed);
        if (timeout > 0 && totalTimeElapsed > timeout) {
            throw new Error('Script timed out. ' + totalTimeElapsed + 'ms is longer than script timeout threshold of ' + timeout + 'ms.');
        }
    }

    return {
        log,
        end
    }
})(ScriptTimeout)