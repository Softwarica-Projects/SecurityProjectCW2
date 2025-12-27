export const passwordRules = {
    minLength: 8,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    digit: /[0-9]/,
    symbol: /[^A-Za-z0-9]/,
};

export function validatePasswordComplexity(pw) {
    const rules = passwordRules;
    const results = {
        length: pw.length >= rules.minLength,
        uppercase: rules.uppercase.test(pw),
        lowercase: rules.lowercase.test(pw),
        digit: rules.digit.test(pw),
        symbol: rules.symbol.test(pw),
    };
    results.valid = Object.values(results).every(Boolean);
    return results;
}

export function passwordStrengthScore(pw) {
    const res = validatePasswordComplexity(pw);
    let score = 0;
    if (res.length) score += 1;
    if (res.uppercase) score += 1;
    if (res.lowercase) score += 1;
    if (res.digit) score += 1;
    if (res.symbol) score += 1;
    return Math.min(5, score);
}
