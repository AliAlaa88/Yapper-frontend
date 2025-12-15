import { describe, it, expect } from 'vitest'
import {
    validateEmail,
    validateName,
    validatePassword,
    validatePhone,
    validateUsername,
    validateOtp,
    validateDateOfBirth,
    validateIdentifier,
    type ValidationResult,
} from '../../utils/validators'

describe('validators', () => {
    describe('validateEmail', () => {
        it('should validate correct email addresses', () => {
            const validEmails = [
                'test@example.com',
                'user.name@example.co.uk',
                'first+last@domain.org',
                'user_123@sub.domain.com',
            ]

            validEmails.forEach((email) => {
                const result = validateEmail(email)
                expect(result.valid).toBe(true)
                expect(result.messageKey).toBeUndefined()
            })
        })

        it('should reject empty email', () => {
            const result = validateEmail('')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.emailRequired')
        })

        it('should reject invalid email formats', () => {
            const invalidEmails = [
                'notanemail',
                'missing@domain',
                '@example.com',
                'user@',
                'user @example.com',
                'user@example',
            ]

            invalidEmails.forEach((email) => {
                const result = validateEmail(email)
                expect(result.valid).toBe(false)
                expect(result.messageKey).toBe('auth.validation.emailInvalid')
            })
        })
    })

    describe('validateName', () => {
        it('should validate correct names', () => {
            const validNames = [
                'John',
                'Jane Doe',
                'محمد علي',
                'Mary Ann',
                'Ahmed Hassan',
            ]

            validNames.forEach((name) => {
                const result = validateName(name)
                expect(result.valid).toBe(true)
            })
        })

        it('should reject empty name', () => {
            const result = validateName('')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.nameRequired')
        })

        it('should reject name with less than 2 characters', () => {
            const result = validateName('A')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.nameMinLength')
        })

        it('should reject name exceeding 50 characters', () => {
            const longName = 'A'.repeat(51)
            const result = validateName(longName)
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.nameMaxLength')
        })

        it('should reject names with invalid characters', () => {
            const invalidNames = [
                'John123',
                'Jane@Doe',
                'User#Name',
                'Test$Name',
                'John_Doe',
                'Name!',
                'User.Name',
            ]

            invalidNames.forEach((name) => {
                const result = validateName(name)
                expect(result.valid).toBe(false)
                expect(result.messageKey).toBe('auth.validation.nameInvalidChars')
            })
        })

        it('should accept names with exactly 2 characters', () => {
            const result = validateName('Jo')
            expect(result.valid).toBe(true)
        })

        it('should accept names with exactly 50 characters', () => {
            const fiftyCharName = 'A'.repeat(50)
            const result = validateName(fiftyCharName)
            expect(result.valid).toBe(true)
        })

        it('should accept arabic names', () => {
            const result = validateName('محمد')
            expect(result.valid).toBe(true)
        })
    })

    describe('validatePassword', () => {
        it('should validate strong passwords', () => {
            const validPasswords = [
                'Password1',
                'MySecure123Pass',
                'Test@Password999',
                'StrongPass1',
            ]

            validPasswords.forEach((password) => {
                const result = validatePassword(password)
                expect(result.valid).toBe(true)
            })
        })

        it('should reject empty password', () => {
            const result = validatePassword('')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.passwordRequired')
        })

        it('should reject password with less than 8 characters', () => {
            const result = validatePassword('Pass1')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.passwordMinLength')
        })

        it('should reject password exceeding 128 characters', () => {
            const longPassword = 'P'.repeat(129) + 'assword1'
            const result = validatePassword(longPassword)
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.passwordTooLong')
        })

        it('should reject password without uppercase letter', () => {
            const result = validatePassword('password123')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.passwordWeak')
        })

        it('should reject password without lowercase letter', () => {
            const result = validatePassword('PASSWORD123')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.passwordWeak')
        })

        it('should reject password without number', () => {
            const result = validatePassword('PasswordTest')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.passwordWeak')
        })

        it('should accept password with exactly 8 characters and all requirements', () => {
            const result = validatePassword('Pass123a')
            expect(result.valid).toBe(true)
        })

        it('should accept password with exactly 128 characters and all requirements', () => {
            const longPassword = 'P' + 'a'.repeat(126) + '1'
            const result = validatePassword(longPassword)
            expect(result.valid).toBe(true)
        })
    })

    describe('validatePhone', () => {
        it('should validate correct phone numbers', () => {
            const validPhones = [
                '1234567890',
                '+1 (234) 567-8901',
                '+201001234567',
                '555-123-4567',
                '+44 20 7946 0958',
                '(555) 123-4567',
            ]

            validPhones.forEach((phone) => {
                const result = validatePhone(phone)
                expect(result.valid).toBe(true)
            })
        })

        it('should reject empty phone', () => {
            const result = validatePhone('')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.phoneRequired')
        })

        it('should reject phone with invalid characters', () => {
            const invalidPhones = ['123abc456', 'phone#456', '123@456', 'test1234']

            invalidPhones.forEach((phone) => {
                const result = validatePhone(phone)
                expect(result.valid).toBe(false)
                expect(result.messageKey).toBe('auth.validation.phoneInvalid')
            })
        })

        it('should reject phone with less than 10 digits', () => {
            const result = validatePhone('123456789')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.phoneLength')
        })

        it('should reject phone with more than 15 digits', () => {
            const result = validatePhone('12345678901234567')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.phoneLength')
        })

        it('should accept phone with exactly 10 digits', () => {
            const result = validatePhone('1234567890')
            expect(result.valid).toBe(true)
        })

        it('should accept phone with exactly 15 digits', () => {
            const result = validatePhone('123456789012345')
            expect(result.valid).toBe(true)
        })

        it('should handle various formatting characters', () => {
            const result = validatePhone('+1 (234) 567-8901')
            expect(result.valid).toBe(true)
        })
    })

    describe('validateUsername', () => {
        it('should validate correct usernames', () => {
            const validUsernames = ['john_doe', 'user123', 'test_user_1', 'abc', 'User_123_Test']

            validUsernames.forEach((username) => {
                const result = validateUsername(username)
                expect(result.valid).toBe(true)
            })
        })

        it('should reject empty username', () => {
            const result = validateUsername('')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.usernameRequired')
        })

        it('should reject username with less than 3 characters', () => {
            const result = validateUsername('ab')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.usernameMinLength')
        })

        it('should reject username exceeding 20 characters', () => {
            const longUsername = 'a'.repeat(21)
            const result = validateUsername(longUsername)
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.usernameMaxLength')
        })

        it('should reject username with invalid characters', () => {
            const invalidUsernames = ['john-doe', 'user.name', 'test@user', 'john doe', 'user!', 'name#123']

            invalidUsernames.forEach((username) => {
                const result = validateUsername(username)
                expect(result.valid).toBe(false)
                expect(result.messageKey).toBe('auth.validation.usernameInvalidChars')
            })
        })

        it('should accept username with exactly 3 characters', () => {
            const result = validateUsername('abc')
            expect(result.valid).toBe(true)
        })

        it('should accept username with exactly 20 characters', () => {
            const result = validateUsername('a'.repeat(20))
            expect(result.valid).toBe(true)
        })

        it('should accept usernames with underscores and numbers', () => {
            const validUsernames = ['user_1', 'test_name_123', 'a_b_c_1']

            validUsernames.forEach((username) => {
                const result = validateUsername(username)
                expect(result.valid).toBe(true)
            })
        })
    })

    describe('validateOtp', () => {
        it('should validate correct OTP codes', () => {
            const validOtps = ['123456', 'ABCDEF', 'AbC123', '000000', 'ZzZzZz']

            validOtps.forEach((otp) => {
                const result = validateOtp(otp)
                expect(result.valid).toBe(true)
            })
        })

        it('should reject empty OTP', () => {
            const result = validateOtp('')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.otpRequired')
        })

        it('should reject OTP with less than 6 characters', () => {
            const result = validateOtp('12345')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.otpInvalid')
        })

        it('should reject OTP with more than 6 characters', () => {
            const result = validateOtp('1234567')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.otpInvalid')
        })

        it('should reject OTP with special characters', () => {
            const invalidOtps = ['123@56', 'ABC#EF', '12 456', 'ABC-EF']

            invalidOtps.forEach((otp) => {
                const result = validateOtp(otp)
                expect(result.valid).toBe(false)
                expect(result.messageKey).toBe('auth.validation.otpInvalid')
            })
        })

        it('should accept OTP with exactly 6 alphanumeric characters', () => {
            const validOtps = ['000000', '999999', 'AAAAAA', 'aaaaaa', 'A1B2C3']

            validOtps.forEach((otp) => {
                const result = validateOtp(otp)
                expect(result.valid).toBe(true)
            })
        })
    })

    describe('validateDateOfBirth', () => {
        it('should validate valid date of birth for adults', () => {
            const year = '2000'
            const month = '05'
            const day = '15'

            const result = validateDateOfBirth(year, month, day)
            expect(result.valid).toBe(true)
        })

        it('should reject empty date of birth fields', () => {
            const testCases = [
                { year: '', month: '05', day: '15' },
                { year: '2000', month: '', day: '15' },
                { year: '2000', month: '05', day: '' },
                { year: '', month: '', day: '' },
            ]

            testCases.forEach(({ year, month, day }) => {
                const result = validateDateOfBirth(year, month, day)
                expect(result.valid).toBe(false)
                expect(result.messageKey).toBe('auth.validation.dobRequired')
            })
        })

        it('should reject users younger than 13 years old', () => {
            const currentYear = new Date().getFullYear()
            const year = String(currentYear - 12) // 12 years old
            const month = '01'
            const day = '01'

            const result = validateDateOfBirth(year, month, day)
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.dobTooYoung')
        })

        it('should accept users exactly 13 years old', () => {
            const currentYear = new Date().getFullYear()
            const currentMonth = new Date().getMonth() + 1
            const year = String(currentYear - 13)
            const month = String(currentMonth).padStart(2, '0')
            const day = String(new Date().getDate()).padStart(2, '0')

            const result = validateDateOfBirth(year, month, day)
            expect(result.valid).toBe(true)
        })

        it('should reject users older than 120 years', () => {
            const currentYear = new Date().getFullYear()
            const year = String(currentYear - 121)
            const month = '01'
            const day = '01'

            const result = validateDateOfBirth(year, month, day)
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.dobInvalid')
        })

        it('should accept users exactly 120 years old', () => {
            const currentYear = new Date().getFullYear()
            const currentMonth = new Date().getMonth() + 1
            const year = String(currentYear - 120)
            const month = String(currentMonth).padStart(2, '0')
            const day = String(new Date().getDate()).padStart(2, '0')

            const result = validateDateOfBirth(year, month, day)
            expect(result.valid).toBe(true)
        })

        it('should handle leap year dates correctly', () => {
            const result = validateDateOfBirth('2000', '02', '29')
            expect(result.valid).toBe(true)
        })

        it('should correctly calculate age across month boundaries', () => {
            const currentDate = new Date()
            const currentYear = currentDate.getFullYear()
            const currentMonth = currentDate.getMonth() + 1
            const currentDay = currentDate.getDate()

            // User born previous month at day 15 will be 12 years old if today is day 10 of current month (should fail)
            const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
            const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
            const year = String(prevYear - 12)
            const month = String(prevMonth).padStart(2, '0')
            const day = String(Math.min(currentDay + 5, 28)).padStart(2, '0') // Ensure valid day

            const result = validateDateOfBirth(year, month, day)
            expect(result.valid).toBe(false)
        })
    })

    describe('validateIdentifier', () => {
        it('should validate email identifier', () => {
            const result = validateIdentifier('test@example.com')
            expect(result.valid).toBe(true)
        })

        it('should validate phone identifier', () => {
            const result = validateIdentifier('+1234567890')
            expect(result.valid).toBe(true)
        })

        it('should validate username identifier', () => {
            const result = validateIdentifier('john_doe')
            expect(result.valid).toBe(true)
        })

        it('should reject empty identifier', () => {
            const result = validateIdentifier('')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.identifierRequired')
        })

        it('should treat input with @ as email', () => {
            const result = validateIdentifier('invalid@email')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.emailInvalid')
        })

        it('should treat numeric input as phone number', () => {
            const result = validateIdentifier('123')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.phoneLength')
        })

        it('should treat non-numeric input without @ as username', () => {
            const result = validateIdentifier('ab')
            expect(result.valid).toBe(false)
            expect(result.messageKey).toBe('auth.validation.usernameMinLength')
        })

        it('should correctly identify email with + in local part', () => {
            const result = validateIdentifier('user+tag@example.com')
            expect(result.valid).toBe(true)
        })

        it('should correctly identify formatted phone numbers', () => {
            const result = validateIdentifier('+1 (234) 567-8901')
            expect(result.valid).toBe(true)
        })
    })
})
