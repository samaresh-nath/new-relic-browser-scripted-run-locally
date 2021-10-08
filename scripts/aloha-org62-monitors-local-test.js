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

/** Uncommented this section of code block if we need to verify our code locally */
/** Need to install selenium-webdriver install locally */

// Create Synthetic scripted browsers provide access the variable $driver & $browser

/** Trying iwth option 1 - https://discuss.newrelic.com/t/local-development-of-scripts/31468/3 -*/

// For running Locally
var assert = require('assert');
require("chromedriver");
$driver = require('selenium-webdriver');
$browser = new $driver.Builder().withCapabilities($driver.Capabilities.chrome()).build();

$browser.waitForElement = function (locatorOrElement, timeoutMsOpt) {
    return $browser.wait($driver.until.elementLocated(locatorOrElement), timeoutMsOpt || 1000, 'Timed-out waiting for element to be located using: ' + locatorOrElement);
  };
$browser.waitForAndFindElement = function (locatorOrElement, timeoutMsOpt) {
    return $browser.waitForElement(locatorOrElement, timeoutMsOpt)
      .then(function (element) {
        return $browser.wait($driver.until.elementIsVisible(element), timeoutMsOpt || 1000, 'Timed-out waiting for element to be visible using: ' + locatorOrElement)
          .then(function () {
            return element;
          });
      });
    };


// /** Read Token from Vault */
const fs = require('fs');
const config = {
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,     
  token: process.env.VAULT_TOKEN,    
  requestOptions: {
    //ca: fs.readFileSync('/etc/ca-certificates/ca-bundle.crt'),
    ca: fs.readFileSync('C:/Users/samaresh.nath/SAMARESH-WORKSPACE/ca-bundle.crt'),

  }
};

/** ############# End Local Testing ################################## */

/** For New Relic Browser */

/** Uncommented this section when deply on the NR Synthetic monitor */
/** HELPER VARIABLES AND FUNCTIONS **/

// const assert = require('assert');
// 	By = $driver.By,
//     browser = $browser.manage()

/** BEGINNING OF SCRIPT **/

/** Read Token from Vault */

// const fs = require('fs');
// const config = {
//   apiVersion: 'v1',
//   endpoint: $env.USER_DEFINED_VARIABLES.VAULT_ADDR,
//   token: $env.USER_DEFINED_VARIABLES.VAULT_TOKEN,
//   requestOptions: {
//     ca: fs.readFileSync('/etc/ca-certificates/ca-bundle.crt'),
//   }
// };

/** End of NR Synthetic monitor */

console.log('Starting synthetics script: monitoring-aloha-org62');
console.log('Default timeout is set to ' + (DefaultTimeout/1000) + ' seconds');

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
    //console.log('SID Value :' + aloha_sid.data.sid);
})();

//Setting User Agent is not then-able, so we do this first (if defined and not default)
if (UserAgent && (0 !== UserAgent.trim().length) && (UserAgent != 'default')) {
  $browser.addHeader('User-Agent', UserAgent);
  console.log('Setting User-Agent to ' + UserAgent);
}

// Get browser capabilities and do nothing with it, so that we start with a then-able command
$browser.getCapabilities().then(function () { })
    .then(() => {
        console.log('This sleep is required to get the value from vault .. !!');
        return $browser.sleep(8000);
     })
	.then(() => {
            logger.log(1, "Opened browser with aloha.my.salesforce.com");
            let url = 'https://aloha.my.salesforce.com/secur/frontdoor.jsp?sid=' + aloha_sid.data.sid;
            console.log('Before URL call :' + url);
            return $browser.get(url);
    })
    // click on the tile to open the specific app 
    .then(() => {
        logger.log(2, "Click Aloha tile element to open the app.. !");
        return $browser.waitForAndFindElement($driver.By.xpath("//*[@id='0H4d000000001YwCAI']/a"), DefaultTimeout)
            .then(function (el) {
                //console.log("Element Found .. //*[@id='0H4d000000001ZVCAY']/a ");
                el.click();
            },function(err){
                if (err.state){
                    console.log("Element NOT FOUND ... //*[@id='0H4d000000001ZVCAY']/a");
                }else{
                    $drive.promise.rejected(err);
                }
            })
    })
    // https://aloha.my.salesforce.com/idp/login?app=0spd0000000CagR
    // .then(() => {
    //     logger.log(3, "Open https://aloha.my.salesforce.com/idp/login?app=0spd0000000CagR");
    //     return $browser.get("https://aloha.my.salesforce.com/idp/login?app=0spd0000000CagR");
    // })
    // .then(() => {
    //     console.log("Waiting before search to view profile icon ...")
    //     //$browser.sleep(5000);
    // })

    // Search the specific element on the app page and validate it
    // .then(() => {
    //     logger.log(3, "verify text of Items to Approve");
    //     return $browser.waitForAndFindElement($driver.By.xpath('//*[@id="pendingApprovalCardHeader_490:0"]/span'), DefaultTimeout)
    //     //return $browser.waitForAndFindElement(xpath("//div[@id='quicktasks']/div/div/small"), DefaultTimeout)
    //         .then((el) => {
    //             return el.getText()
    //         })
    //         .then(function(text){
    //             var found = text.includes("Items to Approve");
    //             console.log("Text found : " + found)
    //         })
    //         .catch(() => {
    //             console.log('Element not found')
    //         })
    //             // .then(function(text){
    //             //     var found = text.includes("Hello, Zabbix");
    //             //     assert.equal(true, found, "Verification failed! Unable to find text Hello, Zabbix in element xpath=//div[@id=\'quicktasks\']/div/div/small. Text: " +text);
    //             // })
    //         //})
    //  })

    // .then(() => {
    //         logger.log(5, "clickElement LMS Update");
    //         return $browser.waitForAndFindElement($driver.By.linkText("Aloha Zabbix Service Account"), DefaultTimeout)
    //             .then(function (el) {
    //                 el.click();
    //             })
    // })

    //End iwth session id ##########################
    // .then(() => {
    //         logger.log(10, "Logout from Aloha SSO");
    //           return await $browser.get("https://aloha.my.salesforce.com/secur/logout.jsp");
              
    // })

    // Logout step from Org62
    // .then(() => {
    //     logger.log(4, "click View profile ...");
    //     $browser.sleep(4000);
    //     return $browser.waitForAndFindElement($driver.By.xpath("//*[@id='tt-for-99:218;a']"), DefaultTimeout)
    //         .then(function (el) {
    //             return el.click();
    //         })
    //         .catch(() => {
    //             console.log('Element not found')
    //         })
    // })
    // .then(() => {
    //         logger.log(5, "clickElement link=Log Out");
    //         return $browser.waitForAndFindElement($driver.By.linkText("Log Out"), DefaultTimeout)
    //             .then(function (el) {
    //                 el.click();
    //             })
    // })
    // .then(() => {
    //     console.log('Ending sleep .. !!')
    //     //$browser.sleep(5000);
    // })

	.then(function() {
		logger.end();
		console.log('Browser script execution SUCCEEDED.');
        //$browser.quit();
	}, function(err) {
		logger.end();
		console.log ('Browser script execution FAILED.');
		//$browser.quit();
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
