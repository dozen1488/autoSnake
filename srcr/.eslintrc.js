"use strict";

// Inspired by https://github.com/facebookincubator/create-react-app

// The ESLint browser environment defines all browser globals as valid,
// even though most people don't know some of them exist (e.g. `name` or `status`).
// This is dangerous as it hides accidentally undefined variables.
// We blacklist the globals that we deem potentially confusing.
// To use them, explicitly reference them, e.g. `window.name` or `window.status`.

const restrictedGlobals = [
    "addEventListener",
    "blur",
    "close",
    "closed",
    "confirm",
    "defaultStatus",
    "defaultstatus",
    "event",
    "external",
    "find",
    "focus",
    "frameElement",
    "frames",
    "history",
    "innerHeight",
    "innerWidth",
    "length",
    "location",
    "locationbar",
    "menubar",
    "moveBy",
    "moveTo",
    "name",
    "onblur",
    "onerror",
    "onfocus",
    "onload",
    "onresize",
    "onunload",
    "open",
    "opener",
    "opera",
    "outerHeight",
    "outerWidth",
    "pageXOffset",
    "pageYOffset",
    "parent",
    "print",
    "removeEventListener",
    "resizeBy",
    "resizeTo",
    "screen",
    "screenLeft",
    "screenTop",
    "screenX",
    "screenY",
    "scroll",
    "scrollbars",
    "scrollBy",
    "scrollTo",
    "scrollX",
    "scrollY",
    "self",
    "status",
    "statusbar",
    "stop",
    "toolbar",
    "top"
];

module.exports = {
    env: {
        browser: true,
        es6: true
    },

    extends: [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:jasmine/recommended",
        "plugin:react/recommended"
    ],

    parser: "babel-eslint",

    parserOptions: {
        sourceType: "module"
    },

    plugins: [
        "import",
        "jasmine",
        "react"
    ],

    root: true,

    rules: {
        "array-bracket-spacing": "error",
        "arrow-spacing": "error",
        "block-scoped-var": "error",
        "block-spacing": "error",
        "brace-style": [
            "error",
            "1tbs",
            { "allowSingleLine": true }
        ],
        "comma-spacing": "error",
        "comma-style": "error",
        "consistent-this": ["error", "me"],
        "curly": "error",
        "eol-last": "error",
        "func-call-spacing": "error",
        "generator-star-spacing": ["error", "after"],
        "indent": [
            "warn",
            4,
            { "SwitchCase": 1 }
        ],
        "jsx-quotes": "error",
        "key-spacing": "error",
        "keyword-spacing": "error",
        "linebreak-style": "error",
        "lines-around-directive": "error",
        "new-parens": "error",
        "newline-before-return": "error",
        "no-caller": "error",
        "no-empty-function": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-global-assign": "error",
        "no-implied-eval": "error",
        "no-mixed-operators": [
            "warn",
            {
                groups: [
                    ["&", "|", "^", "~", "<<", ">>", ">>>"],
                    ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                    ["&&", "||"],
                    ["in", "instanceof"],
                ],
                allowSamePrecedence: false,
            },
        ],
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-restricted-globals": ["error"].concat(restrictedGlobals),
        "no-restricted-syntax": ["warn", "WithStatement"],
        "no-trailing-spaces": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-var": "warn",
        "no-whitespace-before-property": "error",
        "no-with": "error",
        "object-curly-spacing": [
            "error",
            "always",
            {
                "arraysInObjects": true,
                "objectsInObjects": true
            }
        ],
        "one-var": [
            "warn",
            {
                "let": "never",
                "const": "never"
            }
        ],
        "operator-linebreak": "error",
        "prefer-const": "warn",
        "quotes": [
            "error",
            "double",
            {
                "avoidEscape": false,
                "allowTemplateLiterals": true
            }
        ],
        "radix": "error",
        "require-await": "error",
        "semi": "error",
        "semi-spacing": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "never",
                "named": "never",
                "asyncArrow": "always"
            }
        ],
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "spaced-comment": "error",
        "valid-jsdoc": [
            "warn",
            {
                "prefer": {
                    "arg": "param",
                    "argument": "param",
                    "return": "returns"
                },
                "requireParamDescription": false,
                "requireReturnDescription": false,
                "requireReturnType": true
            }
        ],
        "wrap-iife": ["error", "inside"],
        "yield-star-spacing": ["error", "after"],

        // Import
        "import/first": "error",
        "import/no-amd": "error",

        // Jasmine
        // Disable because highlights an entire block and makes eyes hurt
        "jasmine/no-focused-tests":
            "off",
        "jasmine/no-spec-dupes": ["warn", "branch"],

        // React
        // Empty for now
    }
};