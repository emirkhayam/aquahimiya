import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'settings.json');

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read settings
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

// Save settings
function saveSettings(settings) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(settings, null, 2));
}

// Check admin auth
function isAdmin(req) {
  const token = req.headers['x-admin-token'];
  if (!token) return false;
  const settings = getSettings();
  const storedToken = settings._token || '';
  const expires = settings._tokenExpires || 0;
  if (!storedToken || token !== storedToken) return false;
  if (expires > 0 && Date.now() > expires) return false;
  return true;
}

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - public (without password)
  if (req.method === 'GET') {
    const settings = getSettings();
    delete settings.adminPassword;
    delete settings._token;
    delete settings._tokenExpires;
    return res.status(200).json({ ok: true, data: settings });
  }

  // POST - admin only
  if (req.method === 'POST') {
    if (!isAdmin(req)) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const body = req.body;
    const current = getSettings();

    const newSettings = {
      siteName: (body.siteName || current.siteName || 'AQUAHIMIYA').trim(),
      whatsappNumber: (body.whatsappNumber || current.whatsappNumber || '').replace(/\D/g, ''),
      phone: (body.phone || current.phone || '').trim(),
      email: (body.email || current.email || '').trim(),
      address: (body.address || current.address || '').trim(),
      workingHours: (body.workingHours || current.workingHours || '').trim(),
      adminPassword: current.adminPassword || '',
      _token: current._token,
      _tokenExpires: current._tokenExpires
    };

    saveSettings(newSettings);

    const response = { ...newSettings };
    delete response.adminPassword;
    delete response._token;
    delete response._tokenExpires;

    return res.status(200).json({ ok: true, data: response });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
