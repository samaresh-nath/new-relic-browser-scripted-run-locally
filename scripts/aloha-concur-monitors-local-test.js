/**
 * Script Name: monitoring-aloha-org62
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

/** Trying iwth option 1 - https://discuss.newrelic.com/t/local-development-of-scripts/31468/3 - With this getting output but still some issues exists*/
var assert = require('assert');
require("chromedriver");
$driver = require('selenium-webdriver');
$browser = new $driver.Builder().withCapabilities($driver.Capabilities.chrome()).build();

// $browser.waitForAndFindElement = function (el, timeout) {
//     return $browser.wait($driver.until.elementLocated(el), timeout)
//         .then(() => $browser.findElement(el));
// }

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
// require("chromedriver");
// var webdriver = require('selenium-webdriver');

// var $driver = new webdriver.Builder()
//    .withCapabilities(webdriver.Capabilities.chrome())
//    .build();

// $browser.waitForAndFindElement = function (el, timeout) {
//     return $browser.wait($driver.until.elementLocated(el), timeout)
//         .then(() => $browser.findElement(el)
//   };

//var $browser = $driver;

/** Tring option 2 to run code locally - https://discuss.newrelic.com/t/local-development-of-scripts/31468/3  -- Not getting correct output */
// var assert = require('assert'),
// $driver = require('selenium-webdriver');

// var $browser = new $driver.Builder()
//     .forBrowser('chrome')
//     .build();

// $browser.waitForElement = async (locatorOrElement, timeoutMsOpt) => {
//     return $browser.wait($driver.until.elementLocated(locatorOrElement), timeoutMsOpt || 1000, 'Timed-out waiting for element to be located using: ' + locatorOrElement);
// };

// $browser.waitForAndFindElement = async (locatorOrElement, timeoutMsOpt) => {
//     return $browser.waitForElement(locatorOrElement, timeoutMsOpt)
//         .then((element) => {
//             return $browser.wait($driver.until.elementIsVisible(element), timeoutMsOpt || 1000, 'Timed-out waiting for element to be visible using: ' + locatorOrElement)
//                 .then(function () {
//                 return element;
//                 });
//         });
// };

// end option 2

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

/** ############# End Locally Testing ################################## */

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

// const svcPath = 'secret/sre/auth/ad/svc_zabbix_aloha';
// let svc_zabbixapi_pass = null;
// (async () => {
//   svc_zabbixapi_pass = await vault_read(svcPath);
//   console.log("Vault esas_support_api has been returned !");
// })();

// const tokenPath = 'secret/sre/raw/aloha/svc_zabbix_aloha/token';
// let aloha_token = null;
// (async () => {
//   aloha_token = await vault_read(tokenPath);
//   console.log("Vault aloha token has been returned !");
// })();


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
        logger.log(2, "clickElement xpath=//li[@id=\'0H4d000000001ZVCAY\']/a/div[2]/p");
        return $browser.waitForAndFindElement($driver.By.xpath("//*[@id='0H4d000000001ZVCAY']/a"), DefaultTimeout)
        //return $browser.waitForAndFindElement(xpath("//*[@id='0H4d000000001ZVCAY']/a"), DefaultTimeout)
            .then(function (el) {
                console.log("Element Found .. //*[@id='0H4d000000001ZVCAY']/a ");
                el.click();
            },function(err){
                if (err.state){
                    console.log("Element NOT FOUND ... //*[@id='0H4d000000001ZVCAY']/a");
                }else{
                    $drive.promise.rejected(err);
                }
            }
            )
    })
    // https://aloha.my.salesforce.com/idp/login?app=0spd0000000CagR
    // .then(() => {
    //     logger.log(3, "Open https://aloha.my.salesforce.com/idp/login?app=0spd0000000CagR");
    //     return $browser.get("https://aloha.my.salesforce.com/idp/login?app=0spd0000000CagR");
    // })
    // .then(() => {
    //     $browser.sleep(5000);
    // })
    .then(() => {
        logger.log(4, "verify text of xpath=//div[@id=\'quicktasks\']/div/div/small includes Hello, Zabbix");
        return $browser.waitForAndFindElement($driver.By.xpath("//div[@id='quicktasks']/div/div/small"), DefaultTimeout)
        //return $browser.waitForAndFindElement(xpath("//div[@id='quicktasks']/div/div/small"), DefaultTimeout)
            .then((el) => {
                return el.getText()
            })
            .catch(() => {
                console.log('Element not found')
            })
                // .then(function(text){
                //     var found = text.includes("Hello, Zabbix");
                //     assert.equal(true, found, "Verification failed! Unable to find text Hello, Zabbix in element xpath=//div[@id=\'quicktasks\']/div/div/small. Text: " +text);
                // })
            //})
     })
    //End iwth session id ##########################
    // .then(() => {
    //         logger.log(10, "Logout from Aloha SSO");
    //           return await $browser.get("https://aloha.my.salesforce.com/secur/logout.jsp");
              
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
