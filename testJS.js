/*
The MIT License (MIT)

Copyright (c) 2015 Abraham TEWA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*

This software include the following third-party programs :

   MustacheJS
   Original Source:    https://github.com/janl/mustache.js/
   Original Copyright: Copyright (c) 2009 Chris Wanstrath
                       Copyright (c) 2010-2014 Jan Lehnardt
   Original License:   MIT


   Mocha
   Original Source:     http://mochajs.org/
   Original Copyright:  Copyright (c) 2011-2015 TJ Holowaychuk <tj@vision-media.ca>
   Original License:    MIT

 */

/**
 *
 * Example :
 *
 * test('test success', true);                          // success
 *
 * test('test fail', false);                            // fail
 *
 * test('1', 1).toEqual(1);                             // success
 * test('1', 1).toEqual('1');                           // success
 * test('1', 1).strict.toEqual('1');                    // fail
 * test('1', 1).not.toEqual('1');                       // false
 * test('1', 1).not.strict.toEqual('1');                // success
 *
 * test.section('Groups');
 *
 * test('group true', function() {
 *    return true;
 * });                                                  // success
 *
 * test('group 1, no return', function() {
 *    test('innerGroup : test success', true);
 *    test('innerGroup : test failed', false);
 * });
 *
 *
 * test.section('Async');
 *
 * test.async('asyncFunction', function() {
 *    return 1;
 * }).toEqual(1); // success
 *
 * test.async('asyncFunction', function() {
 *
 *    test('asyncFunction : success', true);            // success
 *    return 'a value';
 *
 * }).then(function(test, value) {
 *    test('async.then', value).toBeInstanceof(String); // success
 *    return 1
 * }).toEqual(1);                                       // success
 *
 */

(function (global, nonStrictFunction) {
   'use strict';

   var define, lang, exports, Mustache, tests;
   exports = Mustache = {};

   nonStrictFunction.groupCollapsed = function() {
      nonStrictFunction.Console_groupCollapsed.apply(console, arguments);
   };

   nonStrictFunction.groupEnd = function() {
      nonStrictFunction.Console_groupEnd.apply(console, arguments);
   };

   nonStrictFunction.warn = function() {
      nonStrictFunction.Console_warn.apply(console, arguments);
   };

   nonStrictFunction.log = function() {
      nonStrictFunction.Console_warn.apply(console, arguments);
   };

   define = function () //noinspection JSLint
   {};
   define.amd = undefined;

   /**
    *
    * @type {Promise}
    */
   var promiseResolved = Promise.resolve();

   /*
          *    - startDate
       *    - endDate
       *    - duration
       *    - second
       *    - countTotal
       *    - countSuccess
       *    - countFail
       *    - yes
       *    - no
    */

   lang = { section : { startDate    : 'Start date'
                      , endDate      : 'End date'
                      , duration     : 'Duration'
                      , second       : 'second'
                      , countTotal   : 'total'
                      , countSuccess : 'success'
                      , countFail    : 'fails'
                      , yes          : 'yes'
                      , no           : 'no'}
          , test    : { startTime    : 'Start time'
                      , endTime      : 'End time'
                      , duration     : 'Duration'
                      , second       : 'second'
                      , countTotal   : 'Tests'
                      , countSuccess : 'Successes'
                      , fail_plural  : 'fails'
                      , fail         : 'fail'
                      , yes          : 'yes'
                      , no           : 'no'}};

   // End of mustache.js

   /**
    * @typedef {Object} TestExport
    * @property {SectionExport[]} sections
    *
    */

   /**
    * @typedef {Object} SectionExport
    * @property {TestUnitExport[]} testUnits
    * @property {string}           title
    *
    */

   /**
    * @typedef {Object} TestUnitExport
    * @property {boolean}          async
    * @property {TestExport}       childTests
    * @property {TestUnitExport[]} nextTest
    * @property {boolean}          not
    * @property {boolean}          strict
    * @property {string}           title
    * @property {string}           type
    *
    */

   var common = (function() {

      // Mustache
      /*!
      * mustache.js - Logic-less {{mustache}} templates with JavaScript
      * http://github.com/janl/mustache.js
      */
      (function(global,factory){if(typeof exports==="object"&&exports){factory(exports)}else if(typeof define==="function"&&define.amd){define(["exports"],factory)}else{factory(global.Mustache={})}})(this,function(mustache){var Object_toString=Object.prototype.toString;var isArray=Array.isArray||function(object){return Object_toString.call(object)==="[object Array]"};function isFunction(object){return typeof object==="function"}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var RegExp_test=RegExp.prototype.test;function testRegExp(re,string){return RegExp_test.call(re,string)}var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};function escapeHtml(string){return String(string).replace(/[&<>"'\/]/g,function(s){return entityMap[s]})}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tags){if(typeof tags==="string")tags=tags.split(spaceRe,2);if(!isArray(tags)||tags.length!==2)throw new Error("Invalid tags: "+tags);openingTagRe=new RegExp(escapeRegExp(tags[0])+"\\s*");closingTagRe=new RegExp("\\s*"+escapeRegExp(tags[1]));closingCurlyRe=new RegExp("\\s*"+escapeRegExp("}"+tags[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length)}else{nonSpace=true}tokens.push(["text",chr,start,start+1]);start+=1;if(chr==="\n")stripSpace()}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||"name";scanner.scan(whiteRe);if(type==="="){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type==="{"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type="&"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error("Unclosed tag at "+scanner.pos);token=[type,value,start,scanner.pos];tokens.push(token);if(type==="#"||type==="^"){sections.push(token)}else if(type==="/"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start)}else if(type==="name"||type==="{"||type==="&"){nonSpace=true}else if(type==="="){compileTags(value)}}openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==="text"&&lastToken&&lastToken[0]==="text"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":case"^":collector.push(token);sections.push(token);collector=token[4]=[];break;case"/":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function(){return this.tail===""};Scanner.prototype.scan=function(re){var match=this.tail.match(re);if(!match||match.index!==0)return"";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view==null?{}:view;this.cache={".":this.view};this.parent=parentContext}Context.prototype.push=function(view){return new Context(view,this)};Context.prototype.lookup=function(name){var cache=this.cache;var value;if(name in cache){value=cache[name]}else{var context=this,names,index;while(context){if(name.indexOf(".")>0){value=context.view;names=name.split(".");index=0;while(value!=null&&index<names.length)value=value[names[index++]]}else if(typeof context.view=="object"){value=context.view[name]}if(value!=null)break;context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.cache={}}Writer.prototype.clearCache=function(){this.cache={}};Writer.prototype.parse=function(template,tags){var cache=this.cache;var tokens=cache[template];if(tokens==null)tokens=cache[template]=parseTemplate(template,tags);return tokens};Writer.prototype.render=function(template,view,partials){var tokens=this.parse(template);var context=view instanceof Context?view:new Context(view);return this.renderTokens(tokens,context,partials,template)};Writer.prototype.renderTokens=function(tokens,context,partials,originalTemplate){var buffer="";var self=this;function subRender(template){return self.render(template,context,partials)}var token,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":value=context.lookup(token[1]);if(!value)continue;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate)}}else if(typeof value==="object"||typeof value==="string"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate)}else if(isFunction(value)){if(typeof originalTemplate!=="string")throw new Error("Cannot use higher-order sections without the original template");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate)}break;case"^":value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)buffer+=this.renderTokens(token[4],context,partials,originalTemplate);break;case">":if(!partials)continue;value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null)buffer+=this.renderTokens(this.parse(value),context,partials,value);break;case"&":value=context.lookup(token[1]);if(value!=null)buffer+=value;break;case"name":value=context.lookup(token[1]);if(value!=null)buffer+=mustache.escape(value);break;case"text":buffer+=token[1];break}}return buffer};mustache.name="mustache.js";mustache.version="1.0.0";mustache.tags=["{{","}}"];var defaultWriter=new Writer;mustache.clearCache=function(){return defaultWriter.clearCache()};mustache.parse=function(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function(template,view,partials){return defaultWriter.render(template,view,partials)};mustache.to_html=function(template,view,partials,send){var result=mustache.render(template,view,partials);if(isFunction(send)){send(result)}else{return result}};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer});

      /**
       *
       * @param value
       * @returns {*}
       */
      function copy(value) {
         return JSON.parse(JSON.stringify(value))
      }

      /**
       *
       * text from http://ksblog.org/index.php?q=lpad-rpad-functions-javascript&id=44
       */
      var lpad                                      = function lpad(originalstr, length, strToPad) {
          while (originalstr.length < length)
              originalstr = strToPad + originalstr;
          return originalstr;
      };

      function render2dom(template, value) {

         var /** @type {HTMLElement} */ div
           , /** @type {string}      */ htmlString;

         htmlString = Mustache.render(template, value);

         div = document.createElement('div');
         div.innerHTML = htmlString;

         return div.firstChild;
      }

      /**
       *
       * @param {number} time
       * @returns {string}
       */
      function time2string(time) {

         var /** @type {string} */ timeString
           , /** @type {number} */ hours
           , /** @type {number} */ minutes
           , /** @type {number} */ seconds
           , /** @type {number} */ milliseconds;

         if (time === undefined)
            return '';

         hours = Math.floor(time / (60 * 60 * 1000));
         time -= hours * 60 * 60 * 1000;

         minutes = Math.floor(time / (60 * 1000));
         time -= minutes * 60 * 1000;

         seconds = Math.floor(time / 1000);
         time -= seconds * 1000;

         milliseconds = time;

         timeString = hours + 'h' + lpad(minutes, 2, '0') + 'm' + lpad(milliseconds, 4, '0');

         return timeString;
      }

      return { copy        : copy
             , render2dom  : render2dom
             , time2string : time2string}

   })();

   /**
    *
    * @param {Project} project
    * @param {string}  [title]        Title of the section
    * @param {boolean} defaultSection If true, then this section is the default section of the parent
    * @param {TestUnit} parent
    * @constructor
    * @class Section
    * @extend Promise
    * @property {boolean|undefined}   _isSuccessful
    * @property {boolean|undefined}   asyncTests
    * @property {boolean}             defaultSection
    * @property {DOMSection}          domSection
    * @property {string}              description
    * @property {boolean}             _hasFinished
    * @property {TestUnit[]}          tests
    * @property {string}              title
    */
   var Section                                   = function Section(project, title, defaultSection, parent) {

      this.id             = Section.maxID++;
      this.title          = title;
      this.tests          = [];
      this.project        = project;
      this.parent         = parent;
      this.defaultSection = defaultSection;

      this.results        = { count     : { errors    : 0
                                          , fails     : 0
                                          , successes : 0
                                          , total     : 0}};

   };

   /**
    *
    * @param {TestUnit} test
    */
   Section.prototype.addTest                     = function addTest(test) {

      var /** @type {TestUnit|Section} */ parent;

      this.tests.push(test);

      this.then(function() {
         return test;
      });

      if (this.asyncTests !== undefined && this.asyncTests === false) {
         if (test.hasAsyncTests()) {
            this.asyncTests = true;

            parent = this.parent;

            // Updating parents : we all the parents who call the
            while(parent !== undefined && (parent ? parent : {}).asyncTests !== true) {
               parent.asyncTests = true;
               parent = parent.parent;
            }
         }
      }
   };

   /**
    *
    * @param {number} [deltaErrors]
    * @param {number} [deltaFails]
    * @param {number} [deltaSuccesses]
    * @param {number} [deltaTotal]
    */
   Section.prototype.refresh                       = function refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal) {
      var /** @type {number} */ errors
        , /** @type {number} */ fails
        , /** @type {number} */ successes
        , /** @type {number} */ t
        , /** @type {number} */ total;

      if (deltaTotal !== undefined && this.results.count.fails !== undefined) {
         this.results.count.errors    += deltaErrors;
         this.results.count.fails     += deltaFails;
         this.results.count.successes += deltaSuccesses;
         this.results.count.total     += deltaTotal;
      }
      else {
         errors    = this.results.count.errors;
         fails     = this.results.count.fails;
         successes = this.results.count.successes;
         total     = this.results.count.total;

         this.results.count.errors    = 0;
         this.results.count.fails     = 0;
         this.results.count.successes = 0;
         this.results.count.total     = 0;

         for(t in this.tests) {
            this.results.count.errors    += this.tests[t].countErrors();
            this.results.count.fails     += this.tests[t].countFailedTests();
            this.results.count.successes += this.tests[t].countSuccessfulTests();
            this.results.count.total     += this.tests[t].countTotalTests();
         }

         if (this.results.count.total !== undefined) {
            deltaErrors    = errors    - this.results.count.errors;
            deltaFails     = fails     - this.results.count.fails;
            deltaSuccesses = successes - this.results.count.successes;
            deltaTotal     = total     - this.results.count.total;
         }
      }

      if (this.parent !== undefined)
         if (this.parent.results.count.total !== undefined)
            this.parent.refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal);

      if (this.getDOM())
         this.getDOM().refresh();

   };

   /**
    *
    * @param {boolean} failedOnly
    */
   Section.prototype.console                     = function(failedOnly) {

      var /** @type {number} */ successes
        , /** @type {number} */ t
        , /** @type {number} */ total;

      successes = this.countSuccessfulTests();
      total     = this.countTotalTests();

      nonStrictFunction.groupCollapsed((this.getTitle() !== undefined ? this.getTitle() + ' : ' : '') + (successes === total ? 'success' : 'fail') + ' : ' + successes + '/' + total);

      for(t in this.tests) {

         if (failedOnly)
            if (this.tests[t].isSuccessful())
               continue;

         this.tests[t].console(failedOnly);
      }

      nonStrictFunction.groupEnd();
   };

   /**
    * Return the total number of errors that hasn't been handled
    * @returns {number}
    */
   Section.prototype.countErrors                 = function() {
      return this.results.count.errors;
   };

   /**
    * Return the number of failed tests inside the section
    * @returns {number}
    */
   Section.prototype.countFailedTests            = function countFailedTests() {
      return this.results.count.fails;
   };

   /**
    *
    * @returns {number}
    */
   Section.prototype.countSuccessfulTests        = function countSuccessfulTests() {
      return this.results.count.successes;
   };

   /**
    *
    * @returns {number}
    */
   Section.prototype.countTotalTests             = function countTotalTests() {
      return this.results.count.total;
   };

   //noinspection ReservedWordAsName
   /**
    *
    * @returns {Promise}
    */
   Section.prototype.catch                       = function () {
      this._hasFinished = false;
      return Promise.prototype.catch.apply(this.getPromise(), arguments);
   };

   //noinspection JSUnusedGlobalSymbols
   /**
    * @param {string} description
    */
   Section.prototype.describe                    = function describe(description) {
      this.description = description;
   };

   /**
    * @returns {Promise}
    */
   Section.prototype.getPromise                  = function getPromise() {

      if (this.promise === undefined)
         this.promise = promiseResolved;

      return this.promise;
   };

   /**
    *
    * @return {Promise}
    */
   Section.prototype.getCompletedPromise         = function getCompletedPromise() {

      var /** @type {number} */ i
        , /** @type {Promise[]} */ promises;

      promises = [];
      for(i in this.tests) {
         promises.push(this.tests[i].getCompletedPromise());
      }

      return Promise.all(promises);
   };

   /**
    *
    * @param {boolean} [failedOnly=false]
    * @returns {SectionExport}
    */
   //noinspection ReservedWordAsName
   Section.prototype.getData                     = function getData(failedOnly) {

      var /** @type {number}      */ t
         , /** @type {TestUnit[]} */ tests;

      tests = [];
      failedOnly = failedOnly === undefined ? false : failedOnly;

      for (t in this.tests) {

         if (failedOnly)
            if (this.tests[t].isSuccessful())
               continue;

         tests.push(this.tests[t].getData());
      }

      return { tests : tests
             , title : this.title
      };
   };

   /**
    *
    * @returns {string}
    */
   Section.prototype.getDescription              = function getDescription() {
      return this.description;
   };

   /**
    *
    * @returns {DOMSection}
    */
   Section.prototype.getDOM                      = function getDOM() {
      return this.domSection;
   };

   /**
    * @returns {Date}
    */
   Section.prototype.getEndDate                  = function getEndDate() {
      if (this.tests.length === 0)
         return undefined;

      this.tests[this.tests.length - 1].getEndDate();
   };

   /**
    *
    * @returns {number|undefined}
    */
   Section.prototype.getEndTime                  = function getEndTime() {
      return this.project.getTime(this.getEndDate());
   };

   /**
    * @returns {Date}
    *
    */
   Section.prototype.getStartDate                = function getStartDate() {
      if (this.tests.length === 0)
         return undefined;

      return this.tests[0].getStartDate();
   };

   /**
    *
    * @returns {number}
    */
   Section.prototype.getStartTime                = function getStartTime() {
      return this.project.getTime(this.getStartDate());
   };

   /**
    *
    * @returns {TestUnit[]}
    */
   Section.prototype.getTests                    = function getTests() {
      return this.tests.slice(0);
   };

   /**
    * Return the title of the section
    * @returns {string|undefined}
    */
   Section.prototype.getTitle                    = function getTitle() {
      return !this.title ? '' : this.title;
   };

   /**
    *
    * @returns {boolean}
    */
   Section.prototype.hasAsyncTests               = function hasAsyncTests() {

      var /** @type {number} */ t;

      if (this.asyncTests !== undefined)
         return true;

      for(t in this.tests) {
         if (this.tests[t].hasAsyncTests()) {
            this.asyncTests = true;
            return true;
         }
      }

      return false;
   };

   Section.prototype.hasFinished                 = function hasFinished() {
      var /** @type {number} */ i;

      if (this._hasFinished)
         return this._hasFinished;

      for(i in this.tests) {
         if (!this.tests[i].hasFinished())
            return false;
      }

      this._hasFinished = true;

      return this._hasFinished;
   };

   /**
    *
    * @returns {boolean}
    */
   Section.prototype.isDefault                   = function isDefault() {
      return this.defaultSection;
   };

   /**
    *  @returns {boolean}
    */
   Section.prototype.isSuccessful                = function isSuccessful() {
      var /** @type {number}  */ i;

      if (!this.hasFinished())
         return false;

      for(i in this.tests) {
         if (!this.tests[i].isSuccessful())
            return false;
      }

      return true;
   };

   /**
    * @param {DOMSection} dom
    */
   Section.prototype.setDOM                      = function setDOM(dom) {
      this.domSection = dom;
   };

   /**
   * @returns {Promise}
   */
   Section.prototype.then                        = function() {
      this._hasFinished = false;
      return Promise.prototype.then.apply(this.getPromise(), arguments);
   };

   Section.maxID = 0;

   var Context                                   = (function() {

      /**
       * @typedef {Object} ThisTestContextInfo
       * @property {boolean}  async
       * @property {TestUnit} parent
       * @property {Project}  project
       * @property {boolean}  strict
       * @property {TestUnit} test
       *
       */

      /**
       * @typedef {Object}
       * @name ThisTestContext
       * @property {ThisTestContextInfo} info
       * @property {TestContext}         context
       *
       */

      /**
       *
       * @param {string}                    title
       * @param {*}                         [param2]
       * @param {*}                         [param3]
       * @param {number}                    [param4]
       * @name TestContext
       * @returns {TestUnit|TestContext|Section}
       * @this ThisTestContext
       * @property {TestContext}            async
       * @property {TestContext}            context
       * @property {boolean}                disabled
       * @property {function}               done
       * @property {function}               reset
       * @property {function}               setContext
       * @property {TestContext}            strict
       * @property {ThisTestContextInfo}    info
       */
      var TestContext                            = function test(title, param2, param3, param4) {

         var /** @type {number}   */ executionDelay
           , /** @type {Section}  */ section
           , /** @type {TestUnit} */ testUnit
           , /** @type {number}   */ timeout
           , /** @type {*}        */ value;

         if (arguments.length === 1) {

            if (!this.info.enabled)
               return this.context;

            section = new Section(this.info.project, title, false, this.info.test);

            this.info.test.sections.push(section);
            return section;
         }

         if (this.info.delay) {
            executionDelay = param2;
            value          = param3;
            timeout        = param4;
         }
         else {
            executionDelay = false;
            value          = param2;
            timeout        = param3;
         }

         section = this.info.test.sections[this.info.test.sections.length - 1];

         //noinspection JSUnresolvedVariable
         testUnit = new TestUnit({ async          : this.info.async
                                 , context        : this
                                 , enabled        : this.info.enabled
                                 , executionDelay : executionDelay
                                 , strict         : this.info.strict
                                 , parent         : section
                                 , project        : this.info.project
                                 , value          : value
                                 , timeout        : timeout
                                 , title          : title});

         // Adding the test to the last section
         //noinspection JSUnresolvedVariable
         section.addTest(testUnit);

         this.reset();

         return testUnit;
      };

      /**
       * @this {ThisTestContext}
       * @returns {TestContext}
       */
      var async                                  = function async() {
         if (this.info.enabled)
            this.info.async = true;

         return this.context;
      };

      /**
       *
       * @param {TestUnit} test
       * @return TestContext
       */
      var build                                  = function build(test) {

         var /** @type {ThisTestContext}     */ thisObject
           , /** @type {function}            */ testContext;

         thisObject = {info : { async   : false
                              , enabled : true
                              , delay   : false
                              , strict  : false
                              , test    : test
                              , project : test.getProject()}};

         testContext            = TestContext.bind(thisObject);
         testContext.console    = console.bind(thisObject);
         testContext.disable    = disable.bind(thisObject);
         testContext.display    = display.bind(thisObject);
         testContext.done       = done.bind(thisObject);
         testContext.getData    = getData.bind(thisObject);
         testContext.reset      = reset.bind(thisObject);
         testContext._info      = getInfo.bind(thisObject);

         Object.defineProperties(testContext, { async   : {get : async.bind(thisObject)}
                                              , delay   : {get : delay.bind(thisObject)}
                                              , parent  : {get : parent.bind(thisObject)}
                                              , project : {get : project.bind(thisObject)}
                                              , strict  : {get : strict.bind(thisObject)}});

         thisObject.context     = testContext;
         thisObject.reset       = testContext.reset;

         return testContext;
      };

      /**
       * @this {ThisTestContext}
       * @returns {TestContext}
       */
      var console                                = function console(failedOnly) {
         if (this.info.enabled)
            this.info.test.console(failedOnly);

         return this.context;
      };

      /**
       *
       * @this {ThisTestContext}
       * @returns {TestContext}
       */
      var delay                                  = function delay() {
         if (this.info.enabled)
            this.info.delay = true;

         return this.context;
      };

      /**
       * @this {ThisTestContext}
       * @returns {TestContext}
       */
      var disable                                = function disable() {
         if (this.info.enabled)
            this.info.enabled = false;

         return this.context;
      };

      /**
       *
       * @param {string|HTMLElement} location
       */
      var display                                = function display(location) {
         this.info.project.display(location)
      };

      /**
       * @this {ThisTestContext}
       * @returns {TestContext}
       */
      var done                                   = function done() {

         if (this.info.enabled)
            this.info.test.done();

         return this.context;
      };

      /**
       *
       * @param {boolean} failedOnly
       * @this {ThisTestContext}
       */
      var getData                                = function getData(failedOnly) {

         var /** @type {Object}  */ data;

         data = this.info.test.getData(failedOnly);

         return { endTime   : this.info.test.getEndTime()
                , failed    : this.info.test.countFailedTests()
                , sections  : data.sections
                , startTime : this.info.test.getStartTime()
                , success   : this.info.test.countSuccessfulTests()
                , tests     : this.info.test.countTotalTests()};
      };

      /**
       *
       * @param {Object} receivedToken
       * @this {ThisTestContext}
       * @returns {ThisTestContextInfo}
       * @constructor
       */
      var getInfo                                = function(receivedToken) {

         if (receivedToken !== token)
            throw 'Invalid token';

         return this.info;
      };

      /**
       *
       * @this {ThisTestContext}
       * @returns {TestUnit}
       */
      var parent                                 = function() {
         return this.info.test;
      };

      /**
       *
       * @returns {Project}
       * @this {ThisTestContext}
       */
      var project                                = function() {
         return this.info.test.project;
      };

      /**
       *
       * @param {Object} [receivedToken]
       * @param {Object} [info]
       * @constructor
       * @this {ThisTestContext}
       * @returns {TestContext}
       */
      var reset                                  = function(receivedToken, info) {

         var /** @type {Object} */ oldInfo;

         if (receivedToken === token) {
            oldInfo = this.info;
            this.info = info;
            //noinspection JSValidateTypes
            return oldInfo;
         }

         if (!this.info.enabled)
            return this.context;

         this.info.async   = false;
         this.info.strict  = false;
         this.info.enabled = true;

         return this.context;
      };

      /**
       * @this {ThisTestContext}
       * @returns {TestContext}
       */
      var strict                                 = function strict() {
         if (this.info.enabled)
            this.info.strict = true;

         return this.context;
      };

      return build;
   })();



   /**
    * @typedef {Object}
    * @name TestUnitParameters
    *
    * @property {boolean}             async
    * @property {TestContext}         context
    * @property {number}              executionDelay
    * @property {TestUnit|Section}    parent
    * @property {Project}             project
    * @property {string}              promiseRole
    * @property {boolean}             strict
    * @property {TestContext}         testFunction
    * @property {string}              title
    * @property {number}              timeout
    *
    */

   /**
    * @param {TestUnitParameters} param
    * @constructor
    * @class TestUnit
    * @extend {Promise.<R>}
    * @property {boolean|undefined} _hasFinished         - Indicate weither (true) or not (false) the test, and all it's child tests have end
    * @property {boolean}           _hasUnitTestFinished
    * @property {boolean}           _isClosed            - If true, the the test is closed. False other wise. A closed test can't have new child tests
    * @property {boolean}           async
    * @property {boolean|undefined} asyncTests
    * @property {TestContext}       childContext
    * @property {Date}              creationDate         - Date of creation of the test
    * @property {string}            description
    * @property {DOMTest}           domTest
    * @property {boolean}           durationResult
    * @property {boolean}           enabled
    * @property {boolean}           errorExpected
    * @property {TestUnit[]}        nexts                - Test executed right after this one, using the then/catch function
    * @property {boolean}           notMode
    * @property {TestUnit|Section}  parent
    * @property {Project}           project
    * @property {Promise}           promise
    * @property {string|undefined}  promiseRole
    * @property {boolean}           result
    * @property {Section[]}         sections
    * @property {boolean}           strictMode
    * @property {TestExecution}     testExecution
    * @property {function}          testFunction
    * @property {Array}             testParameters       - The parameter to provide to the testing function (ex: [10] for the "toBeGreaterThan" test)
    * @property {Array}             testParametersExport - Copy of the testParameter attribute that will be used for the export.
    * @property {TestType}          testType
    * @property {number|undefined}  timeout              - If provided, then correspond to the maximum duration of the test function. After that, the test will be considered has failed
    * @property {string}            promiseRole          - Role of the test relatively to the parent test promise. Could be undefined, "then" or "catch".
    * @property {string}            title
    */
   var TestUnit                                  = function TestUnit(param) {

      this.context        = param.context;
      this.creationDate   = new Date();
      this.enabled        = param.enabled;
      this.id             = TestUnit.lastId ++;
      this.nexts          = [];
      this.notMode        = false;
      this.parent         = param.parent;
      this.promiseRole    = param.promiseRole;
      this.project        = param.project;
      this.timeout        = param.timeout;
      this.strictMode     = param.strict;
      this.tests          = [];
      this.title          = param.title;
      this.value          = param.value;
      this.executionDelay = param.executionDelay;
      this.errorExpected  = false;

      this.async          = param.async || this.executionDelay !== false || this.value instanceof Promise;

      this._isClosed      = false;

      this.results        = { error     : undefined
                            , test      : undefined
                            , timeout   : undefined
                            , validity  : undefined

                              // Theses are the values return by the "count" functions. They are updated by the "refresh" function.
                            , count     : { errors    : 0
                                          , fails     : 0
                                          , successes : 0
                                          , total     : 0}};

      // Child tests
      this.childContext   = Context(this);
      this.currentSection = new Section(this.project, '', true, this);
      this.sections       = [this.currentSection];

      if (typeof(this.value) === 'function') {
         this.testFunction  = this.value;
         this.testExecution = new TestExecution(this);
      }

      // Adding the "not" keyword
      //noinspection JSUnusedGlobalSymbols
      Object.defineProperty(this, 'not', { get : function not() { this.notMode = true; return this}.bind(this)});

      if (!this.enabled)
         return;

      this.execute();
   };

   /**
    * Calculate the result of the test
    */
   TestUnit.prototype.calcResult                 = function calcResult() {

      var /** @type {Array}    */ params
        , /** @type {boolean}  */ result
        , /** @type {TestType} */ testType
        , value;

      value = this.value;

      testType = this.testType ? this.testType : TestUnit.TEST_TYPES.isTrue;

      if (!this.isUnitTest()) {
         this.results.validity = this.isValid();

         // We refresh only if counts have already been done
         if (this.results.count.total !== undefined)
            this.refresh();

         return;
      }

      this.results.validity = true;

      params = [value].concat(this.testParameters);

      // If no errors has been raised, then we continue
      if (this.error === undefined || this.errorExpected) {
         try {
            if (this.strictMode && testType.strictTest !== undefined)
               result = testType.strictTest.apply(undefined, params);
            else
               result = testType.test.apply(undefined, params);
         }
         catch (e) {
            result = false;
         }

         if (this.notMode)
            result = !result;
      }

      this.results.test    = result;

      // We refresh only if counts have already been done
      if (this.results.count.total !== undefined)
         this.refresh();

   };

   /**
    * @param {string|function} param1
    * @param {function}        [param2]
    * @returns {TestUnit}
    */
   TestUnit.prototype.catch                      = function then(param1, param2) {

      var /** @type {TestUnit|Promise} */ catchPromise
        , /** @type {string}           */ title
        , /** @type {Function|Promise} */ value;

      if (typeof(param1) === 'string') {

         title        = param1;

         if (param2 instanceof Promise) {
            value = new Promise(function(fullfill) {
               this.results.error = false;
               this.refresh();

               fullfill(param2);
            }.bind(this));
         }
         else {
            value = function() {
               this.results.error = false;
               this.refresh();

               return param2.call(undefined, arguments);
            };
         }

         this.errorExpected = true;

         catchPromise = new TestUnit({ async        : this.async
                                     , enabled      : this.enabled
                                     , parent       : this
                                     , thenTest     : true
                                     , promiseRole  : 'catch'
                                     , title        : title
                                     , value        : value});

         this.nexts.push(catchPromise);
      }
      else
         catchPromise = this.getPromise().then(param1, param2);

      return catchPromise;
   };

   //noinspection JSUnusedGlobalSymbols
   /**
    *
    * @param {boolean} [failedOnly=false]
    * @returns {TestUnit}
    */
   TestUnit.prototype.console                    = function console(failedOnly) {

      var /** @type {string}  */ logText
        , /** @type {number}  */ s
        , /** @type {Section} */ section
        , /** @type {TestUnit[]} */ sectionTests
        , /** @type {number}  */ successes
        , /** @type {number}  */ total;

      failedOnly = undefined ? false : failedOnly;

      successes = this.countSuccessfulTests();
      total     = this.countTotalTests();

      logText = (this.getTitle() !== undefined ? this.getTitle() + ' : ' : '') + (successes === total ? 'success' : 'fail');

      if (total > 1) {
         logText += ' - ' + successes + '/' + total;
         nonStrictFunction.groupCollapsed(logText);

         if (this.sections.length > 1) {
            for (s in this.sections) {

               if (failedOnly)
                  if (this.sections[s].isSuccessful())
                     continue;

               if (this.sections[s].countTotalTests() === 0)
                  continue;

               this.sections[s].console(failedOnly);
            }
         }
         else {

            section = this.sections[0];

            sectionTests = section.getTests();

            for (s in tests) {
               if (failedOnly)
                  if (tests[s].isSuccessful())
                     continue;

               this.sections[0].tests[s].console();
            }

         }

         nonStrictFunction.groupEnd();

      }
      else {

         if (this.isSuccessful())
            nonStrictFunction.log(logText);
         else
            nonStrictFunction.warn(logText);
      }

      return this;
   };

   /**
    *
    * @returns {number}
    */
   TestUnit.prototype.countErrors                = function countError() {
      return this.results.count.errors;
   };

   /**
    *
    * @returns {number}
    */
   TestUnit.prototype.countFailedTests           = function countFailedTests() {
      return this.results.count.fails;
   };

   /**
    *
    * @returns {number}
    */
   TestUnit.prototype.countSuccessfulTests       = function countSuccessfulTests() {
      return this.results.count.successes;
   };

   /**
    *
    * @returns {number}
    */
   TestUnit.prototype.countTotalTests            = function countTotalTests() {
      return this.results.count.total;
   };

   /**
     *
     * @param {string} description
     */
   TestUnit.prototype.describe                   = function describe(description) {
      this.description = description;
      return this;
   };

   /**
    * Function executed to indicate that the async function has finished.
    * This function is relevant only if the async call has been made by providing a timeout.
    * If so, then a test will be done : the difference between the start of the test function and the execution of the done function
    * must be lesser than the timeout provided initially.
    *
    */
   TestUnit.prototype.done                       = function done() {
      this.testExecution.done();
      return this;
   };

   /**
    * Execute the unit test
    *
    */
   TestUnit.prototype.execute                    = function execute() {
      var /** @type {Promise} */ promise;

      if (!this.enabled)
         return;

      if (this.async) {

         if (this.value instanceof Promise) {
            promise = this.value.then(function(value) {
               return value;
            });
         }
         else if (this.executionDelay !== false) {
            promise = this.parent.getPromise().then(function(value) {
               return new Promise(function(fullfill) {

                  setTimeout(function() {
                     fullfill(this.testExecution.execute(value));
                  }.bind(this), this.executionDelay);

               }.bind(this));
            }.bind(this));

         }
         else if (this.promiseRole === undefined) {
            promise = this.getPromise().then(function(value) {
               return this.testExecution.execute(value);
            }.bind(this));
         }
         else if (this.promiseRole === 'then')
            promise = this.parent.getPromise().then(function(value) {
               return this.testExecution.execute(value);
            }.bind(this));
         else  // promiseRole = 'catch'
            promise = this.parent.getPromise().catch(function(value) {
               return this.testExecution.execute(value);
            }.bind(this));

         this.promise = promise.then(function(value) {
            this.value = value;
            this.calcResult();
         }.bind(this)).catch(function(error) {
            this.error = error;
            this.results.error = true;
         }.bind(this));

      }
      else if (this.testFunction) {
         this.value = this.testExecution.execute();
         this.calcResult();
      }
      else
         this.calcResult();
   };

   /**
    * Return the promise that will be executed once all the test and sub-tests (including promises tests) are finished
    *
    * @returns {Promise}
    */
   TestUnit.prototype.getCompletedPromise        = function getCompletedPromise() {

      var /** @type {number}    */ i
        , /** @type {Promise[]} */ promises;

      promises = [this.getPromise(true)];

      for(i in this.sections) {
         promises.push(this.sections[i].getCompletedPromise());
      }

      for(i in this.nexts) {
         promises.push(this.nexts[i].getCompletedPromise());
      }

      return Promise.all(promises);
   };

   /**
    * @param {boolean} [failedOnly=false]
    * @returns {TestUnitExport}
    */
   TestUnit.prototype.getData                    = function getData(failedOnly) {

      var /** @type {Object}           */ data
        , /** @type {number}           */ n
        , /** @type {TestUnitExport[]} */ nexts
        , /** @type {number}           */ s;

      nexts = [];

      failedOnly = failedOnly === undefined ? false : failedOnly;

      for (n in this.nexts) {

         if (failedOnly)
            if (this.next[n].isSuccessful())
               continue;

         nexts.push(this.nexts[n].getData(failedOnly));
      }

      data = {
         async: this.async
         , enabled: this.enabled
         , id: this.id
         , nexts: nexts
         , not: this.notMode
         , result: this.results.test
         , sections: []
         , strict: this.strictMode
         , testParameters: this.testParametersExport
         , title: this.title
         , type: 'TestUnit'
         , value: this.value
      };

      for (s in this.sections) {

         if (failedOnly)
            if (this.sections[s].isSuccessful())
               continue;

         // If the first section is empty, we skip it
         if (s == 0 && this.sections[s].countTotalTests() === 0)
            continue;

         data.sections.push(this.sections[s].getData(failedOnly))
      }

      if (this.testType)
         data['test'] = this.testType.code;

      return data;
   };

   /**
    *
    * @returns {string}
    */
   TestUnit.prototype.getDescription             = function getDescription() {
      return this.description;
   };

   /**
    *
    * @returns {boolean}
    */
   TestUnit.prototype.getDurationResult          = function getDurationResult() {
      return this.durationResult;
   };

   /**
    *
    * @returns {DOMTest}
    */
   TestUnit.prototype.getDOM                     = function getDOM() {
      return this.domTest;
   };

   /**
    *
    * @returns {Date}
    */
   TestUnit.prototype.getEndDate                 = function getEndDate() {
      if (this.testFunction)
         return this.testExecution.getEndDate();

      return this.creationDate;
   };

   /**
    *
    * @returns {number|undefined}
    */
   TestUnit.prototype.getEndTime                 = function getEndTime() {
      this.getProject().getTime(this.getEndDate());
   };

   /**
    *
    * @returns {Promise}
    */
   TestUnit.prototype.getPromise                 = function getPromise() {
      if (this.promise === undefined)
         this.promise = promiseResolved;

      return this.promise;
   };

   /**
    *
    * @returns {Project}
    */
   TestUnit.prototype.getProject                 = function getProject() {
      return this.project;
   };

   //noinspection JSUnusedGlobalSymbols
   /**
    *
    * @returns {TestUnit[]}
    */
   TestUnit.prototype.getNexts                   = function getNexts() {
      return this.nexts.slice(0);
   };

   /**
    * Return the result of the test.
    * Do not take care of the timeout of the function nor the child tests
    *
    * @returns {boolean}
    */
   TestUnit.prototype.getResult                  = function getResult() {
      if (this.results.test     === false)
         return false;

      if (this.results.count.fails > 0)
         return false;

      if (this.results.validity === false)
         return false;

      if (this.results.error    === true)
         return false;

      if (this.results.timeout  === false)
         return false;

      return true;
   };

   /**
    *
    * @returns {Section[]}
    */
   TestUnit.prototype.getSections                = function getSections() {
      return this.sections.slice(0);
   };

   /**
    *
    * @returns {Date}
    */
   TestUnit.prototype.getStartDate               = function getStartDate() {
      if (this.testFunction)
         return this.testExecution.getStartDate();

      return this.creationDate;
   };

   /**
    *
    * @returns {number|undefined}
    */
   TestUnit.prototype.getStartTime               = function getStartTime() {
      return this.getProject().getTime(this.getStartDate());
   };

   /**
    *
    * @returns {function}
    */
   TestUnit.prototype.getTestFunction            = function getTestFunction() {
      return this.testFunction;
   };

   /**
    *
    * @returns {string|undefined}
    */
   TestUnit.prototype.getTitle                   = function getTitle() {
      return this.title;
   };

   /**
    *
    * @returns {*}
    */
   TestUnit.prototype.getValue                   = function getValue() {
      return this.value;
   };

   /**
    *
    * @returns {boolean}
    */
   TestUnit.prototype.hasAsyncTests              = function hasAsyncTests() {

      var /** @type {number} */ n
        , /** @type {number} */ s;

      if (this.asyncTests !== undefined)
         return this.asyncTests;

      if (this.async) {
         this.asyncTests = true;
         return true;
      }

      for(n in this.nexts) {
         if (this.nexts[n].hasAsyncTests()) {
            this.asyncTests = true;
            return true;
         }
      }

      for(s in this.sections) {
         if (this.sections[s].hasAsyncTests()) {
            this.asyncTests = true;
            return true;
         }
      }

      return false;
   };

   /**
    * Return true if the test as finished. False otherwise
    */
   TestUnit.prototype.hasFinished                = function hasFinished() {

      var /** @type {number} */ n
        , /** @type {number} */ s;

      if (this._hasFinished === true)
         return this._hasFinished;

      if (this.testFunction) {
         if (!this.testExecution.hasFinished())
            return false;
      }


      for(s in this.sections) {
         if (!this.sections[s].hasFinished())
            return false;
      }

      for(n in this.nexts) {
         if (!this.nexts[n].hasFinished())
            return false;
      }

      this._hasFinished = true;
      return this._hasFinished;
   };

   /**
    * Indicate if the test function has finished in time.
    * If there is no test function then return true.
    * If there is no timeout defined, then return true.
    * If the function hasn't finished yet but has reached the timeout, then return false.
    * If the function hasn't finished but it's still respecting the timeout, then return undefined
    * @returns {boolean|undefined}
    */
   TestUnit.prototype.hasFinishedInTime          = function hasFinishedInTime() {

      if (!this.testFunction)
         return true;

      if (this.timeout === undefined)
         return true;

      if (this.testExecution.hasFinished())
         return this.testExecution.getDuration() < this.timeout;

      return this.testExecution.getDuration(true) >= this.timeout ? false : undefined;
   };

   TestUnit.prototype.isGroup                    = function isGroup() {
      if (this.sections.length > 1)
         return true;

      if (this.nexts.length > 0)
         return true;

      return this.sections[0].getTests().length > 0;
   };

   /**
    * Indicate if the test is closed (true) or not (false).
    * A test is closed if it has finished or as reached the timeout
    * @returns {boolean}
    */
   TestUnit.prototype.isClosed                   = function isClosed() {
      if (this._isClosed === true)
         return true;

      if (this.hasFinished()) {
         this._isClosed = true;
         return true;
      }

      if (this.hasFinishedInTime() === false) {
         this._isClosed = true;
         return true;
      }

   };

   /**
    * @returns {boolean}
    */
   TestUnit.prototype.isSuccessful               = function isSuccessful() {

      var /** @type {number} */ s
        , /** @type {number} */ t;

      if (this.getResult() === false)
         return false;

      for (s in this.sections) {
         if (!this.sections[s].isSuccessful())
            return false;
      }

      for (t in this.nexts) {
         if (!this.nexts[t].isSuccessful())
            return false;
      }

      return true;
   };

   /**
    * Return true if the test is a unit test, false otherwise.
    * The test is an unit test if a test type has been defined (ex: isTrue)
    * or if a test function as been defined an if this function returned a value (that is not a promise).
    * Note that if a timeout has been defined, then it's a test unit
    * @returns {boolean}
    */
   TestUnit.prototype.isUnitTest                 = function isUnitTest() {

      // If there is no test function, then it's that a value has been provided
      //noinspection JSValidateTypes
      if (this.testFunction === undefined)
         return true;

      if (this.testType !== undefined)
         return true;

      if (this.timeout !== undefined)
         return true;

      //noinspection RedundantConditionalExpressionJS
      return this.value !== undefined && !(this.value instanceof Promise) ? true : false;
   };

   /**
    * Indicate if the test is va valid test or not.
    * A test is invalid if it's not a unit test and if it didn't defined any other test/sections (no child tests, no promises tests)
    *
    * @returns {boolean}
    */
   TestUnit.prototype.isValid                    = function isValid() {

      if (this.isUnitTest())
         return true;

      return this.isGroup();
   };

   /**
    * Count the number of fails, successes and total testes.
    * @param {number} [deltaErrors]
    * @param {number} [deltaFails]
    * @param {number} [deltaSuccesses]
    * @param {number} [deltaTotal]
    *
    */
   TestUnit.prototype.refresh                    = function refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal) {

      var /** @type {number}  */ errors
        , /** @type {number}  */ fails
        , /** @type {boolean} */ hasFinishedInTime
        , /** @type {number}  */ s
        , /** @type {number}  */ successes
        , /** @type {number}  */ t
        , /** @type {number}  */ total;

      if (deltaTotal !== undefined && this.results.count.total !== undefined) {
         this.results.count.deltaErrors += deltaErrors;
         this.results.count.fails       += deltaFails;
         this.results.count.successes   += deltaSuccesses;
         this.results.count.total       += deltaTotal;
      }
      else {

         // Errors
         errors = this.results.error ? 1 : 0;

         // Fails
         fails  = this.isUnitTest() && !this.results.test ? 1 : 0;
         fails += this.results.error ? 1 : 0;
         fails += !this.isValid() ? 1 : 0;

         hasFinishedInTime = this.hasFinishedInTime();

         if (hasFinishedInTime !== undefined && !hasFinishedInTime)
            fails += 1;

         // Successes
         successes  = this.isUnitTest() && this.results.test ? 1 : 0;
         successes += this.timeout !== undefined && this.results.timeout ? 1 : 0;

         if (this.testFunction && this.timeout !== undefined) {
            // Note : if the test hasn't finished in time, then we have another fail
            hasFinishedInTime = this.hasFinishedInTime();

            if (hasFinishedInTime !== undefined && !hasFinishedInTime)
               successes += 1;
         }

         // Total
         total  = this.isUnitTest() ? 1 : 0;
         total += this.timeout !== undefined;

         for (s in this.sections) {
            errors    += this.sections[s].countErrors();
            fails     += this.sections[s].countFailedTests();
            successes += this.sections[s].countSuccessfulTests();
            total     += this.sections[s].countTotalTests();
         }

         for (t in this.nexts) {
            errors    += this.nexts[s].countErrors();
            fails     += this.nexts[t].countFailedTests();
            successes += this.nexts[t].countSuccessfulTests();
            total     += this.nexts[t].countTotalTests();
         }

         if (this.results.count.total !== undefined) {
            deltaErrors    = errors    - this.results.count.errors;
            deltaFails     = fails     - this.results.count.fails;
            deltaSuccesses = successes - this.results.count.successes;
            deltaTotal     = total     - this.results.count.total;
         }

         this.results.count = { errors    : errors
                              , fails     : fails
                              , successes : successes
                              , total     : total};

      }

      if (this.parent !== undefined) {
         if (this.parent.results.count.total !== undefined)
            this.parent.refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal);
      }

      if (this.getDOM())
         this.getDOM().refresh();

   };

   /**
    *
    * @param {DOMTest} dom
    */
   TestUnit.prototype.setDOM                     = function setDOM(dom) {
      this.domTest = dom;
   };

   /**
    *
    * @returns {string}
    */
   TestUnit.prototype.toString                   = function toString() {
      return this.title + ' : ' + (this.isSuccessful() ? 'success' : 'fail') + ' (' + this.countSuccessfulTests() + '/' + this.countTotalTests() + ')';
   };

   /**
    *
    * Function to execute after the test.
    *
    * If the first parameter is a string, then a new test will be created with the string
    * as title and the second parameter as the test. In this case, the function will return
    * the newly created test unit
    * Note that in this case, if we are an sync test, the "then" test will be executed synchronously.
    *
    * If the first parameter isn't a string, then the standard "then" function of promise pattern
    * will be called. The function will return the newly created promise.
    *
    * @param {string|function} param1
    * @param {function}        [param2]
    * @returns {TestUnit}
    */
   TestUnit.prototype.then                       = function then(param1, param2) {

      var /** @type {function} */ testFunction
        , /** @type {TestUnit} */ then
        , /** @type {string}   */ title;

      if (typeof(param1) === 'string') {
         title = param1;
         testFunction = param2;
         then = new TestUnit({ async        : this.async
                             , enabled      : this.enabled
                             , parent       : this
                             , promiseRole  : 'then'
                             , testFunction : testFunction
                             , title        : title});

         this.nexts.push(then);
      }
      else
         then = this.getPromise().then(param1);

      return then;
   };



   // Unit Tests

   /**
    * Test if the value is contain in the result
    */
   TestUnit.prototype.contains                   = function contains(value) {
      this.testType = TestUnit.TEST_TYPES.contains;
      this.testParameters = [value];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    * Testing if the value is defined
    */
   TestUnit.prototype.equal                      = function equal(value) {
      this.testType = TestUnit.TEST_TYPES.equal;
      this.testParameters = [value];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    *
    * @param {number} minValue
    * @param {number} maxValue
    */
   TestUnit.prototype.isBetween                  = function isBetween(minValue, maxValue) {
      this.testType = TestUnit.TEST_TYPES.isBetween;
      this.testParameters = [minValue, maxValue];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    * Testing if the value is defined
    */
   TestUnit.prototype.isDefined                  = function isDefined() {
      this.testType = TestUnit.TEST_TYPES.isDefined;
      this.calcResult();
      return this;
   };

   /**
    * Test if the value of the test is different than the given value
    * @returns {TestUnit}
    */
   TestUnit.prototype.isDifferentThan            = function isDifferentThan(value) {
      this.testType = TestUnit.TEST_TYPES.isDifferentThan;
      this.testParameters = [value];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    * Testing if the value is defined
    */
   TestUnit.prototype.isFalse                    = function isFalse() {
      this.testType = TestUnit.TEST_TYPES.isFalse;
      this.calcResult();
      return this;
   };

   /**
    *
    */
   TestUnit.prototype.isGreaterOrEqualThan       = function isGreaterOrEqualThan(value) {
      this.testType = TestUnit.TEST_TYPES.isGreaterOrEqualThan;
      this.testParameters = [value];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    *
    */
   TestUnit.prototype.isGreaterThan              = function isGreaterThan(value) {
      this.testType = TestUnit.TEST_TYPES.isGreaterThan;
      this.testParameters = [value];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    *
    */
   TestUnit.prototype.isInstanceOf               = function isInstanceOf(value) {
      this.testType = TestUnit.TEST_TYPES.isInstanceOf;
      this.testParameters = [value];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    *
    */
   TestUnit.prototype.isLesserOrEqualThan        = function isLesserOrEqualThan(value) {
      this.testType = TestUnit.TEST_TYPES.isLesserOrEqualThan;
      this.testParameters = [value];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    *
    */
   TestUnit.prototype.isLesserThan               = function isLesserThan(value) {
      this.testType = TestUnit.TEST_TYPES.isLesserThan;
      this.testParameters = [value];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    * Testing if the value is null
    */
   TestUnit.prototype.isNull                     = function isNull() {
      this.testType = TestUnit.TEST_TYPES.isNull;
      this.calcResult();
      return this;
   };

   /**
    * Testing if the value is defined
    */
   TestUnit.prototype.isTrue                     = function isTrue() {
      this.testType = TestUnit.TEST_TYPES.isTrue;
      this.calcResult();
      return this;
   };

   /**
    * Testing if the value is undefined
    */
   TestUnit.prototype.isUndefined                = function isUndefined() {
      this.testType = TestUnit.TEST_TYPES.isUndefined;
      this.calcResult();
      return this;
   };

   //noinspection ReservedWordAsName
   /**
    * Testing if the value is defined
    */
   TestUnit.prototype['throw']                   = function throwError(value) {
      this.testType = TestUnit.TEST_TYPES.throw;
      this.testParameters = [value];
      this.testParametersExport = common.copy(this.testParameters);
      this.calcResult();
      return this;
   };

   /**
    *
    * @param {number} id
    * @returns {TestUnit}
    */
   TestUnit.get                                  = function(id) {
      return TestUnit.ALL[id];
   };

   /**
    * Last ID used for for a test
    * @type {number}
    */
   TestUnit.lastId                               = 0;

   /**
    * @typedef {Object} TestType
    *
    * @property {string}           code        - Code of the type
    * @property {number}           nbParam     - Number of parameters expected
    * @property {function:boolean} test        - Function to execute for non-strict test
    * @property {function:boolean} strictTest  - Function to execute for strict test. If not defined, then the regular function is used (strict test is irrelevant)
    * @property {boolean}          errorTest   - If true, then the first argument will be the error throw by the test
    *
    */

   /**
    * List of all tests
    * @type {TestUnit[]}
    */
   TestUnit.ALL                                  = [];

   TestUnit.TYPES                                = { test : 'test'
                                                   , unit : 'unit'};

   /**
    *
    * @type {Object.<TestType>}
    * @namespace TestUnit
    */
   TestUnit.TEST_TYPES                           = {
                                                     contains             : { code       : 'contains'
                                                                            , test       : function contains(a, b) {return a.indexOf(b)}}

                                                   , equal                : { code       : 'equal'
                                                                            , test       : function equal(a, b, c) { return a  == (arguments.length === 3 ? c : b)}
                                                                            , strictTest : function equal(a, b, c) { return a === (arguments.length === 3 ? c : b)}}

                                                   , isBetween            : { code       : 'isBetween'
                                                                            , test       : function isBetween(a, b, c) {return a >= b && a <= c}}

                                                   , isDefined            : { code       : 'isDefined'
                                                                            , test       : function isDefined(a) {return a != undefined}
                                                                            , strictTest : function isDefined(a) {return a !== undefined}}

                                                   , isDifferentThan      : { code       : 'isDifferentThan'
                                                                            , test       : function isDifferentThan(a, b) {return a != b}
                                                                            , strictTest : function isDifferentThan(a, b) {return a !== b}}

                                                   , isFalse              : { code       : 'isFalse'
                                                                            , test       : function isFalse(a) {return a ? false : true}
                                                                            , strictTest : function isFalse(a) {return a === false}}

                                                   , isGreaterOrEqualThan : { code       : 'isGreaterOrEqualThan'
                                                                            , test       : function isGreaterOrEqualThan(a, b) {return a >= b}}

                                                   , isGreaterThan        : { code       : 'isGreaterThan'
                                                                            , test       : function isGreaterThan(a, b) {return a > b}}

                                                   , isInstanceOf         : { code       : 'isInstanceOf'
                                                                            , test       : function isInstanceOf(a, b) {return a instanceof b}}

                                                   , isLesserOrEqualThan  : { code       : 'isLesserOrEqualThan'
                                                                            , test       : function isLesserOrEqualThan(a, b) {return a <= b}}

                                                   , isLesserThan         : { code       : 'isLesserThan'
                                                                            , test       : function isLesserThan(a, b) {return a < b}}

                                                   , isNull               : { code       : 'isNull'
                                                                            , test       : function isNull(a) {return a == null}
                                                                            , strictTest : function isNull(a) {return a === null}}

                                                   , isTrue               : { code       : 'isTrue'
                                                                            , test       : function isTrue(a) {return a ? true : false}
                                                                            , strictTest : function isTrue(a) {return a === true}}

                                                   , isUndefined          : { code       : 'isUndefined'
                                                                            , test       : function isUndefined(a) {return a == undefined}
                                                                            , strictTest : function isUndefined(a) {return a === undefined}}

                                                   , throw                : { code       : 'throw'
                                                                            , errorTest  : true
                                                                            , test       : function throwError(error, a) {return error instanceof a}}};

   /**
    *
    * @constructor
    * @class Project
    * @extends TestUnit
    * @property {string[]}    authors
    * @property {string}      description
    * @property {string}      name
    */
   var Project                                   = function Project(title) {
      TestUnit.call(this, {project: this, title : title});

      this.name    = !name ? 'Test' : name;
      this.authors = [];
      this.domProject = new DOMProject(this);
   };

   Project.prototype                             = Object.create(TestUnit.prototype);
   //noinspection JSUnusedGlobalSymbols
   Project.prototype.constructor                 = Project;

   //noinspection JSUnusedGlobalSymbols
   /**
    *
    * @param {string} author
    */
   Project.prototype.addAuthor                   = function(author) {
      this.authors.push(author);
   };

   /**
    *
    * @param {string|HTMLElement} [location='body']
    * @returns {Promise}
    */
   Project.prototype.display                     = function(location) {

      var /** @type {Promise}   */ loadPromise
        , /** @type {Promise}   */ promise
        , /** @type {Promise[]} */ promises;

      location = location ? location : 'body';

      document.addEventListener("DOMContentLoaded", function() {
         this.domProject.display(location);
      }.bind(this));

   };

   /**
    *
    * @returns {string[]}
    */
   Project.prototype.getAuthors                  = function() {
      return this.authors.slice(0);
   };

   /**
    *
    * @param {Date} date
    * @returns {number|undefined}
    */
   Project.prototype.getTime                     = function(date) {
      if (date === undefined)
         return undefined;
      return date - this.getStartDate();
   };

   /**
    *
    * @returns {boolean}
    */
   Project.prototype.isUnitTest                  = function isUnitTest() {
      return false;
   };

   Project.prototype.isValid                     = function isValid() {
      return true;
   };

   //noinspection JSUnusedGlobalSymbols
   /**
    *
    * @param {string} title
    */
   Project.prototype.setTitle                    = function(title) {
      this.title = title;
   };



   /**
    *
    * @param {TestUnit} test
    * @constructor
    * @class TestExecution
    * @property {TestContext} childContext
    * @property {Date}     startDate
    * @property {Date}     endDate
    * @property {function} executionFunction
    * @property {TestUnit} test
    */
   var TestExecution                             = function TestExecution (test) {
      this.test         = test;
      this.testFunction = this.test.getTestFunction();
      this.childContext = this.test.childContext;
      this.async        = this.test.async;
      this.context      = this.test.context;
   };

   TestExecution.prototype.done                  = function done() {
      this.endDate = new Date();
   };

   /**
    * Execute the function
    */
   TestExecution.prototype.execute               = function execute() {

      var /** @type {*}                   */ err
        , /** @type {ThisTestContextInfo} */ oldInfo
        , /** @type {Array}               */ params;

      // Building parameters for the function :
      // The first parameter is the "test" function
      // The second parameter is the first argument provided to the execute function.
      params = [this.test.childContext.test];

      if (arguments.length === 1)
         params.push(arguments[0]);

      // We have to change the context of the "test" function
      oldInfo = this.context.info;

      //noinspection JSValidateTypes
      this.context.reset(token, this.childContext._info(token));

      this.startDate = new Date();
      try {
         this.result    = this.testFunction.apply(undefined, params);
      }
      catch(err) {
         this.throwError = true;
         this.error      = err;
      }

      if (this.result instanceof Promise) {
         this.result.then(function(result) {
            // Note : endDate could be already defined if the "done" function has been triggered
            this.endDate = this.endDate === undefined ? new Date() : this.endDate;
            this.result = result;
            return this.result;
         }.bind(this));

         this.result.catch(function(error) {
            this.endDate    = this.endDate === undefined ? new Date() : this.endDate;
            this.throwError = true;
            this.error      = error;
         }.bind(this));
      }
      else
         // Note : endDate could be already defined if the "done" function has been triggered
         this.endDate   = this.endDate === undefined ? new Date() : this.endDate;

      this.context.reset(token, oldInfo);

      return this.result;
   };

   /**
    * Indicate if the test function (and it's eventual return promises) has finished (true) or not (false)
    * @returns {boolean}
    */
   TestExecution.prototype.hasFinished           = function hasFinished() {
      return this.endDate !== undefined;
   };

   /**
    * Return the duration of the execution.
    * If the test hasn't finished, then return undefined.
    * @param {boolean} [untilNow=false] If true, then if will use the current date instead of the end date if the function hasn'nt finished yet
    * @returns {number|undefined}
    */
   TestExecution.prototype.getDuration           = function getDuration(untilNow) {

      var /*** @type {number} */ endDate;

      endDate = this.endDate !== undefined ? this.endDate : (untilNow ? Date.now() : undefined);

      if (endDate === undefined)
         return undefined;

      return endDate - this.startDate;
   };

   /**
    *
    * @returns {Date}
    */
   TestExecution.prototype.getEndDate            = function getEndDate() {
      return this.endDate;
   };

   /**
    *
    * @returns {Date}
    */
   TestExecution.prototype.getStartDate          = function getStartDate() {
      return this.startDate;
   };


   /**
    *
    * @param {TestUnit} test
    * @constructor
    * @class DOMTest
    * @property {TestUnit} test
    * @property {Array.<DOMTest|DOMSection>} childTests
    */
   var DOMTest                                   = function DOMTest(test) {
      this.test         = test;
      this.test.setDOM(this);
      this.childTests   = [];
      this.collapsed    = true;
   };

   /**
    * Build the dom of the test
    */
   DOMTest.prototype.buildDOM                    = function builDOM(collapsed) {

      var /** @type {number}      */ c
        , /** @type {Object}      */ data
        , /** @type {HTMLElement} */ domTests
        , /** @type {HTMLElement} */ domHeader
        , /** @type {number}      */ t;

      this.collapsed = collapsed;
      data = this.getTemplateData();

      this.dom = common.render2dom(this.getTemplate(), data);

      domHeader = this.dom.querySelector('header');

      domHeader.addEventListener('click', function(event) {

         var /** @type {HTMLElement} */ oldDOM;

         if (this.collapsed)
            this.dom.classList.remove('collapsed');
         else
            this.dom.classList.add('collapsed');

         oldDOM = this.dom;

         this.buildDOM(!this.collapsed);

         oldDOM.parentElement.replaceChild(this.dom, oldDOM);

         event.stopPropagation();

      }.bind(this));

      if (this.collapsed) {
         for(c in this.childTests) {
            this.childTests[c].destroy();
         }
      }
      else {
         domTests = this.dom.querySelector('div#tests');

         this.childTests = this.getChildTests();

         for (t in this.childTests) {
            domTests.appendChild(this.childTests[t].getDOM());
         }
      }

   };

   /**
    * Destroy the DOM Test.
    * Basically, this means that all references of the object should be deleted and the dom too.
    * The same should be done for his childrens
    */
   DOMTest.prototype.destroy                     = function destroy() {

      var /** @type {number} */ c;

      this.test.setDOM(undefined);

      if (this.dom !== undefined) {
         if (this.dom.parentElement !== null && this.dom.parentElement !== undefined) {
            this.dom.parentElement.removeChild(this.dom);
         }

         this.dom = undefined;
      }

      for(c in this.childTests) {
         this.childTests[c].destroy();
      }

   };

   /**
    * Return the DOM of the template
    * @param {boolean} [collapsed=false]
    * @returns {HTMLElement}
    */
   DOMTest.prototype.getDOM                      = function getDOM(collapsed) {
      collapsed = collapsed === undefined ? this.collapsed : !!collapsed;

      if (this.dom === undefined || collapsed !== this.collapsed)
         this.buildDOM(collapsed);

      return this.dom;
   };

   /**
    * Return the data expected for the template
    * @returns {TestTemplateData}
    */
   DOMTest.prototype.getTemplateData             = function getTemplateData() {

      var /** @type {number} */ duration
        , /** @type {number} */ endTime
        , /** @type {number} */ fails
        , /** @type {number} */ startTime;

      startTime = this.test.getStartTime();
      endTime   = this.test.getEndTime();

      if (endTime !== undefined)
         duration = (endTime - startTime) / 1000;

      fails = this.test.countFailedTests();

      return { async          : this.test.async
             , collapsed      : this.collapsed
             , description    : this.test.getDescription()
             , duration       : duration
             , endTime        : common.time2string(endTime)
             , isGroup        : this.test.isGroup()
             , lang           : lang.test
             , result         : this.test.getResult()
             , severalFails   : fails > 1
             , startTime      : common.time2string(startTime)
             , strict         : this.test.strictMode
             , success        : this.test.isSuccessful()
             , title          : this.test.getTitle()
             , totalFails     : fails
             , totalSuccesses : this.test.countSuccessfulTests()
             , totalTests     : this.test.countTotalTests()};
   };

   //noinspection JSUnusedGlobalSymbols
   /**
    *
    * @returns {TestUnit}
    */
   DOMTest.prototype.getTest                     = function getTest() {
      return this.test;
   };

   /**
    * @returns {Array.<DOMSection|DOMTest>}
    */
   DOMTest.prototype.getChildTests               = function getTests() {
      var /** @type {Array.<DOMSection|DOMTest>} */ domTests
        , /** @type {Section[]}                  */ sections
        , /** @type {number}                     */ t
        , /** @type {Array.<TestUnit|Section>}   */ tests;

      if (this.test.sections[0].isDefault()) {
         tests    = this.test.sections[0].getTests();
         sections = this.test.getSections();
         sections.shift();
      }
      else {
         tests = this.test.getSections();
      }

      domTests = [];
      tests    = tests.concat(sections);

      for (t in tests) {

         if (tests[t].getDOM() !== undefined)
            domTests.push(tests[t].getDOM());
         else if (tests[t] instanceof Section)
            domTests.push(new DOMSection(tests[t]));
         else
            domTests.push(new DOMTest(tests[t]));
      }

      return domTests;
   };

   /**
    *
    * Lang values :
    *    - startDate
    *    - endDate
    *    - duration
    *    - second
    *    - countTotal
    *    - countSuccess
    *    - countFail
    *    - yes
    *    - no
    *
    * @typedef {Object} TestTemplateData
    * @property {boolean}         async
    * @property {boolean}         collapsed    - If true, then add the class "collapsed" to the div.
    * @property {string}          description  - Description of the section
    * @property {string}          duration     - Duration (in second) of the total execution time
    * @property {string}          endTime      - End date of the latest test of the section
    * @property {Object.<string>} lang         - Local data
    * @property {boolean}         result       - Result of the unit test. true : the unit test is successful. false otherwise
    * @property {string}          startTime    - Date of the first test
    * @property {boolean}         strict       - Indicate weither (true) or not (false) the test is in strict mode
    * @property {boolean}         success      - If true, then the test, the child tests and the sibling tests are successful. False otherwise
    * @property {string}          title        - Title of the section
    * @property {number}          totalFails   - Total number of failed tests
    * @property {number}          totalSuccess - Total number of successful tests
    * @property {number}          totalTests   - Total number of testes
    */

   /**
    *
    * @returns {string}
    */
   DOMTest.prototype.getTemplate                 = function getTemplate() {

      return      '<div class="test {{#success}}pass{{/success}}{{^success}}fail{{/success}} {{#collapsed}}collapsed{{/collapsed}} {{#isGroup}}group{{/isGroup}} {{#severalFails}}severalFails{{/severalFails}}">'
               +     '<header>'
               +        '<div id="title">{{title}}</div>'
               +        '<div id="description">{{description}}</div>'
               +        '<div id="fails">{{totalFails}}</div>'
               +        '<div id="successes">{{totalSuccesses}}</div>'
               +        '<div id="countTests">{{totalTests}}</div>'
               +        '<div id="successesByTests">{{totalSuccesses}}/{{totalTests}}</div>'
               +     '</header>'
               +     '<div id="tests"></div>'
               +     '<div id="nexts"></div>'
               +  '</div>';

   };

   /**
    * Refresh the test.
    */
   DOMTest.prototype.refresh                     = function buildHeader() {
      var /** @type {HTMLElement} */ dom;

      if (this.dom === undefined)
         return;

      dom = this.dom;
      this.buildDOM(this.collapsed);

      dom.parentElement.replaceChild(this.dom, dom);
   };



   /**
    *
    * @param {Section} section
    * @constructor
    * @class DOMSection
    * @extends {DOMTest}
    * @property {boolean}     collapsed
    * @property {HTMLElement} dom
    * @property {Section}     test
    */
   var DOMSection                                = function DOMSection(section) {
      DOMTest.call(this, section);
   };

   /**
    * Build the DOM of the section
    */
   DOMSection.prototype.buildDOM                 = function buildDOM(collapsed) {
      var /** @type {Object}      */ data
        , /** @type {HTMLElement} */ domSection
        , /** @type {HTMLElement} */ domTestUnit
        , /** @type {number}      */ t;

      this.collapsed = collapsed;
      data           = this.getTemplateData();
      this.dom       = common.render2dom(this.getTemplate(), data);
      domSection     = this.dom.querySelector('div#tests');

      if (this.collapsed)
         return;

      for (t in this.testUnits) {
         domTestUnit = this.testUnits[t].getDOM();
         domSection.appendChild(domTestUnit);
      }
   };

   /**
    * @returns {Array.<DOMSection|DOMTest>}
    */
   DOMSection.prototype.getChildTests            = function getTests() {
      var /** @type {Array.<DOMSection|DOMTest>} */ domTests
        , /** @type {Section[]}                  */ sections
        , /** @type {number}                     */ t
        , /** @type {Array.<TestUnit|Section>}   */ tests;

      tests = this.test.getTests();

      domTests = [];

      for (t in tests) {

         if (tests[t].getDOM() !== undefined)
            domTests.push(tests[t].getDOM());
         else
            domTests.push(new DOMTest(tests[t]));
      }

      return domTests;
   };

   /**
    *
    * @returns {Object}
    */
   DOMSection.prototype.getTemplateData          = function () {

      var /** @type {number} */ duration
        , /** @type {number} */ endTime
        , /** @type {number} */ startTime;

      startTime = this.section.getStartTime();
      endTime   = this.section.getEndTime();

      if (endTime !== undefined)
         duration = endTime - startTime;

      return { collapsed   : this.collapsed
             , countFail   : this.section.countFailedTests()
             , countSuccess: this.section.countSuccessfulTests()
             , countTotal  : this.section.countTotalTests()
             , description : this.section.getDescription()
             , duration    : duration
             , endTime     : common.time2string(endTime)
             , lang        : lang.section
             , startTime   : common.time2string(startTime)
             , success     : this.section.isSuccessful()
             , title       : this.section.getTitle()};
   };

   /**
    *
    * Lang values :
    *    - startDate
    *    - endDate
    *    - duration
    *    - second
    *    - countTotal
    *    - countSuccess
    *    - countFail
    *    - yes
    *    - no
    *
    * @typedef {Object} SectionTemplateData
    * @property {string}  description  - Description of the section
    * @property {number}  countTotal   - Total number of tests
    * @property {number}  countSuccess - Total number of successful tests
    * @property {number}  countFail    - Total number of failed tests
    * @property {string}  duration     - Duration (in second) of the total execution time
    * @property {string}  endDate      - End date of the latest test of the section
    * @property {string}  startDate    - Date of the first test
    * @property {boolean} success      - If true, then all the test of the section was successful. False otherwise
    * @property {string}  title        - Title of the section
    */

   /**
    *
    * @returns {string}
    */
   DOMSection.prototype.getTemplate              = function getTemplate() {
      return      '<div class="section {{#success}}pass{{/success}}{{^success}}fail{{/success}} {{#collapsed}}collapsed{{/collapsed}}">'
               +     '<header>'
               +        '<h1>{{title}}</h1>'
               +        '{{#description}}<p>{{description}}</p>{{/description}}'
               +     '</header>'
               +     '<section id="summary">'
               +        '<dl>'
               +           '<dt id="startDate">{{lang.startDate}}</dt><dd id="startDate">{{startTime}}</dd>'
               +           '<dt id="endDate">{{lang.endDate}}</dt><dd id="endDate">{{endTime}}</dd>'
               +           '<dt id="duration">{{lang.duration}}</dt><dd id="duration">{{duration}} {{lang.second}}</dd>'
               +           '<dt id="countTotal">{{lang.countTotal}}</dt><dd id="countTotal">{{countTotal}}</dd>'
               +           '<dt id="countSuccess">{{lang.countSuccess}}</dt><dd id="countSuccess">{{countSuccess}}</dd>'
               +           '<dt id="countFail">{{lang.countFail}}</dt><dd id="countFail">{{countFail}}</dd>'
               +        '</dl>'
               +     '</section>'
               +     '<div id="tests">'
               +     '</div>'
               + '</div>';
   };



   /**
    *
    * @param {Project} project
    * @constructor
    * @class DOMProject
    * @extends DOMTest
    * @property {boolean} collapsed
    * @property {string}  title
    */
   var DOMProject                                = function DOMProject(project) {
      DOMTest.call(this, project);
      this.project   = project;
      this.collapsed = false;
   };

   DOMProject.prototype                          = Object.create(DOMTest.prototype);
   //noinspection JSUnusedGlobalSymbols
   DOMProject.prototype.constructor              = DOMProject;

   DOMProject.prototype.buildDOM                 = function buildDOM(collapsed) {

      this.globalDOM = document.createElement('div');
      this.globalDOM.classList.add('testJS');

      DOMTest.prototype.buildDOM.call(this, collapsed);

      this.dom.classList.remove('test');
      this.dom.classList.add('project');

      this.globalDOM.appendChild(this.dom);

      // Add authors
   };

   /**
    * @param {string|HTMLElement} location
    */
   DOMProject.prototype.display                  = function display(location) {
      var /** @type {HTMLElement} */ dom;

      dom = location instanceof HTMLElement ? location : document.querySelector(location);
      this.buildDOM(false);

      dom.appendChild(this.globalDOM);
   };

   /**
    *
    * @returns {Object}
    */
   DOMProject.prototype.getTemplateData          = function getTemplateData() {

      var /** @type {Object} */ data;

      data = DOMTest.prototype.getTemplateData.call(this);
      data['authors'] = this.project.getAuthors();

      return data;
   };

   var project                                   = new Project();

   global.test  = Context(project);
   //global.xtest = buildContext(project).disabled;

   var token    = {};

})(this, { Console_groupCollapsed : console.groupCollapsed
         , Console_groupEnd       : console.groupEnd
         , Console_warn           : console.warn
         , Console_log            : console.log});