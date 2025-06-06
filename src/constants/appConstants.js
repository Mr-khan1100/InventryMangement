export const validationMessage = {
    INCORRECT_PASSWORD : 'Incorrect password',
    IVALID_EMAIL_FORMAT : 'Invalid email format',
    EMAIL_IS_REQUIRED : 'Email is required',
    EMAIL_START_WITH : 'Email must start with either User_ or Manager_',
    PASSWORD_IS_REQUIRED : 'Password is required',
    PASSWORD_MUST_BE : 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
    START_DATE_CANNOT_WEEKEND : 'Start date cannot be on a weekend',
    START_DATE_BEFORE_END_DATE : 'Start date must be before end date',
    END_DATE_IS_REQUIRED : 'End date is required',
    END_DATE_CANNOT_WEEKEND : 'End date cannot be on a weekend',
    END_DATE_AFTER_START_DATE : 'End date cannot be before start date',
    ONLY_ONE_WFH : 'WFH must be for a single day',
    WFH_APPLIED_THIS_MONTH : 'WFH already applied this month',
    SANDWHICH_RULE : 'Cannot bridge weekend (Friday to Monday)',
    REASON_IS_REQUIRED : 'Reason is required',
    LEAVE_TYPE_REQUIRED :  'Leave type is required',
    START_DATE_REQUIRED : 'Start Date is required',
    END_DATE_REQUIRED : 'End Date is required',
    ENTER_ALL_FIELDS : 'Fill all fields correctly to apply leave',
    INVALID_DATE : 'Invalid date',
    LEAVE_OVERLAP : 'This leave overlaps with an existing leave application',
    ERROR :'Error',
    USERNAME_REQUIRED: 'Username is required',
    INVALID_USERNAME: 'Invalid username format',
    PHONE_REQUIRED: 'Phone number is required',
    INVALID_PHONE: 'Invalid Indian phone number',
    CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
    PASSWORD_MISMATCH: 'Passwords do not match',
    EMAIL_EXISTS: 'Email already registered',
    PHONE_EXISTS: 'Phone number already registered',
};

export const generalConst = {
    MANAGER_ : 'manager_',
    USER_ : 'user_',
    WFH : 'WFH',
    PL : 'Personal Leave',
    SL : 'Sick Leave',
    ON_SITE : 'On Site',
    DATE : 'date',
    START : 'start',
    END :  'end',
    SUCCESS : 'Success',
    FAILED : 'Failed',
    MANAGER : 'manager',
    EMPLOYEE : 'employee',
    MALE : 'Male',
    APPROVED : 'approved',
    REJECTED : 'rejected',
    PENDING : 'pending',
    EMAIL : 'email',
    PASSWORD : 'password',
    FROM_DATE : 'fromDate',
    TO_DATE : 'toDate',
    STATUS : 'status',
    TYPE: 'type',
    FADE : 'fade',
    OK : 'OK',
    OK_PRESSED : 'OK Pressed',
    CANCEL : 'cancel',
};


export const regex = {
    EMAIL : /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*["'+,.:;<>_`|~!@#?£\-$%^&*{}()\$%\^&\*\{}\()\-\]\\/[])(?=.{8,})/,
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
    INDIAN_PHONE: /^[6-9]\d{9}$/,
};

