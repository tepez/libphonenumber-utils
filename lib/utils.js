'use strict';
const PhoneNumber = require('google-libphonenumber');
const snakeCase = require('lodash.snakecase');

const internals = {};

internals.normalizeType = function (type) {
    const PNT = PhoneNumber.PhoneNumberType;

    if (typeof type === 'string')
        return PNT[snakeCase(type).toUpperCase()];

    return type;
};

exports = module.exports = {};
 
// a shared instance of PhoneNumberUtil
exports.phnoeNumberUtil = PhoneNumber.PhoneNumberUtil.getInstance();


/**
 * Return true iff given number types match
 * We can't do just an equality check because FIXED_LINE_OR_MOBILE matches MOBILE and FIXED_LINE
 * and vice versa
 */
exports.typesMatch = function (type1, type2) {
    const PNT = PhoneNumber.PhoneNumberType;

    type1 = internals.normalizeType(type1);
    type2 = internals.normalizeType(type2);

    return type1 === type2 ||
        (type1 === PNT.FIXED_LINE_OR_MOBILE && (type2 === PNT.MOBILE || type2 === PNT.FIXED_LINE)) ||
        (type2 === PNT.FIXED_LINE_OR_MOBILE && (type1 === PNT.MOBILE || type1 === PNT.FIXED_LINE));
};

/**
 * Check whether given number is a valid phone number for given region
 * Type can be either a single type or an array of types. If given, will also check if given
 * number is of given type(s)
 * Returns true if number is valid, otherwise returns false or a string with a reason
 */
exports.isValid = function (rawNumber, regionCode, type) {
    let parsedNumber;

    try {
        parsedNumber = exports.phnoeNumberUtil.parseAndKeepRawInput(rawNumber, regionCode);
    } catch (err) {
        return false;
    }

    const PNV = PhoneNumber.PhoneNumberUtil.ValidationResult;
    switch (exports.phnoeNumberUtil.isPossibleNumberWithReason(parsedNumber)) {
        case PNV.INVALID_COUNTRY_CODE:
            return 'INVALID_COUNTRY_CODE';
        case PNV.TOO_SHORT:
            return 'TOO_SHORT';
        case PNV.TOO_LONG:
            return 'TOO_LONG';
        // PNV.IS_POSSIBLE
    }

    if (!exports.phnoeNumberUtil.isValidNumberForRegion(parsedNumber, regionCode))
        return false;

    if (type != null) {
        const parsedType = exports.phnoeNumberUtil.getNumberType(parsedNumber);

        // list of types - check if any of the types match
        if (Array.isArray(type)) {
            return type.some((typeItr) => {
                return exports.typesMatch(typeItr, parsedType);
            });

        // single type - check if it matches
        } else {
            return exports.typesMatch(type, parsedType)
        }
    }

    return true;
};
