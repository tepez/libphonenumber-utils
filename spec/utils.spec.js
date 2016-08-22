'use strict';
const utils = require('..');
const PhoneNumber = require('google-libphonenumber');
const PNT = PhoneNumber.PhoneNumberType;


describe('utils', () => {
    describe('.typesMatch()', () => {
        it('should return true if types match', () => {
            expect(utils.typesMatch('mobile', 'mobile')).toBe(true);

            expect(utils.typesMatch('mobile', 'MOBILE')).toBe(true);
            expect(utils.typesMatch('mobile', 'FIXED_LINE_OR_MOBILE')).toBe(true);
            expect(utils.typesMatch('fixedLine', 'FIXED_LINE_OR_MOBILE')).toBe(true);
            expect(utils.typesMatch('FIXED_LINE', 'FIXED_LINE_OR_MOBILE')).toBe(true);

            expect(utils.typesMatch('MOBILE', 'mobile')).toBe(true);
            expect(utils.typesMatch('FIXED_LINE_OR_MOBILE', 'mobile')).toBe(true);
            expect(utils.typesMatch('FIXED_LINE_OR_MOBILE', 'fixedLine')).toBe(true);
            expect(utils.typesMatch('FIXED_LINE_OR_MOBILE', 'FIXED_LINE')).toBe(true);

            expect(utils.typesMatch('mobile', PNT.MOBILE)).toBe(true);
            expect(utils.typesMatch('mobile', PNT.FIXED_LINE_OR_MOBILE)).toBe(true);
        });

        it('should return false if types does not match', () => {
            expect(utils.typesMatch('mobile', 'FIXED_LINE')).toBe(false);
            expect(utils.typesMatch('mobile', PNT.FIXED_LINE)).toBe(false);
            expect(utils.typesMatch('MOBILE', PNT.FIXED_LINE)).toBe(false);
            expect(utils.typesMatch(PNT.MOBILE, PNT.FIXED_LINE)).toBe(false);
        });
    });

    describe('.isValid()', () => {
        xit('should return INVALID_COUNTRY_CODE when country code is invalid', () => {
            // TODO add something for this, can this even be?
        });

        it('should return TOO_SHORT when number is too short', () => {
            expect(utils.isValid('972', 'il')).toBe('TOO_SHORT');
        });

        it('should return TOO_LONG when number is too long', () => {
            expect(utils.isValid('972-52-123456789789', 'il')).toBe('TOO_LONG');
        });

        describe('when given a single type', () => {
            it('should return true iff type match', () => {
                expect(utils.isValid('972-52-1234567', 'il', 'mobile')).toBe(true);
                expect(utils.isValid('972-52-1234567', 'il', 'fixedLineOrMobile')).toBe(true);
                expect(utils.isValid('972-52-1234567', 'il', 'MOBILE')).toBe(true);
                expect(utils.isValid('972-52-1234567', 'il', 'FIXED_LINE_OR_MOBILE')).toBe(true);
                expect(utils.isValid('972-52-1234567', 'il', PNT.MOBILE)).toBe(true);
                expect(utils.isValid('972-52-1234567', 'il', PNT.FIXED_LINE_OR_MOBILE)).toBe(true);
            });
        });PNT.TOOL

        describe('when given a multiples types', () => {
            it('should return true iff any type match', () => {
                expect(utils.isValid('972-52-1234567', 'il', ['fixedLine', 'sharedCost', 'mobile'])).toBe(true);
                expect(utils.isValid('972-52-1234567', 'il', ['voip', 'tollFree', 'pager'])).toBe(false);
            });
        });

    });
});

