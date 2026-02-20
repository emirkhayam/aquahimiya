import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'data', 'settings.json');
const TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getSettings() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    const defaultSettings = {
      siteName: 'AQUAHIMIYA',
      whatsappNumber: '',
      phone: '',
      email: '',
      address: '',
      workingHours: '',
      adminPassword: ''
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultSettings, null, 2));
    return defaultSettings;
  }
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

function saveSettings(settings) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(settings, null, 2));
}

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - check auth
  if (req.method === 'GET') {
    const token = req.headers['x-admin-token'];
    if (!token) {
      return res.status(200).json({ ok: true, data: { admin: false } });
    }

    const settings = getSettings();
    const storedToken = settings._token || '';
    const expires = settings._tokenExpires || 0;

    const isValid = storedToken && token === storedToken && (expires === 0 || Date.now() <= expires);
    return res.status(200).json({ ok: true, data: { admin: isValid } });
  }

  // POST - login/logout
  if (req.method === 'POST') {
    const body = req.body;
    const action = body.action;

    if (action === 'login') {
      const password = body.password;
      const settings = getSettings();
      const storedPassword = settings.adminPassword || 'admin123';

      if (password !== storedPassword) {
        return res.status(200).json({ ok: false, error: 'Неверный пароль' });
      }

      // Generate token
      const token = crypto.randomBytes(32).toString('hex');
      settings._token = token;
      settings._tokenExpires = Date.now() + TOKEN_TTL;
      saveSettings(settings);

      return res.status(200).json({ ok: true, data: { admin: true, token } });
    }

    if (action === 'logout') {
      const settings = getSettings();
      delete settings._token;
      delete settings._tokenExpires;
      saveSettings(settings);

      return res.status(200).json({ ok: true, data: { admin: false } });
    }

    return res.status(400).json({ ok: false, error: 'Invalid action' });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
