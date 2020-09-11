export var myConfig = {
    clientID: 'c1OIvYBFmOpdrUgXuHGD5j3KE7rjFSJT',
    domain: 'truetube.eu.auth0.com',
    options: {
        autoclose: true,
        rememberLastLogin: false,
        languageDictionary: {
            emailInputPlaceholder: 'something@youremail.com',
            title: '',
            signUpLabel: 'Register',
            forgotPasswordAction: "Forgotten or need to reset your password?",
            error: {
                login: {
                    "lock.invalid_email_password": "Wrong email or password. Are you logging in with credentials from the old site? You need to reset your password.",
                    "lock.invalid_username_password": "Wrong username or password. Are you logging in with credentials from the old site? You need to reset your password.",
                }
            },
            success: {
               forgotPassword: "We've just sent you an email to reset your password. Didn't get the email? Please check your spam/junk email folder",
            }
        },
        popupOptions: { width: 500 },
        auth: {
            redirect: false
        },
        // socialButtonStyle: 'small',
        // allowSignUp: false,
        theme: {
            logo: '/assets/images/true-tube-logo_black.svg',
            primaryColor: '#FBE407'
        },
        additionalSignUpFields: [
            {
                type: 'select',
                name: 'account_type',
                placeholder: 'Teacher or student?',
                options: [
                    { value: 'Teacher', label: 'Teacher' },
                    { value: 'Student', label: 'Student' }
                ],
            },
            {
                type: 'text',
                name: 'school',
                placeholder: 'School Name'
            }
        ]
    }
};
//# sourceMappingURL=auth.config.js.map