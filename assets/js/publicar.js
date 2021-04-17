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

/***/ "./src/data/countries-dict.js":
/*!************************************!*\
  !*** ./src/data/countries-dict.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"countries\": () => (/* binding */ countries)\n/* harmony export */ });\nconst countries = {\n\t\"AR\": \"argentina\",\n\t\"BO\": \"bolivia\",\n\t\"CA\": \"california\",\n\t\"CH\": \"chile\",\n\t\"CO\": \"colombia\",\n\t\"CR\": \"costa_rica\",\n\t\"CU\": \"cuba\",\n\t\"EC\": \"ecuador\",\n\t\"EL\": \"el_salvador\",\n\t\"ES\": \"españa\",\n\t\"FL\": \"florida\",\n\t\"GU\": \"guatemala\",\n\t\"HO\": \"honduras\",\n\t\"IL\": \"illinois\",\n\t\"MX\": \"méxico\",\n\t\"NI\": \"nicaragua\",\n\t\"PN\": \"panamá\",\n\t\"PG\": \"paraguay\",\n\t\"PE\": \"peru\",\n\t\"PR\": \"puerto_rico\",\n\t\"RD\": \"república_dominicana\",\n\t\"SC\": \"south_carolina\",\n\t\"TX\": \"texas\",\n\t\"UR\": \"uruguay\",\n\t\"VE\": \"venezuela\"\n};\n//export default countries;\n\n\n//# sourceURL=webpack://clasitronicos/./src/data/countries-dict.js?");

/***/ }),

/***/ "./src/scripts/common/helper.js":
/*!**************************************!*\
  !*** ./src/scripts/common/helper.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"stringToNode\": () => (/* binding */ stringToNode)\n/* harmony export */ });\nfunction stringToNode(htmlString) {\r\n  let div = document.createElement('div');\r\n  div.innerHTML = htmlString.trim();\r\n  return div.children[0];\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/common/helper.js?");

/***/ }),

/***/ "./src/scripts/publish/categoria.js":
/*!******************************************!*\
  !*** ./src/scripts/publish/categoria.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"adjustKeywordFieldset\": () => (/* binding */ adjustKeywordFieldset),\n/* harmony export */   \"isCarCategory\": () => (/* binding */ isCarCategory)\n/* harmony export */ });\n/**\r\n* @description\r\n*   displays appropiate keyword fieldset according to selected category.\r\n*/\r\nfunction adjustKeywordFieldset() {\r\n  let category = document.querySelector(\"select[name='category']\").value;\r\n  if ( isCarCategory(category) ) {\r\n    document.getElementById('autoKeywords').style.display = 'block';\r\n    document.getElementById('generalKeywords').style.display = 'none';\r\n  }\r\n}\r\n\r\n/**\r\n* @description check if category is related to autos.\r\n* @param {string} category - a selectable ad category\r\n* @returns {bool} true if category is an auto-related category.\r\n*/\r\nfunction isCarCategory(category) {\r\n    return (category === 'autos' || category === 'autos antiguos'\r\n    || category === 'motoras' || category === 'pickups' ||\r\n    category === 'vanes');\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/publish/categoria.js?");

/***/ }),

/***/ "./src/scripts/publish/form.js":
/*!*************************************!*\
  !*** ./src/scripts/publish/form.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Form)\n/* harmony export */ });\n/* harmony import */ var _categoria_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./categoria.js */ \"./src/scripts/publish/categoria.js\");\n/* harmony import */ var _form_validation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form_validation.js */ \"./src/scripts/publish/form_validation.js\");\n/* harmony import */ var _form_dimensions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form_dimensions.js */ \"./src/scripts/publish/form_dimensions.js\");\n/* harmony import */ var _fotos_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fotos.js */ \"./src/scripts/publish/fotos.js\");\n\r\n\r\n\r\n\r\n//import * as preview from 'preview.js';\r\n\r\nclass Form {\r\n  constructor({form, actions, select = {}, photos = {}, submit}) {\r\n    this.form = form;\r\n    this.actions = actions;\r\n    this.select = select;\r\n    this.photos = photos;\r\n    this.submit = submit;\r\n  }\r\n\r\n  initialize() {\r\n    this.form.addEventListener('change', _form_validation_js__WEBPACK_IMPORTED_MODULE_1__.checkPublishButton);\r\n    this.form.addEventListener('change', () => this.writeToStorage());\r\n    this.select.addEventListener('change', _categoria_js__WEBPACK_IMPORTED_MODULE_0__.adjustKeywordFieldset);\r\n    this.form.addEventListener('submit', e => this.onSubmit(e))\r\n    /*this.actions.forEach(action => {\r\n      //this condition is terrible, needs to be fixed\r\n      if (action.textContent !== \"publicar\") {\r\n        action.addEventListener('click', this.writeToStorage);\r\n      }\r\n    });*/\r\n\r\n    //Obviously change the argument style of renderPhotoFields\r\n    //TODO\r\n    _fotos_js__WEBPACK_IMPORTED_MODULE_3__.renderPhotoFields([1,2,3,4,5,6,7]);\r\n    //dimensions.adjustFieldsetWidth();\r\n  }\r\n\r\n  addFormEventListener(event, callback) {\r\n    this.form.addEventListener(event, callback);\r\n  }\r\n\r\n  /**\r\n  * @description store form field values in local storage\r\n  */\r\n  writeToStorage() {\r\n    const fields = this.getAllFields();\r\n    fields.forEach(field => { window.sessionStorage\r\n                                    .setItem(field.id, field.value);\r\n    });\r\n  }\r\n\r\n  /**\r\n  * @description get all form fields\r\n  * @returns {Array}\r\n  */\r\n  getAllFields() {\r\n    return Array.from( this.form.querySelectorAll(\"input, select\") );\r\n  }\r\n\r\n  async onSubmit(e) {\r\n    e.preventDefault();\r\n    const formData = new FormData(\r\n      document.querySelector('form')\r\n    );\r\n    document.querySelector('#spinner').style.display = 'flex';\r\n    try {\r\n      const res =  await fetch('https://www.clasificadoselectronicos.com/cgi-bin/anunciopr.cgi', {\r\n        method: 'POST',\r\n        body: formData\r\n      });\r\n      if (res.ok) {\r\n        res.text().then(data => {\r\n          let doc = document.getElementsByTagName('html')[0];\r\n          doc.innerHTML = data;\r\n        });\r\n      }else {\r\n        errMsg();\r\n      }\r\n    }catch {\r\n        errMsg();\r\n    }\r\n  }\r\n};\r\n\r\nconst errMsg = () => {\r\n  const errMsg = `<h1> Lo sentimos, hubo un error.\r\n                       Intente luego.\r\n                  </h1>\r\n                  <a style=\"margin: 20px;\"\r\n                     href=\"https://clasitronicos.com\"\r\n                     class=\"button\">\r\n                     Volver a inicio</a>\r\n                  <button\r\n                  style=\"width: 11em;\"\r\n                  onClick=\"document\r\n                  .querySelector('#spinner').style.display='none'\"\r\n                  type=\"button\">\r\n                  Intentar de nuevo </button>`;\r\n  document.querySelector('#spinner').innerHTML = errMsg;\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/publish/form.js?");

/***/ }),

/***/ "./src/scripts/publish/form_dimensions.js":
/*!************************************************!*\
  !*** ./src/scripts/publish/form_dimensions.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"adjustFieldsetWidth\": () => (/* binding */ adjustFieldsetWidth)\n/* harmony export */ });\n/**\r\n* @description\r\n* i think fieldset element needs explicit width?\r\n* need to review what this function is doing\r\n*/\r\nfunction adjustFieldsetWidth() {\r\n    let width = document.getElementsByTagName('form')[0].offsetWidth - 30;\r\n    //get all inputs except the submit button\r\n    let inputs = document\r\n    .querySelectorAll('input:not(.captcha-input)');\r\n    // These divs contain the input label + input field\r\n    let photoInputDivs = document.querySelectorAll('#photoFields div');\r\n    let textareas = document.querySelectorAll('textarea');\r\n    let selects = document.getElementsByTagName('select');\r\n    let captchas = document.querySelectorAll('.captcha');\r\n    // for (let i = 0; i < inputs.length; i++) {\r\n    //   inputs[i].style.width = width + 'px';\r\n    // }\r\n    adjustWidth(photoInputDivs, width);\r\n    adjustWidth(inputs, width);\r\n    //adjustWidth(textareas, width);\r\n    adjustWidth(captchas, width / 2);\r\n    selects[0].style.width = width + 'px';\r\n}\r\n\r\nfunction adjustWidth(nodeSet, width) {\r\n  for (let i = 0; i < nodeSet.length; i++) {\r\n    nodeSet[i].style.width = width + 'px';\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/publish/form_dimensions.js?");

/***/ }),

/***/ "./src/scripts/publish/form_scroller.js":
/*!**********************************************!*\
  !*** ./src/scripts/publish/form_scroller.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ FormScroller)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/scripts/utils.js\");\n\r\n\r\nclass FormScroller {\r\n  /**\r\n  * @param {integer} current - represents the position of the current fieldset\r\n  * @param {HTMLButtonElement} nextButton - points at the 'next' button\r\n  * @param {HTMLButtonElement} backButton - points at the 'back' button\r\n  * @param {Bool}\r\n  * nextShowing, backShowing - wether the corresponding control button is being\r\n  * displayed.\r\n  * @param {integer} firstFieldset, lastFieldset - represent positions of\r\n  * first and last fieldsets\r\n  */\r\n  constructor({nextButton, backButton},\r\n              current = 1,\r\n              nextShowing = true,\r\n              backShowing = false,\r\n              firstFieldset = 1,\r\n              lastFieldset = 7) {\r\n    this.nextButton = nextButton;\r\n    this.backButton = backButton;\r\n    this.current = current;\r\n    this.nextShowing = nextShowing;\r\n    this.backShowing = backShowing;\r\n    this.firstFieldset = firstFieldset;\r\n    this.lastFieldset = lastFieldset;\r\n    this.backButton.style.display = \"none\";\r\n  }\r\n\r\n  /**\r\n  * @description attaches appropiate event handlers to the form buttons\r\n  */\r\n  initialize() {\r\n    this.nextButton.onclick = () => this.scrollForm('forward');\r\n    this.backButton.onclick = () => this.scrollForm('backward');\r\n  }\r\n\r\n  /**\r\n  * @description handles scrolling the publish form in either direction\r\n  * @param {String} direction - the only values must be \"forward\" or \"backward\"\r\n  */\r\n  scrollForm(direction) {\r\n    if (direction != \"forward\" && direction != \"backward\") return false;\r\n    direction === 'forward' ? this.current++ : this.current--;\r\n    if (this.current >= this.lastFieldset) {\r\n      this.nextButton.style.display = 'none';\r\n      //publishDummy.style.display = 'block';\r\n      this.current = this.lastFieldset;\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toggleClass)(true, '.preview', 'preview-display-none');\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toggleClass)(false, 'fieldset:last-of-type', 'display-none');\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toggleClass)(true, '.publish-option', 'add-padding');\r\n    }\r\n\r\n    if (this.current <= this.firstFieldset) {\r\n      this.backButton.style.display = 'none';\r\n      this.current = this.firstFieldset;\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toggleClass)(false, '.preview', 'preview-display-none');\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toggleClass)(true, '.invalidFormError', 'display-none');\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toggleClass)(false, '.publish-option', 'add-padding');\r\n    }\r\n\r\n    if (this.current > this.firstFieldset && this.current < this.lastFieldset) {\r\n      this.nextButton.style.display = 'block';\r\n      this.backButton.style.display = 'block';\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toggleClass)(false, '.preview', 'preview-display-none');\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toggleClass)(false, '.publish-option', 'add-padding');\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toggleClass)(true, '.invalidFormError', 'display-none');\r\n    }\r\n\r\n    let destinationFieldSet = document\r\n        .querySelector('fieldset:nth-child('+this.current+')');\r\n    // grab the fieldset legend text and use it as page header\r\n    document.querySelector('header').innerText = destinationFieldSet\r\n                                                 .firstElementChild.textContent;\r\n    destinationFieldSet.scrollIntoView( {inline:'start', behavior:'smooth'} );\r\n  }\r\n};\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/publish/form_scroller.js?");

/***/ }),

/***/ "./src/scripts/publish/form_validation.js":
/*!************************************************!*\
  !*** ./src/scripts/publish/form_validation.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"invalidExtension\": () => (/* binding */ invalidExtension),\n/* harmony export */   \"checkPublishButton\": () => (/* binding */ checkPublishButton),\n/* harmony export */   \"invalidForm\": () => (/* binding */ invalidForm),\n/* harmony export */   \"getEmptyRequiredValues\": () => (/* binding */ getEmptyRequiredValues),\n/* harmony export */   \"getInvalidValues\": () => (/* binding */ getInvalidValues)\n/* harmony export */ });\n/**\r\n  @description checks for valid file extensions\r\n  @param {string} path - path to file to be tested.\r\n  @returns {bool} true if extension is invalid, false otherwise.\r\n*/\r\nfunction invalidExtension(path) {\r\n    const allowedExtensions = /(\\.jpg|\\.jpeg|\\.png|\\.gif)$/i;\r\n    return !allowedExtensions.exec(path);\r\n  }\r\n\r\n/**\r\n* @params {NodeList} fieldset - fields inside the current fieldset.\r\n* @returns true if required fields are provided and all fields\r\n* are valid in fieldset\r\n*/\r\nfunction isValidFieldset(fieldset) {\r\n  inputs = Array.from(fieldset.nodeChildren)\r\n                .filter(child => child.nodeName === \"SELECT\"\r\n                              || child.nodeName === \"INPUT\");\r\n  }\r\n\r\nfunction checkPublishButton() {\r\n    let parent = document.querySelector('#finish').classList;\r\n    //const submit = document.querySelector('input[name=\"submit\"]');\r\n    if ( !invalidForm() ) {\r\n      setPublishActions(\"enabled\");\r\n      parent.remove('invalidFormError');\r\n      return;\r\n    }\r\n    setPublishActions(\"disabled\");\r\n    parent.add(\"invalidFormError\");\r\n  }\r\n\r\n/**\r\n* @returns {Bool} true if all required field values are non-empty\r\n* and all form fields are valid.\r\n* TODO take the querying code outside of this function.\r\n*/\r\nfunction invalidForm() {\r\n      const requiredFields = document.querySelectorAll('.required + *');\r\n      const allFields = document.querySelectorAll('input, select');\r\n      //console.log(\"inval: \" + getInvalidValues(allFields).length)\r\n      console.log(\"getEmpty: \" + getEmptyRequiredValues(requiredFields).length)\r\n      //console.log(\"incomplete: \" + incompleteCaptcha())\r\n      return  (\r\n                getInvalidValues(allFields).length  ||\r\n                getEmptyRequiredValues(requiredFields).length ||\r\n                incompleteCaptcha()\r\n              );\r\n  }\r\n\r\n/**\r\n* @param {NodeList} requiredFields all required fields\r\n*/\r\nfunction getEmptyRequiredValues(requiredFields) {\r\n    let fields =  Array.from(requiredFields)\r\n                .filter( req => req.value === \"\");\r\n    console.log(fields);\r\n    return fields;\r\n  }\r\n\r\n/**\r\n* @param {NodeList} fields all input fields\r\n* TODO: field.invalid is there just because of photo input\r\n* figure out way to only use checkValidty.\r\n*/\r\nfunction getInvalidValues(fields) {\r\n    return Array.from(fields)\r\n                .filter( field => field.invalid || !field.checkValidity() );\r\n  }\r\n\r\nfunction incompleteCaptcha() {\r\n  return !document.querySelectorAll('input[type=\"radio\"]:checked').length;\r\n}\r\n\r\n/**\r\n* @description disable/enable publish buttons\r\n*/\r\nfunction setPublishActions(action) {\r\n  const publishActions = document.querySelectorAll('.actions *');\r\n  Array.from(publishActions).forEach(publishAction => {\r\n    action === \"enabled\" ? publishAction.classList.remove(\"actionDisabled\") :\r\n                           publishAction.classList.add(\"actionDisabled\")\r\n  });\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/publish/form_validation.js?");

/***/ }),

/***/ "./src/scripts/publish/fotos.js":
/*!**************************************!*\
  !*** ./src/scripts/publish/fotos.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"renderPhotoFields\": () => (/* binding */ renderPhotoFields),\n/* harmony export */   \"renderPhotoField\": () => (/* binding */ renderPhotoField),\n/* harmony export */   \"enableNextPhotoInput\": () => (/* binding */ enableNextPhotoInput),\n/* harmony export */   \"replaceSVGWithImage\": () => (/* binding */ replaceSVGWithImage)\n/* harmony export */ });\n/* harmony import */ var _form_validation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form_validation.js */ \"./src/scripts/publish/form_validation.js\");\n/* harmony import */ var _common_helper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/helper.js */ \"./src/scripts/common/helper.js\");\n\r\n\r\n\r\nfunction renderPhotoFields(photoIndices) {\r\n  const uploadSection = document.querySelector(\"#photoFields\");\r\n  let photoFields = photoIndices\r\n      .map( photoIndex => renderPhotoField(photoIndex, uploadSection) );\r\n  // make fisrt photo required\r\n  document.querySelector('label[for=\"photofile1\"]').classList.add('required');\r\n}\r\n\r\n/**\r\n* @param {number} photoIndex\r\n* @param {Node} uploadSection - photo inputs container\r\n*/\r\nfunction renderPhotoField(photoIndex, uploadSection) {\r\n  const newInputName = \"photofile\" + photoIndex;\r\n  let newElement = `<div>\r\n                        <label for=\"${newInputName}\">\r\n                          foto #${photoIndex}\r\n                        </label>\r\n                        <input id=\"${newInputName}\" type=\"file\"\r\n                               name=\"${newInputName}\"\r\n                               data-index=\"${photoIndex}\"\r\n                               accept=\".jpg,jpeg,.png\">\r\n                      </div>`;\r\n  newElement = _common_helper_js__WEBPACK_IMPORTED_MODULE_1__.stringToNode(newElement);\r\n  if (photoIndex > 1) newElement.children[1].disabled = true;\r\n  uploadSection.append(newElement);\r\n  return 0;\r\n}\r\n\r\n/**\r\n* @param {HTMLInputElement} imageInputField - disabled file input\r\n* @returns {bool|nothing}\r\n* false if all photo inputs have been used\r\n* nothing otherwise\r\n*/\r\nfunction enableNextPhotoInput(imageInputField) {\r\n  const nextInputIndex = Number(imageInputField.getAttribute('data-index')) + 1;\r\n  const lastInputIndex = 7;\r\n  if (nextInputIndex > lastInputIndex) return false;\r\n  document.querySelector(\"input[data-index='\"+nextInputIndex+\"']\")\r\n  .disabled = false;\r\n}\r\n\r\n\r\n/**\r\n* @description\r\n* in the preview, the image placeholder is an SVG.\r\n* it needs to be replaced with actual image preview\r\n* when user uploads an image.\r\n*/\r\nfunction replaceSVGWithImage() {\r\n  const imageContainer = document.querySelector('.image');\r\n  const svg = document.querySelector('.image svg');\r\n  const image = document.createElement('img');\r\n  imageContainer.replaceChild(image, svg);\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/publish/fotos.js?");

/***/ }),

/***/ "./src/scripts/publish/preview.js":
/*!****************************************!*\
  !*** ./src/scripts/publish/preview.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Preview)\n/* harmony export */ });\n/* harmony import */ var _fotos_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fotos.js */ \"./src/scripts/publish/fotos.js\");\n/* harmony import */ var _form_validation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form_validation.js */ \"./src/scripts/publish/form_validation.js\");\n\r\n\r\n\r\nclass Preview {\r\n  constructor({\r\n    imageContainer,\r\n    city,\r\n    price,\r\n    title,\r\n    vendor,\r\n    phone1,\r\n    key1,\r\n    key2\r\n  }) {\r\n    this.imageContainer = imageContainer;\r\n    this.city = city;\r\n    this.price = price;\r\n    this.title = title;\r\n    this.vendor = vendor;\r\n    this.phone1 = phone1;\r\n    this.key1 = key1;\r\n    this.key2 = key2;\r\n  }\r\n\r\n  // lol rmemeber to rename this function\r\n  updatePreview(e, db) {\r\n    const elem = e.target\r\n    let value = elem.value;\r\n    let name = elem.getAttribute('name');\r\n\r\n    if (elem.getAttribute('type') === 'file') {\r\n        if (this.handlePhotoPreview(elem, db)) {\r\n          _fotos_js__WEBPACK_IMPORTED_MODULE_0__.enableNextPhotoInput(elem);\r\n        }\r\n        return;\r\n    }\r\n\r\n    if (name === 'price') {\r\n      value = \"$\" + value;\r\n    }\r\n\r\n    if (name === 'key2' || name === 'key1') {\r\n      const keys = [];\r\n      keys[0] = this.key1.value ? this.key1.value : \"\";\r\n      keys[1] = this.key2.value ? this.key2.value : \"\";\r\n      value = keys[0] + \" \" + keys[1];\r\n    }\r\n\r\n    if ( Object.keys(this).includes(name) ) {\r\n      this[name].innerText = value;\r\n    }\r\n    const store = { id : elem.id, value : elem.value };\r\n    db.addObject(\"fields\", store);\r\n   }\r\n\r\n   /**\r\n   * @description\r\n   * handles the the preview of the first uploaded image.\r\n   * @param {HTMLInputElement} imageInputField - input containing uploaded image\r\n   * @param {object} preview\r\n   * @returns {bool} true if valid image format is uploaded, false otherwise.\r\n   */\r\n   handlePhotoPreview(imageInputField, db) {\r\n     if ( _form_validation_js__WEBPACK_IMPORTED_MODULE_1__.invalidExtension(imageInputField.value) ) {\r\n       // @parentElement points to div container of image upload field,\r\n       // which is where we render the error message.\r\n       imageInputField.parentElement.classList.add(\"photoError\");\r\n       imageInputField.invalid = true;\r\n       imageInputField.value = \"\";\r\n       return false;\r\n     }\r\n\r\n     if ( imageInputField.files && imageInputField.files[0]\r\n       && imageInputField.getAttribute('data-index') === \"1\") {\r\n       // on page load, preview image will be a placeholder svg that\r\n       // needs to be replaced\r\n       if (this.imageContainer.childNodes[1].tagName !== \"IMG\") {\r\n         _fotos_js__WEBPACK_IMPORTED_MODULE_0__.replaceSVGWithImage();\r\n       }\r\n       const reader = new FileReader();\r\n       reader.onload = e => {\r\n         document.querySelector('.image img')\r\n                 .setAttribute('src', e.target.result);\r\n         db.addObject( \"fields\", {\r\n           id : imageInputField.id,\r\n           value : e.target.result } );\r\n       }\r\n       reader.readAsDataURL(imageInputField.files[0]);\r\n     }\r\n\r\n     const parentDivClassList = imageInputField.parentElement.classList;\r\n     imageInputField.invalid = false;\r\n     parentDivClassList.remove(\"photoError\");\r\n     return true;\r\n   }\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/publish/preview.js?");

/***/ }),

/***/ "./src/scripts/publish/publicar.js":
/*!*****************************************!*\
  !*** ./src/scripts/publish/publicar.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _session_session_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../session/session.js */ \"./src/scripts/session/session.js\");\n/* harmony import */ var _data_countries_dict_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../data/countries-dict.js */ \"./src/data/countries-dict.js\");\n/* harmony import */ var _form_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form.js */ \"./src/scripts/publish/form.js\");\n/* harmony import */ var _form_scroller_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form_scroller.js */ \"./src/scripts/publish/form_scroller.js\");\n/* harmony import */ var _preview_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./preview.js */ \"./src/scripts/publish/preview.js\");\n/* harmony import */ var _session_db_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../session/db.js */ \"./src/scripts/session/db.js\");\n/* harmony import */ var _form_validation_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./form_validation.js */ \"./src/scripts/publish/form_validation.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nconst db = new _session_db_js__WEBPACK_IMPORTED_MODULE_5__.default(\"clasitronicos\", 3);\r\nhandleLocation();\r\n/* setup publish form */\r\nconst formFields = {\r\n  form : document.querySelector('form'),\r\n  actions : Array.from( document.querySelectorAll('.actions a') ),\r\n  select : document.querySelector('select#category'),\r\n  photos : \"\",\r\n  submit : document.querySelector('input[type=\"submit\"]')\r\n}\r\nconst form = new _form_js__WEBPACK_IMPORTED_MODULE_2__.default(formFields);\r\nform.initialize();\r\n\r\n/* set up form scroll functionality */\r\nconst scrollButtons = {\r\n  nextButton : document\r\n               .querySelector('#formScrollButtons button:nth-child(2)'),\r\n  backButton : document\r\n               .querySelector('#formScrollButtons button:nth-child(1)')\r\n}\r\nconst scroller = new _form_scroller_js__WEBPACK_IMPORTED_MODULE_3__.default(scrollButtons);\r\nscroller.initialize();\r\n\r\n/* set up ad preview */\r\nconst previewFields = {\r\n  imageContainer : document.querySelector('.image'),\r\n  city : document.querySelector('.province'),\r\n  price : document.querySelector('.price'),\r\n  title : document.querySelector('.title'),\r\n  vendor : document.querySelector('.vendor'),\r\n  phone1 : document.querySelector('.phone'),\r\n  key1 : document.querySelector('input[name=\"key1\"]'),\r\n  key2 : document.querySelector('input[name=\"key2\"]')\r\n};\r\nconst preview = new _preview_js__WEBPACK_IMPORTED_MODULE_4__.default(previewFields);\r\nform.addFormEventListener('change', e => preview.updatePreview(e, db));\r\n_session_session_js__WEBPACK_IMPORTED_MODULE_0__.handlePremiumPitch( document.querySelector('.premium-pitch'),\r\n                            document.querySelector('input[name=\"submit\"]') );\r\n\r\n// atm cant remember why we need this but we do.\r\nconst publishDummy = document\r\n                     .querySelector('#formScrollButtons button:nth-child(3)');\r\npublishDummy.style.display = 'none';\r\n\r\n\r\n//hacky, fix later\r\nconst tooltips = document.querySelectorAll('.title-info');\r\ntooltips.forEach((tooltip, i) => {\r\n  tooltip.addEventListener('click', e => {\r\n    let perks = e.currentTarget.nextElementSibling.nextElementSibling;\r\n    perks.style.display = \"flex\";\r\n  })\r\n});\r\n\r\ndocument.querySelectorAll('.perks').forEach((perk, i) => {\r\n  perk.addEventListener('click', e => {\r\n      e.currentTarget.style.display = \"none\";\r\n      });\r\n\r\n  });\r\n\r\ndocument.querySelector('select#country')\r\n.addEventListener('change', e => {\r\n  let val = e.target.value;\r\n  sessionStorage.setItem('id', val);\r\n  handleLocation();\r\n})\r\n\r\n//also place this somewhere better\r\n//remember to upload script.js to server\r\n//for this to work\r\nfunction handleLocation() {\r\n  let id;\r\n  let country;\r\n  if ( id = sessionStorage.getItem(\"id\")) {\r\n    if (id === \"PR\") {\r\n      removeCityState();\r\n      document.querySelector(\"#city\").style.display = \"block\";\r\n      document.querySelector('label[for=\"city\"]').style.display = \"block\";\r\n    } else {\r\n      insertCityState();\r\n      const city = document.querySelector(\"select#city\");\r\n      city.style.display = \"none\";\r\n      let label = document.querySelector('label[for=\"city\"]');\r\n      label.style.display = \"none\";\r\n      label.classList.remove(\"required\");\r\n      //const country = countries[ sessionStorage.getItem(\"id\") ];\r\n    }\r\n    setSelectTo(id);\r\n  } else {\r\n      //default\r\n    country = \"puerto rico\";\r\n    removeCityState();\r\n    setSelectTo(\"PR\");\r\n  }\r\n  //document.querySelector('#loc span').innerText = country;\r\n}\r\n\r\nfunction removeCityState(property) {\r\n  const city = document.querySelector(\"#city-not-muni\");\r\n  city.value = \"none\";\r\n  city.style.display = \"none\";\r\n  document.querySelector('label[for=\"city-not-muni\"]').style.display = \"none\";\r\n  const state = document.querySelector(\"#state\");\r\n  state.value = \"none\";\r\n  state.style.display = \"none\";\r\n  document.querySelector('label[for=\"state\"]').style.display = \"none\";\r\n}\r\n\r\nfunction insertCityState() {\r\n  const city = document.querySelector(\"#city-not-muni\");\r\n  city.value = \"\";\r\n  city.style.display = \"block\";\r\n  document.querySelector('label[for=\"city-not-muni\"]').style.display = \"block\";\r\n  const state = document.querySelector(\"#state\");\r\n  state.value = \"\";\r\n  state.style.display = \"block\";\r\n  document.querySelector('label[for=\"state\"]').style.display = \"block\";\r\n}\r\n\r\nfunction setSelectTo(countryID) {\r\n  const country = document.querySelector('select#country');\r\n  const option = document.querySelector(`option[value=\"${countryID}\"]`);\r\n  country.value = option.value;\r\n  option.selected = true;\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/publish/publicar.js?");

/***/ }),

/***/ "./src/scripts/session/db.js":
/*!***********************************!*\
  !*** ./src/scripts/session/db.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DB)\n/* harmony export */ });\n\r\nclass DB {\r\n\r\n  constructor(name, version) {\r\n    this.db = create(\"clasitronicos\", 3);\r\n  }\r\n\r\n  getObject(objectStore, objectId) {\r\n    return this.db.then(db => {\r\n      let transaction = db.transaction(objectStore, \"readwrite\");\r\n      let request = transaction.objectStore(\"fields\").get(objectId);\r\n      //request.onsuccess = e => console.log(e.target.result);\r\n      return handleRequest(request);\r\n    })\r\n  }\r\n\r\n  getValue(objectStore, objectId, property) {\r\n    return this.getObject(objectStore, objectId)\r\n               .then(object => object[property])\r\n               .catch(error => console.log(error));\r\n  }\r\n\r\n  addObject(objectStore, object) {\r\n    return this.db.then(db => {\r\n      let transaction = db.transaction(objectStore, \"readwrite\");\r\n      let request = transaction.objectStore(\"fields\").put(object);\r\n      return handleRequest(request);\r\n    })\r\n  }\r\n\r\n  updateValue(objectStore, objectId, property, value) {\r\n    return this.getObject(objectStore, objectId)\r\n               .then(object => {\r\n                 object[property] = value;\r\n                 this.db.then(db => {\r\n                   const request = db.transaction(objectStore, \"readwrite\")\r\n                                     .objectStore(objectStore).put(object);\r\n                   return handleRequest(request);\r\n                 });\r\n               });\r\n  }\r\n\r\n  getAllObjects(objectStore) {\r\n    return this.db.then(db => {\r\n      const objStore = db.transaction(objectStore, \"readwrite\")\r\n                         .objectStore(objectStore);\r\n      return handleRequest( objStore.getAll() )\r\n    });\r\n  }\r\n\r\n  dummyData(objectStore, objects) {\r\n    objects.forEach(item  => {\r\n        this.addObject(objectStore, item)\r\n        .then(res => console.log(res) )\r\n        .catch(err => console.log(err) );\r\n    });\r\n  }\r\n\r\n  clear(objectStore) {\r\n    return this.db.then( db => {\r\n      const clearRequest =  db.transaction(objectStore, \"readwrite\")\r\n                              .objectStore(objectStore).clear();\r\n      return handleRequest(clearRequest);\r\n    })\r\n  }\r\n\r\n};\r\n\r\nconst create = (name, version) => {\r\n  if (!window.indexedDB) {\r\n    alert(\"indexedDB not supported.\");\r\n  }\r\n  const request = indexedDB.open(name, version);\r\n  request.onupgradeneeded = e => {\r\n    let db = e.target.result;\r\n    const objectStore = db.createObjectStore(\"fields\", { keyPath : \"id\" });\r\n  }\r\n  return handleRequest(request);\r\n}\r\n\r\nfunction handleRequest(request, success=successDefault, error=errorDefault) {\r\n  return new Promise((res, rej) => {\r\n    request.onerror = e => rej( errorDefault(e) )\r\n    request.onsuccess = e => res( successDefault(e) );\r\n  });\r\n}\r\n\r\nfunction handleTransaction(transaction, success=successDefault, error=errorDefault) {\r\n  return new Promise((res, rej) => {\r\n    transaction.onerror = e => rej( errorDefault(e) )\r\n    transaction.onsuccess = e => res( successDefault(e) );\r\n  });\r\n}\r\n\r\nconst successDefault = e => e.target.result;\r\nconst errorDefault = e => console.log(\"Error: \" + e.target.errorCode);\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/session/db.js?");

/***/ }),

/***/ "./src/scripts/session/session.js":
/*!****************************************!*\
  !*** ./src/scripts/session/session.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"isLoggedin\": () => (/* binding */ isLoggedin),\n/* harmony export */   \"handlePremiumPitch\": () => (/* binding */ handlePremiumPitch)\n/* harmony export */ });\n/**\r\n* @description returns true if user is logged in\r\n* careful, only use it for load routines\r\n* ex. imagine that it only lets you post premium if you are signed in\r\n*\r\n*/\r\nfunction isLoggedin() {\r\n  return document.cookie.includes(\"login\");\r\n}\r\n\r\n/**\r\n* @description removes premium pitch to guests\r\n* TODO make this a method of the form class\r\n*/\r\nfunction handlePremiumPitch(pitchContainer, publishButton) {\r\n  if ( isLoggedin() ) {\r\n    pitchContainer.style.display = 'none';\r\n    publishButton.value = \"publicar\";\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/session/session.js?");

/***/ }),

/***/ "./src/scripts/utils.js":
/*!******************************!*\
  !*** ./src/scripts/utils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"toggleClass\": () => (/* binding */ toggleClass)\n/* harmony export */ });\nfunction toggleClass(toggle, selector, className) {\r\n  const elements = document.querySelectorAll(selector);\r\n  elements.forEach((element, i) => {\r\n    toggle ? element.classList.add(className) :\r\n             element.classList.remove(className);\r\n  });\r\n}\r\n\n\n//# sourceURL=webpack://clasitronicos/./src/scripts/utils.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/publish/publicar.js");
/******/ 	
/******/ })()
;