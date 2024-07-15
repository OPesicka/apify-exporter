/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Blueprint functions
/** Format object to pretty JSON */
Pulsar.registerFunction("objectToPrettyJson", (object) => {
    return JSON.stringify(object, null, 2);
});
/** Generate style dictionary tree */
Pulsar.registerFunction("generateStyleDictionaryTree", (rootGroup, allTokens, allGroups) => {
    let writeRoot = {};
    // Compute full data structure of the entire type-dependent tree
    let result = representTree(rootGroup, allTokens, allGroups, writeRoot);
    // Add top level entries which don't belong to any user-defined group
    for (let token of tokensOfGroup(rootGroup, allTokens)) {
        result[safeTokenName(token)] = representToken(token, allTokens, allGroups);
    }
    // Retrieve
    return {
        [`${typeLabel(rootGroup.tokenType)}`]: result,
    };
});
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Tree construction
/** Construct tree out of one specific group, independent of tree type */
function representTree(rootGroup, allTokens, allGroups, writeObject) {
    // Represent one level of groups and tokens inside tree. Creates subobjects and then also information about each token
    for (let group of rootGroup.subgroups) {
        // Write buffer
        let writeSubObject = {};
        // Add each entry for each subgroup, and represent its tree into it
        writeObject[safeGroupName(group)] = representTree(group, allTokens, allGroups, writeSubObject);
        // Add each entry for each token, writing to the same write root
        for (let token of tokensOfGroup(group, allTokens)) {
            writeSubObject[safeTokenName(token)] = representToken(token, allTokens, allGroups);
        }
    }
    return writeObject;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Representation
/** Represent a singular token as SD object */
function representToken(token, allTokens, allGroups) {
    switch (token.tokenType) {
        case "Color":
            return representColorToken(token, allTokens, allGroups);
        case "Border":
            return representBorderToken(token, allTokens, allGroups);
        case "Font":
            return representFontToken(token, allTokens, allGroups);
        case "Gradient":
            return representGradientToken(token, allTokens, allGroups);
        case "Measure":
            return representMeasureToken(token, allTokens, allGroups);
        case "Radius":
            return representRadiusToken(token, allTokens, allGroups);
        case "Shadow":
            return representShadowToken(token, allTokens, allGroups);
        case "Text":
            return representTextToken(token, allTokens, allGroups);
        case "Typography":
            return representTypographyToken(token, allTokens, allGroups);
    }
}
/** Represent full color token, including wrapping meta-information such as user description */
function representColorToken(token, allTokens, allGroups) {
    let value = representColorTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full border token, including wrapping meta-information such as user description */
function representBorderToken(token, allTokens, allGroups) {
    let value = representBorderTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full font token, including wrapping meta-information such as user description */
function representFontToken(token, allTokens, allGroups) {
    let value = representFontTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full gradient token, including wrapping meta-information such as user description */
function representGradientToken(token, allTokens, allGroups) {
    let value = representGradientTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full measure token, including wrapping meta-information such as user description */
function representMeasureToken(token, allTokens, allGroups) {
    let value = representMeasureTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full radius token, including wrapping meta-information such as user description */
function representRadiusToken(token, allTokens, allGroups) {
    let value = representRadiusTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full shadow token, including wrapping meta-information such as user description */
function representShadowToken(token, allTokens, allGroups) {
    const layers = token.shadowLayers;
    if ((layers === null || layers === void 0 ? void 0 : layers.length) > 1) {
        // "shadow-token": { "value": [ {"color": ..}, {..
        let value = layers.reverse().map((layer) => representShadowTokenValue(layer.value, allTokens, allGroups));
        // "shadow-token": { "value": { "layer-1": { "color": ..}, "layer-2"..
        // let value = layers.reverse().reduce((acc, layer, i) => (acc[`layer-${i + 1}`] = representShadowTokenValue(layer.value, allTokens, allGroups), acc), {});
        return tokenWrapper(token, value);
    }
    let value = representShadowTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full text token, including wrapping meta-information such as user description */
function representTextToken(token, allTokens, allGroups) {
    let value = representTextTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full typography token, including wrapping meta-information such as user description */
function representTypographyToken(token, allTokens, allGroups) {
    let value = representTypographyTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Value Representation
/** Represent color token value either as reference or as plain representation */
function representColorTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = `#${value.hex}`;
    }
    return result;
}
/** Represent radius token value either as reference or as plain representation */
function representRadiusTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            radius: {
                type: "measure",
                value: representMeasureTokenValue(value.radius, allTokens, allGroups),
            },
            topLeft: value.topLeft
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.topLeft, allTokens, allGroups),
                }
                : undefined,
            topRight: value.topRight
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.topRight, allTokens, allGroups),
                }
                : undefined,
            bottomLeft: value.bottomLeft
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.bottomLeft, allTokens, allGroups),
                }
                : undefined,
            bottomRight: value.bottomRight
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.bottomRight, allTokens, allGroups),
                }
                : undefined,
        };
    }
    return result;
}
/** Represent measure token value either as reference or as plain representation */
function representMeasureTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            measure: {
                type: "size",
                value: value.measure,
            },
            unit: {
                type: "string",
                value: value.unit.toLowerCase(),
            },
        };
    }
    return result;
}
/** Represent font token value either as reference or as plain representation */
function representFontTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            family: {
                type: "string",
                value: value.family,
            },
            subfamily: {
                type: "string",
                value: value.subfamily,
            },
        };
    }
    return result;
}
/** Represent text token value either as reference or as plain representation */
function representTextTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = value.text;
    }
    return result;
}
/** Represent typography token value either as reference or as plain representation */
function representTypographyTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            font: {
                type: "font",
                value: representFontTokenValue(value.font, allTokens, allGroups),
            },
            fontSize: {
                type: "measure",
                value: representMeasureTokenValue(value.fontSize, allTokens, allGroups),
            },
            textDecoration: value.textDecoration,
            textCase: value.textCase,
            letterSpacing: {
                type: "measure",
                value: representMeasureTokenValue(value.letterSpacing, allTokens, allGroups),
            },
            paragraphIndent: {
                type: "measure",
                value: representMeasureTokenValue(value.paragraphIndent, allTokens, allGroups),
            },
            lineHeight: value.lineHeight
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.lineHeight, allTokens, allGroups),
                }
                : undefined,
        };
    }
    return result;
}
/** Represent border token value either as reference or as plain representation */
function representBorderTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            color: {
                type: "color",
                value: representColorTokenValue(value.color, allTokens, allGroups),
            },
            width: {
                type: "measure",
                value: representMeasureTokenValue(value.width, allTokens, allGroups),
            },
            position: {
                type: "string",
                value: value.position,
            },
        };
    }
    return result;
}
/** Represent shadow token value either as reference or as plain representation */
function representShadowTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            color: {
                type: "color",
                value: representColorTokenValue(value.color, allTokens, allGroups),
            },
            x: {
                type: "measure",
                value: representMeasureTokenValue(value.x, allTokens, allGroups),
            },
            y: {
                type: "measure",
                value: representMeasureTokenValue(value.y, allTokens, allGroups),
            },
            radius: {
                type: "measure",
                value: representMeasureTokenValue(value.radius, allTokens, allGroups),
            },
            spread: {
                type: "measure",
                value: representMeasureTokenValue(value.spread, allTokens, allGroups),
            },
            opacity: {
                type: "size",
                value: value.opacity,
            },
        };
    }
    return result;
}
/** Represent gradient token value either as reference or as plain representation */
function representGradientTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            to: {
                type: "point",
                value: {
                    x: {
                        type: "size",
                        value: value.to.x,
                    },
                    y: {
                        type: "size",
                        value: value.to.y,
                    },
                },
            },
            from: {
                type: "point",
                value: {
                    x: {
                        type: "size",
                        value: value.from.x,
                    },
                    y: {
                        type: "size",
                        value: value.from.y,
                    },
                },
            },
            type: {
                type: "string",
                value: value.type,
            },
            aspectRatio: {
                type: "size",
                value: value.aspectRatio,
            },
            stops: {},
        };
        // Inject gradient stops
        let count = 0;
        for (let stop of value.stops) {
            let stopObject = {
                type: "gradientStop",
                position: {
                    type: "size",
                    value: stop.position,
                },
                color: {
                    type: "color",
                    value: representColorTokenValue(stop.color, allTokens, allGroups),
                },
            };
            result.stops[`${count}`] = stopObject;
            count++;
        }
    }
    return result;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Object wrappers
/** Retrieve wrapper to certain token (referenced by name) pointing to token value */
function referenceWrapper(reference) {
    return `{${reference}.value}`;
}
/** Retrieve token wrapper containing its metadata and value information (used as container for each defined token) */
function tokenWrapper(token, value) {
    return {
        value: value,
        type: typeLabel(token.tokenType),
        comment: token.description.length > 0 ? token.description : undefined,
    };
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Naming
/** Create full reference name representing token. Such name can, for example, look like: [g1].[g2].[g3].[g4].[token-name] */
function referenceName(token, allGroups) {
    // Find the group to which token belongs. This is really suboptimal and should be solved by the SDK to just provide the group reference
    let occurances = allGroups.filter((g) => g.tokenIds.indexOf(token.id) !== -1);
    if (occurances.length === 0) {
        throw Error("JS: Unable to find token in any of the groups");
    }
    let containingGroup = occurances[0];
    let tokenPart = safeTokenName(token);
    let groupParts = referenceGroupChain(containingGroup).map((g) => safeGroupName(g));
    return [...groupParts, tokenPart].join(".");
}
/** Retrieve safe token name made out of normal token name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeTokenName(token) {
    // skip safe to match how our tokens are named
    return token.name;
}
/** Retrieve safe group name made out of normal group name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeGroupName(group) {
    return group.name.replace(/\W+/g, "-").toLowerCase();
}
/** Retrieve human-readable token type in unified fashion, used both as token type and as token master group */
function typeLabel(type) {
    switch (type) {
        case "Border":
            return "border";
        case "Color":
            return "color";
        case "Font":
            return "font";
        case "Gradient":
            return "gradient";
        case "Measure":
            return "measure";
        case "Radius":
            return "radius";
        case "Shadow":
            return "shadow";
        case "Text":
            return "text";
        case "Typography":
            return "typography";
    }
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Lookup
/** Find all tokens that belong to a certain group and retrieve them as objects */
function tokensOfGroup(containingGroup, allTokens) {
    const isVirtualShadow = (t) => { var _a; return ((_a = t) === null || _a === void 0 ? void 0 : _a.isVirtual) === true && t.tokenType === 'Shadow'; };
    return allTokens.filter((t) => containingGroup.tokenIds.indexOf(t.id) !== -1 && !isVirtualShadow(t));
}
/** Retrieve chain of groups up to a specified group, ordered from parent to children */
function referenceGroupChain(containingGroup) {
    let iteratedGroup = containingGroup;
    let chain = [containingGroup];
    while (iteratedGroup.parent) {
        chain.push(iteratedGroup.parent);
        iteratedGroup = iteratedGroup.parent;
    }
    return chain.reverse();
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLCtCQUErQjtBQUMzQztBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixhQUFhLFlBQVksR0FBRztBQUN4RDtBQUNBLDRCQUE0QixXQUFXLGFBQWEsYUFBYTtBQUNqRSxnRkFBZ0YsTUFBTSwyRUFBMkU7QUFDaks7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixVQUFVO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsNEJBQTRCLE1BQU07QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxFQUFFLFVBQVUsT0FBTztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFFBQVEsMEdBQTBHO0FBQ3RKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb21waWxlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBCbHVlcHJpbnQgZnVuY3Rpb25zXG4vKiogRm9ybWF0IG9iamVjdCB0byBwcmV0dHkgSlNPTiAqL1xuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJvYmplY3RUb1ByZXR0eUpzb25cIiwgKG9iamVjdCkgPT4ge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIDIpO1xufSk7XG4vKiogR2VuZXJhdGUgc3R5bGUgZGljdGlvbmFyeSB0cmVlICovXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcImdlbmVyYXRlU3R5bGVEaWN0aW9uYXJ5VHJlZVwiLCAocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3VwcykgPT4ge1xuICAgIGxldCB3cml0ZVJvb3QgPSB7fTtcbiAgICAvLyBDb21wdXRlIGZ1bGwgZGF0YSBzdHJ1Y3R1cmUgb2YgdGhlIGVudGlyZSB0eXBlLWRlcGVuZGVudCB0cmVlXG4gICAgbGV0IHJlc3VsdCA9IHJlcHJlc2VudFRyZWUocm9vdEdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVSb290KTtcbiAgICAvLyBBZGQgdG9wIGxldmVsIGVudHJpZXMgd2hpY2ggZG9uJ3QgYmVsb25nIHRvIGFueSB1c2VyLWRlZmluZWQgZ3JvdXBcbiAgICBmb3IgKGxldCB0b2tlbiBvZiB0b2tlbnNPZkdyb3VwKHJvb3RHcm91cCwgYWxsVG9rZW5zKSkge1xuICAgICAgICByZXN1bHRbc2FmZVRva2VuTmFtZSh0b2tlbildID0gcmVwcmVzZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICB9XG4gICAgLy8gUmV0cmlldmVcbiAgICByZXR1cm4ge1xuICAgICAgICBbYCR7dHlwZUxhYmVsKHJvb3RHcm91cC50b2tlblR5cGUpfWBdOiByZXN1bHQsXG4gICAgfTtcbn0pO1xuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBUcmVlIGNvbnN0cnVjdGlvblxuLyoqIENvbnN0cnVjdCB0cmVlIG91dCBvZiBvbmUgc3BlY2lmaWMgZ3JvdXAsIGluZGVwZW5kZW50IG9mIHRyZWUgdHlwZSAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VHJlZShyb290R3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzLCB3cml0ZU9iamVjdCkge1xuICAgIC8vIFJlcHJlc2VudCBvbmUgbGV2ZWwgb2YgZ3JvdXBzIGFuZCB0b2tlbnMgaW5zaWRlIHRyZWUuIENyZWF0ZXMgc3Vib2JqZWN0cyBhbmQgdGhlbiBhbHNvIGluZm9ybWF0aW9uIGFib3V0IGVhY2ggdG9rZW5cbiAgICBmb3IgKGxldCBncm91cCBvZiByb290R3JvdXAuc3ViZ3JvdXBzKSB7XG4gICAgICAgIC8vIFdyaXRlIGJ1ZmZlclxuICAgICAgICBsZXQgd3JpdGVTdWJPYmplY3QgPSB7fTtcbiAgICAgICAgLy8gQWRkIGVhY2ggZW50cnkgZm9yIGVhY2ggc3ViZ3JvdXAsIGFuZCByZXByZXNlbnQgaXRzIHRyZWUgaW50byBpdFxuICAgICAgICB3cml0ZU9iamVjdFtzYWZlR3JvdXBOYW1lKGdyb3VwKV0gPSByZXByZXNlbnRUcmVlKGdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVTdWJPYmplY3QpO1xuICAgICAgICAvLyBBZGQgZWFjaCBlbnRyeSBmb3IgZWFjaCB0b2tlbiwgd3JpdGluZyB0byB0aGUgc2FtZSB3cml0ZSByb290XG4gICAgICAgIGZvciAobGV0IHRva2VuIG9mIHRva2Vuc09mR3JvdXAoZ3JvdXAsIGFsbFRva2VucykpIHtcbiAgICAgICAgICAgIHdyaXRlU3ViT2JqZWN0W3NhZmVUb2tlbk5hbWUodG9rZW4pXSA9IHJlcHJlc2VudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHdyaXRlT2JqZWN0O1xufVxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBUb2tlbiBSZXByZXNlbnRhdGlvblxuLyoqIFJlcHJlc2VudCBhIHNpbmd1bGFyIHRva2VuIGFzIFNEIG9iamVjdCAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgc3dpdGNoICh0b2tlbi50b2tlblR5cGUpIHtcbiAgICAgICAgY2FzZSBcIkNvbG9yXCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50Q29sb3JUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiQm9yZGVyXCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50Qm9yZGVyVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIkZvbnRcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRGb250VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIkdyYWRpZW50XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50R3JhZGllbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiTWVhc3VyZVwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudE1lYXN1cmVUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiUmFkaXVzXCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50UmFkaXVzVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIlNoYWRvd1wiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFNoYWRvd1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJUZXh0XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50VGV4dFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJUeXBvZ3JhcGh5XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50VHlwb2dyYXBoeVRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgfVxufVxuLyoqIFJlcHJlc2VudCBmdWxsIGNvbG9yIHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudENvbG9yVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIGJvcmRlciB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRCb3JkZXJUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRCb3JkZXJUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIGZvbnQgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50Rm9udFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudEZvbnRUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIGdyYWRpZW50IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEdyYWRpZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50R3JhZGllbnRUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIG1lYXN1cmUgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50TWVhc3VyZVRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIHJhZGl1cyB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRSYWRpdXNUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRSYWRpdXNUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIHNoYWRvdyB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRTaGFkb3dUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBjb25zdCBsYXllcnMgPSB0b2tlbi5zaGFkb3dMYXllcnM7XG4gICAgaWYgKChsYXllcnMgPT09IG51bGwgfHwgbGF5ZXJzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBsYXllcnMubGVuZ3RoKSA+IDEpIHtcbiAgICAgICAgLy8gXCJzaGFkb3ctdG9rZW5cIjogeyBcInZhbHVlXCI6IFsge1wiY29sb3JcIjogLi59LCB7Li5cbiAgICAgICAgbGV0IHZhbHVlID0gbGF5ZXJzLnJldmVyc2UoKS5tYXAoKGxheWVyKSA9PiByZXByZXNlbnRTaGFkb3dUb2tlblZhbHVlKGxheWVyLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3VwcykpO1xuICAgICAgICAvLyBcInNoYWRvdy10b2tlblwiOiB7IFwidmFsdWVcIjogeyBcImxheWVyLTFcIjogeyBcImNvbG9yXCI6IC4ufSwgXCJsYXllci0yXCIuLlxuICAgICAgICAvLyBsZXQgdmFsdWUgPSBsYXllcnMucmV2ZXJzZSgpLnJlZHVjZSgoYWNjLCBsYXllciwgaSkgPT4gKGFjY1tgbGF5ZXItJHtpICsgMX1gXSA9IHJlcHJlc2VudFNoYWRvd1Rva2VuVmFsdWUobGF5ZXIudmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSwgYWNjKSwge30pO1xuICAgICAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG4gICAgfVxuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudFNoYWRvd1Rva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgdGV4dCB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRUZXh0VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50VGV4dFRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vKiogUmVwcmVzZW50IGZ1bGwgdHlwb2dyYXBoeSB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRUeXBvZ3JhcGh5VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50VHlwb2dyYXBoeVRva2VuVmFsdWUodG9rZW4udmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICByZXR1cm4gdG9rZW5XcmFwcGVyKHRva2VuLCB2YWx1ZSk7XG59XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIFRva2VuIFZhbHVlIFJlcHJlc2VudGF0aW9uXG4vKiogUmVwcmVzZW50IGNvbG9yIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IGAjJHt2YWx1ZS5oZXh9YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgcmFkaXVzIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFJhZGl1c1Rva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICByYWRpdXM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUucmFkaXVzLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9wTGVmdDogdmFsdWUudG9wTGVmdFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnRvcExlZnQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0b3BSaWdodDogdmFsdWUudG9wUmlnaHRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS50b3BSaWdodCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJvdHRvbUxlZnQ6IHZhbHVlLmJvdHRvbUxlZnRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5ib3R0b21MZWZ0LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgYm90dG9tUmlnaHQ6IHZhbHVlLmJvdHRvbVJpZ2h0XG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUuYm90dG9tUmlnaHQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IG1lYXN1cmUgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBtZWFzdXJlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLm1lYXN1cmUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5pdDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnVuaXQudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IGZvbnQgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50Rm9udFRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBmYW1pbHk6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5mYW1pbHksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3ViZmFtaWx5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuc3ViZmFtaWx5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgdGV4dCB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRUZXh0VG9rZW5WYWx1ZSh2YWx1ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4pIHtcbiAgICAgICAgLy8gRm9ybXMgcmVmZXJlbmNlXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlTmFtZSh2YWx1ZS5yZWZlcmVuY2VkVG9rZW4sIGFsbEdyb3VwcykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gUmF3IHZhbHVlXG4gICAgICAgIHJlc3VsdCA9IHZhbHVlLnRleHQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IHR5cG9ncmFwaHkgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VHlwb2dyYXBoeVRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBmb250OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJmb250XCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudEZvbnRUb2tlblZhbHVlKHZhbHVlLmZvbnQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb250U2l6ZToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5mb250U2l6ZSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiB2YWx1ZS50ZXh0RGVjb3JhdGlvbixcbiAgICAgICAgICAgIHRleHRDYXNlOiB2YWx1ZS50ZXh0Q2FzZSxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUubGV0dGVyU3BhY2luZywgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcmFncmFwaEluZGVudDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5wYXJhZ3JhcGhJbmRlbnQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5lSGVpZ2h0OiB2YWx1ZS5saW5lSGVpZ2h0XG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUubGluZUhlaWdodCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgYm9yZGVyIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEJvcmRlclRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiY29sb3JcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHZhbHVlLmNvbG9yLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2lkdGg6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUud2lkdGgsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnBvc2l0aW9uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgc2hhZG93IHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFNoYWRvd1Rva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiY29sb3JcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHZhbHVlLmNvbG9yLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS54LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS55LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmFkaXVzOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnJhZGl1cywgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwcmVhZDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5zcHJlYWQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLm9wYWNpdHksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCBncmFkaWVudCB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRHcmFkaWVudFRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICB0bzoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9pbnRcIixcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS50by54LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS50by55LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnJvbToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9pbnRcIixcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5mcm9tLngsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLmZyb20ueSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS50eXBlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLmFzcGVjdFJhdGlvLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3BzOiB7fSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gSW5qZWN0IGdyYWRpZW50IHN0b3BzXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGZvciAobGV0IHN0b3Agb2YgdmFsdWUuc3RvcHMpIHtcbiAgICAgICAgICAgIGxldCBzdG9wT2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZ3JhZGllbnRTdG9wXCIsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBzdG9wLnBvc2l0aW9uLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjb2xvclwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHN0b3AuY29sb3IsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc3VsdC5zdG9wc1tgJHtjb3VudH1gXSA9IHN0b3BPYmplY3Q7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIE9iamVjdCB3cmFwcGVyc1xuLyoqIFJldHJpZXZlIHdyYXBwZXIgdG8gY2VydGFpbiB0b2tlbiAocmVmZXJlbmNlZCBieSBuYW1lKSBwb2ludGluZyB0byB0b2tlbiB2YWx1ZSAqL1xuZnVuY3Rpb24gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2UpIHtcbiAgICByZXR1cm4gYHske3JlZmVyZW5jZX0udmFsdWV9YDtcbn1cbi8qKiBSZXRyaWV2ZSB0b2tlbiB3cmFwcGVyIGNvbnRhaW5pbmcgaXRzIG1ldGFkYXRhIGFuZCB2YWx1ZSBpbmZvcm1hdGlvbiAodXNlZCBhcyBjb250YWluZXIgZm9yIGVhY2ggZGVmaW5lZCB0b2tlbikgKi9cbmZ1bmN0aW9uIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIHR5cGU6IHR5cGVMYWJlbCh0b2tlbi50b2tlblR5cGUpLFxuICAgICAgICBjb21tZW50OiB0b2tlbi5kZXNjcmlwdGlvbi5sZW5ndGggPiAwID8gdG9rZW4uZGVzY3JpcHRpb24gOiB1bmRlZmluZWQsXG4gICAgfTtcbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gTmFtaW5nXG4vKiogQ3JlYXRlIGZ1bGwgcmVmZXJlbmNlIG5hbWUgcmVwcmVzZW50aW5nIHRva2VuLiBTdWNoIG5hbWUgY2FuLCBmb3IgZXhhbXBsZSwgbG9vayBsaWtlOiBbZzFdLltnMl0uW2czXS5bZzRdLlt0b2tlbi1uYW1lXSAqL1xuZnVuY3Rpb24gcmVmZXJlbmNlTmFtZSh0b2tlbiwgYWxsR3JvdXBzKSB7XG4gICAgLy8gRmluZCB0aGUgZ3JvdXAgdG8gd2hpY2ggdG9rZW4gYmVsb25ncy4gVGhpcyBpcyByZWFsbHkgc3Vib3B0aW1hbCBhbmQgc2hvdWxkIGJlIHNvbHZlZCBieSB0aGUgU0RLIHRvIGp1c3QgcHJvdmlkZSB0aGUgZ3JvdXAgcmVmZXJlbmNlXG4gICAgbGV0IG9jY3VyYW5jZXMgPSBhbGxHcm91cHMuZmlsdGVyKChnKSA9PiBnLnRva2VuSWRzLmluZGV4T2YodG9rZW4uaWQpICE9PSAtMSk7XG4gICAgaWYgKG9jY3VyYW5jZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiSlM6IFVuYWJsZSB0byBmaW5kIHRva2VuIGluIGFueSBvZiB0aGUgZ3JvdXBzXCIpO1xuICAgIH1cbiAgICBsZXQgY29udGFpbmluZ0dyb3VwID0gb2NjdXJhbmNlc1swXTtcbiAgICBsZXQgdG9rZW5QYXJ0ID0gc2FmZVRva2VuTmFtZSh0b2tlbik7XG4gICAgbGV0IGdyb3VwUGFydHMgPSByZWZlcmVuY2VHcm91cENoYWluKGNvbnRhaW5pbmdHcm91cCkubWFwKChnKSA9PiBzYWZlR3JvdXBOYW1lKGcpKTtcbiAgICByZXR1cm4gWy4uLmdyb3VwUGFydHMsIHRva2VuUGFydF0uam9pbihcIi5cIik7XG59XG4vKiogUmV0cmlldmUgc2FmZSB0b2tlbiBuYW1lIG1hZGUgb3V0IG9mIG5vcm1hbCB0b2tlbiBuYW1lXG4gKiBUaGlzIHJlcGxhY2Ugc3BhY2VzIHdpdGggZGFzaGVzLCBhbHNvIGNoYW5nZSBhbnl0aGluZyBub24tYWxwaGFudW1lcmljIGNoYXIgdG8gaXQgYXMgd2VsbC5cbiAqIEZvciBleGFtcGxlLCBTVCZSSyBJbmR1c3RyaWVzIHdpbGwgYmUgY2hhbmdlZCB0byBzdC1yay1pbmR1c3RyaWVzXG4gKi9cbmZ1bmN0aW9uIHNhZmVUb2tlbk5hbWUodG9rZW4pIHtcbiAgICAvLyBza2lwIHNhZmUgdG8gbWF0Y2ggaG93IG91ciB0b2tlbnMgYXJlIG5hbWVkXG4gICAgcmV0dXJuIHRva2VuLm5hbWU7XG59XG4vKiogUmV0cmlldmUgc2FmZSBncm91cCBuYW1lIG1hZGUgb3V0IG9mIG5vcm1hbCBncm91cCBuYW1lXG4gKiBUaGlzIHJlcGxhY2Ugc3BhY2VzIHdpdGggZGFzaGVzLCBhbHNvIGNoYW5nZSBhbnl0aGluZyBub24tYWxwaGFudW1lcmljIGNoYXIgdG8gaXQgYXMgd2VsbC5cbiAqIEZvciBleGFtcGxlLCBTVCZSSyBJbmR1c3RyaWVzIHdpbGwgYmUgY2hhbmdlZCB0byBzdC1yay1pbmR1c3RyaWVzXG4gKi9cbmZ1bmN0aW9uIHNhZmVHcm91cE5hbWUoZ3JvdXApIHtcbiAgICByZXR1cm4gZ3JvdXAubmFtZS5yZXBsYWNlKC9cXFcrL2csIFwiLVwiKS50b0xvd2VyQ2FzZSgpO1xufVxuLyoqIFJldHJpZXZlIGh1bWFuLXJlYWRhYmxlIHRva2VuIHR5cGUgaW4gdW5pZmllZCBmYXNoaW9uLCB1c2VkIGJvdGggYXMgdG9rZW4gdHlwZSBhbmQgYXMgdG9rZW4gbWFzdGVyIGdyb3VwICovXG5mdW5jdGlvbiB0eXBlTGFiZWwodHlwZSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFwiQm9yZGVyXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJib3JkZXJcIjtcbiAgICAgICAgY2FzZSBcIkNvbG9yXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJjb2xvclwiO1xuICAgICAgICBjYXNlIFwiRm9udFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiZm9udFwiO1xuICAgICAgICBjYXNlIFwiR3JhZGllbnRcIjpcbiAgICAgICAgICAgIHJldHVybiBcImdyYWRpZW50XCI7XG4gICAgICAgIGNhc2UgXCJNZWFzdXJlXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJtZWFzdXJlXCI7XG4gICAgICAgIGNhc2UgXCJSYWRpdXNcIjpcbiAgICAgICAgICAgIHJldHVybiBcInJhZGl1c1wiO1xuICAgICAgICBjYXNlIFwiU2hhZG93XCI6XG4gICAgICAgICAgICByZXR1cm4gXCJzaGFkb3dcIjtcbiAgICAgICAgY2FzZSBcIlRleHRcIjpcbiAgICAgICAgICAgIHJldHVybiBcInRleHRcIjtcbiAgICAgICAgY2FzZSBcIlR5cG9ncmFwaHlcIjpcbiAgICAgICAgICAgIHJldHVybiBcInR5cG9ncmFwaHlcIjtcbiAgICB9XG59XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIExvb2t1cFxuLyoqIEZpbmQgYWxsIHRva2VucyB0aGF0IGJlbG9uZyB0byBhIGNlcnRhaW4gZ3JvdXAgYW5kIHJldHJpZXZlIHRoZW0gYXMgb2JqZWN0cyAqL1xuZnVuY3Rpb24gdG9rZW5zT2ZHcm91cChjb250YWluaW5nR3JvdXAsIGFsbFRva2Vucykge1xuICAgIGNvbnN0IGlzVmlydHVhbFNoYWRvdyA9ICh0KSA9PiB7IHZhciBfYTsgcmV0dXJuICgoX2EgPSB0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaXNWaXJ0dWFsKSA9PT0gdHJ1ZSAmJiB0LnRva2VuVHlwZSA9PT0gJ1NoYWRvdyc7IH07XG4gICAgcmV0dXJuIGFsbFRva2Vucy5maWx0ZXIoKHQpID0+IGNvbnRhaW5pbmdHcm91cC50b2tlbklkcy5pbmRleE9mKHQuaWQpICE9PSAtMSAmJiAhaXNWaXJ0dWFsU2hhZG93KHQpKTtcbn1cbi8qKiBSZXRyaWV2ZSBjaGFpbiBvZiBncm91cHMgdXAgdG8gYSBzcGVjaWZpZWQgZ3JvdXAsIG9yZGVyZWQgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4gKi9cbmZ1bmN0aW9uIHJlZmVyZW5jZUdyb3VwQ2hhaW4oY29udGFpbmluZ0dyb3VwKSB7XG4gICAgbGV0IGl0ZXJhdGVkR3JvdXAgPSBjb250YWluaW5nR3JvdXA7XG4gICAgbGV0IGNoYWluID0gW2NvbnRhaW5pbmdHcm91cF07XG4gICAgd2hpbGUgKGl0ZXJhdGVkR3JvdXAucGFyZW50KSB7XG4gICAgICAgIGNoYWluLnB1c2goaXRlcmF0ZWRHcm91cC5wYXJlbnQpO1xuICAgICAgICBpdGVyYXRlZEdyb3VwID0gaXRlcmF0ZWRHcm91cC5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBjaGFpbi5yZXZlcnNlKCk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9