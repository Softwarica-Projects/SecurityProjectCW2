const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '../../logs/activity.log');

function sanitizeBody(body) {
    if (!body || typeof body !== 'object') return body;
    const copy = { ...body };
    const sensitive = ['password', 'oldPassword', 'newPassword', 'token', 'authorization'];
    for (const key of sensitive) {
        if (key in copy) copy[key] = '[REDACTED]';
    }
    return copy;
}

const activityLogger = (req, res, next) => {
    const start = Date.now();

    const { method, originalUrl: url, ip, headers } = req;
    const userAgent = headers['user-agent'] || '';
    const requestSnapshot = {
        body: sanitizeBody(req.body),
        params: req.params,
        query: req.query
    };

    res.on('finish', () => {
        try {
            const duration = Date.now() - start;
            const user = req.user ? { id: req.user.id || req.user._id || null, role: req.user.role || null } : null;

            const entry = {
                timestamp: new Date().toISOString(),
                user,
                method,
                url,
                status: res.statusCode,
                durationMs: duration,
                ip: req.ip || ip || req.connection?.remoteAddress || null,
                userAgent,
                request: requestSnapshot
            };

            const line = JSON.stringify(entry) + '\n';
            fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
            fs.appendFile(LOG_PATH, line, (err) => {
                if (err) {
                    console.error('Failed to write activity log:', err);
                }
            });
        } catch (err) {
            console.error('Activity logger error:', err);
        }
    });

    next();
};

module.exports = activityLogger;
