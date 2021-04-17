/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/publicado/publicado.js":
/*!********************************************!*\
  !*** ./src/scripts/publicado/publicado.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _session_db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../session/db.js */ \"./src/scripts/session/db.js\");\n\r\n\r\nconst db = new _session_db_js__WEBPACK_IMPORTED_MODULE_0__.default(\"clasitronicos\", 3);\r\nconst OBJECT_STORE = \"fields\";\r\n\r\nconst previewFields = {\r\n  photofile1 : document.querySelector('.image img'),\r\n  city : document.querySelector('.province'),\r\n  price : document.querySelector('.price'),\r\n  name : document.querySelector('.title'),\r\n  vendor : document.querySelector('.vendor'),\r\n  phone1 : document.querySelector('.phone'),\r\n  key1 : document.querySelector('input[name=\"key1\"]'),\r\n  key2 : document.querySelector('input[name=\"key2\"]')\r\n};\r\n\r\nif ( sessionStorage.get(\"choseFreeOption\") ) {\r\n  removePremiumOffer();\r\n}\r\n\r\n// get all rows from objectStore\r\ndb.getAllObjects(OBJECT_STORE).then( objects => {\r\n  objects.forEach( item => {\r\n    const elem = previewFields[item.id];\r\n    if (elem) {\r\n      elem.nodeName === \"IMG\" ?\r\n      elem.src = item.value : elem.textContent = item.value;\r\n    }\r\n  });\r\n});\r\n\r\ndb.clear(\"fields\")\r\n.then( res => console.log(res) )\r\n.catch(err => console.log(err))\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/publicado/publicado.js?");

/***/ }),

/***/ "./src/scripts/session/db.js":
/*!***********************************!*\
  !*** ./src/scripts/session/db.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DB)\n/* harmony export */ });\n\r\nclass DB {\r\n\r\n  constructor(name, version) {\r\n    this.db = create(\"clasitronicos\", 3);\r\n  }\r\n\r\n  getObject(objectStore, objectId) {\r\n    return this.db.then(db => {\r\n      let transaction = db.transaction(objectStore, \"readwrite\");\r\n      let request = transaction.objectStore(\"fields\").get(objectId);\r\n      //request.onsuccess = e => console.log(e.target.result);\r\n      return handleRequest(request);\r\n    })\r\n  }\r\n\r\n  getValue(objectStore, objectId, property) {\r\n    return this.getObject(objectStore, objectId)\r\n               .then(object => object[property])\r\n               .catch(error => console.log(error));\r\n  }\r\n\r\n  addObject(objectStore, object) {\r\n    return this.db.then(db => {\r\n      let transaction = db.transaction(objectStore, \"readwrite\");\r\n      let request = transaction.objectStore(\"fields\").put(object);\r\n      return handleRequest(request);\r\n    })\r\n  }\r\n\r\n  updateValue(objectStore, objectId, property, value) {\r\n    return this.getObject(objectStore, objectId)\r\n               .then(object => {\r\n                 object[property] = value;\r\n                 this.db.then(db => {\r\n                   const request = db.transaction(objectStore, \"readwrite\")\r\n                                     .objectStore(objectStore).put(object);\r\n                   return handleRequest(request);\r\n                 });\r\n               });\r\n  }\r\n\r\n  getAllObjects(objectStore) {\r\n    return this.db.then(db => {\r\n      const objStore = db.transaction(objectStore, \"readwrite\")\r\n                         .objectStore(objectStore);\r\n      return handleRequest( objStore.getAll() )\r\n    });\r\n  }\r\n\r\n  dummyData(objectStore, objects) {\r\n    objects.forEach(item  => {\r\n        this.addObject(objectStore, item)\r\n        .then(res => console.log(res) )\r\n        .catch(err => console.log(err) );\r\n    });\r\n  }\r\n\r\n  clear(objectStore) {\r\n    return this.db.then( db => {\r\n      const clearRequest =  db.transaction(objectStore, \"readwrite\")\r\n                              .objectStore(objectStore).clear();\r\n      return handleRequest(clearRequest);\r\n    })\r\n  }\r\n\r\n};\r\n\r\nconst create = (name, version) => {\r\n  if (!window.indexedDB) {\r\n    alert(\"indexedDB not supported.\");\r\n  }\r\n  const request = indexedDB.open(name, version);\r\n  request.onupgradeneeded = e => {\r\n    let db = e.target.result;\r\n    const objectStore = db.createObjectStore(\"fields\", { keyPath : \"id\" });\r\n  }\r\n  return handleRequest(request);\r\n}\r\n\r\nfunction handleRequest(request, success=successDefault, error=errorDefault) {\r\n  return new Promise((res, rej) => {\r\n    request.onerror = e => rej( errorDefault(e) )\r\n    request.onsuccess = e => res( successDefault(e) );\r\n  });\r\n}\r\n\r\nfunction handleTransaction(transaction, success=successDefault, error=errorDefault) {\r\n  return new Promise((res, rej) => {\r\n    transaction.onerror = e => rej( errorDefault(e) )\r\n    transaction.onsuccess = e => res( successDefault(e) );\r\n  });\r\n}\r\n\r\nconst successDefault = e => e.target.result;\r\nconst errorDefault = e => console.log(\"Error: \" + e.target.errorCode);\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/session/db.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/publicado/publicado.js");
/******/ 	
/******/ })()
;