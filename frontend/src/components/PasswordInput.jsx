import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { validatePasswordComplexity, passwordStrengthScore, passwordRules } from '../utils/passwordUtils';

const StrengthBar = ({ score }) => {
    const colors = ['#e3342f', '#f6ad55', '#f6e05e', '#9ae6b4', '#38a169'];
    return (
        <div className="w-full mt-2 flex gap-1">
            {[0,1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, height: 6, background: i < score ? colors[Math.max(0, score-1)] : '#2d3748', borderRadius: 3 }} />
            ))}
        </div>
    );
};

const PasswordInput = React.forwardRef(({ label = 'Password', name='password', onChange, value, error, registerOptions }, ref) => {
    // Support both controlled (value provided) and uncontrolled (react-hook-form) usages.
    const [internalValue, setInternalValue] = useState(value ?? '');

    useEffect(() => {
        if (value !== undefined) setInternalValue(value || '');
    }, [value]);

    const handleChange = (e) => {
        const v = e?.target?.value ?? '';
        setInternalValue(v);
        if (onChange) onChange(e);
    };

    const complexity = validatePasswordComplexity(internalValue);
    const score = passwordStrengthScore(internalValue);

    return (
        <Form.Group className="mb-4" controlId={`form${name}` }>
            <Form.Control
                ref={ref}
                name={name}
                type="password"
                placeholder={`Enter ${label.toLowerCase()}`}
                onChange={handleChange}
                value={value !== undefined ? value : internalValue}
                isInvalid={!!error}
                {...(registerOptions || {})}
            />
            <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>

            <StrengthBar score={score} />

            <div className="text-xs text-gray-300 mt-2">
                <div>Password must include:</div>
                <ul className="ml-4 list-disc">
                    <li className={complexity.length ? 'text-green-300' : ''}>At least {passwordRules.minLength} characters</li>
                    <li className={complexity.uppercase ? 'text-green-300' : ''}>Uppercase letter</li>
                    <li className={complexity.lowercase ? 'text-green-300' : ''}>Lowercase letter</li>
                    <li className={complexity.digit ? 'text-green-300' : ''}>A number</li>
                    <li className={complexity.symbol ? 'text-green-300' : ''}>A symbol</li>
                </ul>
            </div>
        </Form.Group>
    );
});

export default PasswordInput;
